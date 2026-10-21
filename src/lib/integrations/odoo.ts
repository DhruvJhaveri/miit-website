import "server-only";

/**
 * Optional Odoo CRM adapter using Odoo's documented external JSON-RPC API
 * (/jsonrpc, services "common" and "object"). It creates a crm.lead and attaches
 * uploaded files as ir.attachment records.
 *
 * NOT VERIFIED against MIIT's instance: it requires the CRM app, a user with an
 * API key, and an Odoo plan that permits external API access. Enable it only
 * after testing with `npm run odoo:check` — see docs/INTEGRATIONS.md.
 */
export const odooEnabled = Boolean(
  process.env.ODOO_URL && process.env.ODOO_DB && process.env.ODOO_USERNAME && process.env.ODOO_API_KEY,
);

async function rpc<T>(service: string, method: string, args: unknown[]): Promise<T> {
  const res = await fetch(`${process.env.ODOO_URL!.replace(/\/$/, "")}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`odoo http ${res.status}`);
  const body = (await res.json()) as { result?: T; error?: { message?: string } };
  if (body.error) throw new Error(`odoo error: ${body.error.message ?? "unknown"}`);
  return body.result as T;
}

let cachedUid: number | null = null;
async function uid() {
  if (cachedUid) return cachedUid;
  const id = await rpc<number | false>("common", "authenticate", [
    process.env.ODOO_DB, process.env.ODOO_USERNAME, process.env.ODOO_API_KEY, {},
  ]);
  if (!id) throw new Error("odoo authentication failed");
  cachedUid = id;
  return id;
}

async function execute<T>(model: string, method: string, args: unknown[]) {
  return rpc<T>("object", "execute_kw", [process.env.ODOO_DB, await uid(), process.env.ODOO_API_KEY, model, method, args]);
}

export async function createOdooLead(lead: {
  name: string;
  contactName: string;
  partnerName?: string;
  email: string;
  phone?: string;
  description: string;
  attachments?: { name: string; base64: string }[];
}) {
  const leadId = await execute<number>("crm.lead", "create", [[{
    name: lead.name,
    contact_name: lead.contactName,
    partner_name: lead.partnerName || false,
    email_from: lead.email,
    phone: lead.phone || false,
    description: lead.description,
  }]]).then((r) => (Array.isArray(r) ? r[0] : r));
  for (const a of lead.attachments ?? []) {
    await execute("ir.attachment", "create", [[{ name: a.name, datas: a.base64, res_model: "crm.lead", res_id: leadId }]]);
  }
  return leadId;
}

export async function checkOdoo() {
  const version = await rpc<{ server_version: string }>("common", "version", []);
  const id = await uid();
  return { version: version.server_version, uid: id };
}
