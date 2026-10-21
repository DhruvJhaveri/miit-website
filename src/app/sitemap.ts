import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/company";
import { allFamilies, categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { articles } from "@/content/articles";
import { caseStudies } from "@/content/case-studies";
import { topics } from "@/content/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/products",
    "/industries",
    "/procurement",
    "/about",
    "/case-studies",
    "/resources",
    "/faq",
    "/contact",
    "/request-quote",
    "/privacy",
    "/terms",
    "/credits",
    ...categories.map((c) => `/products/${c.slug}`),
    ...allFamilies().map(({ category, family }) => `/products/${category.slug}/${family.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...caseStudies.map((c) => `/case-studies/${c.slug}`),
    ...articles.map((a) => `/resources/${a.slug}`),
    ...topics.map((t) => `/resources/topics/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${siteUrl}${p === "/" ? "" : p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : p.split("/").length > 3 ? 0.6 : 0.8 }));
}
