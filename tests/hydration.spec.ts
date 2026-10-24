import type { Page } from "@playwright/test";
import { expect, test, waitForHydration } from "./support/fixtures";
import { ROUTES } from "./support/routes";

/**
 * Hydration under load (opt-in stress test, `STRESS=1`).
 *
 * The bug: under heavy machine load, routes.spec.ts sometimes logged React
 * error #418, a hydration mismatch. On a quiet machine it never appeared.
 *
 * The cause: the root layout's `<main>` holds the page element, and that
 * element waits on the root error boundary's chunk (app/error-*.js). When
 * hydration reaches `<main>` before that chunk has run, it suspends inside
 * `<main>`. React 19.2 then replays `<main>` without rewinding its hydration
 * cursor, so it tries to claim the `<div>` inside `<main>` as a second
 * `<main>`. It throws #418 and re-renders the whole page on the client
 * (facebook/react#35494, fixed upstream after 19.2). The keyed Fragment in
 * app/layout.tsx moves that suspension off the host element.
 *
 * The test doesn't load the machine. It holds the error chunk back instead,
 * so it arrives after hydration has started, as it does when the machine is
 * loaded. Each load is then a race, lost about 1 time in 12 before the fix.
 * The run does enough loads (6 per route by default) that one would fail
 * the test before the fix.
 *
 *   STRESS=1 npx playwright test --grep @stress
 *   STRESS=1 STRESS_LOADS=300 npx playwright test --grep @stress
 */

const LOADS = Number(process.env.STRESS_LOADS ?? ROUTES.length * 6);
const PARALLEL = 6;
/** How long the error chunk is held back: a random spread, so the race varies. */
const HOLD_MS: [number, number] = [300, 1500];

const isHydrationError = (text: string) => /Minified React error #(418|423|425)\b|Hydration failed|didn't match/i.test(text);

/**
 * Loads `route` and reports any hydration error, and whether React threw the
 * server DOM away. A load that doesn't hydrate in time (a starved machine)
 * is reported as timed out rather than thrown, so one slow page doesn't end
 * the run.
 */
async function load(page: Page, route: string) {
  const errors: string[] = [];
  const record = (text: string) => {
    if (isHydrationError(text)) errors.push(text.split("; visit")[0]);
  };
  page.on("pageerror", (e) => record(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") record(m.text());
  });
  // The <main> the parser built. Hydration keeps it; a client re-render replaces it.
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { __parsedMain: Element | null }).__parsedMain = document.getElementById("main");
    });
  });
  try {
    await page.goto(route);
    await waitForHydration(page);
  } catch {
    return { errors, replaced: false, timedOut: true };
  }
  // A recovered mismatch is reported when its client re-render commits.
  await page.waitForTimeout(300);
  const replaced = await page.evaluate(() => {
    const parsed = (window as unknown as { __parsedMain: Element | null }).__parsedMain;
    return !!parsed && parsed !== document.getElementById("main");
  });
  return { errors, replaced, timedOut: false };
}

test.describe("hydration under load", () => {
  test.skip(!process.env.STRESS, "Opt-in stress test: STRESS=1 npx playwright test --grep @stress");

  test(`${LOADS} loads with a late error-boundary chunk: no hydration mismatch`, { tag: "@stress" }, async ({ newIsolatedContext }) => {
    test.setTimeout(Math.max(120_000, LOADS * 15_000));
    const failures: string[] = [];
    const timedOut: string[] = [];
    let next = 0;

    const worker = async () => {
      while (next < LOADS) {
        const i = next++;
        const route = ROUTES[i % ROUTES.length];
        const context = await newIsolatedContext();
        await context.route(/\/_next\/static\/chunks\/app\/error-[^/]*\.js$/, async (r) => {
          const [min, max] = HOLD_MS;
          await new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
          await r.continue().catch(() => {
            /* The context closed first. */
          });
        });
        const page = await context.newPage();
        const result = await load(page, route);
        await context.close();
        if (result.errors.length || result.replaced) {
          failures.push(
            `${route} (load ${i + 1}): ${result.errors.join(" | ") || "no error logged"}${result.replaced ? "; <main> was re-rendered" : ""}`,
          );
        }
        if (result.timedOut) timedOut.push(`${route} (load ${i + 1})`);
      }
    };
    await Promise.all(Array.from({ length: PARALLEL }, worker));

    test.info().annotations.push({
      type: "loads",
      description: `${LOADS}: ${failures.length} with a mismatch, ${timedOut.length} not hydrated within 60 s`,
    });
    expect(failures, `hydration mismatches in ${LOADS} loads`).toEqual([]);
    // Too many timeouts and the run proves nothing.
    expect(timedOut.length, `loads that never hydrated: ${timedOut.join(", ")}`).toBeLessThanOrEqual(Math.floor(LOADS / 10));
  });
});
