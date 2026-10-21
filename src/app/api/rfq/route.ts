import { NextResponse } from "next/server";
import { fieldErrors, rfqSchema } from "@/lib/rfq/schema";
import { validateUploads } from "@/lib/rfq/files";
import { clientIp, rateLimit } from "@/lib/rfq/rate-limit";
import { lookupIdempotency, newReference, rememberIdempotency } from "@/lib/rfq/store";
import { acknowledgeRfq, deliverRfq } from "@/lib/rfq/deliver";
import { verifyTurnstile } from "@/lib/integrations/turnstile";

const MIN_FILL_MS = 3_000;
const MAX_BODY = 27 * 1024 * 1024;

const fail = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limited = rateLimit(`rfq:${ip}`, Number(process.env.RFQ_RATE_LIMIT) || 5, 10 * 60_000);
  if (!limited.ok) {
    return fail(429, "Too many requests. Please wait a few minutes and try again.", { retryAfter: limited.retryAfter });
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY) return fail(413, "The request is too large. Attachments are limited to 25 MB in total.");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "The request could not be read.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return fail(400, "The request could not be read.");
  }

  const parsed = rfqSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(422, "Some information is missing or invalid.", { fields: fieldErrors(parsed.error) });
  }
  const rfq = parsed.data;

  // Spam checks: honeypot is enforced by the schema; reject implausibly fast submissions.
  if (Date.now() - rfq.meta.startedAt < MIN_FILL_MS) return fail(400, "Please review your request and submit again.");
  if (!(await verifyTurnstile(form.get("cf-turnstile-response") as string | null, ip))) {
    return fail(400, "Verification failed. Please try again.");
  }

  // Duplicate prevention: a repeated idempotency key returns the original reference.
  const existing = await lookupIdempotency(rfq.meta.idempotencyKey);
  if (existing) return NextResponse.json({ ok: true, ref: existing, duplicate: true });

  const uploads = form.getAll("files").filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f);
  const checked = await validateUploads(uploads);
  if ("error" in checked) return fail(422, checked.error, { fields: { files: checked.error } });

  const ref = newReference("RFQ");
  const report = await deliverRfq(ref, rfq, checked.files, new Date().toISOString());
  if (!report.recorded) {
    return fail(503, "We could not record your request right now. Please try again, or email it to us directly.", { ref: null });
  }
  await rememberIdempotency(rfq.meta.idempotencyKey, ref);
  await acknowledgeRfq(ref, rfq);
  return NextResponse.json({ ok: true, ref });
}
