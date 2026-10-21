import "server-only";
import { company } from "@/content/company";
import { categoryBySlug } from "@/content/categories";
import type { CheckedFile } from "./files";
import type { Contact, Rfq } from "./schema";
import { persistSubmission, storageEnabled } from "./store";
import { emailEnabled, escapeHtml, notifyRecipients, sendEmail } from "../integrations/email";
import { createOdooLead, odooEnabled } from "../integrations/odoo";
import { postWebhook, webhookEnabled } from "../integrations/webhook";

export interface DeliveryReport {
  recorded: boolean;
  channels: Record<string, "ok" | "failed" | "off">;
}

/**
 * Delivers a submission to every configured channel. A submission counts as
 * recorded only if at least one channel succeeded — the caller must report a
 * failure to the visitor otherwise, so a request is never silently discarded.
 * Logs carry the reference and channel status only, never procurement details.
 */
async function fanOut(ref: string, tasks: Record<string, (() => Promise<unknown>) | null>): Promise<DeliveryReport> {
  const channels: DeliveryReport["channels"] = {};
  await Promise.all(
    Object.entries(tasks).map(async ([name, task]) => {
      if (!task) return void (channels[name] = "off");
      try {
        await task();
        channels[name] = "ok";
      } catch (err) {
        channels[name] = "failed";
        console.error(`[submission ${ref}] channel ${name} failed: ${(err as Error).message}`);
      }
    }),
  );
  const recorded = Object.values(channels).includes("ok");
  console.info(`[submission ${ref}] recorded=${recorded} ${JSON.stringify(channels)}`);
  return { recorded, channels };
}

const categoryName = (slug: string) => (slug ? categoryBySlug(slug)?.shortName ?? slug : "—");

function rfqText(ref: string, r: Rfq, files: CheckedFile[]) {
  const lines = r.items.map(
    (it, i) =>
      `${i + 1}. ${it.product} — ${it.quantity} ${it.unit}` +
      [it.category && `category: ${categoryName(it.category)}`, it.material && `material/grade: ${it.material}`, it.size && `size: ${it.size}`, it.standard && `standard: ${it.standard}`, it.brand && `brand: ${it.brand}`, it.notes && `notes: ${it.notes}`]
        .filter(Boolean)
        .map((s) => `\n   ${s}`)
        .join(""),
  );
  return [
    `Quotation request ${ref}`,
    "",
    `Name: ${r.customer.name}`,
    `Company: ${r.customer.company}`,
    `Email: ${r.customer.email}`,
    `Phone: ${r.customer.phone}`,
    r.customer.role && `Role: ${r.customer.role}`,
    "",
    `Delivery location: ${r.requirement.deliveryLocation}`,
    `Timeline: ${r.requirement.timeline}`,
    r.requirement.additional && `Additional requirements: ${r.requirement.additional}`,
    "",
    `Line items (${r.items.length}):`,
    ...lines,
    "",
    files.length ? `Attachments: ${files.map((f) => f.originalName).join(", ")}` : "Attachments: none",
    r.meta.source ? `Started from: ${r.meta.source}` : null,
  ]
    .filter((l): l is string => typeof l === "string")
    .join("\n");
}

function rfqHtml(ref: string, r: Rfq, files: CheckedFile[]) {
  const e = escapeHtml;
  const rows = r.items
    .map(
      (it, i) =>
        `<tr><td>${i + 1}</td><td><b>${e(it.product)}</b>${it.notes ? `<br><small>${e(it.notes)}</small>` : ""}</td><td>${e(categoryName(it.category))}</td><td>${e(it.material)}</td><td>${e(it.size)}</td><td>${e(it.standard)}</td><td>${e(it.brand)}</td><td style="text-align:right">${it.quantity}</td><td>${e(it.unit)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="margin:0 0 4px">Quotation request ${e(ref)}</h2>
<p style="margin:0 0 16px;color:#555">${r.items.length} line item(s) · ${files.length} attachment(s)</p>
<table cellpadding="4" style="border-collapse:collapse;margin-bottom:16px">
<tr><td><b>Name</b></td><td>${e(r.customer.name)}</td></tr>
<tr><td><b>Company</b></td><td>${e(r.customer.company)}</td></tr>
<tr><td><b>Email</b></td><td>${e(r.customer.email)}</td></tr>
<tr><td><b>Phone</b></td><td>${e(r.customer.phone)}</td></tr>
${r.customer.role ? `<tr><td><b>Role</b></td><td>${e(r.customer.role)}</td></tr>` : ""}
<tr><td><b>Delivery location</b></td><td>${e(r.requirement.deliveryLocation)}</td></tr>
<tr><td><b>Timeline</b></td><td>${e(r.requirement.timeline)}</td></tr>
</table>
${r.requirement.additional ? `<p><b>Additional requirements</b><br>${e(r.requirement.additional).replace(/\n/g, "<br>")}</p>` : ""}
<table border="1" cellpadding="6" style="border-collapse:collapse;border-color:#ccc;font-size:13px">
<tr style="background:#f2f2f2"><th>#</th><th>Product</th><th>Category</th><th>Material / grade</th><th>Size</th><th>Standard</th><th>Brand</th><th>Qty</th><th>Unit</th></tr>
${rows}</table>
${files.length ? `<p>Attachments: ${files.map((f) => e(f.originalName)).join(", ")}</p>` : ""}
</div>`;
}

export async function deliverRfq(ref: string, r: Rfq, files: CheckedFile[], receivedAt: string) {
  const record = {
    ref,
    receivedAt,
    customer: r.customer,
    requirement: r.requirement,
    items: r.items,
    source: r.meta.source,
    attachments: files.map((f) => ({ originalName: f.originalName, storedAs: f.safeName, size: f.size })),
  };
  const text = rfqText(ref, r, files);
  return fanOut(ref, {
    storage: storageEnabled ? () => persistSubmission("rfq", ref, record, files) : null,
    email: emailEnabled
      ? () =>
          sendEmail({
            to: notifyRecipients(),
            subject: `RFQ ${ref} — ${r.customer.company} (${r.items.length} item${r.items.length === 1 ? "" : "s"})`,
            html: rfqHtml(ref, r, files),
            text,
            replyTo: r.customer.email,
            attachments: files.map((f) => ({ filename: f.safeName, content: Buffer.from(f.bytes).toString("base64") })),
          })
      : null,
    odoo: odooEnabled
      ? () =>
          createOdooLead({
            name: `RFQ ${ref} — ${r.customer.company}`,
            contactName: r.customer.name,
            partnerName: r.customer.company,
            email: r.customer.email,
            phone: r.customer.phone,
            description: text,
            attachments: files.map((f) => ({ name: f.safeName, base64: Buffer.from(f.bytes).toString("base64") })),
          })
      : null,
    webhook: webhookEnabled ? () => postWebhook({ type: "rfq", ...record }) : null,
  });
}

/** Optional acknowledgement to the customer. Never blocks or fails the submission. */
export async function acknowledgeRfq(ref: string, r: Rfq) {
  if (!emailEnabled || process.env.SEND_CUSTOMER_ACK !== "true") return;
  try {
    await sendEmail({
      to: [r.customer.email],
      subject: `We have received your quotation request ${ref}`,
      text: `Dear ${r.customer.name},\n\nThank you for your quotation request (${ref}) covering ${r.items.length} item(s). The MIIT CORPORATION team will review the specifications and contact you if anything needs clarification.\n\n${company.name}\n${company.phones.map((p) => p.display).join(" / ")}\n${company.email}`,
      html: `<p>Dear ${escapeHtml(r.customer.name)},</p><p>Thank you for your quotation request <b>${escapeHtml(ref)}</b> covering ${r.items.length} item(s). The MIIT CORPORATION team will review the specifications and contact you if anything needs clarification.</p><p>${company.name}<br>${company.phones.map((p) => p.display).join(" / ")}<br>${company.email}</p>`,
      replyTo: company.email,
    });
  } catch (err) {
    console.error(`[submission ${ref}] customer acknowledgement failed: ${(err as Error).message}`);
  }
}

export async function deliverContact(ref: string, c: Contact, receivedAt: string) {
  const record = { ref, receivedAt, name: c.name, email: c.email, phone: c.phone, company: c.company, topic: c.topic, message: c.message };
  const text = `Website enquiry ${ref}\n\nTopic: ${c.topic}\nName: ${c.name}\nCompany: ${c.company || "—"}\nEmail: ${c.email}\nPhone: ${c.phone || "—"}\n\n${c.message}`;
  return fanOut(ref, {
    storage: storageEnabled ? () => persistSubmission("contact", ref, record) : null,
    email: emailEnabled
      ? () =>
          sendEmail({
            to: notifyRecipients(),
            subject: `Website enquiry ${ref} — ${c.topic}`,
            text,
            html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
            replyTo: c.email,
          })
      : null,
    odoo: odooEnabled
      ? () => createOdooLead({ name: `Enquiry ${ref} — ${c.topic}`, contactName: c.name, partnerName: c.company, email: c.email, phone: c.phone, description: text })
      : null,
    webhook: webhookEnabled ? () => postWebhook({ type: "contact", ...record }) : null,
  });
}
