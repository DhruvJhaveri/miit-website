"use client";

import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("en-IN");

/**
 * Counts up once when visible. The final value is server-rendered, so it is
 * correct without JS, for screen readers and with reduced motion.
 */
export function CountUp({ value, suffix = "", duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          setShown(Math.round(value * (1 - Math.pow(1 - k, 4))));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        setShown(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={`${fmt.format(value)}${suffix}`}>
      <span aria-hidden>
        {fmt.format(shown)}
        {suffix}
      </span>
    </span>
  );
}
