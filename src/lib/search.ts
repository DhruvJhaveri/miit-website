import { categories } from "@/content/categories";
import { industries } from "@/content/industries";
import { articles } from "@/content/articles";

export type SearchKind = "product" | "category" | "industry" | "article";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  summary: string;
  href: string;
  category?: string;
  image?: string;
  haystack: string;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9.]+/g, " ").trim();

export function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const c of categories) {
    out.push({ kind: "category", title: c.name, summary: c.tagline, href: `/products/${c.slug}`, category: c.slug, image: c.image, haystack: norm([c.name, c.shortName, c.tagline, c.description, ...c.applications].join(" ")) });
    for (const f of c.families) {
      out.push({
        kind: "product",
        title: f.name,
        summary: f.summary,
        href: `/products/${c.slug}/${f.slug}`,
        category: c.slug,
        image: f.image ?? c.image,
        haystack: norm([f.name, f.summary, f.description, ...(f.keywords ?? []), c.shortName].join(" ")),
      });
    }
  }
  for (const i of industries) out.push({ kind: "industry", title: i.name, summary: i.short, href: `/industries/${i.slug}`, image: i.image, haystack: norm([i.name, i.short, i.intro, ...i.applications].join(" ")) });
  for (const a of articles) out.push({ kind: "article", title: a.title, summary: a.excerpt, href: `/resources/${a.slug}`, haystack: norm([a.title, a.excerpt, a.topic].join(" ")) });
  return out;
}

/** Token-based scoring: every token must match; title and prefix matches rank higher. */
export function search(index: SearchEntry[], query: string, kinds?: SearchKind[]) {
  const tokens = norm(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of index) {
    if (kinds && !kinds.includes(e.kind)) continue;
    const title = norm(e.title);
    let score = 0;
    let all = true;
    for (const t of tokens) {
      const inTitle = title.includes(t);
      const inHay = e.haystack.includes(t);
      if (!inTitle && !inHay) {
        all = false;
        break;
      }
      score += inTitle ? 5 : 1;
      if (title.startsWith(t) || title.includes(` ${t}`)) score += 2;
    }
    if (all) scored.push({ e, score: score + (e.kind === "product" ? 1 : 0) });
  }
  return scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title)).map((s) => s.e);
}

export const SUGGESTIONS = ["Flanges", "Grinding wheels", "TMT bars", "Bearings", "Valves", "Drills", "Nuts and bolts", "Safety"];
