import "server-only";

/** Optional Cloudflare Turnstile verification; skipped when no secret is configured. */
export const turnstileEnabled = Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(token: string | null, ip: string) {
  if (!turnstileEnabled) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}
