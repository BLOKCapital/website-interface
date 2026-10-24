// LCP element + time per route at 375, CPU 4x, ~slow 4G. Usage: node lcp.mjs <base>
import { chromium } from "playwright";
const BASE = process.argv[2] ?? "http://localhost:4173";
const ROUTES = ["/", "/about", "/protocol", "/indices", "/indices/blokc5", "/security", "/token", "/governance", "/contact", "/legal/cookie-policy"];
const browser = await chromium.launch({ channel: "chrome" });
for (const r of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { const el = e.element; window.__lcp.push({ t: Math.round(e.startTime), render: Math.round(e.renderTime), load: Math.round(e.loadTime), size: e.size, el: el ? (el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + "." + [...el.classList].slice(0, 4).join(".") + " «" + (el.textContent || el.currentSrc || "").trim().slice(0, 50) + "»") : e.url }); } }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(BASE + r, { waitUntil: "load" });
  await page.waitForTimeout(3500);
  const res = await page.evaluate(() => ({ lcp: window.__lcp, fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1) }));
  const last = res.lcp.at(-1);
  console.log(`${r.padEnd(22)} FCP ${res.fcp}ms  LCP ${last?.t}ms  ${last?.el}  (candidates: ${res.lcp.map((x) => x.t).join(",")})`);
  await ctx.close();
}
await browser.close();
