import { describe, expect, it } from "vitest";
import { assessComplexity, type ComplexityInput } from "@/lib/rfq/complexity";

const base: ComplexityInput = { lineItems: 5, categories: 1, suppliers: 1, consignments: 1, specs: "all", mix: [], documentation: false, packaging: false, exportOrder: false };

describe("assessComplexity", () => {
  it("scores a minimal requirement as straightforward", () => {
    const r = assessComplexity(base);
    expect(r.score).toBeLessThan(30);
    expect(r.band).toBe("Straightforward");
    expect(r.path.title).toMatch(/line by line/i);
  });

  it("caps every factor and the total at 100", () => {
    const r = assessComplexity({ ...base, lineItems: 10_000, categories: 50, suppliers: 99, consignments: 99, specs: "none", documentation: true, packaging: true, exportOrder: true });
    expect(r.score).toBe(100);
    expect(r.band).toBe("Complex");
    for (const b of r.breakdown) expect(b.points).toBeLessThanOrEqual(b.max);
  });

  it("matches the published 65-tonne order shape as complex", () => {
    const r = assessComplexity({ ...base, lineItems: 130, categories: 8, suppliers: 24, consignments: 3, specs: "most", mix: ["structural", "piping", "tools", "fasteners", "instruments"], exportOrder: true });
    expect(r.band).toBe("Complex");
    expect(r.documents.some((d) => /bill of materials/i.test(d))).toBe(true);
    expect(r.categories).toContain("pipes-valves-fittings");
  });

  it("lists mix-specific missing information only when specs are incomplete", () => {
    const complete = assessComplexity({ ...base, mix: ["piping"] });
    const partial = assessComplexity({ ...base, mix: ["piping"], specs: "some" });
    expect(complete.missing.join(" ")).not.toMatch(/pressure class/i);
    expect(partial.missing.join(" ")).toMatch(/pressure class/i);
  });

  it("never produces monetary output", () => {
    const r = assessComplexity({ ...base, lineItems: 80, categories: 5 });
    expect(JSON.stringify(r)).not.toMatch(/₹|\$|INR|saving|price/i);
  });

  it("handles invalid numeric input safely", () => {
    const r = assessComplexity({ ...base, lineItems: Number.NaN, categories: -3, suppliers: Infinity, consignments: 0 });
    expect(Number.isFinite(r.score)).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});
