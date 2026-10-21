"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { contactSchema, fieldErrors } from "@/lib/rfq/schema";
import { company } from "@/content/company";
import { track } from "@/lib/analytics";
import { Field, inputClass } from "@/components/rfq/fields";

const TOPICS = ["General enquiry", "Product question", "Project discussion", "Supplier / partnership", "Other"] as const;

export function ContactForm() {
  const router = useRouter();
  const [v, setV] = useState({ name: "", email: "", phone: "", company: "", topic: "General enquiry" as (typeof TOPICS)[number], message: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const meta = useRef({ idempotencyKey: "", startedAt: 0 });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    meta.current = { idempotencyKey: crypto.randomUUID(), startedAt: Date.now() };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const payload = { ...v, consent, meta: { ...meta.current, website } };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setErrors({});
    setBusy(true);
    setServerError(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        track("contact_submit_success");
        router.push(`/contact/received?ref=${encodeURIComponent(data.ref)}`);
        return;
      }
      if (data.fields) setErrors(data.fields);
      setServerError(data.error || "Something went wrong. Please try again.");
    } catch {
      setServerError("We could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="absolute -left-[9999px]" aria-hidden>
        <input tabIndex={-1} autoComplete="off" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <Field label="Name" error={errors.name}>{(p) => <input {...p} autoComplete="name" className={inputClass(errors.name)} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />}</Field>
      <Field label="Email" error={errors.email}>{(p) => <input {...p} type="email" autoComplete="email" className={inputClass(errors.email)} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} />}</Field>
      <Field label="Phone" optional error={errors.phone}>{(p) => <input {...p} type="tel" autoComplete="tel" className={inputClass(errors.phone)} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />}</Field>
      <Field label="Company" optional>{(p) => <input {...p} autoComplete="organization" className={inputClass()} value={v.company} onChange={(e) => setV({ ...v, company: e.target.value })} />}</Field>
      <Field label="Topic" className="sm:col-span-2">
        {(p) => (
          <select {...p} className={inputClass()} value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value as (typeof TOPICS)[number] })}>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
      </Field>
      <Field label="Message" error={errors.message} className="sm:col-span-2">{(p) => <textarea {...p} rows={6} className={inputClass(errors.message)} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />}</Field>
      <label className="flex items-start gap-3 text-sm sm:col-span-2">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={errors.consent ? true : undefined} className="mt-0.5 size-5 accent-[var(--color-blue)]" />
        <span>
          I agree that MIIT CORPORATION may use these details to respond, as described in the <a href="/privacy" className="underline">privacy notice</a>.
          {errors.consent && <span className="mt-1 block font-medium text-danger">{errors.consent}</span>}
        </span>
      </label>
      {serverError && (
        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-danger sm:col-span-2">
          <AlertCircle className="size-4" aria-hidden /> {serverError} You can also email <a className="underline" href={`mailto:${company.email}`}>{company.email}</a>.
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-accent-fill px-7 py-4 font-semibold text-white hover:bg-ink hover:text-paper disabled:opacity-70">
          {busy ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</> : <>Send message <ArrowRight className="size-4" aria-hidden /></>}
        </button>
      </div>
    </form>
  );
}
