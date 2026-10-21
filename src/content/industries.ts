import type { Industry } from "./types";

/**
 * Industries listed on MIIT CORPORATION's public website: Manufacturing, Foundries,
 * Exports, CNC-VMC machine shops, Construction, Contractors, plus EPC/Turnkey,
 * Fabrication and Oil & Gas mentioned in body copy. Infrastructure and Automobile &
 * Engineering come from the website brief and should be confirmed by MIIT.
 */
export const industries: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Consumables, tools and spares that keep production lines running.",
    intro:
      "Manufacturing plants depend on a steady flow of tools, consumables, fasteners and spares — usually dozens of small line items from many suppliers. MIIT consolidates these recurring requirements into fewer, better-coordinated purchases.",
    image: "/media/stills/ind-manufacturing.jpg",
    imageAlt: "Aerial view of an industrial manufacturing facility",
    challenges: [
      { title: "Fragmented indents", body: "Maintenance, production and stores raise separate requests for overlapping items." },
      { title: "Downtime risk", body: "A missing bearing or cutting tool can stop a line while a new supplier is found." },
      { title: "Specification drift", body: "Repeat orders placed from memory rather than specification lead to mismatched parts." },
    ],
    categories: ["engineering-hand-tools", "cutting-grinding", "fasteners-hardware", "bearings-mechanical", "safety-maintenance", "pneumatics-instrumentation"],
    applications: ["Maintenance stores replenishment", "Machine spares", "Production consumables", "Plant expansion materials"],
    specConsiderations: ["Use part numbers or drawings for spares", "Specify brand when standardised across the plant", "Group recurring items into a periodic requirement list"],
    support: ["Single consolidated quotation across categories", "Specification review before sourcing", "Coordinated packaging and dispatch"],
  },
  {
    slug: "foundries",
    name: "Foundries and Castings",
    short: "Fettling, finishing and safety supplies for hot, abrasive work.",
    intro:
      "Foundries consume abrasives, grinding wheels, cutting discs and safety equipment at a high rate. MIIT supports foundries with dependable access to these consumables alongside tools, fasteners and maintenance items.",
    image: "/media/stills/ind-foundries.jpg",
    imageAlt: "Molten metal and steam in a foundry",
    challenges: [
      { title: "High consumable usage", body: "Grinding and cutting consumables run out quickly during fettling." },
      { title: "Harsh conditions", body: "Heat and abrasion demand the right grade of wheel and the right PPE." },
      { title: "Mixed requirements", body: "Consumables, tools and maintenance spares are often purchased separately." },
    ],
    categories: ["cutting-grinding", "safety-maintenance", "engineering-hand-tools", "fasteners-hardware", "bearings-mechanical"],
    applications: ["Fettling and finishing castings", "Riser and gate removal", "Hot-work protection", "Maintenance of handling equipment"],
    specConsiderations: ["Wheel dimensions, grit and maximum operating speed", "Material being ground", "PPE standards for hot work"],
    support: ["Consumables and safety items quoted together", "Brand preferences accommodated subject to availability", "Repeat requirement planning"],
  },
  {
    slug: "exports",
    name: "Exports",
    short: "Multi-category export packages, packed and dispatched to specification.",
    intro:
      "Exporters supplying overseas plants often need large, mixed packages — structural materials, piping, tools and instruments — prepared to exact specifications. MIIT's published 65-tonne, 130-product order for an exporter is an example of this kind of coordination.",
    image: "/media/stills/ind-exports.jpg",
    imageAlt: "Container port at dusk with cranes and stacked containers",
    challenges: [
      { title: "Many line items", body: "Packages can span hundreds of items across many categories and suppliers." },
      { title: "Compliance checks", body: "Specifications must align with the destination project's standards." },
      { title: "Packing and dispatch", body: "Consignments must be packed, checked and documented for shipment." },
    ],
    categories: ["metals-structural-materials", "pipes-valves-fittings", "fasteners-hardware", "engineering-hand-tools", "pneumatics-instrumentation"],
    applications: ["Plant supply packages", "Utility (oil, water, steam) packages", "Spares packages for overseas sites"],
    specConsiderations: ["Destination standards and documentation", "Packing and marking requirements", "Consolidated bill of materials with per-item quantities"],
    support: ["Requirement consolidation into one procurement plan", "Specification checks against stated standards", "Packaging, quality checks and dispatch coordination", "One point of contact"],
    caseStudy: "65-tonne-export-order",
  },
  {
    slug: "cnc-vmc",
    name: "CNC/VMC and Machine Shops",
    short: "Cutting tools, measuring instruments and workshop consumables.",
    intro:
      "Machine shops need the right cutting tool, taps, reamers and measuring instruments — in the right size and grade — without delay. MIIT helps CNC, VMC and conventional machine shops source tooling and inspection equipment.",
    image: "/media/stills/ind-cnc-vmc.jpg",
    imageAlt: "Spindle of a vertical machining centre",
    challenges: [
      { title: "Tooling precision", body: "Small differences in size, coating or geometry affect results." },
      { title: "Short lead times", body: "Jobs wait when a specific tool or insert is unavailable." },
      { title: "Inspection accuracy", body: "Instruments need the right range, resolution and calibration." },
    ],
    categories: ["cutting-grinding", "engineering-hand-tools", "pneumatics-instrumentation", "aluminium-materials", "fasteners-hardware"],
    applications: ["Drilling, tapping and reaming", "Milling and turning tooling", "Inspection and quality control"],
    specConsiderations: ["Tool material, coating and geometry", "Workpiece material", "Instrument range and least count"],
    support: ["Tooling and instruments quoted together", "Preferred-make sourcing", "Repeat-order specification records"],
  },
  {
    slug: "construction",
    name: "Construction",
    short: "Steel, TMT, fasteners and site tools for building projects.",
    intro:
      "Construction projects need structural steel, TMT bars, fasteners, tools and safety equipment scheduled to site progress. MIIT coordinates these materials as one requirement rather than many separate purchases.",
    image: "/media/stills/ind-construction.jpg",
    imageAlt: "Tower cranes above a building under construction",
    challenges: [
      { title: "Schedule-driven demand", body: "Materials must arrive in step with site progress." },
      { title: "Tonnage and diameter breakdowns", body: "Steel requirements vary by diameter, section and length." },
      { title: "Site consumables", body: "Tools, discs and PPE are needed alongside major materials." },
    ],
    categories: ["metals-structural-materials", "fasteners-hardware", "cutting-grinding", "safety-maintenance", "engineering-hand-tools"],
    applications: ["Reinforcement steel", "Structural sections", "Site tools and consumables", "Safety equipment"],
    specConsiderations: ["Diameter-wise tonnage for TMT", "Section sizes and lengths", "Delivery site access and schedule"],
    support: ["Structural materials and consumables in one quotation", "Delivery location and schedule coordination"],
  },
  {
    slug: "contractors",
    name: "Contractors and Fabricators",
    short: "Fabrication materials, consumables and tools for contract work.",
    intro:
      "Contractors and fabricators juggle material, consumable and tool requirements across multiple jobs. MIIT provides one coordinated source for steel, fasteners, cutting and grinding consumables and tools.",
    image: "/media/stills/ind-contractors.jpg",
    imageAlt: "Welder joining steel sections with sparks flying",
    challenges: [
      { title: "Multiple concurrent jobs", body: "Requirements change as jobs start and finish." },
      { title: "Cost and coordination", body: "Buying small quantities from many vendors adds overhead." },
      { title: "Material traceability", body: "Clients may require grades and certificates." },
    ],
    categories: ["metals-structural-materials", "cutting-grinding", "fasteners-hardware", "engineering-hand-tools", "safety-maintenance"],
    applications: ["Fabrication materials", "Weld preparation and finishing", "Erection hardware"],
    specConsiderations: ["Grade and certificate needs per job", "Cut-length requirements", "Consumable usage per job"],
    support: ["Job-wise requirement lists", "Consolidated quotations", "Coordinated dispatch"],
  },
  {
    slug: "epc-turnkey",
    name: "EPC and Turnkey Projects",
    short: "Project packages across piping, structural and instrumentation.",
    intro:
      "EPC and turnkey projects issue large bills of materials spanning piping, structural steel, fasteners and instruments. MIIT reviews these requirements line by line and coordinates sourcing across categories and suppliers.",
    image: "/media/stills/ind-epc-turnkey.jpg",
    imageAlt: "Aerial view of a large process plant with pipe racks",
    challenges: [
      { title: "Large, technical BOMs", body: "Hundreds of items, each with its own size, rating and standard." },
      { title: "Multi-supplier coordination", body: "Items come from many sources but must arrive as one package." },
      { title: "Documentation", body: "Projects often require certificates and inspection records." },
    ],
    categories: ["pipes-valves-fittings", "metals-structural-materials", "fasteners-hardware", "pneumatics-instrumentation", "safety-maintenance"],
    applications: ["Piping packages", "Structural packages", "Bolting and instrumentation packages"],
    specConsiderations: ["Line lists with size, rating, material and standard", "Documentation and inspection requirements", "Packing and marking per package"],
    support: ["Line-by-line requirement review", "Clarification of incomplete specifications", "Consolidated supply coordination"],
    caseStudy: "65-tonne-export-order",
  },
  {
    slug: "infrastructure",
    name: "Infrastructure",
    short: "Structural materials and project supplies for infrastructure works.",
    intro:
      "Infrastructure works require structural materials, piping and fastening products in volume, together with site tools and safety equipment. MIIT coordinates these requirements against the specifications and schedules provided.",
    image: "/media/stills/ind-infrastructure.jpg",
    imageAlt: "Steel truss bridge spanning a river",
    challenges: [
      { title: "Volume and phasing", body: "Materials are needed in phases across long project timelines." },
      { title: "Specification compliance", body: "Grades and standards are defined by project specifications." },
      { title: "Remote delivery", body: "Sites may be far from supply centres." },
    ],
    categories: ["metals-structural-materials", "pipes-valves-fittings", "fasteners-hardware", "safety-maintenance"],
    applications: ["Structural steel", "Utility piping", "Site supplies"],
    specConsiderations: ["Project specification references", "Phase-wise quantities", "Delivery location details"],
    support: ["Phase-wise requirement planning", "Consolidated quotations", "Dispatch coordination to site"],
  },
  {
    slug: "automobile-engineering",
    name: "Automobile and Engineering",
    short: "Tooling, fasteners and components for engineering manufacturers.",
    intro:
      "Automobile component and engineering manufacturers need precise tooling, fasteners, bearings and measuring instruments. MIIT supports these buyers with specification-conscious sourcing.",
    image: "/media/stills/ind-automobile-engineering.jpg",
    imageAlt: "Close-up of an engine assembly",
    challenges: [
      { title: "Tight tolerances", body: "Tools and instruments must match process requirements." },
      { title: "Standardised brands", body: "Plants often standardise on specific makes." },
      { title: "Recurring demand", body: "Consumption-based requirements repeat on a cycle." },
    ],
    categories: ["engineering-hand-tools", "cutting-grinding", "fasteners-hardware", "bearings-mechanical", "pneumatics-instrumentation"],
    applications: ["Machining tooling", "Assembly fasteners", "Inspection instruments", "Maintenance spares"],
    specConsiderations: ["Part numbers and drawings", "Preferred makes", "Calibration requirements"],
    support: ["Repeat-requirement coordination", "Preferred-make sourcing", "Consolidated quotations"],
  },
  {
    slug: "oil-gas",
    name: "Oil and Gas, Refineries and Utilities",
    short: "Valves, flanges, fittings and instruments for process and utility service.",
    intro:
      "Oil, gas, refinery and utility projects depend on correctly rated valves, flanges, fittings, pipes and instruments. MIIT supplies these components against the sizes, ratings, materials and standards you specify, and coordinates them with structural and tooling requirements.",
    image: "/media/stills/ind-oil-gas.jpg",
    imageAlt: "Refinery stacks and steam lit up at night",
    challenges: [
      { title: "Rating and material accuracy", body: "Pressure class, material and standard must match the service." },
      { title: "Documentation", body: "Test certificates and inspection records are often required." },
      { title: "Shutdown timing", body: "Maintenance shutdowns compress procurement windows." },
    ],
    categories: ["pipes-valves-fittings", "fasteners-hardware", "pneumatics-instrumentation", "metals-structural-materials", "safety-maintenance"],
    applications: ["Oil, water and steam utility lines", "Shutdown and maintenance packages", "Project piping"],
    specConsiderations: ["Service medium, pressure and temperature", "Pressure class and material", "Certificate and inspection requirements"],
    support: ["Specification review against stated standards", "Multi-category package coordination", "Packaging and dispatch coordination"],
    caseStudy: "65-tonne-export-order",
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
