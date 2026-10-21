"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, inline ambient loop. The poster renders immediately; the video source is
 * attached only when the element nears the viewport, plays only while visible,
 * and never loads with reduced motion. If playback fails, the poster remains.
 */
export function AmbientVideo({ name, className = "", label }: { name: "product-macro" | "logistics"; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [attach, setAttach] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAttach(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (attach) ref.current?.play().catch(() => {});
  }, [attach]);

  return (
    <video
      ref={ref}
      className={className}
      poster={`/media/loops/${name}-poster.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {attach && <source src={`/media/loops/${name}.webm`} type="video/webm" />}
      {attach && <source src={`/media/loops/${name}.mp4`} type="video/mp4" />}
    </video>
  );
}
