// Rough lab measurements (local production server): FCP, LCP, CLS, transferred bytes on first load,
// unthrottled and with "Fast 4G"-like throttling. Not a substitute for field data or Lighthouse.
import { chromium } from "@playwright/test";
const url = process.argv[2] || "http://localhost:3200/";
const b = await chromium.launch();
for (const [label, throttle] of [["unthrottled", null], ["fast-4g", { downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8, latency: 60 }]]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  if (throttle) await cdp.send("Network.emulateNetworkConditions", { offline: false, ...throttle });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const m = await page.evaluate(() => {
    const res = performance.getEntriesByType("resource");
    const sum = (f) => Math.round(res.filter(f).reduce((s, r) => s + (r.transferSize || 0), 0) / 1024);
    return {
      fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
      lcp: Math.round(window.__lcp),
      cls: +window.__cls.toFixed(3),
      jsKB: sum((r) => r.name.endsWith(".js")),
      filmFramesLoaded: res.filter((r) => r.name.includes("/media/film/")).length,
      totalKB: sum(() => true),
    };
  });
  console.log(label, JSON.stringify(m));
  await ctx.close();
}
await b.close();
