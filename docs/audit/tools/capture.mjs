// Baseline capture: full-page screenshots, axe (WCAG 2.2 AA tags), console
// errors, horizontal overflow, CLS observed during scroll-through.
// Usage: node capture.mjs <baseUrl> <outDir> [label]
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4173";
const OUT = process.argv[3];
const LABEL = process.argv[4] ?? "baseline";
const ROUTES = [
  "/", "/about", "/protocol", "/indices", "/indices/blokc2", "/indices/blokc5", "/indices/blokc10",
  "/security", "/token", "/governance", "/contact",
  "/legal/cookie-policy", "/legal/acceptable-use", "/legal/user-agreement", "/this-page-does-not-exist",
];
const WIDTHS = [375, 768, 1280, 1920];
const OVERFLOW_WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];
const slug = (r) => (r === "/" ? "home" : r.slice(1).replace(/\//g, "_"));

fs.mkdirSync(path.join(OUT, "screenshots"), { recursive: true });
const results = { label: LABEL, base: BASE, at: new Date().toISOString(), routes: {} };

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function scrollThrough(page) {
  // The site sets `scroll-behavior: smooth`, so every jump must be explicit
  // `instant` or the page is still mid-scroll when the screenshot fires.
  await page.evaluate(async () => {
    const go = (top) => window.scrollTo({ top, left: 0, behavior: "instant" });
    const step = Math.max(200, Math.floor(innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      go(y);
      await new Promise((r) => setTimeout(r, 120));
    }
    go(document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    go(0);
    await new Promise((r) => setTimeout(r, 900));
  });
}

await Promise.all(WIDTHS.map(async (width) => {
  const height = width < 768 ? 812 : width < 1280 ? 1024 : 900;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  const page = await ctx.newPage();

  // First visit: capture the above-the-fold view including the consent banner, then reject.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, "screenshots", `first-visit_${width}.jpg`), type: "jpeg", quality: 70 });
  const reject = page.getByRole("button", { name: "Reject all" });
  if (await reject.count()) await reject.first().click();

  for (const route of ROUTES) {
    const key = route;
    const r = (results.routes[key] ??= { widths: {} });
    const consoleErrors = [];
    const onConsole = (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300)); };
    const onPageError = (e) => consoleErrors.push("pageerror: " + String(e).slice(0, 300));
    const failed = [];
    const onFailed = (req) => failed.push(`${req.failure()?.errorText} ${req.url().slice(0, 150)}`);
    const onResp = (res) => { if (res.status() >= 400 && !res.url().includes("does-not-exist")) failed.push(`${res.status()} ${res.url().slice(0, 150)}`); };
    page.on("console", onConsole); page.on("pageerror", onPageError); page.on("requestfailed", onFailed); page.on("response", onResp);

    const resp = await page.goto(BASE + route, { waitUntil: "networkidle" }).catch((e) => ({ status: () => "ERR " + e.message }));
    await page.evaluate(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    });
    await scrollThrough(page);
    const metrics = await page.evaluate(() => ({
      cls: Number(window.__cls.toFixed(4)),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      title: document.title,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().slice(0, 120)),
      metaDescription: document.querySelector('meta[name="description"]')?.content ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      images: document.images.length,
      imagesNoAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
      links: document.querySelectorAll("a[href]").length,
      domNodes: document.getElementsByTagName("*").length,
    }));
    await page.screenshot({ path: path.join(OUT, "screenshots", `${slug(route)}_${width}.jpg`), type: "jpeg", quality: 70, fullPage: true });

    let axe = null;
    if (width === 375 || width === 1280) {
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      axe = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help, targets: v.nodes.slice(0, 4).map((n) => n.target.join(" ")) }));
    }
    r.status = typeof resp?.status === "function" ? resp.status() : null;
    r.widths[width] = { ...metrics, consoleErrors: [...new Set(consoleErrors)], failedRequests: [...new Set(failed)], axe };
    page.off("console", onConsole); page.off("pageerror", onPageError); page.off("requestfailed", onFailed); page.off("response", onResp);
    process.stdout.write(`${width} ${route} cls=${metrics.cls} sw=${metrics.scrollWidth} err=${consoleErrors.length} axe=${axe ? axe.length : "-"}\n`);
  }
  await ctx.close();
}));

// Horizontal overflow sweep (no screenshots).
const overflow = {};
await Promise.all(OVERFLOW_WIDTHS.map(async (width) => {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const o = await page.evaluate(() => {
      const iw = document.documentElement.clientWidth;
      const offenders = [];
      if (document.documentElement.scrollWidth > iw) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.right > iw + 1 && b.width > 0 && getComputedStyle(el).position !== "fixed") offenders.push((el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 3).join(".")).slice(0, 80));
          if (offenders.length > 5) break;
        }
      }
      return { scrollWidth: document.documentElement.scrollWidth, clientWidth: iw, offenders };
    });
    if (o.scrollWidth > o.clientWidth) (overflow[route] ??= {})[width] = o;
  }
  await ctx.close();
}));
results.overflow = overflow;

// Reduced-motion check: everything visible without scrolling-triggered reveals?
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  results.reducedMotion = {};
  for (const route of ROUTES.slice(0, 11)) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    results.reducedMotion[route] = await page.evaluate(() => {
      const hidden = [...document.querySelectorAll("[data-reveal],[data-reveal-item],[data-split]")].filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length;
      const running = document.getAnimations().filter((a) => a.playState === "running" && (a.effect?.getTiming().iterations === Infinity)).length;
      return { hiddenRevealTargets: hidden, infiniteAnimationsRunning: running };
    });
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, "capture.json"), JSON.stringify(results, null, 2));
console.log("done");
