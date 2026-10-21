"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { company } from "@/content/company";
import { useIsClient, useQueryParams } from "@/lib/use-query-params";

const REF = /^MIIT-(RFQ|MSG)-\d{6}-[A-Z0-9]{5}$/;

/** Confirmation view. The reference is read from the URL (set only after the server confirmed). */
export function Received({ kind }: { kind: "rfq" | "contact" }) {
  const [params] = useQueryParams();
  const client = useIsClient();
  const raw = params.get("ref");
  const ref = raw && REF.test(raw) ? raw : "";

  return (
    <section className="flex min-h-[80svh] items-center bg-paper pb-24 pt-[calc(var(--nav-h)+4rem)]">
      <div className="absolute inset-x-0 top-0 h-[var(--nav-h)] bg-ink" aria-hidden />
      <div className="shell max-w-3xl">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <h1 className="t-h1 mt-6">{kind === "rfq" ? "Your quotation request has been received." : "Your message has been received."}</h1>
        {client &&
          (ref ? (
            <p className="mt-6 text-lg">
              Reference number: <span className="rounded bg-ink px-2 py-1 font-mono text-paper">{ref}</span>
            </p>
          ) : (
            <p className="mt-6 text-graphite">Keep this page for your records.</p>
          ))}
        <div className="mt-10 space-y-4 text-graphite">
          <p className="font-medium text-ink">What happens next</p>
          {kind === "rfq" ? (
            <ol className="list-decimal space-y-2 pl-5">
              <li>The MIIT team reviews each line item and any documents you attached.</li>
              <li>If a specification needs clarification, the team will contact you using the details you provided.</li>
              <li>A quotation is prepared based on the confirmed requirement; terms and delivery are agreed with you.</li>
            </ol>
          ) : (
            <p>The team will respond using the contact details you provided.</p>
          )}
          <p>Quote your reference number if you contact us about this request: {company.phones.map((p) => p.display).join(" / ")} · {company.email}</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper">Back to home</Link>
          <Link href="/products" className="rounded-full border border-ink/20 px-6 py-3.5 font-semibold">Browse products</Link>
        </div>
      </div>
    </section>
  );
}
