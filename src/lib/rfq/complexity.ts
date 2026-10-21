/**
 * Requirement Complexity Planner — an internal planning aid, not a certified
 * procurement assessment. It never estimates prices or savings.
 *
 * Scoring rules (max 100):
 *   line items        min(lines / 150, 1)            × 25
 *   categories        min(categories / 8, 1)         × 20
 *   current suppliers min(suppliers / 15, 1)         × 15
 *   consignments      min((consignments − 1) / 5, 1) × 10
 *   specifications    all 0 · most 6 · some 12 · none 18
 *   documentation +4 · special packaging +4 · export +4
 * Bands: < 30 Straightforward · 30–59 Moderate · ≥ 60 Complex
 */

export type SpecCompleteness = "all" | "most" | "some" | "none";
export type MixKey = "structural" | "piping" | "tools" | "consumables" | "fasteners" | "instruments" | "mechanical" | "safety";

export interface ComplexityInput {
  lineItems: number;
  categories: number;
  suppliers: number;
  consignments: number;
  specs: SpecCompleteness;
  mix: MixKey[];
  documentation: boolean;
  packaging: boolean;
  exportOrder: boolean;
}

export interface ComplexityResult {
  score: number;
  band: "Straightforward" | "Moderate" | "Complex";
  breakdown: { label: string; points: number; max: number }[];
  missing: string[];
  documents: string[];
  categories: string[];
  path: { title: string; detail: string };
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

const SPEC_POINTS: Record<SpecCompleteness, number> = { all: 0, most: 6, some: 12, none: 18 };

const MIX_CATEGORY: Record<MixKey, string> = {
  structural: "metals-structural-materials",
  piping: "pipes-valves-fittings",
  tools: "engineering-hand-tools",
  consumables: "cutting-grinding",
  fasteners: "fasteners-hardware",
  instruments: "pneumatics-instrumentation",
  mechanical: "bearings-mechanical",
  safety: "safety-maintenance",
};

const MIX_MISSING: Record<MixKey, string[]> = {
  structural: ["Section type, size and length for each structural line", "Grade or standard and tonnage per size"],
  piping: ["Size, pressure class / schedule and material for every piping line", "End connections and applicable standard"],
  tools: ["Sizes or size ranges and any preferred make for tools"],
  consumables: ["Dimensions, grit and machine speed for discs and wheels"],
  fasteners: ["Diameter × length, grade / property class and finish for fasteners"],
  instruments: ["Range, connection and accuracy / calibration needs for instruments"],
  mechanical: ["Bearing numbers or full dimensions; capacities for lifting equipment"],
  safety: ["Size breakdown and required standards for PPE"],
};

export function assessComplexity(input: ComplexityInput): ComplexityResult {
  const lines = Math.max(0, Math.round(input.lineItems || 0));
  const breakdown = [
    { label: "Line items", points: Math.round(clamp01(lines / 150) * 25), max: 25 },
    { label: "Product categories", points: Math.round(clamp01(input.categories / 8) * 20), max: 20 },
    { label: "Suppliers involved today", points: Math.round(clamp01(input.suppliers / 15) * 15), max: 15 },
    { label: "Deliveries / consignments", points: Math.round(clamp01((input.consignments - 1) / 5) * 10), max: 10 },
    { label: "Specification gaps", points: SPEC_POINTS[input.specs], max: 18 },
    {
      label: "Documentation, packaging, export",
      points: (input.documentation ? 4 : 0) + (input.packaging ? 4 : 0) + (input.exportOrder ? 4 : 0),
      max: 12,
    },
  ];
  const score = Math.min(100, breakdown.reduce((s, b) => s + b.points, 0));
  const band = score >= 60 ? "Complex" : score >= 30 ? "Moderate" : "Straightforward";

  const missing: string[] = [];
  if (input.specs !== "all") {
    missing.push("Confirm a size, grade or standard for every line — mark unknowns clearly");
    for (const key of input.mix) missing.push(...MIX_MISSING[key]);
  }
  missing.push("Unit of measurement on every line (nos, kg, tonnes, metres…)");
  missing.push("Delivery location and required timeline");

  const documents: string[] = [];
  if (lines > 10) documents.push("Bill of materials as Excel or CSV (one row per distinct item)");
  if (input.mix.includes("structural") || input.mix.includes("piping")) documents.push("Drawings, line lists or GA references");
  if (input.mix.includes("instruments") || input.mix.includes("mechanical")) documents.push("Datasheets or part numbers for instruments and components");
  if (input.documentation) documents.push("List of required certificates and inspection documents");
  if (input.packaging) documents.push("Packing and marking instructions");
  if (input.exportOrder) documents.push("Destination standards and export documentation requirements");
  if (documents.length === 0) documents.push("A simple item list is enough to start");

  const path =
    band === "Complex"
      ? { title: "Upload your BOM and request a specification review", detail: "Submit the RFQ with your BOM attached and note the lines that need clarification. MIIT can review them with you before quoting." }
      : lines > 10
        ? { title: "Upload your BOM with the RFQ", detail: "Attach your Excel or CSV list and add delivery details. Key lines can also be entered individually." }
        : { title: "Enter items line by line", detail: "Use the RFQ form to add each item with its specification and quantity." };

  return {
    score,
    band,
    breakdown,
    missing: Array.from(new Set(missing)),
    documents,
    categories: input.mix.map((m) => MIX_CATEGORY[m]),
    path,
  };
}
