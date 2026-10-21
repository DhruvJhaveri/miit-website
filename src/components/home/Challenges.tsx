import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

const challenges = [
  { title: "Too many suppliers", body: "Tools from one vendor, fasteners from another, steel from a third — each with its own follow-up, delivery and invoice." },
  { title: "Specification mismatches", body: "A missing grade, rating or unit turns into the wrong item on site and a second round of procurement." },
  { title: "Coordination overhead", body: "Large requirements spread across categories take time to consolidate, chase and reconcile." },
  { title: "Timeline pressure", body: "Shutdowns, export dispatches and project milestones compress the window for sourcing." },
];

export function Challenges() {
  return (
    <section className="bg-paper py-28 md:py-36" aria-labelledby="challenges-title">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="The procurement problem" title={<span id="challenges-title">Industrial buying is rarely one item at a time.</span>} />
          <div data-reveal="image" className="relative mt-12 aspect-[4/5] overflow-hidden rounded-sm bg-ink max-lg:hidden">
            <Image src="/media/stills/ed-inventory.jpg" alt="Inventory check among stocked warehouse racking (illustrative footage)" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover" />
          </div>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7 lg:pt-28">
          {challenges.map((c, i) => (
            <li key={c.title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="grid grid-cols-[3.5rem_1fr] border-t border-ink/15 py-9 last:border-b">
              <span className="t-eyebrow pt-1.5 text-graphite">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="t-h3">{c.title}</h3>
                <p className="mt-3 max-w-[46ch] text-graphite">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
