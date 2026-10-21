import { brandNote, brands } from "@/content/brands";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export function BrandEcosystem() {
  return (
    <section className="bg-paper-2 py-28 md:py-36" aria-labelledby="brands-title">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Brands & sourcing"
            title={<span id="brands-title">The make you specify, or the right alternative.</span>}
            lead="MIIT helps buyers identify suitable sourcing options — from the brands they have standardised on to other makes that meet the requirement."
          />
          <div data-reveal className="mt-10">
            <ButtonLink href="/request-quote?source=brands" variant="ink">Request a specific make</ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ul className="grid grid-cols-2 border-l border-t border-ink/12 sm:grid-cols-3">
            {brands.map((b, i) => (
              <li key={b.name} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex aspect-[4/3] flex-col justify-between border-b border-r border-ink/12 p-6">
                <span className="t-eyebrow text-graphite">{b.area ?? "Industrial supplies"}</span>
                <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em] [font-stretch:110%]">{b.name}</span>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-6 max-w-[62ch] text-sm text-graphite">{brandNote} Brand names are trademarks of their respective owners.</p>
        </div>
      </div>
    </section>
  );
}
