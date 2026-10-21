import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors, rfqSchema } from "@/lib/rfq/schema";

const valid = {
  customer: { name: "Asha Rao", company: "Example Fabricators", email: "asha@example.com", phone: "+91 98200 00000", role: "" },
  requirement: { deliveryLocation: "Pune", timeline: "Within 2–4 weeks", additional: "" },
  items: [{ category: "fasteners-hardware", product: "Hex bolt M16x60", quantity: "600", unit: "nos", material: "Gr 8.8", size: "", standard: "", brand: "", notes: "" }],
  consent: true,
  meta: { idempotencyKey: "0f8fad5b-d9cb-469f-a165-70867728950e", startedAt: 1_700_000_000_000, website: "" },
};

describe("rfqSchema", () => {
  it("accepts a valid request and coerces quantity", () => {
    const r = rfqSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.items[0].quantity).toBe(600);
  });

  it("rejects missing customer details with field paths", () => {
    const r = rfqSchema.safeParse({ ...valid, customer: { ...valid.customer, email: "not-an-email", name: "" } });
    expect(r.success).toBe(false);
    if (!r.success) {
      const f = fieldErrors(r.error);
      expect(f["customer.email"]).toBeTruthy();
      expect(f["customer.name"]).toBeTruthy();
    }
  });

  it("requires at least one line item with a positive quantity and a known unit", () => {
    expect(rfqSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
    expect(rfqSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity: "0" }] }).success).toBe(false);
    expect(rfqSchema.safeParse({ ...valid, items: [{ ...valid.items[0], unit: "bags" }] }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(rfqSchema.safeParse({ ...valid, meta: { ...valid.meta, website: "http://spam" } }).success).toBe(false);
  });

  it("requires consent and a well-formed idempotency key", () => {
    expect(rfqSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(rfqSchema.safeParse({ ...valid, meta: { ...valid.meta, idempotencyKey: "x" } }).success).toBe(false);
  });

  it("caps line items at 300", () => {
    const items = Array.from({ length: 301 }, () => valid.items[0]);
    expect(rfqSchema.safeParse({ ...valid, items }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("allows an empty optional phone", () => {
    const r = contactSchema.safeParse({ name: "Ravi", email: "r@example.com", phone: "", company: "", topic: "General enquiry", message: "Need a catalogue for bearings.", consent: true, meta: valid.meta });
    expect(r.success).toBe(true);
  });
});
