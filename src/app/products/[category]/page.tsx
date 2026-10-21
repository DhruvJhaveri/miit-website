import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { categories, categoryBySlug, supplyModeLabel } from "@/content/categories";
import { industryBySlug } from "@/content/industries";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ViewTracker } from "@/components/ui/ViewTracker";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = categoryBySlug(category);
  if (!c) return {};
  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: `/products/${c.slug}` },
    openGraph: { images: [{ url: c.image }] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const c = categoryBySlug(category);
  if (!c) notFound();

  return (
    <>
      <ViewTracker event="category_view" props={{ category: c.slug }} />
      <PageHero
        crumbs={[{ label: "Products", href: "/products" }, { label: c.shortName }]}
        eyebrow={`${c.code} / 09 — Product family`}
        title={c.name}
        lead={c.description}
        image={c.image}
        imageAlt={c.imageAlt}
      >
        <ButtonLink href={`/request-quote?category=${c.slug}&source=category`}>Request a Quote</ButtonLink>
        <ButtonLink href="#families" variant="ghost-dark" arrow={false}>View products</ButtonLink>
      </PageHero>

      <section id="families" className="scroll-mt-20 bg-paper py-24" aria-labelledby="families-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="families-title" className="t-h2">Products in this family</h2>
            <p className="max-w-md text-sm text-graphite">{c.supplyModes.map((m) => supplyModeLabel[m]).join(" · ")}. Availability, makes and lead times are confirmed per enquiry.</p>
          </div>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-md bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {c.families.map((f, i) => (
              <li key={f.slug} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties} className="bg-paper">
                <Link href={`/products/${c.slug}/${f.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-white">
                  <span className="t-eyebrow text-graphite">{c.code}.{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="t-h3 mt-5 group-hover:text-blue">{f.name}</h3>
                  <p className="mt-3 flex-1 text-graphite">{f.summary}</p>
                  <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium">Details & enquiry <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2 py-24" aria-label="Applications and industries">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink">
              <Image src={c.image} alt={c.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-3 text-xs text-graphite">Illustrative footage — not a photograph of MIIT stock.</p>
          </div>
          <div className="space-y-14 lg:col-span-6 lg:col-start-7">
            <div>
              <h2 className="t-eyebrow text-blue">Common applications</h2>
              <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
                {c.applications.map((a) => <li key={a} className="py-4 text-lg">{a}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="t-eyebrow text-blue">Industries that buy {c.shortName.toLowerCase()}</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.industries.map((s) => {
                  const ind = industryBySlug(s);
                  return ind ? (
                    <li key={s}><Link href={`/industries/${s}`} className="inline-block rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-ink">{ind.name}</Link></li>
                  ) : null;
                })}
              </ul>
            </div>
            <div className="rounded-md bg-ink p-8 text-paper">
              <h2 className="t-h3">Buying across several families?</h2>
              <p className="mt-3 text-paper/70">Add every line to one quotation request — MIIT consolidates multi-category requirements.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={`/request-quote?category=${c.slug}&source=category-multi`}>Start an RFQ</ButtonLink>
                <ButtonLink href="/procurement" variant="ghost-dark" arrow={false}>How it works</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-24" aria-labelledby="related-title">
        <div className="shell">
          <h2 id="related-title" className="t-h3">Related product families</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {c.related.map((slug) => {
              const r = categoryBySlug(slug)!;
              return (
                <li key={slug}>
                  <Link href={`/products/${r.slug}`} className="group relative flex aspect-[16/10] items-end overflow-hidden rounded-md bg-ink p-5 text-paper">
                    <Image src={r.image} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                    <span className="relative">
                      <span className="t-eyebrow text-accent">{r.code}</span>
                      <span className="t-h3 mt-1 block">{r.shortName}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
