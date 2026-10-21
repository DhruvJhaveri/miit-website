import { company, whatsappLink } from "@/content/company";
import { RfqForm } from "@/components/rfq/RfqForm";

export function RfqSection() {
  const wa = whatsappLink("Hello MIIT CORPORATION, I would like a quotation for:");
  return (
    <section id="rfq" className="scroll-mt-20 bg-paper-2 py-28 md:py-36" aria-labelledby="rfq-title">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <p data-reveal className="t-eyebrow mb-5 flex items-center gap-3 text-blue">
              <span className="inline-block h-px w-8 bg-current" aria-hidden /> Request for quotation
            </p>
            <h2 id="rfq-title" data-reveal className="t-h2 max-w-[14ch]">Send your full requirement in one go.</h2>
            <p data-reveal className="mt-6 max-w-[40ch] text-graphite">
              Add as many line items as you need, paste rows from a spreadsheet, or attach your bill of materials and drawings. You will receive a reference number once the request is recorded.
            </p>
            <ul className="mt-10 space-y-4 border-t border-ink/12 pt-8 text-sm">
              <li>
                <span className="t-eyebrow block text-graphite">Prefer to talk?</span>
                {company.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="link-underline mr-4 font-medium">{p.display}</a>
                ))}
              </li>
              <li>
                <span className="t-eyebrow block text-graphite">Email</span>
                <a href={`mailto:${company.email}`} className="link-underline font-medium">{company.email}</a>
              </li>
              {wa && (
                <li>
                  <span className="t-eyebrow block text-graphite">WhatsApp</span>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">Message the team</a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="rounded-lg bg-paper p-6 shadow-[0_40px_100px_-60px_rgba(12,15,18,0.45)] sm:p-10 lg:col-span-8">
          <RfqForm embedded />
        </div>
      </div>
    </section>
  );
}
