import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

/** Scene 7 — a calmer closing statement that leads straight to the RFQ. */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-steel text-paper" aria-labelledby="final-cta-title">
      <div className="absolute inset-0 -z-10">
        <Image src="/media/stills/ed-lathe.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-steel via-steel/85 to-steel/40" />
      </div>
      <div className="shell grid gap-10 py-28 md:py-40 lg:grid-cols-12 lg:items-end">
        <h2 id="final-cta-title" data-reveal className="t-h1 max-w-[14ch] lg:col-span-8">Your next industrial requirement starts here.</h2>
        <div data-reveal className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
          <p className="max-w-[36ch] text-paper/70 lg:text-right">Share a single item or a full bill of materials. The team reviews every line before quoting.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/request-quote?source=final-cta">Request a Quote</ButtonLink>
            <ButtonLink href="/contact" variant="ghost-dark" arrow={false}>Contact the team</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
