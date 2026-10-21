// Visual QA for the scroll film: forward/reverse scrubbing, mobile, reduced motion,
// failed media. Usage: node scripts/qa/film-check.mjs [baseUrl] [outDir]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:3100";
const out = process.argv[3] || "media-src/qa";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const report = [];

async function filmRange(page) {
  return page.evaluate(() => {
    const s = document.querySelector("section.film");
    const top = s.getBoundingClientRect().top + scrollY;
    return { top, len: s.offsetHeight - innerHeight };
  });
}

async function scrubTo(page, range, p) {
  await page.evaluate((y) => window.scrollTo(0, y), range.top + range.len * p);
  await page.waitForTimeout(900);
}

async function run(name, ctxOpts, { block = false, points = [0, 0.12, 0.2, 0.3, 0.42, 0.5, 0.6, 0.7, 0.78, 0.9, 1] } = {}) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  if (block) await page.route("**/media/film/**", (r) => r.abort());
  const t0 = Date.now();
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1");
  const heroMs = Date.now() - t0;
  await page.waitForTimeout(2500);
  const range = await filmRange(page);
  for (const p of points) {
    await scrubTo(page, range, p);
    await page.screenshot({ path: `${out}/${name}-${String(Math.round(p * 100)).padStart(3, "0")}.png` });
  }
  // reverse + rapid scrolling
  for (const p of [0.8, 0.1, 0.65, 0.05, 0.45]) await page.evaluate((y) => window.scrollTo(0, y), range.top + range.len * p);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${name}-reverse-045.png` });
  const loaded = await page.evaluate(() => performance.getEntriesByType("resource").filter((r) => r.name.includes("/media/film/")).length);
  report.push({ name, heroMs, filmScrollLength: Math.round(range.len), filmRequests: loaded, errors });
  await ctx.close();
}

await run("desktop", { viewport: { width: 1440, height: 900 } });
await run("mobile", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, { points: [0, 0.3, 0.5, 0.7, 0.9] });
await run("reduced", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }, { points: [0, 0.5, 1] });
await run("blocked-media", { viewport: { width: 1440, height: 900 } }, { block: true, points: [0, 0.5] });

await browser.close();
console.log(JSON.stringify(report, null, 2));
