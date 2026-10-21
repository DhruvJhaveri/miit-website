import "server-only";
import { createHmac } from "node:crypto";

/**
 * Optional outbound webhook (e.g. to a CRM, Zapier/Make, or an internal system).
 * Payload excludes file contents. If WEBHOOK_SECRET is set the body is signed
 * with HMAC-SHA256 in the `x-miit-signature` header.
 */
export const webhookEnabled = Boolean(process.env.SUBMISSION_WEBHOOK_URL);

export async function postWebhook(payload: unknown) {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.WEBHOOK_SECRET) {
    headers["x-miit-signature"] = createHmac("sha256", process.env.WEBHOOK_SECRET).update(body).digest("hex");
  }
  const res = await fetch(process.env.SUBMISSION_WEBHOOK_URL!, { method: "POST", headers, body, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
}
