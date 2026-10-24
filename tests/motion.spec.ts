import { expect, test, waitForHydration } from "./support/fixtures";
import { PRIMARY_ROUTES } from "./support/routes";

/**
 * Motion contract (IMPROVEMENT_PLAN §3.4).
 *
 * Reduced motion: nothing waits on a reveal, nothing loops, nothing glides.
 * Performance gate (opt-in, `PERF=1`): the LCP candidate is visible at first
 * paint, measured as LCP − FCP on a throttled phone profile.
 */

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  for (const route of PRIMARY_ROUTES) {
    test(`${route}: no hidden reveal targets, no infinite animations, no smooth scroll`, async ({ page }) => {
      await page.goto(route);
      expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), "emulating reduced motion").toBe(true);
      await waitForHydration(page);
      await page.waitForTimeout(500);
      const state = await page.evaluate(() => ({
        hiddenRevealTargets: [...document.querySelectorAll("[data-reveal],[data-reveal-item],[data-split]")]
          .filter((el) => Number(getComputedStyle(el).opacity) < 0.99)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")}`),
        infiniteAnimations: document
          .getAnimations()
          .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity)
          .map((a) => (a as CSSAnimation).animationName ?? a.id ?? "animation"),
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      }));
      expect(state.hiddenRevealTargets, "reveal targets below 0.99 opacity").toEqual([]);
      expect(state.infiniteAnimations, "infinite animations running").toEqual([]);
      expect(state.scrollBehavior).toBe("auto");
    });
  }
});

/* ---------- LCP gate (opt-in) ------------------------------------------------ */

const PERF_ROUTES = ["/", "/protocol", "/token", "/about"];
const RUNS = 3;

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

test.describe("LCP gate", () => {
  test.skip(!process.env.PERF, "Opt-in timing gate: PERF=1 npx playwright test --grep @perf");

  for (const route of PERF_ROUTES) {
    test(`${route}: LCP − FCP ≤ 50 ms (412×823, DPR 1.75, 4× CPU, 1.6 Mbps)`, { tag: "@perf" }, async ({ newIsolatedContext }) => {
      test.setTimeout(RUNS * 60_000);

      const gaps: number[] = [];
      for (let run = 0; run < RUNS; run++) {
        // A fresh context per run: cold cache, like a first visit.
        const context = await newIsolatedContext({
          viewport: { width: 412, height: 823 },
          deviceScaleFactor: 1.75,
          isMobile: true,
          hasTouch: true,
        });
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        await cdp.send("Network.enable");
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
        await cdp.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 150,
          downloadThroughput: (1.6 * 1024 * 1024) / 8,
          uploadThroughput: (750 * 1024) / 8,
        });
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        // Same observer as docs/audit/tools/lcp.mjs.
        await page.addInitScript(() => {
          const w = window as unknown as { __lcp: number[] };
          w.__lcp = [];
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) w.__lcp.push(entry.startTime);
          }).observe({ type: "largest-contentful-paint", buffered: true });
        });
        await page.goto(route, { waitUntil: "load", timeout: 45_000 });
        await page.waitForTimeout(3000);
        const { fcp, lcp } = await page.evaluate(() => ({
          fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1,
          lcp: (window as unknown as { __lcp: number[] }).__lcp.at(-1) ?? -1,
        }));
        expect(fcp, "FCP recorded").toBeGreaterThan(0);
        expect(lcp, "LCP recorded").toBeGreaterThan(0);
        gaps.push(Math.round(lcp - fcp));
        await context.close();
      }
      test.info().annotations.push({ type: "LCP − FCP (ms)", description: gaps.join(", ") });
      expect(median(gaps), `median LCP − FCP over ${RUNS} runs (${gaps.join(", ")} ms)`).toBeLessThanOrEqual(50);
    });
  }
});
