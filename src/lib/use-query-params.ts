"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * URL query string as an external store. The server snapshot is empty, so
 * prerendered HTML is stable; the client re-renders with the real query after
 * hydration. Updates use history.replaceState (supported by the App Router).
 */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useQueryParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const update = useCallback((mutate: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(window.location.search);
    mutate(p);
    const qs = p.toString();
    window.history.replaceState(window.history.state, "", qs ? `?${qs}` : window.location.pathname);
    listeners.forEach((l) => l());
  }, []);
  return [params, update] as const;
}

/** True only after hydration on the client. */
const noop = () => () => {};
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}
