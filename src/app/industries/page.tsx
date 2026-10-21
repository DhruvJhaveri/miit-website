import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/content/industries";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Industries Served",
  description: "Industrial procurement for manufacturing, foundries, exporters, machine shops, construction, contractors, EPC projects, infrastructure, automobile engineering and oil & gas.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries" }]}
        eyebrow="Industries served"
        title="Procurement support shaped around each sector."
        lead="Every industry buys differently. MIIT adapts how requirements are gathered, specified and coordinated — from consumable-heavy foundries to specification-heavy EPC packages."
        image="/media/stills/ind-manufacturing.jpg"
      >
        <ButtonLink href="/request-quote?source=industries">Request a Quote</ButtonLink>
      </PageHero>
      <section className="bg-paper py-24">
        <div className="shell">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <li key={ind.slug} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
                <Link href={`/industries/${ind.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink">
                    <Image src={ind.image} alt={ind.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="t-eyebrow absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-paper/85 backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="t-h3 group-hover:text-blue">{ind.name}</h2>
                      <p className="mt-2 text-graphite">{ind.short}</p>
                    </div>
                    <ArrowUpRight className="mt-1 size-5 shrink-0" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
