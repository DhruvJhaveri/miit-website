/**
 * Source: MIIT CORPORATION LinkedIn post
 * https://www.linkedin.com/posts/miitcorporation_miit-corporation-profile-activity-7382656711062532096-F7Of
 * Only the figures and facts reported in that post are used. The client is not named.
 * Obtain MIIT's approval before adding any further identifying details.
 */
export interface CaseStudy {
  slug: string;
  title: string;
  dek: string;
  client: string;
  source: { label: string; href: string };
  figures: { value: number; suffix: string; label: string; display?: string }[];
  categories: { group: string; items: string[] }[];
  chapters: { n: string; title: string; body: string }[];
  services: string[];
  takeaway: string;
  image: string;
  industries: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "65-tonne-export-order",
    title: "130 products. 65 tonnes. One coordinated order.",
    dek:
      "How MIIT CORPORATION consolidated a multi-category requirement for an exporter supplying oil, water and steam-based plant systems to a textile manufacturing company.",
    client: "An exporter (repeat customer) supplying oil, water and steam-based plants for a textile manufacturing company",
    source: {
      label: "MIIT CORPORATION on LinkedIn",
      href: "https://www.linkedin.com/posts/miitcorporation_miit-corporation-profile-activity-7382656711062532096-F7Of",
    },
    figures: [
      { value: 130, suffix: "+", label: "Different products in one requirement" },
      { value: 65000, suffix: " kg", label: "Approximate material weight", display: "65,000 kg" },
      { value: 65, suffix: " t", label: "Total, in tonnes" },
      { value: 1, suffix: "", label: "Point of contact and one invoice" },
    ],
    categories: [
      { group: "Structural", items: ["H, L and C beams", "Pipes", "Pipe fittings", "Flanges", "Valves"] },
      { group: "Operational", items: ["Industrial tools", "Nuts and bolts", "Instruments"] },
    ],
    chapters: [
      {
        n: "01",
        title: "The challenge",
        body:
          "The customer needed more than 130 different products, each in specific sizes and grades and in varying quantities, delivered within a tight deadline.",
      },
      {
        n: "02",
        title: "The coordination problem",
        body:
          "Structural sections, piping components, valves, tools, fasteners and instruments come from different supply chains. Each line carried its own specification and quantity.",
      },
      {
        n: "03",
        title: "The approach",
        body:
          "MIIT consolidated the requirements into a single procurement plan and checked specifications against the export compliance standards that applied.",
      },
      {
        n: "04",
        title: "Execution",
        body:
          "Standard and hard-to-find items were sourced from dozens of suppliers. MIIT handled packaging, quality checks and dispatch, giving the customer one point of contact and one invoice.",
      },
      {
        n: "05",
        title: "Reported result",
        body:
          "MIIT reports that approximately 65 tonnes of material was delivered on time, matching the specified requirements and quantities.",
      },
    ],
    services: [
      "Requirement consolidation into one procurement plan",
      "Specification checks against export compliance standards",
      "Sourcing of standard and hard-to-find items",
      "Packaging, quality checks and dispatch",
      "One point of contact, one invoice",
    ],
    takeaway:
      "For complex, multi-category requirements, consolidating procurement through one coordinator can reduce the burden of managing many suppliers. Outcomes depend on each order's products, specifications and agreed terms.",
    image: "/media/stills/ed-port-cranes.jpg",
    industries: ["exports", "oil-gas", "epc-turnkey"],
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
