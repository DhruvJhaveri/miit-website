import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ComplexityPlanner } from "@/components/calculator/ComplexityPlanner";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { categories } from "@/content/categories";

export const metadata: Metadata = {
  title: "Procurement Solutions & Project Supply",
  description:
    "Multi-category industrial sourcing, consolidated requirements, specification coordination and project material supply from MIIT CORPORATION, Mumbai.",
  alternates: { canonical: "/procurement" },
};

const capabilities = [
  { title: "Multi-category sourcing", body: "Tools, consumables, fasteners, mechanical components, instruments, piping and structural materials on one requirement." },
  { title: "Consolidated requirements", body: "Indents from different teams merged, de-duplicated and organised into a single procurement plan." },
  { title: "Specification coordination", body: "Missing sizes, grades, ratings and standards clarified before anything is sourced." },
  { title: "Project materials", body: "MS, SS, TMT, beams, channels, angles, plates, valves, flanges and pipe fittings for project schedules." },
  { title: "Supply coordination", body: "Standard and hard-to-find items sourced across suppliers, then consolidated, checked, packed and dispatched as agreed." },
  { title: "One point of contact", body: "A single coordinator for questions, quotations, dispatch and documentation." },
];

export default function ProcurementPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Procurement Solutions" }]}
        eyebrow="Procurement & project supply"
        title="One requirement. Multiple categories. One coordinated procurement process."
        lead="Submit requirements spanning engineering tools, fasteners, structural materials, valves, fittings, instruments and more — MIIT coordinates specifications, sourcing and dispatch."
        image="/media/stills/ed-steel-hall.jpg"
      >
        <ButtonLink href="/request-quote?source=procurement">Submit a requirement</ButtonLink>
        <ButtonLink href="#planner" variant="ghost-dark" arrow={false}>Plan a complex requirement</ButtonLink>
      </PageHero>

      <section className="bg-paper py-24" aria-labelledby="cap-title">
        <div className="shell">
          <h2 id="cap-title" className="t-h2 max-w-[20ch]">What consolidated procurement covers</h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-md bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <li key={c.title} data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties} className="bg-paper p-8">
                <span className="t-eyebrow text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-5">{c.title}</h3>
                <p className="mt-3 text-graphite">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grain relative isolate overflow-hidden bg-ink py-28 text-paper">
        <AmbientVideo name="logistics" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" aria-hidden />
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-eyebrow text-accent">The process</p>
            <h2 className="t-h2 mt-4 max-w-[14ch]">How a requirement moves through MIIT</h2>
            <p className="mt-5 max-w-[42ch] text-paper/70">Expand each stage to see its inputs, activities and outputs. The exact process depends on the order, the products and the project. The website does not verify suppliers, certify documents or track shipments automatically.</p>
          </div>
          <div className="lg:col-span-7">
            <ProcessSteps tone="dark" />
          </div>
        </div>
      </section>

      <section id="planner" className="scroll-mt-20 bg-paper-2 py-28" aria-labelledby="planner-title">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="t-eyebrow text-blue">Requirement planner</p>
              <h2 id="planner-title" className="t-h2 mt-4 max-w-[18ch]">Structure a complex requirement before you send it.</h2>
            </div>
            <p className="text-graphite lg:col-span-5 lg:self-end">Describe the shape of your requirement to get a checklist of missing information, documents to prepare and a recommended way to submit. Scoring rules are published below.</p>
          </div>
          <div className="mt-14">
            <ComplexityPlanner />
          </div>
          <details className="mt-10 max-w-3xl rounded-md border border-ink/12 bg-white p-6 text-sm">
            <summary className="cursor-pointer font-medium">How the indicative score is calculated</summary>
            <ul className="mt-4 space-y-1 text-graphite">
              <li>Line items: min(lines ÷ 150, 1) × 25 points</li>
              <li>Product categories: min(categories ÷ 8, 1) × 20 points</li>
              <li>Suppliers involved today: min(suppliers ÷ 15, 1) × 15 points</li>
              <li>Deliveries: min((deliveries − 1) ÷ 5, 1) × 10 points</li>
              <li>Specification gaps: all 0 · most 6 · some 12 · not yet 18 points</li>
              <li>Documentation, special packing, export: 4 points each</li>
              <li>Bands: below 30 Straightforward · 30–59 Moderate · 60+ Complex</li>
            </ul>
          </details>
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <div data-reveal="image" className="relative aspect-[16/11] overflow-hidden rounded-md bg-ink">
            <Image src="/media/stills/ed-warehouse-engineer.jpg" alt="Engineer reviewing a drawing in a materials warehouse (illustrative footage)" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 className="t-h2 max-w-[16ch]">Project supply across the portfolio</h2>
            <p className="mt-5 text-graphite">Every product family can be included in a project requirement:</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem]">
              {categories.map((c) => <li key={c.slug} className="border-b border-ink/10 py-2">{c.shortName}</li>)}
            </ul>
            <div className="mt-8"><ButtonLink href="/request-quote?source=procurement-bottom" variant="ink">Start a project RFQ</ButtonLink></div>
          </div>
        </div>
      </section>
    </>
  );
}
