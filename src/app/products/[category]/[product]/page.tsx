import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, FileText } from "lucide-react";
import { allFamilies, familyBySlug, supplyModeLabel } from "@/content/categories";
import { company, whatsappLink } from "@/content/company";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ViewTracker } from "@/components/ui/ViewTracker";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return allFamilies().map(({ category, family }) => ({ category: category.slug, product: family.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[category]/[product]">): Promise<Metadata> {
  const { category, product } = await params;
  const hit = familyBySlug(category, product);
  if (!hit) return {};
  const { family: f, category: c } = hit;
  return {
    title: `${f.name} — ${c.shortName}`,
    description: `${f.summary} Request a quotation for ${f.name.toLowerCase()} from MIIT CORPORATION, Mumbai. ${f.description}`.slice(0, 300),
    alternates: { canonical: `/products/${c.slug}/${f.slug}` },
    openGraph: { images: [{ url: f.image ?? c.image }] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[category]/[product]">) {
  const { category, product } = await params;
  const hit = familyBySlug(category, product);
  if (!hit) notFound();
  const { category: c, family: f } = hit;

  // Verified technical data, rendered only when present in the catalogue data.
  const specs: { label: string; value: string }[] = [
    ...(f.material ? [{ label: "Material", value: f.material }] : []),
    ...(f.grades?.length ? [{ label: "Grades", value: f.grades.join(", ") }] : []),
    ...(f.sizes ? [{ label: "Sizes", value: f.sizes }] : []),
    ...(f.standards?.length ? [{ label: "Standards", value: f.standards.join(", ") }] : []),
    ...(f.brands?.length ? [{ label: "Brands", value: f.brands.join(", ") }] : []),
    ...(f.moq ? [{ label: "Minimum order", value: f.moq }] : []),
    ...(f.attributes ?? []),
  ];
  const siblings = c.families.filter((x) => x.slug !== f.slug);
  const wa = whatsappLink(`Hello MIIT CORPORATION, I would like a quotation for ${f.name} (${c.shortName}).`);

  return (
    <>
      <ViewTracker event="product_view" props={{ category: c.slug, product: f.slug }} />
      <PageHero
        size="md"
        crumbs={[{ label: "Products", href: "/products" }, { label: c.shortName, href: `/products/${c.slug}` }, { label: f.name }]}
        eyebrow={c.name}
        title={f.name}
        lead={f.summary}
        image={f.image ?? c.image}
        imageAlt={c.imageAlt}
      >
        <ButtonLink href={`/request-quote?category=${c.slug}&product=${f.slug}&source=product`}>Request a Quote</ButtonLink>
      </PageHero>

      <section className="bg-paper py-24">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-eyebrow text-blue">Overview</h2>
            <p className="t-lead mt-5 max-w-[56ch]">{f.description}</p>

            <div className="mt-14">
              <h2 className="t-h3">What to include in your enquiry</h2>
              <p className="mt-2 text-graphite">Complete specifications help MIIT source the right item the first time.</p>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {f.specifyOnEnquiry.map((s) => (
                  <li key={s} className="flex items-start gap-3 border-b border-ink/10 pb-3">
                    <Check className="mt-1 size-4 shrink-0 text-brand" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {specs.length > 0 && (
              <div className="mt-14">
                <h2 className="t-h3">Technical information</h2>
                <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  {specs.map((s) => (
                    <div key={s.label} className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-graphite">{s.label}</dt>
                      <dd className="col-span-2">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {f.variants?.length ? (
              <div className="mt-14">
                <h2 className="t-h3">Variants</h2>
                <ul className="mt-4 flex flex-wrap gap-2">{f.variants.map((v) => <li key={v} className="rounded-full border border-ink/15 px-3 py-1 text-sm">{v}</li>)}</ul>
              </div>
            ) : null}

            {f.documents?.length ? (
              <div className="mt-14">
                <h2 className="t-h3">Documentation</h2>
                <ul className="mt-4 space-y-2">
                  {f.documents.map((d) => (
                    <li key={d.href}><a href={d.href} className="inline-flex items-center gap-2 text-blue underline"><FileText className="size-4" aria-hidden />{d.label}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-[calc(var(--nav-h)+2rem)] space-y-6">
              <div className="rounded-md bg-ink p-7 text-paper">
                <p className="t-eyebrow text-accent">Enquire</p>
                <p className="t-h3 mt-3">Quote for {f.name.toLowerCase()}</p>
                <p className="mt-3 text-sm text-paper/70">Add sizes, grades and quantities — and any other items you need — to one request.</p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink href={`/request-quote?category=${c.slug}&product=${f.slug}&source=product-aside`}>Request a Quote</ButtonLink>
                  {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full border border-paper/30 px-6 py-3 text-center text-sm font-semibold hover:bg-paper hover:text-ink">WhatsApp the team</a>}
                  <a href={`tel:${company.phones[0].tel}`} className="text-center text-sm text-paper/70 underline">Call {company.phones[0].display}</a>
                </div>
              </div>
              <div className="rounded-md border border-ink/12 p-6 text-sm">
                <p className="t-eyebrow text-graphite">Availability</p>
                <p className="mt-2">{c.supplyModes.map((m) => supplyModeLabel[m]).join(" · ")}.</p>
                <p className="mt-2 text-graphite">Stock, makes and lead times are confirmed with each quotation. No item is guaranteed to be in stock.</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink">
                <Image src={f.image ?? c.image} alt={c.imageAlt} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
                <p className="t-eyebrow absolute bottom-3 left-3 rounded-full bg-ink/60 px-2.5 py-1 text-[0.6rem] text-paper/80">Illustrative</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="bg-paper-2 py-20" aria-labelledby="related-products">
          <div className="shell">
            <h2 id="related-products" className="t-h3">More in {c.shortName}</h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-md bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((s) => (
                <li key={s.slug} className="bg-paper-2">
                  <Link href={`/products/${c.slug}/${s.slug}`} className="group flex h-full flex-col p-6 hover:bg-white">
                    <span className="font-medium group-hover:text-blue">{s.name}</span>
                    <span className="mt-2 flex-1 text-sm text-graphite">{s.summary}</span>
                    <ArrowUpRight className="mt-4 size-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
