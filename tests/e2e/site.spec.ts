import { expect, test } from "@playwright/test";

test.describe("routes and links", () => {
  test("every sitemap URL renders with a unique title and no console errors", async ({ page, request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(urls.length).toBeGreaterThan(80);
    const titles = new Map<string, string>();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    for (const u of urls) {
      const res = await page.goto(u, { waitUntil: "domcontentloaded" });
      expect(res?.status(), u).toBe(200);
      const t = await page.title();
      expect(t.length, u).toBeGreaterThan(5);
      if (titles.has(t)) throw new Error(`duplicate title "${t}" on ${u} and ${titles.get(t)}`);
      titles.set(t, u);
      expect(await page.locator("h1").count(), u).toBeGreaterThanOrEqual(1);
    }
    expect(errors).toEqual([]);
  });

  test("no broken internal links or images", async ({ page, request }) => {
    const seen = new Set<string>();
    const broken: string[] = [];
    for (const start of ["/", "/products", "/industries", "/resources", "/about", "/procurement", "/case-studies/65-tonne-export-order", "/products/pipes-valves-fittings/flanges"]) {
      await page.goto(start);
      const hrefs = await page.$$eval("a[href^='/'], img[src^='/']", (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? (e as HTMLImageElement).getAttribute("src") ?? ""));
      for (const h of hrefs) {
        const p = h.split("#")[0];
        if (!p || seen.has(p)) continue;
        seen.add(p);
        const r = await request.get(p);
        if (r.status() >= 400) broken.push(`${r.status()} ${p} (from ${start})`);
      }
    }
    expect(broken).toEqual([]);
  });

  test("custom 404", async ({ page }) => {
    const res = await page.goto("/products/not-a-real-category");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /isn’t in the catalogue/ })).toBeVisible();
  });

  test("SEO metadata on a product page", async ({ page }) => {
    await page.goto("/products/pipes-valves-fittings/flanges");
    await expect(page).toHaveTitle(/Flanges/);
    expect(await page.locator("meta[name=description]").getAttribute("content")).toMatch(/flange/i);
    expect(await page.locator("link[rel=canonical]").getAttribute("href")).toMatch(/\/products\/pipes-valves-fittings\/flanges$/);
    const ld = await page.locator("script[type='application/ld+json']").allTextContents();
    expect(ld.some((t) => t.includes("BreadcrumbList"))).toBe(true);
    expect(ld.some((t) => t.includes('"Organization"'))).toBe(true);
  });
});

test.describe("interactions", () => {
  test("catalogue search, filters and empty state", async ({ page }) => {
    await page.goto("/products");
    const search = page.getByPlaceholder(/search products/i);
    await search.fill("flange");
    await expect(page.getByRole("link", { name: /Flanges/ }).first()).toBeVisible();
    await expect(page).toHaveURL(/q=flange/);
    await search.fill("");
    await page.getByLabel("Fasteners").check();
    await expect(page.getByText("3 product families")).toBeVisible();
    await search.fill("zzzzqqq");
    await expect(page.getByText(/No product families match/)).toBeVisible();
    await page.getByRole("button", { name: "Bearings" }).click();
    await expect(page.getByRole("link", { name: /^Bearings/ }).first()).toBeVisible();
  });

  test("product explorer tabs respond to keyboard", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Product families" });
    await tabs.scrollIntoViewIfNeeded();
    const first = tabs.getByRole("tab").first();
    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(tabs.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Pipes, Valves and Fittings");
  });

  test("FAQ accordion and filters", async ({ page }) => {
    await page.goto("/faq");
    const q = page.getByRole("button", { name: "How is product availability confirmed?" });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Procurement", exact: true }).click();
    await expect(page.getByRole("button", { name: "How does the quotation process work?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "How is product availability confirmed?" })).toHaveCount(0);
  });

  test("requirement planner updates and links to the RFQ", async ({ page }) => {
    await page.goto("/procurement#planner");
    await page.getByLabel("Product line items value").fill("200");
    await page.locator("label", { hasText: /^Not yet$/ }).click();
    await expect(page.getByText("Complex", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /submit the requirement/i })).toHaveAttribute("href", /request-quote/);
  });

  test("desktop mega menu opens, closes with Escape", async ({ page }) => {
    await page.goto("/about");
    const btn = page.getByRole("button", { name: "Products" });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#panel-products")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("contact form submits and confirms", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Contact Tester");
    await page.getByLabel("Email").fill("contact@example.com");
    await page.getByLabel("Message").fill("Please share your range of grinding wheels.");
    await page.waitForTimeout(2100);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /send message/i }).click();
    await page.waitForURL(/\/contact\/received\?ref=MIIT-MSG-/);
  });
});

test.describe("mobile @mobile", () => {
  test("mobile menu, no horizontal overflow, quote bar", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await menu.getByRole("button", { name: "Products" }).click();
    await expect(menu.getByRole("link", { name: "Fasteners" })).toBeVisible();
    await page.getByRole("button", { name: "Close menu" }).click();
    for (const p of ["/", "/products", "/request-quote", "/industries/foundries", "/procurement"]) {
      await page.goto(p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, p).toBeLessThanOrEqual(1);
    }
    await page.goto("/about");
    await page.mouse.wheel(0, 1500);
    await expect(page.getByRole("link", { name: "Request a Quote" }).last()).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("film becomes a static hero with all narrative text", async ({ page }) => {
    await page.goto("/");
    const height = await page.locator("section.film").evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeLessThan(2000);
    for (const t of ["The right products.", "The right specifications.", "The right procurement coordination."]) {
      await expect(page.locator(".film-static").getByText(t)).toBeVisible();
    }
    expect(await page.locator("canvas").evaluate((c) => getComputedStyle(c).opacity)).toBe("0");
  });
});
