/**
 * Company facts. Every value here was taken from MIIT CORPORATION's public website
 * (miitcorporation.odoo.com) or LinkedIn page during discovery (October 2026).
 * Items flagged `verified: false` must be confirmed by the company before launch —
 * see docs/LAUNCH-CHECKLIST.md.
 */
export const company = {
  name: "MIIT CORPORATION",
  formerName: "Apco Tools Traders",
  originsLabel: "Early 1970s",
  // Founding year is described publicly only as "the early 1970s".
  // Set `foundingYear` once the company confirms the official date.
  foundingYear: null as number | null,
  city: "Mumbai",
  address: {
    line1: "96 Narayan Dhru Street, 3rd Floor",
    city: "Mumbai",
    postalCode: "400003",
    region: "Maharashtra",
    country: "India",
  },
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "miitcorporation@gmail.com",
  phones: [
    { display: "+91 98202 93202", tel: "+919820293202" },
    { display: "+91 98693 14101", tel: "+919869314101" },
  ],
  // WhatsApp is shown only when a number is explicitly confirmed via env.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  linkedin: "https://www.linkedin.com/company/miitcorporation/",
  legacySite: "https://miitcorporation.odoo.com/",
  mission: "To provide the best possible service to our customers, locally and globally.",
  vision: "To focus on customer satisfaction and serve every industry in the market.",
  values: "To meet every customer requirement without compromising on quality or service.",
  contactVerified: false,
} as const;

/**
 * Public metrics as listed on the existing website. Their exact meaning has not
 * been confirmed, so `NEXT_PUBLIC_SHOW_METRICS` must be set to "true" after
 * the company approves the wording below. Labels deliberately avoid stronger claims.
 */
export const metrics = [
  { value: 50, suffix: "+", label: "Years in industrial supply", note: "Since the early 1970s, as Apco Tools Traders" },
  { value: 50, suffix: "+", label: "Affiliated partners and distributors", note: "As listed on the company website" },
  { value: 1000, suffix: "+", label: "Products supplied over the years", note: "Not a count of items in stock" },
  { value: 100, suffix: "+", label: "Customers across industries", note: "As listed on the company website" },
] as const;

export const showMetrics = process.env.NEXT_PUBLIC_SHOW_METRICS === "true";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.miitcorporation.com";

export function whatsappLink(message: string) {
  if (!company.whatsapp) return null;
  return `https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
