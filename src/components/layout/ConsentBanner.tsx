"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import { CONSENT_KEY } from "@/lib/analytics";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// consent stored in localStorage, exposed as an external store
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};
const read = () => {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : "ask";
  } catch {
    return "ask";
  }
};

/**
 * Analytics consent. Renders nothing when no analytics provider is configured,
 * and loads Google Tag Manager only after the visitor accepts.
 */
export function ConsentBanner() {
  const state = useSyncExternalStore(subscribe, read, () => "unknown");

  const decide = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {}
    listeners.forEach((l) => l());
  };

  if (!GTM_ID) return null;

  return (
    <>
      {state === "granted" && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {state === "ask" && (
        <div role="dialog" aria-label="Analytics consent" className="fixed bottom-20 left-3 right-3 z-50 max-w-md rounded-md border border-white/10 bg-ink-2 p-5 text-sm text-paper shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto">
          <p>We use privacy-conscious analytics to understand how the site is used. No procurement details are shared. <Link href="/privacy" className="underline">Privacy</Link></p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => decide("granted")} className="rounded-full bg-accent-fill px-4 py-2 font-semibold text-white">Accept</button>
            <button type="button" onClick={() => decide("denied")} className="rounded-full border border-white/25 px-4 py-2">Decline</button>
          </div>
        </div>
      )}
    </>
  );
}
