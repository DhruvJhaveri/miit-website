import { metrics, showMetrics } from "@/content/company";
import { CountUp } from "@/components/ui/CountUp";

const benefits = [
  { n: "01", title: "Consolidated sourcing", body: "Tools, consumables, materials and components on one requirement." },
  { n: "02", title: "Broad engineering range", body: "Nine product families, from drills to structural steel." },
  { n: "03", title: "Specification-conscious", body: "Sizes, grades, standards and quantities checked line by line." },
  { n: "04", title: "Supplier coordination", body: "Standard and hard-to-find items sourced across many suppliers." },
  { n: "05", title: "Dispatch coordination", body: "Packaging, checks and dispatch coordinated as agreed." },
];

export function Positioning() {
  return (
    <section className="film-overlap relative z-10 rounded-t-[1.75rem] bg-paper pt-24 md:rounded-t-[2.5rem] md:pt-32" aria-labelledby="positioning-title">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <p data-reveal className="t-eyebrow flex items-center gap-3 text-blue lg:col-span-3">
            <span className="inline-block h-px w-8 bg-current" aria-hidden /> MIIT CORPORATION
          </p>
          <div className="lg:col-span-9">
            <h2 id="positioning-title" data-reveal className="t-h2 max-w-[24ch]">
              From everyday engineering tools to complex, multi-category project requirements — one procurement partner with{" "}
              <span className="text-blue">coordination, clarity and reliability</span>.
            </h2>
            <p data-reveal className="t-lead mt-8 max-w-[56ch] text-graphite" style={{ "--reveal-i": 1 } as React.CSSProperties}>
              Founded in the early 1970s as Apco Tools Traders, MIIT began with magnets, drills and tools. Today it helps manufacturers, foundries,
              exporters, contractors and project teams source the right specification, consolidate purchases and manage supply with fewer moving parts.
            </p>
          </div>
        </div>

        <ol className="mt-20 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b, i) => (
            <li
              key={b.n}
              data-reveal
              style={{ "--reveal-i": i } as React.CSSProperties}
              className="border-b border-ink/15 py-8 pr-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="t-eyebrow text-brand">{b.n}</span>
              <h3 className="t-h3 mt-4">{b.title}</h3>
              <p className="mt-3 text-[0.95rem] text-graphite">{b.body}</p>
            </li>
          ))}
        </ol>

        {showMetrics && (
          <dl className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} data-reveal className="border-l-2 border-accent pl-5">
                <dt className="sr-only">{m.label}</dt>
                <dd className="t-metric text-[clamp(2.6rem,5vw,4.5rem)]">
                  <CountUp value={m.value} suffix={m.suffix} />
                </dd>
                <dd className="mt-2 text-sm font-medium">{m.label}</dd>
                <dd className="mt-1 text-xs text-graphite">{m.note}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
