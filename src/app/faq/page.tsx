import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { PageHero } from "@/components/layout/PageHero";
import { FaqList } from "@/components/faq/FaqList";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about MIIT CORPORATION's products, technical requirements, the quotation process, availability and delivery.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero size="md" crumbs={[{ label: "FAQs" }]} eyebrow="FAQs" title="Questions buyers ask." image="/media/stills/ed-gears.jpg" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="bg-paper py-20">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <FaqList />
          </div>
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="sticky top-[calc(var(--nav-h)+2rem)] rounded-md bg-ink p-6 text-paper">
              <p className="t-h3">Still have a question?</p>
              <p className="mt-2 text-sm text-paper/70">Send it with your requirement, or contact the team directly.</p>
              <div className="mt-5 flex flex-col gap-2">
                <ButtonLink href="/request-quote?source=faq">Request a Quote</ButtonLink>
                <ButtonLink href="/contact" variant="ghost-dark" arrow={false}>Contact</ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
