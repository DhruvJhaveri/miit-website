import Link from "next/link";
import { siteUrl } from "@/content/company";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: new URL(c.href, siteUrl).toString() } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="hero-in">
      <ol className="t-eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] text-paper/55">
        {all.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-paper">{c.label}</Link>
            ) : (
              <span aria-current="page" className="text-paper/85">{c.label}</span>
            )}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
