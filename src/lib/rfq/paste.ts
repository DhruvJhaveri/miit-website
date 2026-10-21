import { UNITS } from "./schema";

export interface DraftItem {
  key: string;
  category: string;
  product: string;
  quantity: string;
  unit: string;
  material: string;
  size: string;
  standard: string;
  brand: string;
  notes: string;
}

// React list keys only — a counter avoids reading the clock during render.
let counter = 0;
export const newKey = () => `li-${(counter++).toString(36)}`;

export const emptyItem = (over: Partial<DraftItem> = {}): DraftItem => ({
  key: newKey(),
  category: "",
  product: "",
  quantity: "",
  unit: "nos",
  material: "",
  size: "",
  standard: "",
  brand: "",
  notes: "",
  ...over,
});

const UNIT_ALIASES: Record<string, (typeof UNITS)[number]> = {
  no: "nos", nos: "nos", "no.": "nos", "nos.": "nos", number: "nos", numbers: "nos",
  pc: "pcs", pcs: "pcs", piece: "pcs", pieces: "pcs",
  set: "sets", sets: "sets",
  kg: "kg", kgs: "kg", kilogram: "kg", kilograms: "kg",
  t: "tonnes", ton: "tonnes", tons: "tonnes", tonne: "tonnes", tonnes: "tonnes", mt: "tonnes",
  m: "metres", mtr: "metres", mtrs: "metres", meter: "metres", meters: "metres", metre: "metres", metres: "metres",
  ft: "feet", feet: "feet", foot: "feet",
  box: "boxes", boxes: "boxes",
  l: "litres", ltr: "litres", litre: "litres", litres: "litres", liter: "litres", liters: "litres",
  pair: "pairs", pairs: "pairs",
};

export function normaliseUnit(raw: string): (typeof UNITS)[number] {
  return UNIT_ALIASES[raw.trim().toLowerCase()] ?? "other";
}

/**
 * Parses rows pasted from Excel/Sheets (tab-separated) or CSV.
 * Column order: Product, Quantity, Unit, Material/Grade, Size, Standard, Brand, Notes.
 * A header row is skipped when its quantity column is not numeric.
 */
export function parsePastedRows(text: string): DraftItem[] {
  const rows = text
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);
  const out: DraftItem[] = [];
  for (const [i, row] of rows.entries()) {
    const cells = (row.includes("\t") ? row.split("\t") : splitCsv(row)).map((c) => c.trim());
    const [product = "", qty = "", unit = "", material = "", size = "", standard = "", brand = "", ...rest] = cells;
    const quantity = qty.replace(/,/g, "");
    if (i === 0 && quantity && Number.isNaN(Number(quantity))) continue; // header
    if (!product) continue;
    out.push(
      emptyItem({
        product: product.slice(0, 200),
        quantity: quantity && !Number.isNaN(Number(quantity)) ? quantity : "",
        unit: unit ? normaliseUnit(unit) : "nos",
        material: material.slice(0, 120),
        size: size.slice(0, 160),
        standard: standard.slice(0, 120),
        brand: brand.slice(0, 80),
        notes: rest.join(" ").slice(0, 1000),
      }),
    );
  }
  return out;
}

function splitCsv(row: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (quoted && row[i + 1] === '"') {
        cur += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}
