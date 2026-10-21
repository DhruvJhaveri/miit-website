import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { industries, industryBySlug } from "@/content/industries";
import { categoryBySlug } from "@/content/categories";
import { caseStudyBySlug } from "@/content/case-studies";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ViewTracker } from "@/components/ui/ViewTracker";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} — Industrial Procurement`,
    description: `${ind.short} ${ind.intro}`.slice(0, 300),
    alternates: { canonical: `/industries/${ind.slug}` },
    openGraph: { images: [{ url: ind.image }] },
  };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();
  const cs = ind.caseStudy ? caseStudyBySlug(ind.caseStudy) : undefined;
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 4);

  return (
    <>
      <ViewTracker event="industry_view" props={{ industry: ind.slug }} />
      <PageHero
        crumbs={[{ label: "Industries", href: "/industries" }, { label: ind.name }]}
        eyebrow="Industry"
        title={ind.name}
        lead={ind.intro}
        image={ind.image}
        imageAlt={ind.imageAlt}
      >
        <ButtonLink href={`/request-quote?source=industry-${ind.slug}`}>Request a Quote</ButtonLink>
        <ButtonLink href="#categories" variant="ghost-dark" arrow={false}>Relevant products</ButtonLink>
      </PageHero>

      <section className="bg-paper py-24" aria-labelledby="challenges">
        <div className="shell">
          <h2 id="challenges" className="t-h2 max-w-[18ch]">Typical procurement challenges</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md bg-ink/10 md:grid-cols-3">
            {ind.challenges.map((c, i) => (
              <li key={c.title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="bg-paper p-8">
                <span className="t-eyebrow text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-5">{c.title}</h3>
                <p className="mt-3 text-graphite">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="categories" className="scroll-mt-20 bg-ink py-24 text-paper" aria-labelledby="cats-title">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="cats-title" className="t-h2 max-w-[18ch]">Relevant product families</h2>
            <Link href="/products" className="link-underline text-paper/75">Full catalogue →</Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ind.categories.map((s) => {
              const c = categoryBySlug(s)!;
              return (
                <li key={s}>
                  <Link href={`/products/${c.slug}`} className="group relative flex aspect-[16/10] items-end overflow-hidden rounded-md bg-ink-3 p-6">
                    <Image src={c.image} alt="" fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                    <span className="relative">
                      <span className="t-eyebrow text-accent">{c.code}</span>
                      <span className="t-h3 mt-1 block">{c.shortName}</span>
                      <span className="mt-1 block text-sm text-paper/65">{c.tagline}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="shell grid gap-14 lg:grid-cols-3">
          <div>
            <h2 className="t-eyebrow text-blue">Example applications</h2>
            <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">{ind.applications.map((a) => <li key={a} className="py-4">{a}</li>)}</ul>
          </div>
          <div>
            <h2 className="t-eyebrow text-blue">Specification considerations</h2>
            <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">{ind.specConsiderations.map((a) => <li key={a} className="py-4">{a}</li>)}</ul>
          </div>
          <div>
            <h2 className="t-eyebrow text-blue">How MIIT supports sourcing</h2>
            <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">{ind.support.map((a) => <li key={a} className="py-4">{a}</li>)}</ul>
          </div>
        </div>
      </section>

      {cs && (
        <section className="bg-paper-2 py-24">
          <div className="shell">
            <Link href={`/case-studies/${cs.slug}`} className="group grid overflow-hidden rounded-md bg-ink text-paper md:grid-cols-2">
              <div className="relative min-h-72">
                <Image src={cs.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-10">
                <p className="t-eyebrow text-accent">Related case study</p>
                <p className="t-h2 mt-4">{cs.title}</p>
                <p className="mt-4 text-paper/70">{cs.dek}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-medium">Read the case study <ArrowUpRight className="size-4" aria-hidden /></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="bg-steel py-24 text-paper">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <h2 className="t-h2 max-w-[20ch]">Send your {ind.name.toLowerCase()} requirement.</h2>
          <ButtonLink href={`/request-quote?source=industry-${ind.slug}-footer`}>Request a Quote</ButtonLink>
        </div>
        <div className="shell mt-16">
          <p className="t-eyebrow text-paper/50">Other industries</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((o) => <li key={o.slug}><Link href={`/industries/${o.slug}`} className="inline-block rounded-full border border-paper/20 px-4 py-2 text-sm hover:border-paper">{o.name}</Link></li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
