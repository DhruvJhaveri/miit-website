// Scrolls each page top-to-bottom (triggering reveals and pinned scenes), records
// console/page errors and failed requests, and saves viewport screenshots at intervals.
// Usage: node scripts/qa/shots.mjs <baseUrl> <outDir> <width> <height> <path...>
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const [base = "http://localhost:3100", out = "media-src/qa/pages", w = "1440", h = "900", ...paths] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, ...(+w < 600 ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });
const report = {};
for (const p of paths.length ? paths : ["/"]) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 300)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
  const res = await page.goto(base + p, { waitUntil: "networkidle" }).catch((e) => ({ status: () => String(e) }));
  const slug = p === "/" ? "home" : p.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "");
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = +h;
  let i = 0;
  for (let y = 0; y < total; y += vh * 0.9) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    if (i % 2 === 0) await page.screenshot({ path: `${out}/${slug}-${w}-${String(i).padStart(2, "0")}.png` });
    i++;
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  report[p] = { status: res.status(), height: total, horizontalOverflow: overflow, errors };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
