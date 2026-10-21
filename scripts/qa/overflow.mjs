// Lists elements extending beyond the viewport width on a mobile device (horizontal overflow hunt).
// Usage: node scripts/qa/overflow.mjs <url>
import { chromium, devices } from "@playwright/test";
const url = process.argv[2] || "http://localhost:3200/";
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices["Pixel 7"] })).newPage();
await p.goto(url);
await p.waitForTimeout(1500);
const res = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > 412 + 1 && r.width > 0) {
      if (el.closest("header, #mobile-menu") || getComputedStyle(el).position === "fixed") continue;
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (["hidden", "auto", "scroll", "clip"].includes(s.overflowX) && a.getBoundingClientRect().right <= 413) { clipped = true; break; }
      }
      if (!clipped) out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 80)} right=${Math.round(r.right)}`);
    }
  }
  return { vw, innerWidth, list: out.slice(0, 15) };
});
console.log(JSON.stringify(res, null, 1));
await b.close();
