"use client";

/**
 * Privacy-conscious analytics facade. Events are pushed to `window.dataLayer`
 * (Google Tag Manager compatible) ONLY after the visitor grants consent and only
 * when NEXT_PUBLIC_GTM_ID is configured. Never pass names, emails, phone numbers
 * or procurement specifications — event props are restricted to safe primitives.
 */
export type AnalyticsEvent =
  | "cta_click"
  | "category_view"
  | "product_view"
  | "product_search"
  | "rfq_start"
  | "rfq_step"
  | "rfq_submit_success"
  | "rfq_submit_error"
  | "rfq_validation_error"
  | "rfq_file_added"
  | "contact_click"
  | "contact_submit_success"
  | "calculator_complete"
  | "case_study_view"
  | "industry_view";

type SafeProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = "miit-consent";

export function hasConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function track(event: AnalyticsEvent, props: SafeProps = {}) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GTM_ID || !hasConsent()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...props });
}
