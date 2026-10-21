import Image from "next/image";
import { caseStudies } from "@/content/case-studies";
import { CountUp } from "@/components/ui/CountUp";
import { ButtonLink } from "@/components/ui/Button";

/** Scene 6 — flagship case study. Only the figures reported by MIIT are shown. */
export function CaseStudyReveal() {
  const cs = caseStudies[0];
  return (
    <section className="grain relative isolate overflow-hidden bg-ink text-paper" aria-labelledby="case-title">
      <div data-reveal="image" className="absolute inset-0 -z-10">
        <Image src="/media/stills/ed-port-night.jpg" alt="" fill sizes="100vw" className="object-cover opacity-55" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/60 to-ink" aria-hidden />
      <div className="shell py-28 md:py-40">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-reveal className="t-eyebrow flex items-center gap-3 text-accent">
              <span className="inline-block h-px w-8 bg-current" aria-hidden /> Case study · Export order
            </p>
            <h2 id="case-title" data-reveal className="t-h1 mt-6 max-w-[14ch]">{cs.title}</h2>
            <p data-reveal className="t-lead mt-8 max-w-[50ch] text-paper/75">{cs.dek}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <ul className="space-y-5 border-l border-white/15 pl-6">
              {cs.categories.map((g) => (
                <li key={g.group} data-reveal>
                  <p className="t-eyebrow text-paper/50">{g.group}</p>
                  <p className="mt-2 text-paper/85">{g.items.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 border-t border-white/15 lg:grid-cols-4">
          {cs.figures.map((f, i) => (
            <div key={f.label} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex flex-col-reverse border-b border-white/10 py-8 pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
              <dt className="mt-3 text-sm text-paper/60">{f.label}</dt>
              <dd className="t-metric text-[clamp(2.8rem,6vw,5.5rem)] text-paper">
                <CountUp value={f.value} suffix={f.suffix} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[60ch] text-xs text-paper/50">
            Figures as reported by MIIT CORPORATION (
            <a href={cs.source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">source</a>
            ). Results depend on each order and are not a guarantee for future requirements. Footage is illustrative.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/case-studies/${cs.slug}`} variant="ghost-dark">Read the case study</ButtonLink>
            <ButtonLink href="/request-quote?source=case-study">Discuss a similar requirement</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
