import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  { title: "Broad product coverage", body: "Nine families spanning tools, consumables, fasteners, mechanical components, instruments, piping and structural steel." },
  { title: "Consolidated procurement", body: "Multiple categories coordinated on one requirement, with one point of contact." },
  { title: "Specification-conscious sourcing", body: "Attention to dimensions, grades, ratings, standards, quantities and application before anything is sourced." },
  { title: "Supplier coordination", body: "Standard and hard-to-find items sourced across a network of affiliated partners and suppliers." },
  { title: "Project-oriented supply", body: "Experience with complex, multi-product orders — including a published 130-product, 65-tonne requirement." },
  { title: "Established experience", body: "A business history reaching back to the early 1970s, when MIIT began as Apco Tools Traders." },
  { title: "Customer-focused service", body: "Clear communication, requirement clarity and supply on the terms agreed with each customer." },
];

export function WhyMiit() {
  return (
    <section className="bg-paper py-28 md:py-36" aria-labelledby="why-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            className="lg:col-span-6"
            eyebrow="Why MIIT CORPORATION"
            title={<span id="why-title">A procurement partner, not just a product list.</span>}
            lead="Buyers come to MIIT for the item. They return for the coordination around it."
          />
          <div data-reveal="image" className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink lg:col-span-5 lg:col-start-8 lg:aspect-auto">
            <Image src="/media/stills/ed-heritage-drill.jpg" alt="Macro shot of a twist drill entering steel — MIIT began with drills, magnets and tools (illustrative footage)" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
        <ol className="mt-20 grid gap-px overflow-hidden rounded-sm bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <li
              key={r.title}
              data-reveal
              style={{ "--reveal-i": i % 4 } as React.CSSProperties}
              className={`group relative bg-paper p-8 transition-colors duration-500 hover:bg-ink hover:text-paper ${i === 0 ? "lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-end" : ""}`}
            >
              <span className="t-eyebrow text-brand group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`mt-6 ${i === 0 ? "t-h2 max-w-[12ch]" : "t-h3"}`}>{r.title}</h3>
              <p className={`mt-4 text-graphite transition-colors group-hover:text-paper/70 ${i === 0 ? "t-lead max-w-[40ch]" : "text-[0.95rem]"}`}>{r.body}</p>
            </li>
          ))}
          <li data-reveal className="bg-accent-fill">
            <Link href="/about" className="group flex h-full flex-col justify-between gap-10 p-8 text-white">
              <span className="t-eyebrow">Since the early 1970s</span>
              <span className="t-h3 flex items-end justify-between gap-4">
                The MIIT story
                <ArrowUpRight className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
