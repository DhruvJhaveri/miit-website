import type { Faq } from "./types";

/**
 * Answers are limited to what MIIT's public material supports. No payment terms,
 * warranties, returns, minimum order values or delivery guarantees are stated.
 */
export const faqs: Faq[] = [
  { group: "Products", q: "What product categories does MIIT supply?", a: "MIIT supplies metals and structural materials (MS, SS, TMT, beams, channels, angles, plates), pipes, valves, flanges and fittings, cutting and grinding consumables, engineering and hand tools, fasteners, bearings and mechanical components, pneumatics and instruments, safety equipment and aluminium. See the product catalogue for the full list." },
  { group: "Products", q: "Can multiple product categories be quoted together?", a: "Yes. Consolidating multi-category requirements is central to how MIIT works. Add each item as a separate line in the quotation request, or upload your bill of materials." },
  { group: "Products", q: "Can I specify a preferred brand?", a: "Yes. MIIT references brands including Norton, Addison, Taparia, Miranda, Bipico and I.T., and can source other makes as per customer preference, subject to availability." },
  { group: "Products", q: "Can I request uncommon or specialised items?", a: "Yes. Describe the item with as much specification detail as possible, or attach a datasheet or drawing. MIIT will confirm whether it can be sourced." },
  { group: "Technical requirements", q: "What should a quotation request include?", a: "For each item: a clear description, size or dimensions, material or grade, the applicable standard, quantity and unit, and any brand preference. Add the delivery location and desired timeline. Incomplete lines can still be submitted — MIIT will ask for clarification." },
  { group: "Technical requirements", q: "Why do sizes, grades and standards matter?", a: "Two items with the same name can differ in rating, material or dimension. Precise specifications prevent mismatches, rework and delays — especially for piping, structural steel and fasteners." },
  { group: "Technical requirements", q: "Can I submit drawings or technical specifications?", a: "Yes. The quotation form accepts PDF, Excel, CSV, Word, image and CAD files (DWG/DXF) up to 10 MB each." },
  { group: "Procurement", q: "How does the quotation process work?", a: "You share the requirement, MIIT reviews the specifications, coordinates sourcing and prepares a quotation. Terms are then agreed before supply. The exact process depends on the order." },
  { group: "Procurement", q: "Can I submit a multi-product bill of materials?", a: "Yes. Upload the BOM in the quotation form, or enter items line by line. Large requirements — MIIT has published an order of more than 130 products — are welcome." },
  { group: "Procurement", q: "How are packaging and dispatch coordinated?", a: "Packaging, checks and dispatch are coordinated according to the agreed requirements for each order. State any packing, marking or documentation needs in your request." },
  { group: "Procurement", q: "Can project requirements be discussed in advance?", a: "Yes. Contact MIIT with your project scope or schedule to discuss requirements before issuing a formal enquiry." },
  { group: "Delivery & availability", q: "How is product availability confirmed?", a: "Availability is confirmed for each enquiry. Some items may be available from stock, others are sourced through partner suppliers or against the project requirement." },
  { group: "Delivery & availability", q: "How are delivery timelines agreed?", a: "Delivery timelines are agreed with each quotation, based on the items, quantities and sourcing involved. Tell MIIT your required timeline in the request." },
  { group: "Delivery & availability", q: "Can I specify delivery locations and packaging?", a: "Yes. The quotation form includes fields for delivery location, timeline and additional requirements such as packing or documentation." },
  { group: "Business & contact", q: "Which industries does MIIT serve?", a: "Manufacturing, foundries, exporters, CNC/VMC machine shops, construction, contractors and fabricators, EPC and turnkey projects, infrastructure, automobile and engineering, and oil, gas and utility projects." },
  { group: "Business & contact", q: "How do I request a quote?", a: "Use the Request a Quote form. Add your items, upload any documents and submit. You will receive a reference number once the request is recorded." },
  { group: "Business & contact", q: "How can I contact the team?", a: "Email miitcorporation@gmail.com, call +91 98202 93202 or +91 98693 14101, or visit 96 Narayan Dhru Street, 3rd Floor, Mumbai 400003." },
];

export const faqGroups = ["Products", "Technical requirements", "Procurement", "Delivery & availability", "Business & contact"] as const;
