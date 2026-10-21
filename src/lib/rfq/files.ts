import { LIMITS } from "./schema";

/** Allowed upload types, checked by extension AND file signature (magic bytes). */
const TYPES: Record<string, { label: string; check: (b: Uint8Array) => boolean }> = {
  pdf: { label: "PDF", check: (b) => starts(b, [0x25, 0x50, 0x44, 0x46]) },
  png: { label: "PNG", check: (b) => starts(b, [0x89, 0x50, 0x4e, 0x47]) },
  jpg: { label: "JPEG", check: (b) => starts(b, [0xff, 0xd8, 0xff]) },
  jpeg: { label: "JPEG", check: (b) => starts(b, [0xff, 0xd8, 0xff]) },
  webp: { label: "WebP", check: (b) => starts(b, [0x52, 0x49, 0x46, 0x46]) && ascii(b, 8, 4) === "WEBP" },
  xlsx: { label: "Excel", check: isZip },
  docx: { label: "Word", check: isZip },
  xls: { label: "Excel", check: isOle },
  doc: { label: "Word", check: isOle },
  csv: { label: "CSV", check: isPlainText },
  txt: { label: "Text", check: isPlainText },
  dxf: { label: "DXF", check: isPlainText },
  dwg: { label: "DWG", check: (b) => ascii(b, 0, 2) === "AC" },
};

export const ACCEPT_ATTR = Object.keys(TYPES).map((e) => `.${e}`).join(",");
export const ACCEPT_LABEL = "PDF, Excel, CSV, Word, PNG, JPG, WebP, DWG or DXF";

function starts(b: Uint8Array, sig: number[]) {
  return sig.every((v, i) => b[i] === v);
}
function ascii(b: Uint8Array, at: number, len: number) {
  return String.fromCharCode(...b.slice(at, at + len));
}
function isZip(b: Uint8Array) {
  return starts(b, [0x50, 0x4b, 0x03, 0x04]);
}
function isOle(b: Uint8Array) {
  return starts(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
}
function isPlainText(b: Uint8Array) {
  const n = Math.min(b.length, 4096);
  for (let i = 0; i < n; i++) if (b[i] === 0) return false;
  return true;
}

export const extensionOf = (name: string) => name.toLowerCase().split(".").pop() ?? "";

/** Client-side pre-check (size + extension). The server repeats every check. */
export function precheckFile(file: { name: string; size: number }): string | null {
  const ext = extensionOf(file.name);
  if (!TYPES[ext]) return `${file.name}: file type not accepted. Use ${ACCEPT_LABEL}.`;
  if (file.size > LIMITS.maxFileBytes) return `${file.name}: larger than 10 MB.`;
  if (file.size === 0) return `${file.name}: file is empty.`;
  return null;
}

export interface CheckedFile {
  originalName: string;
  safeName: string;
  ext: string;
  size: number;
  bytes: Uint8Array;
}

/** Server-side validation. Returns an error message or the checked files. */
export async function validateUploads(files: File[]): Promise<{ error: string } | { files: CheckedFile[] }> {
  if (files.length > LIMITS.maxFiles) return { error: `Attach up to ${LIMITS.maxFiles} files.` };
  let total = 0;
  const out: CheckedFile[] = [];
  for (const [i, file] of files.entries()) {
    const pre = precheckFile(file);
    if (pre) return { error: pre };
    total += file.size;
    if (total > LIMITS.maxTotalBytes) return { error: "Attachments exceed 25 MB in total." };
    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = extensionOf(file.name);
    if (!TYPES[ext].check(bytes)) return { error: `${file.name}: contents do not match a ${TYPES[ext].label} file.` };
    const base = file.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";
    out.push({ originalName: file.name.slice(0, 200), safeName: `${String(i + 1).padStart(2, "0")}-${base}.${ext}`, ext, size: file.size, bytes });
  }
  return { files: out };
}
