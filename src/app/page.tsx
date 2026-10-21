import Link from "next/link";
import { ScrollFilm } from "@/components/home/film/ScrollFilm";
import { Positioning } from "@/components/home/Positioning";
import { Challenges } from "@/components/home/Challenges";
import { ProductRail } from "@/components/home/ProductRail";
import { ProductExplorer } from "@/components/home/ProductExplorer";
import { SupplySplit } from "@/components/home/SupplySplit";
import { ComplexityAssembly } from "@/components/home/ComplexityAssembly";
import { WhyMiit } from "@/components/home/WhyMiit";
import { IndustriesList } from "@/components/home/IndustriesList";
import { BrandEcosystem } from "@/components/home/BrandEcosystem";
import { ProcessNarrative } from "@/components/home/ProcessNarrative";
import { CaseStudyReveal } from "@/components/home/CaseStudyReveal";
import { RfqSection } from "@/components/home/RfqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { FaqList } from "@/components/faq/FaqList";
import { faqs } from "@/content/faqs";

const HOME_FAQS = [0, 1, 4, 6, 7, 11, 12, 15].map((i) => faqs[i]);

export default function Home() {
  return (
    <>
      <ScrollFilm />
      <Positioning />
      <Challenges />
      <ProductRail />
      <ProductExplorer />
      <SupplySplit />
      <ComplexityAssembly />
      <WhyMiit />
      <IndustriesList />
      <BrandEcosystem />
      <ProcessNarrative />
      <CaseStudyReveal />
      <RfqSection />
      <section className="bg-paper py-28 md:py-36" aria-labelledby="faq-title">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p data-reveal className="t-eyebrow mb-5 flex items-center gap-3 text-blue">
              <span className="inline-block h-px w-8 bg-current" aria-hidden /> FAQs
            </p>
            <h2 id="faq-title" data-reveal className="t-h2 max-w-[12ch]">Questions buyers ask.</h2>
            <Link href="/faq" className="link-underline mt-8 inline-block text-blue">All questions →</Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={HOME_FAQS} />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
