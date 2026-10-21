"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Phone } from "lucide-react";
import { company } from "@/content/company";
import { track } from "@/lib/analytics";

/** Persistent but unobtrusive mobile CTA; hidden on the RFQ page itself. */
export function MobileQuoteBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/request-quote")) return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-40 flex gap-2 transition-[transform,opacity] duration-500 sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <Link
        href="/request-quote?source=mobile-bar"
        onClick={() => track("cta_click", { location: "mobile-bar" })}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent-fill py-3.5 font-semibold text-white shadow-lg shadow-black/30"
      >
        <FileText className="size-4" aria-hidden /> Request a Quote
      </Link>
      <a
        href={`tel:${company.phones[0].tel}`}
        onClick={() => track("contact_click", { method: "phone", location: "mobile-bar" })}
        className="flex size-[3.25rem] items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-black/30"
      >
        <Phone className="size-4" aria-hidden />
        <span className="sr-only">Call MIIT CORPORATION</span>
      </a>
    </div>
  );
}
