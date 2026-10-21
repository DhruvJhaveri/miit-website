import { describe, expect, it } from "vitest";
import { normaliseUnit, parsePastedRows } from "@/lib/rfq/paste";
import { buildIndex, search } from "@/lib/search";
import { loadOrder, nearestLoaded } from "@/components/home/film/frames";
import { rateLimit } from "@/lib/rfq/rate-limit";
import { categories } from "@/content/categories";
import { industries } from "@/content/industries";

describe("parsePastedRows", () => {
  it("parses tab-separated rows from Excel and skips a header", () => {
    const rows = parsePastedRows("Product\tQty\tUnit\tGrade\nHex bolt M16\t1,200\tNos.\tGr 8.8\nTMT bar 12mm\t8\tMT\tFe 500D");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ product: "Hex bolt M16", quantity: "1200", unit: "nos", material: "Gr 8.8" });
    expect(rows[1].unit).toBe("tonnes");
  });

  it("parses quoted CSV", () => {
    const rows = parsePastedRows('"Flange, weld neck",24,pcs,CS,"4"" ",ASME B16.5');
    expect(rows[0]).toMatchObject({ product: "Flange, weld neck", quantity: "24", unit: "pcs", size: '4"', standard: "ASME B16.5" });
  });

  it("maps unknown units to 'other' and blank quantities to empty", () => {
    expect(normaliseUnit("bundle")).toBe("other");
    expect(parsePastedRows("Gauge\t\t")[0].quantity).toBe("");
  });

  it("gives every row a unique key", () => {
    const rows = parsePastedRows("a\t1\nb\t2\nc\t3");
    expect(new Set(rows.map((r) => r.key)).size).toBe(3);
  });
});

describe("site search", () => {
  const index = buildIndex();
  it("finds product families by name and keyword", () => {
    expect(search(index, "flange")[0].title).toBe("Flanges");
    expect(search(index, "ISMB").some((e) => e.title === "Beams, Channels and Angles")).toBe(true);
  });
  it("requires every token to match", () => {
    expect(search(index, "grinding wheel").some((e) => e.title === "Grinding Wheels")).toBe(true);
    expect(search(index, "flange zzzz")).toHaveLength(0);
  });
  it("filters by kind", () => {
    expect(search(index, "foundr", ["industry"]).every((e) => e.kind === "industry")).toBe(true);
  });
});

describe("content integrity", () => {
  it("cross-references only existing slugs", () => {
    const catSlugs = new Set(categories.map((c) => c.slug));
    const indSlugs = new Set(industries.map((i) => i.slug));
    for (const c of categories) {
      c.related.forEach((r) => expect(catSlugs.has(r)).toBe(true));
      c.industries.forEach((i) => expect(indSlugs.has(i)).toBe(true));
    }
    for (const i of industries) i.categories.forEach((c) => expect(catSlugs.has(c)).toBe(true));
  });
});

describe("frame sequence loading", () => {
  it("loads first, last, then coarse-to-fine without duplicates", () => {
    const order = loadOrder(240);
    expect(order.slice(0, 3)).toEqual([0, 239, 16]);
    expect(new Set(order).size).toBe(240);
    expect(order.indexOf(8)).toBeLessThan(order.indexOf(1));
  });
  it("falls back to the nearest loaded frame", () => {
    const loaded = [true, false, false, false, true];
    expect(nearestLoaded(1, loaded)).toBe(0);
    expect(nearestLoaded(3, loaded)).toBe(4);
    expect(nearestLoaded(2, [false, false, false])).toBe(-1);
  });
});

describe("rateLimit", () => {
  it("blocks after the limit within the window and recovers after it", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("ip-test", 3, 1000, t + i).ok).toBe(true);
    expect(rateLimit("ip-test", 3, 1000, t + 10).ok).toBe(false);
    expect(rateLimit("ip-test", 3, 1000, t + 2000).ok).toBe(true);
  });
});
