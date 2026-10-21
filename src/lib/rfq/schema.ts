import { z } from "zod";

export const UNITS = ["nos", "pcs", "sets", "kg", "tonnes", "metres", "feet", "boxes", "litres", "pairs", "other"] as const;

export const TIMELINES = ["As soon as possible", "Within 1 week", "Within 2–4 weeks", "Within 1–3 months", "Planning / budgetary", "Other (see notes)"] as const;

export const LIMITS = {
  maxItems: 300,
  maxFiles: 5,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
} as const;

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().default("");

export const lineItemSchema = z.object({
  category: optionalText(80),
  product: text(200).min(2, "Describe the product or material"),
  quantity: z.coerce.number({ error: "Enter a quantity" }).positive("Quantity must be greater than zero").max(1e9),
  unit: z.enum(UNITS, { error: "Choose a unit" }),
  material: optionalText(120),
  size: optionalText(160),
  standard: optionalText(120),
  brand: optionalText(80),
  notes: optionalText(1000),
});

export const customerSchema = z.object({
  name: text(120).min(2, "Enter your full name"),
  company: text(160).min(2, "Enter your company name"),
  email: z.email("Enter a valid business email").max(160),
  phone: text(24).regex(/^\+?[0-9 ()-]{7,24}$/, "Enter a valid phone number"),
  role: optionalText(120),
});

export const requirementSchema = z.object({
  deliveryLocation: text(200).min(2, "Enter the delivery location"),
  timeline: z.enum(TIMELINES, { error: "Choose a timeline" }),
  additional: optionalText(4000),
});

export const rfqSchema = z.object({
  customer: customerSchema,
  requirement: requirementSchema,
  items: z.array(lineItemSchema).min(1, "Add at least one item").max(LIMITS.maxItems),
  consent: z.literal(true, { error: "Please accept the privacy notice" }),
  meta: z.object({
    idempotencyKey: z.string().regex(/^[a-zA-Z0-9-]{16,64}$/),
    startedAt: z.number().int().positive(),
    // honeypot — must stay empty
    website: z.string().max(0).optional().default(""),
    source: optionalText(120),
  }),
});

export type RfqInput = z.input<typeof rfqSchema>;
export type Rfq = z.output<typeof rfqSchema>;
export type LineItem = z.output<typeof lineItemSchema>;

export const contactSchema = z.object({
  name: text(120).min(2, "Enter your name"),
  email: z.email("Enter a valid email").max(160),
  phone: z.union([z.literal(""), text(24).regex(/^\+?[0-9 ()-]{7,24}$/, "Enter a valid phone number")]).optional().default(""),
  company: optionalText(160),
  topic: z.enum(["General enquiry", "Product question", "Project discussion", "Supplier / partnership", "Other"]),
  message: text(4000).min(10, "Tell us a little more (at least 10 characters)"),
  consent: z.literal(true, { error: "Please accept the privacy notice" }),
  meta: z.object({
    idempotencyKey: z.string().regex(/^[a-zA-Z0-9-]{16,64}$/),
    startedAt: z.number().int().positive(),
    website: z.string().max(0).optional().default(""),
  }),
});

export type Contact = z.output<typeof contactSchema>;

/** Flattens zod issues into { "items.0.product": "message" } for field-level display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
