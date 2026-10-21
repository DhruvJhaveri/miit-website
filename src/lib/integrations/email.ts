import "server-only";

/**
 * Email delivery through the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * Enabled when RESEND_API_KEY and NOTIFY_EMAIL_TO are set. Any provider with an
 * HTTP API can replace this adapter without touching the route handlers.
 */
export const emailEnabled = Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL_TO);

export interface OutgoingEmail {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
}

export async function sendEmail(mail: OutgoingEmail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_EMAIL_FROM || "MIIT Website <onboarding@resend.dev>",
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
      attachments: mail.attachments,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`email provider responded ${res.status}`);
}

export const notifyRecipients = () => (process.env.NOTIFY_EMAIL_TO || "").split(",").map((s) => s.trim()).filter(Boolean);

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
