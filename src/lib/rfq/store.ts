import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { CheckedFile } from "./files";

/**
 * Local file-system persistence for submissions. Submissions and uploads are
 * written OUTSIDE /public so they are never web-accessible. On hosts without a
 * durable disk (serverless), set RFQ_STORAGE=off and rely on email/Odoo
 * delivery, or replace this module with object storage — see docs/DEPLOYMENT.md.
 */
// Runtime-only path: excluded from build tracing so the project isn't bundled into the server output.
const ROOT = path.resolve(/*turbopackIgnore: true*/ process.env.RFQ_STORAGE_DIR || path.join(process.cwd(), ".data"));
export const storageEnabled = process.env.RFQ_STORAGE !== "off";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function newReference(kind: "RFQ" | "MSG", now = new Date()) {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Array.from(randomBytes(5), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `MIIT-${kind}-${ymd}-${rand}`;
}

const idemFile = (key: string) => path.join(ROOT, "idempotency", `${key.replace(/[^a-zA-Z0-9-]/g, "")}.txt`);
const memoryIdem = new Map<string, { ref: string; at: number }>();

export async function lookupIdempotency(key: string): Promise<string | null> {
  const hit = memoryIdem.get(key);
  if (hit && Date.now() - hit.at < 24 * 3600_000) return hit.ref;
  if (!storageEnabled) return null;
  try {
    return (await readFile(idemFile(key), "utf8")).trim() || null;
  } catch {
    return null;
  }
}

export async function rememberIdempotency(key: string, ref: string) {
  memoryIdem.set(key, { ref, at: Date.now() });
  if (!storageEnabled) return;
  await mkdir(path.dirname(idemFile(key)), { recursive: true });
  await writeFile(idemFile(key), ref, "utf8");
}

export async function persistSubmission(kind: "rfq" | "contact", ref: string, record: unknown, files: CheckedFile[] = []) {
  if (!storageEnabled) return false;
  const dir = path.join(ROOT, kind, ref);
  await mkdir(dir, { recursive: true });
  for (const f of files) await writeFile(path.join(dir, f.safeName), f.bytes);
  await writeFile(path.join(dir, "submission.json"), JSON.stringify(record, null, 2), "utf8");
  return true;
}
