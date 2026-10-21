"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, ClipboardPaste, Copy, FileUp, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { categories, familyBySlug } from "@/content/categories";
import { company } from "@/content/company";
import { customerSchema, fieldErrors, LIMITS, lineItemSchema, requirementSchema, TIMELINES, UNITS } from "@/lib/rfq/schema";
import { ACCEPT_ATTR, ACCEPT_LABEL, precheckFile } from "@/lib/rfq/files";
import { emptyItem, parsePastedRows, type DraftItem } from "@/lib/rfq/paste";
import { track } from "@/lib/analytics";
import { useIsClient } from "@/lib/use-query-params";
import { Field, inputClass } from "./fields";

const STEPS = ["Your details", "Requirement", "Documents", "Review & submit"] as const;
const DRAFT_KEY = "miit-rfq-draft-v1";

type Customer = { name: string; company: string; email: string; phone: string; role: string };
type Requirement = { deliveryLocation: string; timeline: string; additional: string };
type Errors = Record<string, string>;

const familyNames = categories.flatMap((c) => c.families.map((f) => f.name));

function newIdempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}-${Math.random().toString(36).slice(2, 12)}`;
}

interface Initial {
  customer: Customer;
  items: DraftItem[];
  requirement: Requirement;
  source: string;
  idempotencyKey: string;
  startedAt: number;
}

/** Reads the saved draft and URL prefill (?category=&product=&source=). Client only. */
function loadInitial(embedded: boolean): Initial {
  const params = new URLSearchParams(window.location.search);
  let customer: Customer = { name: "", company: "", email: "", phone: "", role: "" };
  let items: DraftItem[] = [emptyItem()];
  let requirement: Requirement = { deliveryLocation: "", timeline: "", additional: "" };
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d.customer) customer = { ...customer, ...d.customer };
      if (Array.isArray(d.items) && d.items.length) items = d.items.map((it: DraftItem) => ({ ...emptyItem(), ...it }));
      if (d.requirement) requirement = { ...requirement, ...d.requirement };
    }
  } catch {}
  const cat = params.get("category");
  const prod = params.get("product");
  if (cat && categories.some((c) => c.slug === cat)) {
    const fam = prod ? familyBySlug(cat, prod)?.family : undefined;
    const prefill = { category: cat, product: fam?.name ?? "" };
    if (!items.some((p) => p.category === cat && p.product === prefill.product)) {
      items = items.length === 1 && !items[0].product ? [emptyItem(prefill)] : [...items, emptyItem(prefill)];
    }
  }
  return {
    customer,
    items,
    requirement,
    source: params.get("source")?.slice(0, 120) || (embedded ? "homepage" : ""),
    idempotencyKey: newIdempotencyKey(),
    startedAt: Date.now(),
  };
}

/** The form depends on browser-only state (draft, URL), so it renders after hydration. */
export function RfqForm({ embedded = false }: { embedded?: boolean }) {
  const client = useIsClient();
  if (!client) {
    return (
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading quotation form">
        <div className="grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-1 rounded-full bg-ink/10" />)}</div>
        <div className="h-8 w-48 rounded bg-ink/10" />
        <div className="grid gap-5 sm:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-12 rounded-md bg-ink/10" />)}</div>
      </div>
    );
  }
  return <RfqFormInner embedded={embedded} />;
}

function RfqFormInner({ embedded }: { embedded: boolean }) {
  const router = useRouter();
  const [initial] = useState(() => loadInitial(embedded));
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<Customer>(initial.customer);
  const [items, setItems] = useState<DraftItem[]>(initial.items);
  const [requirement, setRequirement] = useState<Requirement>(initial.requirement);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const source = initial.source;
  const meta = useRef({ idempotencyKey: initial.idempotencyKey, startedAt: initial.startedAt, started: false });
  const rootRef = useRef<HTMLDivElement>(null);

  // persist draft locally (never files) — a per-visitor convenience only
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ customer, items, requirement }));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [customer, items, requirement]);

  const markStarted = () => {
    if (meta.current.started) return;
    meta.current.started = true;
    track("rfq_start", { source: source || "direct" });
  };

  const scrollToTop = () => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const focusFirstError = () =>
    requestAnimationFrame(() => {
      const el = rootRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      el?.focus();
    });

  const validateStep = useCallback(
    (s: number): Errors => {
      const errs: Errors = {};
      if (s === 0) {
        const r = customerSchema.safeParse(customer);
        if (!r.success) Object.entries(fieldErrors(r.error)).forEach(([k, v]) => (errs[`customer.${k}`] = v));
      }
      if (s === 1) {
        items.forEach((it, i) => {
          const r = lineItemSchema.safeParse({ ...it, quantity: it.quantity === "" ? undefined : it.quantity });
          if (!r.success) Object.entries(fieldErrors(r.error)).forEach(([k, v]) => (errs[`items.${i}.${k}`] = v));
        });
        if (items.length > LIMITS.maxItems) errs.items = `Up to ${LIMITS.maxItems} line items per request. Upload the rest as a BOM.`;
        const r = requirementSchema.safeParse(requirement);
        if (!r.success) Object.entries(fieldErrors(r.error)).forEach(([k, v]) => (errs[`requirement.${k}`] = v));
      }
      if (s === 3 && !consent) errs.consent = "Please confirm you have read the privacy notice.";
      return errs;
    },
    [customer, items, requirement, consent],
  );

  const goTo = (s: number) => {
    setStep(s);
    setServerError(null);
    track("rfq_step", { step: s + 1 });
    scrollToTop();
  };

  const next = () => {
    markStarted();
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) {
      track("rfq_validation_error", { step: step + 1, count: Object.keys(errs).length });
      focusFirstError();
      return;
    }
    goTo(step + 1);
  };

  const updateItem = (key: string, patch: Partial<DraftItem>) => {
    markStarted();
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  };

  const addFiles = (list: FileList | File[]) => {
    setFileError(null);
    const incoming = Array.from(list);
    const next = [...files];
    for (const f of incoming) {
      const err = precheckFile(f);
      if (err) {
        setFileError(err);
        continue;
      }
      if (next.length >= LIMITS.maxFiles) {
        setFileError(`Attach up to ${LIMITS.maxFiles} files.`);
        break;
      }
      if (next.reduce((s, x) => s + x.size, 0) + f.size > LIMITS.maxTotalBytes) {
        setFileError("Attachments are limited to 25 MB in total.");
        break;
      }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    setFiles(next);
    track("rfq_file_added", { count: next.length });
  };

  const applyPaste = () => {
    const parsed = parsePastedRows(pasteText);
    if (!parsed.length) return;
    setItems((prev) => {
      const keep = prev.filter((p) => p.product.trim());
      return [...keep, ...parsed].slice(0, LIMITS.maxItems);
    });
    setPasteText("");
    setPasteOpen(false);
  };

  const submit = async () => {
    if (submitting) return;
    const all: Errors = { ...validateStep(0), ...validateStep(1), ...validateStep(3) };
    setErrors(all);
    if (Object.keys(all).length) {
      const firstStep = Object.keys(all).some((k) => k.startsWith("customer.")) ? 0 : Object.keys(all).some((k) => k.startsWith("items") || k.startsWith("requirement.")) ? 1 : 3;
      if (firstStep !== step) goTo(firstStep);
      focusFirstError();
      return;
    }
    setSubmitting(true);
    setServerError(null);
    const payload = {
      customer,
      requirement,
      items: items.map((it) => ({ category: it.category, product: it.product, quantity: it.quantity, unit: it.unit, material: it.material, size: it.size, standard: it.standard, brand: it.brand, notes: it.notes })),
      consent: true,
      meta: { idempotencyKey: meta.current.idempotencyKey, startedAt: meta.current.startedAt, website: honeypot, source },
    };
    const fd = new FormData();
    fd.set("payload", JSON.stringify(payload));
    files.forEach((f) => fd.append("files", f));
    const turnstile = rootRef.current?.querySelector<HTMLInputElement>("input[name='cf-turnstile-response']")?.value;
    if (turnstile) fd.set("cf-turnstile-response", turnstile);
    try {
      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string; fields?: Errors };
      if (res.ok && data.ok && data.ref) {
        track("rfq_submit_success", { items: items.length, files: files.length });
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        router.push(`/request-quote/received?ref=${encodeURIComponent(data.ref)}`);
        return;
      }
      track("rfq_submit_error", { status: res.status });
      if (data.fields) {
        const mapped: Errors = {};
        Object.entries(data.fields).forEach(([k, v]) => (mapped[k] = v));
        setErrors(mapped);
        if (Object.keys(mapped).some((k) => k.startsWith("customer."))) goTo(0);
        else if (Object.keys(mapped).some((k) => k.startsWith("items") || k.startsWith("requirement."))) goTo(1);
        else if (mapped.files) goTo(2);
      }
      setServerError(data.error || "Something went wrong. Please try again.");
    } catch {
      track("rfq_submit_error", { status: 0 });
      setServerError("We could not reach the server. Check your connection and try again — your entries are kept.");
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoFallback = useMemo(() => {
    const body = [
      `Name: ${customer.name}`,
      `Company: ${customer.company}`,
      `Phone: ${customer.phone}`,
      "",
      ...items.filter((i) => i.product).map((i, n) => `${n + 1}. ${i.product} — ${i.quantity} ${i.unit} ${[i.material, i.size, i.standard, i.brand].filter(Boolean).join(", ")}`),
      "",
      `Delivery: ${requirement.deliveryLocation} (${requirement.timeline})`,
    ].join("\n");
    return `mailto:${company.email}?subject=${encodeURIComponent("Quotation request")}&body=${encodeURIComponent(body.slice(0, 1800))}`;
  }, [customer, items, requirement]);

  const err = (k: string) => errors[k];

  return (
    <div ref={rootRef} className="scroll-mt-28" onFocusCapture={markStarted}>
      {/* progress */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Quotation request progress">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && goTo(i)}
              aria-current={i === step ? "step" : undefined}
              className="group w-full text-left disabled:cursor-default"
            >
              <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-brand" : "bg-ink/10"}`} />
              <span className={`t-eyebrow mt-3 block text-[0.66rem] ${i === step ? "text-ink" : "text-graphite"}`}>
                {String(i + 1).padStart(2, "0")}
                <span className="hidden sm:inline"> · {label}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) next();
          else submit();
        }}
        className="mt-10"
      >
        {/* honeypot */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
          </label>
        </div>

        {step === 0 && (
          <fieldset>
            <legend className="t-h3">Your details</legend>
            <p className="mt-2 text-sm text-graphite">So the team can respond to your requirement.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={err("customer.name")}>
                {(p) => <input {...p} autoComplete="name" className={inputClass(err("customer.name"))} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />}
              </Field>
              <Field label="Company name" error={err("customer.company")}>
                {(p) => <input {...p} autoComplete="organization" className={inputClass(err("customer.company"))} value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />}
              </Field>
              <Field label="Business email" error={err("customer.email")}>
                {(p) => <input {...p} type="email" inputMode="email" autoComplete="email" className={inputClass(err("customer.email"))} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />}
              </Field>
              <Field label="Phone number" error={err("customer.phone")} hint="Include the country code if outside India.">
                {(p) => <input {...p} type="tel" inputMode="tel" autoComplete="tel" className={inputClass(err("customer.phone"))} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />}
              </Field>
              <Field label="Role or department" optional className="sm:col-span-2">
                {(p) => <input {...p} autoComplete="organization-title" className={inputClass()} value={customer.role} onChange={(e) => setCustomer({ ...customer, role: e.target.value })} />}
              </Field>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-12">
            <fieldset>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <legend className="t-h3">Line items</legend>
                  <p className="mt-2 max-w-[56ch] text-sm text-graphite">Add one line per distinct item. Unknown details can be left blank — the team will clarify. Large lists can be pasted or uploaded as a BOM in the next step.</p>
                </div>
                <button type="button" onClick={() => setPasteOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-ink" aria-expanded={pasteOpen}>
                  <ClipboardPaste className="size-4" aria-hidden /> Paste from spreadsheet
                </button>
              </div>

              {pasteOpen && (
                <div className="mt-6 rounded-md border border-dashed border-ink/25 bg-paper-2 p-5">
                  <label htmlFor="rfq-paste" className="text-sm font-medium">Paste rows from Excel or Google Sheets</label>
                  <p className="mt-1 text-xs text-graphite">Column order: Product · Quantity · Unit · Material/Grade · Size · Standard · Brand · Notes. A header row is ignored.</p>
                  <textarea id="rfq-paste" rows={5} className={`${inputClass()} mt-3 font-mono text-xs`} value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={"Hex bolt M16x60\t600\tnos\tGr 8.8\tM16 x 60\tIS 1364\t\tHDG"} />
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={applyPaste} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">Add {parsePastedRows(pasteText).length || ""} rows</button>
                    <button type="button" onClick={() => setPasteOpen(false)} className="rounded-full px-4 py-2 text-sm">Cancel</button>
                  </div>
                </div>
              )}

              {errors.items && <p className="mt-4 text-sm font-medium text-danger">{errors.items}</p>}

              <datalist id="rfq-families">
                {familyNames.map((n) => <option key={n} value={n} />)}
              </datalist>

              <ol className="mt-8 space-y-4">
                {items.map((it, i) => (
                  <li key={it.key} className="rounded-md border border-ink/12 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="t-eyebrow text-graphite">Item {String(i + 1).padStart(2, "0")}</p>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setItems((p) => [...p.slice(0, i + 1), { ...it, key: emptyItem().key }, ...p.slice(i + 1)])} className="inline-flex size-9 items-center justify-center rounded-full hover:bg-paper-2" title="Duplicate item">
                          <Copy className="size-4" aria-hidden /><span className="sr-only">Duplicate item {i + 1}</span>
                        </button>
                        <button type="button" disabled={items.length === 1} onClick={() => setItems((p) => p.filter((x) => x.key !== it.key))} className="inline-flex size-9 items-center justify-center rounded-full hover:bg-paper-2 disabled:opacity-30" title="Remove item">
                          <Trash2 className="size-4" aria-hidden /><span className="sr-only">Remove item {i + 1}</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
                      <Field label="Product or material" error={err(`items.${i}.product`)} className="lg:col-span-5">
                        {(p) => <input {...p} list="rfq-families" className={inputClass(err(`items.${i}.product`))} value={it.product} onChange={(e) => updateItem(it.key, { product: e.target.value })} placeholder="e.g. Weld-neck flange" />}
                      </Field>
                      <Field label="Category" optional className="lg:col-span-3">
                        {(p) => (
                          <select {...p} className={inputClass()} value={it.category} onChange={(e) => updateItem(it.key, { category: e.target.value })}>
                            <option value="">Not sure</option>
                            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.shortName}</option>)}
                          </select>
                        )}
                      </Field>
                      <Field label="Quantity" error={err(`items.${i}.quantity`)} className="lg:col-span-2">
                        {(p) => <input {...p} inputMode="decimal" className={inputClass(err(`items.${i}.quantity`))} value={it.quantity} onChange={(e) => updateItem(it.key, { quantity: e.target.value.replace(/[^0-9.]/g, "") })} />}
                      </Field>
                      <Field label="Unit" error={err(`items.${i}.unit`)} className="lg:col-span-2">
                        {(p) => (
                          <select {...p} className={inputClass(err(`items.${i}.unit`))} value={it.unit} onChange={(e) => updateItem(it.key, { unit: e.target.value })}>
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        )}
                      </Field>
                      <Field label="Material or grade" optional className="lg:col-span-3">
                        {(p) => <input {...p} className={inputClass()} value={it.material} onChange={(e) => updateItem(it.key, { material: e.target.value })} />}
                      </Field>
                      <Field label="Size or dimensions" optional className="lg:col-span-3">
                        {(p) => <input {...p} className={inputClass()} value={it.size} onChange={(e) => updateItem(it.key, { size: e.target.value })} />}
                      </Field>
                      <Field label="Standard or specification" optional className="lg:col-span-3">
                        {(p) => <input {...p} className={inputClass()} value={it.standard} onChange={(e) => updateItem(it.key, { standard: e.target.value })} />}
                      </Field>
                      <Field label="Brand preference" optional className="lg:col-span-3">
                        {(p) => <input {...p} className={inputClass()} value={it.brand} onChange={(e) => updateItem(it.key, { brand: e.target.value })} />}
                      </Field>
                      <Field label="Notes" optional className="sm:col-span-2 lg:col-span-12">
                        {(p) => <input {...p} className={inputClass()} value={it.notes} onChange={(e) => updateItem(it.key, { notes: e.target.value })} placeholder="Finish, end connection, certificate needs, drawing reference…" />}
                      </Field>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setItems((p) => [...p, emptyItem({ category: p[p.length - 1]?.category ?? "" })])}
                  disabled={items.length >= LIMITS.maxItems}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-blue disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden /> Add item
                </button>
                <p className="text-sm text-graphite" aria-live="polite">{items.length} line item{items.length === 1 ? "" : "s"}</p>
              </div>
            </fieldset>

            <fieldset>
              <legend className="t-h3">Delivery</legend>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Delivery location" error={err("requirement.deliveryLocation")} hint="City, site or port.">
                  {(p) => <input {...p} autoComplete="address-level2" className={inputClass(err("requirement.deliveryLocation"))} value={requirement.deliveryLocation} onChange={(e) => setRequirement({ ...requirement, deliveryLocation: e.target.value })} />}
                </Field>
                <Field label="Desired timeline" error={err("requirement.timeline")}>
                  {(p) => (
                    <select {...p} className={inputClass(err("requirement.timeline"))} value={requirement.timeline} onChange={(e) => setRequirement({ ...requirement, timeline: e.target.value })}>
                      <option value="">Select…</option>
                      {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </Field>
                <Field label="Additional requirements" optional className="sm:col-span-2" hint="Packing, marking, documentation, inspection or anything else the team should know.">
                  {(p) => <textarea {...p} rows={4} className={inputClass()} value={requirement.additional} onChange={(e) => setRequirement({ ...requirement, additional: e.target.value })} />}
                </Field>
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="t-h3">Documents</legend>
            <p className="mt-2 max-w-[60ch] text-sm text-graphite">Optional. Attach a bill of materials, requirement sheet, drawings, specifications or reference images. {ACCEPT_LABEL}; up to {LIMITS.maxFiles} files, 10 MB each, 25 MB total.</p>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className={`mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-6 py-14 text-center transition-colors hover:border-blue hover:bg-white ${errors.files ? "border-danger" : "border-ink/20"}`}
            >
              <FileUp className="size-7 text-blue" aria-hidden />
              <span className="font-medium">Drop files here or <span className="text-blue underline">browse</span></span>
              <span className="text-xs text-graphite">{ACCEPT_LABEL}</span>
              <input type="file" multiple accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => e.target.files && addFiles(e.target.files)} />
            </label>
            {(fileError || errors.files) && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-danger" role="alert"><AlertCircle className="size-4" aria-hidden /> {fileError || errors.files}</p>
            )}
            {files.length > 0 && (
              <ul className="mt-6 divide-y divide-ink/10 rounded-md border border-ink/12 bg-white">
                {files.map((f) => (
                  <li key={f.name + f.size} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="min-w-0 truncate">{f.name}</span>
                    <span className="flex shrink-0 items-center gap-3 text-graphite">
                      {(f.size / 1024 / 1024).toFixed(2)} MB
                      <button type="button" onClick={() => setFiles((p) => p.filter((x) => x !== f))} className="inline-flex size-8 items-center justify-center rounded-full hover:bg-paper-2">
                        <X className="size-4" aria-hidden /><span className="sr-only">Remove {f.name}</span>
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <ReviewBlock title="Your details" onEdit={() => goTo(0)}>
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {(
                  [
                    ["Name", customer.name],
                    ["Company", customer.company],
                    ["Email", customer.email],
                    ["Phone", customer.phone],
                    ["Role", customer.role || "—"],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}><dt className="text-graphite">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
            </ReviewBlock>
            <ReviewBlock title={`Line items (${items.length})`} onEdit={() => goTo(1)}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-graphite">
                    <tr className="border-b border-ink/10">
                      <th className="py-2 pr-3 font-normal">#</th><th className="py-2 pr-3 font-normal">Product</th><th className="py-2 pr-3 font-normal">Specification</th><th className="py-2 pr-3 text-right font-normal">Qty</th><th className="py-2 font-normal">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={it.key} className="border-b border-ink/5 align-top">
                        <td className="py-2.5 pr-3 text-graphite">{i + 1}</td>
                        <td className="py-2.5 pr-3 font-medium">{it.product}{it.notes && <span className="block text-xs font-normal text-graphite">{it.notes}</span>}</td>
                        <td className="py-2.5 pr-3 text-graphite">{[it.material, it.size, it.standard, it.brand].filter(Boolean).join(" · ") || "—"}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums">{it.quantity}</td>
                        <td className="py-2.5">{it.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm"><span className="text-graphite">Delivery:</span> {requirement.deliveryLocation} · {requirement.timeline}</p>
              {requirement.additional && <p className="mt-1 text-sm text-graphite">{requirement.additional}</p>}
            </ReviewBlock>
            <ReviewBlock title={`Documents (${files.length})`} onEdit={() => goTo(2)}>
              <p className="text-sm text-graphite">{files.length ? files.map((f) => f.name).join(", ") : "No documents attached."}</p>
            </ReviewBlock>

            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />}

            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={errors.consent ? true : undefined} className="mt-0.5 size-5 accent-[var(--color-blue)]" />
              <span>
                I agree that MIIT CORPORATION may use these details to respond to this request, as described in the <a href="/privacy" target="_blank" className="underline">privacy notice</a>.
                {errors.consent && <span className="mt-1 block font-medium text-danger">{errors.consent}</span>}
              </span>
            </label>
          </div>
        )}

        {serverError && (
          <div role="alert" className="mt-8 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium text-danger"><AlertCircle className="size-4" aria-hidden /> {serverError}</p>
            <p className="mt-2 text-graphite">
              You can also email your requirement to <a href={mailtoFallback} className="underline">{company.email}</a> or call <a href={`tel:${company.phones[0].tel}`} className="underline">{company.phones[0].display}</a>.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium hover:bg-paper-2">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={submitting}
            aria-disabled={submitting}
            className="inline-flex min-w-48 items-center justify-center gap-2 rounded-full bg-accent-fill px-7 py-4 font-semibold text-white transition-colors hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <><Loader2 className="size-4 animate-spin" aria-hidden /> Submitting…</>
            ) : step < 3 ? (
              <>Continue <ArrowRight className="size-4" aria-hidden /></>
            ) : (
              <>Submit request <ArrowRight className="size-4" aria-hidden /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-ink/12 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 text-sm text-blue hover:underline">
          <Pencil className="size-3.5" aria-hidden /> Edit
        </button>
      </div>
      {children}
    </section>
  );
}

function Turnstile({ siteKey }: { siteKey: string }) {
  useEffect(() => {
    if (document.getElementById("cf-turnstile")) return;
    const s = document.createElement("script");
    s.id = "cf-turnstile";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);
  return <div className="cf-turnstile" data-sitekey={siteKey} />;
}
