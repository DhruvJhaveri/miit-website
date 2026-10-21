import { NextResponse } from "next/server";
import { contactSchema, fieldErrors } from "@/lib/rfq/schema";
import { clientIp, rateLimit } from "@/lib/rfq/rate-limit";
import { lookupIdempotency, newReference, rememberIdempotency } from "@/lib/rfq/store";
import { deliverContact } from "@/lib/rfq/deliver";
import { verifyTurnstile } from "@/lib/integrations/turnstile";

const fail = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  if (!rateLimit(`contact:${ip}`, 8, 10 * 60_000).ok) return fail(429, "Too many messages. Please wait a few minutes.");

  let raw: { turnstile?: string } & Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return fail(400, "The request could not be read.");
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return fail(422, "Some information is missing or invalid.", { fields: fieldErrors(parsed.error) });
  const msg = parsed.data;

  if (Date.now() - msg.meta.startedAt < 2_000) return fail(400, "Please review your message and send again.");
  if (!(await verifyTurnstile(raw.turnstile ?? null, ip))) return fail(400, "Verification failed. Please try again.");

  const existing = await lookupIdempotency(msg.meta.idempotencyKey);
  if (existing) return NextResponse.json({ ok: true, ref: existing, duplicate: true });

  const ref = newReference("MSG");
  const report = await deliverContact(ref, msg, new Date().toISOString());
  if (!report.recorded) return fail(503, "We could not send your message right now. Please try again or call us.");
  await rememberIdempotency(msg.meta.idempotencyKey, ref);
  return NextResponse.json({ ok: true, ref });
}
