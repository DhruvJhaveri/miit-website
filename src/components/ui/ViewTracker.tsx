"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Fires one analytics event when a page mounts (no-op without consent). */
export function ViewTracker({ event, props }: { event: AnalyticsEvent; props?: Record<string, string> }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    track(event, JSON.parse(key));
  }, [event, key]);
  return null;
}
