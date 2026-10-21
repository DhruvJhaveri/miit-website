import { describe, expect, it } from "vitest";
import { precheckFile, validateUploads } from "@/lib/rfq/files";

const file = (name: string, bytes: number[] | string, type = "") =>
  new File([typeof bytes === "string" ? bytes : new Uint8Array(bytes)], name, { type });

describe("upload validation", () => {
  it("accepts files whose signature matches their extension", async () => {
    const r = await validateUploads([file("spec.pdf", [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]), file("bom.xlsx", [0x50, 0x4b, 0x03, 0x04, 0, 0]), file("bom.csv", "item,qty\nbolt,10")]);
    expect("files" in r && r.files.length).toBe(3);
  });

  it("rejects a renamed executable", async () => {
    const r = await validateUploads([file("drawing.pdf", [0x4d, 0x5a, 0x90, 0x00])]);
    expect("error" in r && r.error).toMatch(/do not match/);
  });

  it("rejects disallowed extensions", () => {
    expect(precheckFile({ name: "setup.exe", size: 10 })).toMatch(/not accepted/);
    expect(precheckFile({ name: "page.html", size: 10 })).toMatch(/not accepted/);
  });

  it("enforces size limits", async () => {
    expect(precheckFile({ name: "big.pdf", size: 11 * 1024 * 1024 })).toMatch(/10 MB/);
    expect(precheckFile({ name: "empty.pdf", size: 0 })).toMatch(/empty/);
    const many = Array.from({ length: 6 }, (_, i) => file(`f${i}.csv`, "a,b"));
    expect("error" in (await validateUploads(many))).toBe(true);
  });

  it("sanitises stored file names", async () => {
    const r = await validateUploads([file("../../etc/pass wd<script>.csv", "a,b")]);
    expect("files" in r && r.files[0].safeName).toMatch(/^01-[a-zA-Z0-9_-]+\.csv$/);
  });

  it("rejects binary content posing as CSV", async () => {
    const r = await validateUploads([file("bom.csv", [0x41, 0x00, 0x42])]);
    expect("error" in r).toBe(true);
  });
});
