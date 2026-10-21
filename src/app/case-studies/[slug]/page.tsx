import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/content/case-studies";
import { industryBySlug } from "@/content/industries";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ViewTracker } from "@/components/ui/ViewTracker";

// Fully static content: unknown params resolve before streaming, so notFound() returns a real 404.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  if (!cs) return {};
  return { title: `Case study: ${cs.title}`, description: cs.dek, alternates: { canonical: `/case-studies/${cs.slug}` }, openGraph: { images: [{ url: cs.image }] } };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  if (!cs) notFound();

  return (
    <>
      <ViewTracker event="case_study_view" props={{ slug: cs.slug }} />
      <PageHero crumbs={[{ label: "Case studies", href: "/case-studies" }, { label: "65-tonne export order" }]} eyebrow="Case study" title={cs.title} lead={cs.dek} image="/media/stills/ed-port-night.jpg">
        <ButtonLink href="/request-quote?source=case-study-page">Discuss a similar requirement</ButtonLink>
      </PageHero>

      {/* numerical summary */}
      <section className="bg-ink pb-20 text-paper" aria-label="Reported figures">
        <div className="shell">
          <dl className="grid grid-cols-2 border-t border-white/15 lg:grid-cols-4">
            {cs.figures.map((f, i) => (
              <div key={f.label} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex flex-col-reverse border-b border-white/10 py-8 pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <dt className="mt-3 text-sm text-paper/60">{f.label}</dt>
                <dd className="t-metric text-[clamp(2.6rem,5vw,4.8rem)]"><CountUp value={f.value} suffix={f.suffix} /></dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-paper/45">Figures as reported by MIIT CORPORATION. Approximate weight as published.</p>
        </div>
      </section>

      {/* editorial timeline */}
      <section className="bg-paper py-24" aria-labelledby="story">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <h2 id="story" className="t-eyebrow text-blue">The order, step by step</h2>
              <p className="mt-4 text-graphite"><span className="font-medium text-ink">Customer:</span> {cs.client}.</p>
              <div className="mt-8">
                <p className="t-eyebrow text-graphite">Industries</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {cs.industries.map((s) => {
                    const ind = industryBySlug(s);
                    return ind ? <li key={s}><Link href={`/industries/${s}`} className="inline-block rounded-full border border-ink/15 px-3 py-1 text-sm hover:border-ink">{ind.name}</Link></li> : null;
                  })}
                </ul>
              </div>
            </div>
          </div>
          <ol className="relative lg:col-span-7 lg:col-start-6">
            <span className="absolute bottom-0 left-[0.4rem] top-2 w-px bg-ink/15" aria-hidden />
            {cs.chapters.map((c, i) => (
              <li key={c.n} data-reveal style={{ "--reveal-i": i % 2 } as React.CSSProperties} className="relative pb-14 pl-12 last:pb-0">
                <span className="absolute left-0 top-2 size-[0.85rem] rounded-full border-2 border-brand bg-paper" aria-hidden />
                <p className="t-eyebrow text-brand">{c.n}</p>
                <h3 className="t-h3 mt-2">{c.title}</h3>
                <p className="mt-3 max-w-[56ch] text-lg text-graphite">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* complexity visualisation */}
      <section className="bg-paper-2 py-24" aria-labelledby="composition">
        <div className="shell">
          <h2 id="composition" className="t-h2 max-w-[18ch]">What the requirement contained</h2>
          <p className="mt-4 max-w-[60ch] text-graphite">Category groupings as published. Individual line items and quantities are not disclosed.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {cs.categories.map((g) => (
              <div key={g.group} className="rounded-md bg-white p-8">
                <p className="t-eyebrow text-blue">{g.group}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((it) => <li key={it} className="rounded-full bg-ink px-4 py-2 text-sm text-paper">{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md bg-white p-8">
            <p className="t-eyebrow text-blue">What MIIT handled</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cs.services.map((s, i) => (
                <li key={s} className="flex gap-3"><span className="t-eyebrow pt-1 text-brand">{String(i + 1).padStart(2, "0")}</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grain relative isolate overflow-hidden bg-steel py-24 text-paper">
        <Image src="/media/stills/ed-port-cranes.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
        <div className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-eyebrow text-accent">The takeaway</p>
            <p className="t-h2 mt-4 max-w-[28ch]">{cs.takeaway}</p>
            <p className="mt-6 text-sm text-paper/60">
              Source: <a href={cs.source.href} target="_blank" rel="noopener noreferrer" className="underline">{cs.source.label}</a>. Imagery is illustrative and does not depict this shipment.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <ButtonLink href="/request-quote?source=case-study-bottom">Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
