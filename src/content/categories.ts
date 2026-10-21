import type { ProductCategory } from "./types";

/**
 * Catalogue taxonomy derived from MIIT CORPORATION's public portfolio
 * (flanges, pipe fittings, bearings, iron & steel, valves, chain pulleys,
 * cutting & grinding tools, hand tools, nuts & bolts, instruments, couplings,
 * magnets, pneumatics, aluminium, safety, power tools; MS/SS/TMT, beams,
 * channels, angles, plates).
 *
 * `specifyOnEnquiry` lists what a buyer should state in an RFQ. It is guidance,
 * not a claim about stock. Technical fields (grades, standards, sizes, brands)
 * are intentionally left empty until MIIT supplies verified product data.
 */
export const categories: ProductCategory[] = [
  {
    slug: "metals-structural-materials",
    code: "01",
    name: "Metals and Structural Materials",
    shortName: "Metals & Structural",
    tagline: "Steel sections, plates and bars for fabrication and projects.",
    description:
      "Mild steel, stainless steel and TMT bars alongside structural sections — beams, channels, angles and plates — procured to the sizes, grades and quantities your drawings and project schedules call for.",
    image: "/media/stills/cat-metals-structural.jpg",
    imageAlt: "Low-angle view of a steel-framed industrial structure",
    applications: ["Structural fabrication", "Plant and shed construction", "Equipment frames and supports", "Infrastructure works"],
    industries: ["construction", "contractors", "epc-turnkey", "infrastructure", "manufacturing"],
    supplyModes: ["sourced", "project"],
    related: ["fasteners-hardware", "pipes-valves-fittings", "cutting-grinding"],
    seo: {
      title: "Structural Steel, MS, SS & TMT Bars — Procurement in Mumbai",
      description:
        "Source mild steel, stainless steel, TMT bars, beams, channels, angles and plates through MIIT CORPORATION, Mumbai. Submit sizes, grades and quantities for a quotation.",
    },
    families: [
      {
        slug: "mild-steel",
        name: "Mild Steel (MS)",
        summary: "MS sections, plates, bars and flats for general fabrication.",
        description:
          "Mild steel products for fabrication, structures and general engineering. Share the form, dimensions, grade and quantity and MIIT will coordinate sourcing against your requirement.",
        specifyOnEnquiry: ["Form (plate, sheet, bar, flat, section)", "Dimensions and thickness", "Grade or standard", "Quantity (kg, tonnes or pieces)", "Cut-to-length needs", "Test certificate requirement"],
        keywords: ["MS", "mild steel", "plate", "flat", "round bar"],
      },
      {
        slug: "stainless-steel",
        name: "Stainless Steel (SS)",
        summary: "Stainless plates, sheets, bars and pipes in the grade you specify.",
        description:
          "Stainless steel material for process, food, chemical and corrosion-sensitive applications. Grade and finish matter — include them with dimensions and quantity.",
        specifyOnEnquiry: ["Grade", "Form and finish", "Dimensions and thickness", "Quantity", "Standard or specification", "Mill test certificate requirement"],
        keywords: ["SS", "stainless", "SS304", "SS316"],
      },
      {
        slug: "tmt-bars",
        name: "TMT Bars",
        summary: "Reinforcement bars for construction and infrastructure projects.",
        description:
          "Thermo-mechanically treated reinforcement bars supplied against construction and project requirements. Provide diameter, grade, length and tonnage per diameter.",
        specifyOnEnquiry: ["Diameter(s)", "Grade", "Length", "Tonnage per diameter", "Preferred make", "Delivery site and schedule"],
        keywords: ["TMT", "rebar", "reinforcement"],
      },
      {
        slug: "beams-channels-angles",
        name: "Beams, Channels and Angles",
        summary: "H, I and L sections, channels and angles for structural work.",
        description:
          "Structural sections for frames, sheds, platforms and supports — including H, L and C profiles of the kind supplied in MIIT's published 65-tonne export order.",
        specifyOnEnquiry: ["Section type and size", "Grade or standard", "Length per piece", "Number of pieces or tonnage", "Cutting or drilling needs", "Documentation required"],
        keywords: ["beam", "ISMB", "channel", "ISMC", "angle", "H beam", "C channel", "L angle"],
      },
      {
        slug: "plates",
        name: "Plates",
        summary: "Steel plates cut or supplied to your thickness and size.",
        description:
          "Steel plates for base plates, fabrication, liners and machinery. Thickness, grade and dimensions determine sourcing — specify them precisely.",
        specifyOnEnquiry: ["Thickness", "Length × width", "Grade", "Quantity", "Cutting requirement", "Test certificate requirement"],
        keywords: ["plate", "chequered plate", "HR plate"],
      },
    ],
  },
  {
    slug: "pipes-valves-fittings",
    code: "02",
    name: "Pipes, Valves and Fittings",
    shortName: "Pipes, Valves & Fittings",
    tagline: "Piping components coordinated across sizes, ratings and standards.",
    description:
      "Pipes, pipe fittings, flanges, valves and couplings for utilities, process lines and project packages. Piping requirements are specification-heavy, so MIIT works from your line list, sizes, ratings and material requirements.",
    image: "/media/stills/cat-pipes-valves-fittings.jpg",
    imageAlt: "Stainless process pipework inside an industrial plant",
    applications: ["Water, steam and oil utility lines", "Process piping", "Plant maintenance and shutdowns", "Export project packages"],
    industries: ["oil-gas", "epc-turnkey", "exports", "manufacturing", "infrastructure"],
    supplyModes: ["sourced", "project"],
    related: ["fasteners-hardware", "pneumatics-instrumentation", "metals-structural-materials"],
    seo: {
      title: "Pipes, Pipe Fittings, Flanges & Valves — Industrial Supply Mumbai",
      description:
        "Request quotations for pipes, pipe fittings, flanges, valves and couplings. MIIT CORPORATION coordinates piping requirements by size, rating, material and standard.",
    },
    families: [
      {
        slug: "pipes",
        name: "Pipes",
        summary: "MS, GI and SS pipes to the size and schedule you require.",
        description: "Pipes for utility, process and structural use. Include material, nominal size, schedule or thickness, standard and length.",
        specifyOnEnquiry: ["Material", "Nominal bore / OD", "Schedule or wall thickness", "Seamless or welded", "Standard", "Length and quantity"],
        keywords: ["pipe", "GI pipe", "MS pipe", "SS pipe", "seamless", "ERW"],
      },
      {
        slug: "pipe-fittings",
        name: "Pipe Fittings",
        summary: "Elbows, tees, reducers, caps, unions and other fittings.",
        description: "Butt-weld, socket-weld and threaded fittings. Match each fitting's type, size, schedule, material and end connection to your piping.",
        specifyOnEnquiry: ["Fitting type", "Size(s)", "Schedule or class", "Material", "End connection", "Standard", "Quantity per item"],
        keywords: ["elbow", "tee", "reducer", "cap", "union", "nipple", "socket"],
      },
      {
        slug: "flanges",
        name: "Flanges",
        summary: "Weld-neck, slip-on, blind and other flange types.",
        description: "Flanges supplied against your size, pressure class, facing, material and standard. Mismatched ratings are a common source of rework — state them explicitly.",
        specifyOnEnquiry: ["Flange type", "Size", "Pressure class / rating", "Facing", "Material", "Standard", "Quantity"],
        keywords: ["flange", "weld neck", "slip on", "blind flange", "SORF", "WNRF"],
      },
      {
        slug: "valves",
        name: "Valves",
        summary: "Gate, globe, ball, check and butterfly valves for utilities and process.",
        description: "Industrial valves for water, steam, oil and process service. Share valve type, size, rating, body material, end connection and service medium.",
        specifyOnEnquiry: ["Valve type", "Size", "Pressure rating", "Body and trim material", "End connection", "Service medium and temperature", "Preferred make"],
        keywords: ["gate valve", "ball valve", "globe valve", "check valve", "butterfly valve", "NRV"],
      },
      {
        slug: "couplings",
        name: "Couplings",
        summary: "Pipe and shaft couplings for joining and power transmission.",
        description: "Couplings for pipework and rotating equipment. Specify coupling type, size or bore, and the application.",
        specifyOnEnquiry: ["Coupling type", "Size / bore", "Material", "Application", "Quantity"],
        keywords: ["coupling", "jaw coupling", "pipe coupling"],
      },
    ],
  },
  {
    slug: "cutting-grinding",
    code: "03",
    name: "Cutting and Grinding",
    shortName: "Cutting & Grinding",
    tagline: "Cutting tools, abrasives and wheels for the workshop floor.",
    description:
      "High-performance cutting tools, abrasives, cutting discs and grinding wheels — the everyday consumables that keep fabrication, foundry and machine-shop operations running. Brand preferences can be accommodated subject to availability.",
    image: "/media/stills/cat-cutting-grinding.jpg",
    imageAlt: "Sparks from an angle grinder cutting steel",
    applications: ["Fettling and finishing castings", "Fabrication and weld preparation", "Metal cutting", "Surface preparation"],
    industries: ["foundries", "manufacturing", "cnc-vmc", "contractors", "automobile-engineering"],
    supplyModes: ["stock", "sourced"],
    related: ["engineering-hand-tools", "safety-maintenance", "metals-structural-materials"],
    seo: {
      title: "Cutting Tools, Abrasives, Cutting Discs & Grinding Wheels",
      description:
        "Industrial cutting and grinding consumables — cutting tools, abrasives, cutting discs and grinding wheels — supplied by MIIT CORPORATION, Mumbai.",
    },
    families: [
      {
        slug: "cutting-tools",
        name: "Cutting Tools",
        summary: "Drills, end mills, inserts and other metal-cutting tools.",
        description: "Metal-cutting tools for machining and fabrication. State tool type, size, material (HSS, carbide), coating and the workpiece material.",
        specifyOnEnquiry: ["Tool type", "Diameter / size", "Tool material and coating", "Workpiece material", "Shank type", "Preferred make", "Quantity"],
        keywords: ["HSS", "carbide", "end mill", "insert", "cutter"],
      },
      {
        slug: "abrasives",
        name: "Abrasives",
        summary: "Coated and bonded abrasives, belts, flap discs and sheets.",
        description: "Abrasives for grinding, blending and finishing. Grit, size, backing and application determine the right product.",
        specifyOnEnquiry: ["Product form", "Grit", "Size", "Abrasive grain", "Application", "Preferred make", "Quantity"],
        keywords: ["abrasive", "flap disc", "belt", "emery", "sandpaper"],
      },
      {
        slug: "cutting-discs",
        name: "Cutting Discs",
        summary: "Cut-off wheels for steel, stainless and general metal cutting.",
        description: "Cut-off wheels for portable and stationary machines. Match diameter, thickness, bore and maximum operating speed to the machine.",
        specifyOnEnquiry: ["Diameter × thickness × bore", "Material to be cut", "Machine type and RPM", "Preferred make", "Quantity"],
        keywords: ["cut off wheel", "cutting wheel", "chop saw disc"],
      },
      {
        slug: "grinding-wheels",
        name: "Grinding Wheels",
        summary: "Depressed-centre, bench and surface grinding wheels.",
        description: "Grinding wheels for fettling, deburring and precision grinding. Specify wheel type, dimensions, grit, grade and machine speed.",
        specifyOnEnquiry: ["Wheel type", "Dimensions", "Grit and grade", "Bond", "Machine and RPM", "Preferred make", "Quantity"],
        keywords: ["grinding wheel", "DC wheel", "bench grinder"],
      },
    ],
  },
  {
    slug: "engineering-hand-tools",
    code: "04",
    name: "Engineering and Hand Tools",
    shortName: "Engineering Tools",
    tagline: "Hand tools, power tools, drills, taps and reamers.",
    description:
      "The tools MIIT started with — drills and engineering tools — have grown into a wide range of hand tools, power tools, taps and dies, reamers and workshop essentials for maintenance teams and machine shops.",
    image: "/media/stills/cat-engineering-tools.jpg",
    imageAlt: "Macro shot of a twist drill cutting into steel with chips curling away",
    applications: ["Plant maintenance", "Machine-shop tooling", "Assembly and fitting", "Site tool kits"],
    industries: ["manufacturing", "cnc-vmc", "automobile-engineering", "contractors", "foundries"],
    supplyModes: ["stock", "sourced"],
    related: ["cutting-grinding", "fasteners-hardware", "pneumatics-instrumentation"],
    seo: {
      title: "Hand Tools, Power Tools, Drills, Taps & Reamers — MIIT CORPORATION",
      description:
        "Engineering and hand tools for maintenance and machine shops: hand tools, power tools, drills, taps and dies, reamers and workshop tools.",
    },
    families: [
      {
        slug: "hand-tools",
        name: "Hand Tools",
        summary: "Spanners, wrenches, pliers, screwdrivers and toolkits.",
        description: "Hand tools for maintenance and assembly. List tool types, sizes or size ranges, and any brand preference.",
        specifyOnEnquiry: ["Tool type", "Size or set range", "Preferred make", "Quantity"],
        keywords: ["spanner", "wrench", "plier", "screwdriver", "socket set"],
      },
      {
        slug: "power-tools",
        name: "Power Tools",
        summary: "Drills, grinders, cutters and other electric power tools.",
        description: "Portable power tools for workshops and sites. Include tool type, power rating, disc or chuck size, voltage and preferred make.",
        specifyOnEnquiry: ["Tool type", "Power rating", "Chuck / disc size", "Corded or cordless", "Preferred make", "Quantity"],
        keywords: ["angle grinder", "drill machine", "power tool"],
      },
      {
        slug: "drills",
        name: "Drills",
        summary: "Twist drills and drill sets for metal and general use.",
        description: "Drill bits for metalworking and maintenance. Diameter, length series, material and shank type should be specified.",
        specifyOnEnquiry: ["Diameter(s)", "Length series", "Tool material", "Shank type", "Preferred make", "Quantity per size"],
        keywords: ["drill bit", "twist drill", "HSS drill", "taper shank"],
      },
      {
        slug: "taps-dies",
        name: "Taps and Dies",
        summary: "Hand and machine taps, dies and threading tools.",
        description: "Threading tools for internal and external threads. Thread standard, size, pitch and tap type are essential.",
        specifyOnEnquiry: ["Thread standard", "Size and pitch", "Tap type", "Tool material", "Quantity"],
        keywords: ["tap", "die", "threading"],
      },
      {
        slug: "reamers",
        name: "Reamers",
        summary: "Hand and machine reamers for accurate hole finishing.",
        description: "Reamers for precise hole sizing. Specify diameter, tolerance, reamer type and shank.",
        specifyOnEnquiry: ["Diameter and tolerance", "Reamer type", "Shank", "Tool material", "Quantity"],
        keywords: ["reamer", "hand reamer", "machine reamer"],
      },
      {
        slug: "workshop-tools",
        name: "Workshop Tools",
        summary: "Vices, clamps, files and other workshop essentials.",
        description: "General workshop equipment and consumables for maintenance stores. List items with sizes and quantities.",
        specifyOnEnquiry: ["Item", "Size", "Preferred make", "Quantity"],
        keywords: ["vice", "clamp", "file", "workshop"],
      },
    ],
  },
  {
    slug: "fasteners-hardware",
    code: "05",
    name: "Fasteners and Hardware",
    shortName: "Fasteners",
    tagline: "Nuts, bolts, washers and threaded fasteners in the grade you need.",
    description:
      "Nuts, bolts, washers and threaded fasteners supplied by size, grade, finish and quantity — from maintenance store requirements to project-scale bolting lists.",
    image: "/media/stills/cat-fasteners-hardware.jpg",
    imageAlt: "Steel screws and bolts scattered on a work surface",
    applications: ["Structural and flange bolting", "Machinery assembly", "Maintenance stores", "Project bolting lists"],
    industries: ["construction", "epc-turnkey", "manufacturing", "automobile-engineering", "oil-gas"],
    supplyModes: ["stock", "sourced", "project"],
    related: ["pipes-valves-fittings", "metals-structural-materials", "engineering-hand-tools"],
    seo: {
      title: "Nuts, Bolts, Washers & Industrial Fasteners — MIIT CORPORATION",
      description: "Industrial fasteners and hardware by size, grade and finish. Submit your bolting list for a consolidated quotation.",
    },
    families: [
      {
        slug: "nuts-bolts",
        name: "Nuts and Bolts",
        summary: "Hex bolts, studs, nuts and fastener sets.",
        description: "Bolts and nuts for structural, flange and machinery use. Diameter, length, thread, grade and finish define the requirement.",
        specifyOnEnquiry: ["Type", "Diameter × length", "Thread", "Grade / property class", "Material and finish", "Quantity"],
        keywords: ["bolt", "nut", "stud", "hex bolt", "stud bolt", "anchor"],
      },
      {
        slug: "washers",
        name: "Washers",
        summary: "Plain, spring and specialised washers.",
        description: "Washers matched to your fastener size, material and finish.",
        specifyOnEnquiry: ["Type", "Size", "Material and finish", "Quantity"],
        keywords: ["washer", "spring washer", "plain washer"],
      },
      {
        slug: "threaded-fasteners",
        name: "Threaded Fasteners",
        summary: "Screws, threaded rods and allied fasteners.",
        description: "Screws, threaded rods and other threaded fasteners. Include head type, size, thread, material and finish.",
        specifyOnEnquiry: ["Type and head style", "Size and thread", "Material and finish", "Quantity"],
        keywords: ["screw", "allen bolt", "threaded rod", "grub screw"],
      },
    ],
  },
  {
    slug: "bearings-mechanical",
    code: "06",
    name: "Bearings and Mechanical Components",
    shortName: "Bearings & Mechanical",
    tagline: "Bearings, chain pulleys, couplings and magnets.",
    description:
      "Bearings, chain pulley blocks, couplings and magnets — including the magnets MIIT has supplied since its earliest days — for maintenance, material handling and machinery.",
    image: "/media/stills/cat-bearings-mechanical.jpg",
    imageAlt: "Close-up of heavy steel chain links",
    applications: ["Rotating equipment maintenance", "Material handling and lifting", "Power transmission", "Workholding and separation"],
    industries: ["manufacturing", "foundries", "automobile-engineering", "cnc-vmc"],
    supplyModes: ["stock", "sourced"],
    related: ["engineering-hand-tools", "fasteners-hardware", "pneumatics-instrumentation"],
    seo: {
      title: "Bearings, Chain Pulley Blocks, Couplings & Magnets",
      description: "Mechanical components for maintenance and material handling: bearings, chain pulleys, couplings and magnets from MIIT CORPORATION.",
    },
    families: [
      {
        slug: "bearings",
        name: "Bearings",
        summary: "Ball, roller and housed bearings by part number.",
        description: "Bearings for motors, gearboxes and machinery. A bearing number or full dimensions, plus brand preference, speeds up sourcing.",
        specifyOnEnquiry: ["Bearing number or dimensions", "Type", "Clearance / seal suffix", "Preferred make", "Quantity"],
        keywords: ["bearing", "ball bearing", "roller bearing", "pillow block"],
      },
      {
        slug: "chain-pulleys",
        name: "Chain Pulley Blocks",
        summary: "Manual chain pulley blocks for lifting.",
        description: "Chain pulley blocks for workshops and sites. Capacity, lift height and preferred make are required.",
        specifyOnEnquiry: ["Capacity", "Lift height", "Type", "Preferred make", "Certification requirement", "Quantity"],
        keywords: ["chain pulley", "chain block", "hoist"],
      },
      {
        slug: "couplings-mechanical",
        name: "Couplings",
        summary: "Shaft couplings for power transmission.",
        description: "Couplings to connect shafts and absorb misalignment. Share the coupling type, bore sizes and torque or motor rating.",
        specifyOnEnquiry: ["Coupling type", "Bore sizes", "Torque or motor rating", "Quantity"],
        keywords: ["coupling", "gear coupling", "tyre coupling"],
      },
      {
        slug: "magnets",
        name: "Magnets",
        summary: "Industrial magnets for lifting, holding and separation.",
        description: "Magnets for industrial applications. Describe the application, required holding or lifting capacity, and dimensions.",
        specifyOnEnquiry: ["Application", "Capacity or strength", "Dimensions", "Quantity"],
        keywords: ["magnet", "lifting magnet", "magnetic base"],
      },
    ],
  },
  {
    slug: "pneumatics-instrumentation",
    code: "07",
    name: "Pneumatics and Instrumentation",
    shortName: "Pneumatics & Instruments",
    tagline: "Pneumatic products and precision measuring instruments.",
    description:
      "Pneumatic products and engineering instruments — from precision measuring tools for the inspection bench to instruments required on project packages.",
    image: "/media/stills/cat-pneumatics-instrumentation.jpg",
    imageAlt: "Engineer checking instrumented pipework in a process plant",
    applications: ["Quality inspection", "Process monitoring", "Compressed-air systems", "Project instrumentation"],
    industries: ["manufacturing", "cnc-vmc", "oil-gas", "epc-turnkey", "automobile-engineering"],
    supplyModes: ["sourced", "project"],
    related: ["pipes-valves-fittings", "engineering-hand-tools", "bearings-mechanical"],
    seo: {
      title: "Pneumatic Products & Precision Measuring Instruments",
      description: "Pneumatic products, precision measuring instruments and engineering instruments supplied against your specification.",
    },
    families: [
      {
        slug: "pneumatic-products",
        name: "Pneumatic Products",
        summary: "Cylinders, valves, fittings and air-line components.",
        description: "Pneumatic components for automation and compressed-air lines. Include part numbers where available, or bore, stroke, port size and pressure.",
        specifyOnEnquiry: ["Product type", "Part number (if known)", "Size / port", "Operating pressure", "Preferred make", "Quantity"],
        keywords: ["pneumatic", "cylinder", "solenoid valve", "FRL", "push fitting"],
      },
      {
        slug: "measuring-instruments",
        name: "Precision Measuring Instruments",
        summary: "Vernier callipers, micrometers, gauges and measuring tools.",
        description: "Measuring instruments for inspection and machining. Range, resolution and calibration requirements should be stated.",
        specifyOnEnquiry: ["Instrument type", "Range", "Resolution / least count", "Calibration certificate requirement", "Preferred make", "Quantity"],
        keywords: ["vernier", "micrometer", "dial gauge", "caliper", "measuring"],
      },
      {
        slug: "engineering-instruments",
        name: "Engineering Instruments",
        summary: "Pressure gauges, temperature gauges and allied instruments.",
        description: "Instruments for plant and project use. Share the measured variable, range, connection, dial size and service conditions.",
        specifyOnEnquiry: ["Instrument type", "Range", "Connection size and type", "Dial size", "Service medium", "Quantity"],
        keywords: ["pressure gauge", "temperature gauge", "instrument"],
      },
    ],
  },
  {
    slug: "safety-maintenance",
    code: "08",
    name: "Safety and Maintenance",
    shortName: "Safety & Maintenance",
    tagline: "Safety equipment and workshop maintenance essentials.",
    description:
      "Safety equipment and personal protective equipment for workshops, foundries and sites, alongside maintenance essentials. The exact range is confirmed per enquiry.",
    image: "/media/stills/cat-safety-maintenance.jpg",
    imageAlt: "Welder in a protective mask working amid sparks",
    applications: ["Workshop and site PPE", "Hot-work protection", "Maintenance stores"],
    industries: ["foundries", "construction", "contractors", "manufacturing", "oil-gas"],
    supplyModes: ["stock", "sourced"],
    related: ["cutting-grinding", "engineering-hand-tools"],
    seo: {
      title: "Industrial Safety Equipment & PPE — MIIT CORPORATION",
      description: "Safety equipment, PPE and maintenance essentials for industrial and site teams. Request a quotation from MIIT CORPORATION.",
    },
    families: [
      {
        slug: "safety-equipment",
        name: "Safety Equipment",
        summary: "Site and workshop safety equipment.",
        description: "Safety equipment for industrial environments. List items, sizes and any required certification or standard.",
        specifyOnEnquiry: ["Item", "Size", "Certification / standard required", "Quantity"],
        keywords: ["safety", "helmet", "harness"],
      },
      {
        slug: "ppe",
        name: "Personal Protective Equipment",
        summary: "Gloves, eyewear, helmets, footwear and protective wear.",
        description: "PPE for workshop and site teams. Include item, size breakdown and required standard.",
        specifyOnEnquiry: ["Item", "Size breakdown", "Standard required", "Quantity"],
        keywords: ["PPE", "gloves", "goggles", "safety shoes"],
      },
    ],
  },
  {
    slug: "aluminium-materials",
    code: "09",
    name: "Aluminium and Other Materials",
    shortName: "Aluminium & Materials",
    tagline: "Aluminium and additional engineering materials.",
    description:
      "Aluminium products and other engineering materials sourced to your alloy, form, dimension and quantity requirements.",
    image: "/media/stills/cat-aluminium-materials.jpg",
    imageAlt: "Bright metal bar turning on a lathe",
    applications: ["Machined components", "Lightweight fabrication", "Electrical and thermal applications"],
    industries: ["cnc-vmc", "manufacturing", "automobile-engineering", "exports"],
    supplyModes: ["sourced"],
    related: ["metals-structural-materials", "cutting-grinding"],
    seo: {
      title: "Aluminium Sheets, Bars & Engineering Materials",
      description: "Aluminium and engineering materials sourced to alloy, form and dimension by MIIT CORPORATION, Mumbai.",
    },
    families: [
      {
        slug: "aluminium",
        name: "Aluminium Products",
        summary: "Aluminium sheets, plates, bars and sections.",
        description: "Aluminium in the alloy, temper and form your application needs. State alloy, temper, dimensions and quantity.",
        specifyOnEnquiry: ["Alloy and temper", "Form", "Dimensions", "Quantity", "Certificate requirement"],
        keywords: ["aluminium", "aluminum", "sheet", "bar"],
      },
      {
        slug: "other-materials",
        name: "Other Engineering Materials",
        summary: "Additional metals and materials on request.",
        description: "If a material is not listed, describe it with its specification — MIIT will confirm whether it can be sourced.",
        specifyOnEnquiry: ["Material", "Specification", "Form and dimensions", "Quantity"],
        keywords: ["brass", "copper", "material"],
      },
    ],
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export function familyBySlug(categorySlug: string, familySlug: string) {
  const category = categoryBySlug(categorySlug);
  const family = category?.families.find((f) => f.slug === familySlug);
  return category && family ? { category, family } : undefined;
}

export const allFamilies = () =>
  categories.flatMap((category) => category.families.map((family) => ({ category, family })));

export const supplyModeLabel: Record<string, string> = {
  // Supply-mode assignments are a starting assumption pending MIIT confirmation.
  stock: "May be available from stock",
  sourced: "Sourced through partner suppliers",
  project: "Supplied against project requirements",
};
