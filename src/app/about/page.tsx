import type { Metadata } from "next";
import Image from "next/image";
import { company } from "@/content/company";
import { industries } from "@/content/industries";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About MIIT CORPORATION",
  description: "From Apco Tools Traders in the early 1970s to MIIT CORPORATION — five decades of industrial engineering supply and procurement in Mumbai.",
  alternates: { canonical: "/about" },
};

const timeline = [
  { when: "Early 1970s", title: "Apco Tools Traders", body: "The business begins in Mumbai supplying magnets, drills and tools to industry." },
  { when: "Growth", title: "A broader industrial range", body: "The portfolio expands into most industrial product categories — cutting and grinding, hand and power tools, fasteners, bearings, instruments, pneumatics, safety and more." },
  { when: "Today", title: "MIIT CORPORATION", body: "Industrial engineering supplies plus procurement and supply of structural materials — MS, SS, TMT, beams, channels, angles, plates, valves, flanges and pipe fittings — for industrial and infrastructure projects." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About MIIT CORPORATION"
        title="Five decades of supplying the businesses that keep industry moving."
        lead={`Formerly ${company.formerName}, MIIT CORPORATION has served industry from Mumbai since the ${company.originsLabel.toLowerCase()}.`}
        image="/media/stills/ed-heritage-drill.jpg"
      />

      <section className="bg-paper py-24" aria-labelledby="history">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="history" className="t-h2">History and evolution</h2>
            <p className="mt-5 text-graphite">The official founding year is being confirmed; public records describe the business as beginning in the early 1970s.</p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {timeline.map((t, i) => (
              <li key={t.title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="grid gap-4 border-t border-ink/12 py-10 sm:grid-cols-[10rem_1fr]">
                <p className="t-eyebrow pt-1 text-brand">{t.when}</p>
                <div>
                  <h3 className="t-h3">{t.title}</h3>
                  <p className="mt-3 text-graphite">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink py-24 text-paper" aria-labelledby="philosophy">
        <div className="shell">
          <h2 id="philosophy" className="t-eyebrow text-accent">Business philosophy</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md bg-white/10 md:grid-cols-3">
            {[
              ["Mission", company.mission],
              ["Vision", company.vision],
              ["Values", company.values],
            ].map(([k, v]) => (
              <div key={k} data-reveal className="bg-ink p-10">
                <p className="t-eyebrow text-paper/50">{k}</p>
                <p className="t-h3 mt-6 font-medium">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24" aria-labelledby="approach">
        <div className="shell grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 id="approach" className="t-h2 max-w-[16ch]">A procurement approach built on clarity</h2>
            <ul className="mt-8 space-y-6">
              {[
                ["Understand the requirement", "Every line is read for size, grade, standard, quantity and application."],
                ["Consolidate", "Multi-category requirements are organised into one procurement plan."],
                ["Coordinate", "Sourcing, checks, packaging and dispatch are coordinated with one point of contact."],
              ].map(([t, b]) => (
                <li key={t} className="border-l-2 border-accent pl-5">
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-graphite">{b}</p>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink">
            <Image src="/media/stills/ed-inventory.jpg" alt="Inventory check in a stocked warehouse (illustrative footage, not MIIT's premises)" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-24" aria-labelledby="experience">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="experience" className="t-h2">Industry experience</h2>
            <p className="mt-5 text-graphite">MIIT works with buyers across manufacturing, project and trading sectors.</p>
            <div className="mt-10 inline-flex items-center gap-6 rounded-md bg-ink p-6">
              <Image src="/brand/miit-mark.png" alt="MIIT CORPORATION logo" width={186} height={102} className="h-16 w-auto" />
              <p className="max-w-[22ch] text-xs text-paper/60">The MIIT monogram. Its blue sets the colour of this website.</p>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 lg:col-span-7">
            {industries.map((i) => <li key={i.slug} className="border-b border-ink/10 py-4">{i.name}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-steel py-24 text-paper">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <h2 className="t-h2 max-w-[20ch]">Talk to the MIIT team.</h2>
            <p className="mt-4 text-paper/70">{company.address.line1}, {company.address.city} {company.address.postalCode}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Contact us</ButtonLink>
            <ButtonLink href="/request-quote?source=about" variant="ghost-dark" arrow={false}>Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
