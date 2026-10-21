export interface ProcessStep {
  n: string;
  title: string;
  summary: string;
  inputs: string[];
  activities: string[];
  outputs: string[];
}

/** Indicative procurement process. The exact process depends on each order. */
export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Share your requirement",
    summary: "Send a line-item list, bill of materials, drawings or a simple description.",
    inputs: ["Product descriptions", "Sizes, grades and standards", "Quantities and units", "Delivery location and timeline"],
    activities: ["Requirement received and logged", "Initial review for completeness"],
    outputs: ["Acknowledgement", "Questions on anything unclear"],
  },
  {
    n: "02",
    title: "Review specifications",
    summary: "Each line is checked for the information needed to source it correctly.",
    inputs: ["Your requirement", "Drawings or datasheets", "Brand preferences"],
    activities: ["Line-by-line specification review", "Clarification of missing sizes, grades or ratings"],
    outputs: ["A clarified, sourceable requirement"],
  },
  {
    n: "03",
    title: "Coordinate sourcing",
    summary: "Items are sourced across categories and suppliers.",
    inputs: ["Clarified requirement"],
    activities: ["Availability checks", "Sourcing of standard and hard-to-find items", "Alternatives proposed where appropriate"],
    outputs: ["Confirmed sourcing options"],
  },
  {
    n: "04",
    title: "Confirm the quotation",
    summary: "You receive a quotation for review, and terms are agreed.",
    inputs: ["Sourcing options"],
    activities: ["Quotation prepared", "Commercial and delivery terms agreed"],
    outputs: ["Confirmed order"],
  },
  {
    n: "05",
    title: "Coordinate supply and dispatch",
    summary: "Goods are consolidated, checked, packed and dispatched as agreed.",
    inputs: ["Confirmed order", "Packing and documentation requirements"],
    activities: ["Consolidation", "Quality checks", "Packaging", "Dispatch coordination"],
    outputs: ["Consignment dispatched to the agreed location"],
  },
  {
    n: "06",
    title: "Delivery and documentation",
    summary: "Delivery and documents follow the agreed process.",
    inputs: ["Agreed delivery terms"],
    activities: ["Delivery follow-up", "Documentation as agreed"],
    outputs: ["Delivered requirement", "Records for repeat orders"],
  },
];
