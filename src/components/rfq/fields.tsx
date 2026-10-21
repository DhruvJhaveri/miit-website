"use client";

import { useId } from "react";

const base =
  "w-full rounded-md border bg-white px-3.5 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-graphite/60 focus:border-blue focus:ring-2 focus:ring-blue/20";

export function Field({
  label,
  error,
  hint,
  optional,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-graphite">Optional</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-graphite">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function inputClass(error?: string) {
  return `${base} ${error ? "border-danger" : "border-ink/15"}`;
}
