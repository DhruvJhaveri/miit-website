export type SupplyMode = "stock" | "sourced" | "project";

export interface ProductFamily {
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Parameters a buyer should include in an enquiry. Guidance, not a stock claim. */
  specifyOnEnquiry: string[];
  /** Optional verified technical data. Leave undefined when unknown — never invent. */
  material?: string;
  grades?: string[];
  sizes?: string;
  standards?: string[];
  attributes?: { label: string; value: string }[];
  variants?: string[];
  brands?: string[];
  moq?: string;
  documents?: { label: string; href: string }[];
  image?: string;
  keywords?: string[];
}

export interface ProductCategory {
  slug: string;
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  applications: string[];
  industries: string[];
  supplyModes: SupplyMode[];
  families: ProductFamily[];
  related: string[];
  seo: { title: string; description: string };
}

export interface Industry {
  slug: string;
  name: string;
  short: string;
  intro: string;
  image: string;
  imageAlt: string;
  challenges: { title: string; body: string }[];
  categories: string[];
  applications: string[];
  specConsiderations: string[];
  support: string[];
  caseStudy?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  topic: "RFQ & Specifications" | "Procurement Planning" | "Product Selection" | "Project Supply";
  readingMinutes: number;
  relatedCategories: string[];
  relatedIndustries?: string[];
  body: ArticleBlock[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export interface Faq {
  q: string;
  a: string;
  group: "Products" | "Technical requirements" | "Procurement" | "Delivery & availability" | "Business & contact";
}
