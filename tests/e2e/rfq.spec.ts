import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const minimalPayload = (key: string, over: Record<string, unknown> = {}) => ({
  customer: { name: "E2E Buyer", company: "E2E Test Pvt Ltd", email: "buyer@example.com", phone: "+91 98200 00000", role: "" },
  requirement: { deliveryLocation: "Mumbai", timeline: "Within 1 week", additional: "" },
  items: [{ category: "fasteners-hardware", product: "Hex bolt M16x60", quantity: "100", unit: "nos", material: "", size: "", standard: "", brand: "", notes: "" }],
  consent: true,
  meta: { idempotencyKey: key, startedAt: Date.now() - 60_000, website: "" },
  ...over,
});

const post = (request: import("@playwright/test").APIRequestContext, payload: unknown, files: { name: string; mimeType: string; buffer: Buffer }[] = [], ip = `10.0.0.${Math.floor(Math.random() * 250)}`) =>
  request.post("/api/rfq", {
    headers: { "x-forwarded-for": ip },
    multipart: { payload: JSON.stringify(payload), ...Object.fromEntries(files.map((f, i) => [`files${i ? i : ""}`, f])) },
  });

test.describe("RFQ API", () => {
  test("records a valid request, persists it, and de-duplicates by idempotency key", async ({ request }) => {
    const key = `e2e-${Date.now()}-dedupe-aaaa`;
    const r1 = await post(request, minimalPayload(key));
    expect(r1.status()).toBe(200);
    const b1 = await r1.json();
    expect(b1.ref).toMatch(/^MIIT-RFQ-\d{6}-[A-Z0-9]{5}$/);
    const saved = JSON.parse(await readFile(path.join(".data-e2e", "rfq", b1.ref, "submission.json"), "utf8"));
    expect(saved.items[0].product).toBe("Hex bolt M16x60");
    const r2 = await post(request, minimalPayload(key));
    const b2 = await r2.json();
    expect(b2.ref).toBe(b1.ref);
    expect(b2.duplicate).toBe(true);
  });

  test("rejects invalid data with field errors", async ({ request }) => {
    const r = await post(request, minimalPayload(`e2e-${Date.now()}-invalid-aa`, { items: [] }));
    expect(r.status()).toBe(422);
    expect((await r.json()).fields.items).toBeTruthy();
  });

  test("rejects honeypot and too-fast submissions", async ({ request }) => {
    const p = minimalPayload(`e2e-${Date.now()}-honeypot-a`);
    const hp = await post(request, { ...p, meta: { ...p.meta, website: "spam" } });
    expect(hp.status()).toBe(422);
    const fast = await post(request, { ...p, meta: { ...p.meta, idempotencyKey: `e2e-${Date.now()}-fast-aaaa`, startedAt: Date.now() } });
    expect(fast.status()).toBe(400);
  });

  test("rejects a file whose contents do not match its extension", async ({ request }) => {
    const r = await post(request, minimalPayload(`e2e-${Date.now()}-badfile-a`), [{ name: "drawing.pdf", mimeType: "application/pdf", buffer: Buffer.from("MZ\x90\x00not a pdf") }]);
    expect(r.status()).toBe(422);
    expect((await r.json()).error).toMatch(/do not match/);
  });

  test("stores valid attachments outside the public folder", async ({ request }) => {
    const r = await post(request, minimalPayload(`e2e-${Date.now()}-goodfile-a`), [{ name: "bom.csv", mimeType: "text/csv", buffer: Buffer.from("item,qty\nbolt,10\n") }]);
    expect(r.status()).toBe(200);
    const { ref } = await r.json();
    const saved = JSON.parse(await readFile(path.join(".data-e2e", "rfq", ref, "submission.json"), "utf8"));
    expect(saved.attachments[0].storedAs).toBe("01-bom.csv");
    const pub = await request.get(`/.data-e2e/rfq/${ref}/01-bom.csv`);
    expect(pub.status()).toBe(404);
  });

  test("rate-limits repeated submissions from one client", async ({ request }) => {
    const ip = "10.9.9.9";
    let last = 0;
    for (let i = 0; i < 42; i++) {
      const r = await post(request, { bad: true }, [], ip);
      last = r.status();
      if (last === 429) break;
    }
    expect(last).toBe(429);
  });
});

test.describe("RFQ form", () => {
  test("multi-step flow with validation, line items, paste, upload and confirmation", async ({ page }) => {
    await page.goto("/request-quote?category=pipes-valves-fittings&product=flanges&source=e2e");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // step 1 — validation then valid details
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText("Enter your full name")).toBeVisible();
    await page.getByLabel("Full name").fill("Form Tester");
    await page.getByLabel("Company name").fill("Form Test Industries");
    await page.getByLabel("Business email").fill("tester@example.com");
    await page.getByLabel("Phone number").fill("+91 98690 00000");
    await page.getByRole("button", { name: /continue/i }).click();

    // step 2 — prefilled item from URL
    await expect(page.getByLabel("Product or material").first()).toHaveValue("Flanges");
    await page.getByLabel("Quantity").first().fill("36");
    await page.getByRole("button", { name: "Add item" }).click();
    await expect(page.getByText("2 line items")).toBeVisible();
    await page.getByRole("button", { name: "Remove item 2" }).click();
    await expect(page.getByText("1 line item")).toBeVisible();

    await page.getByRole("button", { name: /paste from spreadsheet/i }).click();
    await page.getByLabel(/paste rows/i).fill("Hex bolt M16x60\t600\tnos\tGr 8.8\nGate valve 50 NB\t24\tpcs\tCS");
    await page.getByRole("button", { name: /add 2 rows/i }).click();
    await expect(page.getByText("3 line items")).toBeVisible();

    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText("Enter the delivery location")).toBeVisible();
    await page.getByLabel("Delivery location").fill("Surat, Gujarat");
    await page.getByLabel("Desired timeline").selectOption("Within 2–4 weeks");
    await page.getByRole("button", { name: /continue/i }).click();

    // step 3 — reject a bad file, accept a CSV
    const input = page.locator("input[type=file]");
    await input.setInputFiles({ name: "virus.exe", mimeType: "application/octet-stream", buffer: Buffer.from("MZ") });
    await expect(page.getByRole("alert").filter({ hasText: "not accepted" })).toBeVisible();
    await input.setInputFiles({ name: "bom.csv", mimeType: "text/csv", buffer: Buffer.from("item,qty\nflange,36\n") });
    await expect(page.locator("li", { hasText: "bom.csv" })).toBeVisible();
    await page.getByRole("button", { name: /continue/i }).click();

    // step 4 — review, consent, submit once
    await expect(page.getByText("Line items (3)")).toBeVisible();
    await expect(page.getByRole("cell", { name: "Gate valve 50 NB" })).toBeVisible();
    await page.getByRole("button", { name: /submit request/i }).click();
    await expect(page.getByText("Please confirm you have read the privacy notice.")).toBeVisible();
    await page.getByRole("checkbox").check();
    const requests: string[] = [];
    page.on("request", (r) => r.url().includes("/api/rfq") && requests.push(r.method()));
    const submit = page.getByRole("button", { name: /submit request/i });
    await submit.dblclick();
    await page.waitForURL(/\/request-quote\/received\?ref=MIIT-RFQ-/);
    await expect(page.getByText(/Reference number/)).toBeVisible();
    expect(requests.length).toBe(1);
  });

  test("shows a recoverable error when the server cannot record the request", async ({ page }) => {
    await page.route("**/api/rfq", (r) => r.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, error: "We could not record your request right now." }) }));
    await page.goto("/request-quote");
    await page.evaluate(() => localStorage.setItem("miit-rfq-draft-v1", JSON.stringify({
      customer: { name: "A Buyer", company: "Co Ltd", email: "a@example.com", phone: "+91 98200 11111", role: "" },
      items: [{ key: "x", category: "", product: "Bearing 6205", quantity: "10", unit: "nos", material: "", size: "", standard: "", brand: "", notes: "" }],
      requirement: { deliveryLocation: "Pune", timeline: "As soon as possible", additional: "" },
    })));
    await page.reload();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: /continue/i }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /submit request/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: "could not record" })).toBeVisible();
    const fallback = page.getByRole("alert").filter({ hasText: "could not record" }).getByRole("link", { name: "miitcorporation@gmail.com" });
    await expect(fallback).toHaveAttribute("href", /^mailto:.*body=.*Bearing%206205/);
  });
});
