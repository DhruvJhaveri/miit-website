import type { Metadata } from "next";
import { FileSpreadsheet, ListChecks, Upload } from "lucide-react";
import { company } from "@/content/company";
import { RfqForm } from "@/components/rfq/RfqForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Submit a multi-item industrial quotation request to MIIT CORPORATION — add line items with specifications, paste from a spreadsheet, or upload your BOM and drawings.",
  alternates: { canonical: "/request-quote" },
};

export default function RequestQuotePage() {
  return (
    <section className="bg-paper-2 pb-28 pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="absolute inset-x-0 top-0 -z-0 h-[var(--nav-h)] bg-ink" aria-hidden />
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <p className="t-eyebrow flex items-center gap-3 text-blue"><span className="inline-block h-px w-8 bg-current" aria-hidden /> Request for quotation</p>
            <h1 className="t-h1 mt-5 max-w-[12ch]">Request a Quote</h1>
            <p className="mt-6 max-w-[42ch] text-graphite">One request can cover every category you need. You will receive a reference number once it is recorded.</p>
            <ul className="mt-10 space-y-5 text-sm">
              <li className="flex gap-3"><ListChecks className="size-5 shrink-0 text-blue" aria-hidden /><span><span className="font-medium">Line by line.</span> Add items with size, grade, standard and quantity.</span></li>
              <li className="flex gap-3"><FileSpreadsheet className="size-5 shrink-0 text-blue" aria-hidden /><span><span className="font-medium">Paste from Excel.</span> Bring a spreadsheet straight into the form.</span></li>
              <li className="flex gap-3"><Upload className="size-5 shrink-0 text-blue" aria-hidden /><span><span className="font-medium">Attach documents.</span> BOMs, drawings, datasheets and reference images.</span></li>
            </ul>
            <div className="mt-10 border-t border-ink/12 pt-6 text-sm text-graphite">
              <p>Need help? Call {company.phones.map((p, i) => <a key={p.tel} href={`tel:${p.tel}`} className="font-medium text-ink underline">{p.display}{i === 0 ? " / " : ""}</a>)}</p>
              <p className="mt-1">or email <a href={`mailto:${company.email}`} className="font-medium text-ink underline">{company.email}</a></p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-paper p-6 shadow-[0_40px_100px_-60px_rgba(12,15,18,0.45)] sm:p-10 lg:col-span-8">
          <RfqForm />
        </div>
      </div>
    </section>
  );
}
