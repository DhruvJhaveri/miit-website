import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/case-studies";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Published examples of complex, multi-category industrial procurement coordinated by MIIT CORPORATION.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "Case studies" }]} eyebrow="Case studies" title="Complex requirements, coordinated." lead="Examples MIIT CORPORATION has published. Only reported facts are shown; client identities are withheld." image="/media/stills/ed-port-cranes.jpg" />
      <section className="bg-paper py-24">
        <div className="shell">
          <ul className="space-y-8">
            {caseStudies.map((cs) => (
              <li key={cs.slug}>
                <Link href={`/case-studies/${cs.slug}`} className="group grid overflow-hidden rounded-md bg-ink text-paper lg:grid-cols-2">
                  <div className="relative min-h-80">
                    <Image src={cs.image} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-between gap-10 p-10">
                    <div>
                      <p className="t-eyebrow text-accent">Export order · Multi-category</p>
                      <h2 className="t-h2 mt-4">{cs.title}</h2>
                      <p className="mt-4 text-paper/70">{cs.dek}</p>
                    </div>
                    <div className="flex items-end justify-between gap-6">
                      <dl className="flex gap-10">
                        {cs.figures.slice(0, 3).map((f) => (
                          <div key={f.label} className="flex flex-col-reverse">
                            <dt className="text-xs text-paper/55">{f.label}</dt>
                            <dd className="t-metric text-4xl">{f.display ?? `${f.value}${f.suffix}`}</dd>
                          </div>
                        ))}
                      </dl>
                      <ArrowUpRight className="size-6 shrink-0" aria-hidden />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[60ch] text-sm text-graphite">Further case studies will be added as MIIT approves them for publication.</p>
        </div>
      </section>
    </>
  );
}
