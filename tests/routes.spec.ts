import type { ConsoleMessage, Page } from "@playwright/test";
import { expect, scrollThrough, test, waitForHydration } from "./support/fixtures";
import { NOT_FOUND_ROUTE, ROUTES } from "./support/routes";

/**
 * Smoke: every route answers with the right status, renders without console
 * errors, and every in-page or cross-page hash link lands on an element that
 * exists.
 */

/** Collect console errors and uncaught exceptions, minus the expected noise. */
function watchErrors(page: Page, route: string) {
  const errors: string[] = [];
  const isNoise = (msg: ConsoleMessage) => {
    const text = msg.text();
    const at = msg.location().url;
    // Requests the fixture blocked on purpose (RPC, YouTube, Google, …).
    if (text.includes("net::ERR_BLOCKED_BY_CLIENT")) return true;
    if (text.startsWith("Failed to load resource") && at && !/^https?:\/\/localhost[:/]/.test(at)) return true;
    // The 404 route's own document is a 404 by design.
    if (route === NOT_FOUND_ROUTE && text.includes("status of 404") && at.endsWith(route)) return true;
    return false;
  };
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isNoise(msg)) errors.push(`console: ${msg.text()} (${msg.location().url})`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

for (const route of ROUTES) {
  const status = route === NOT_FOUND_ROUTE ? 404 : 200;

  test(`${route} returns ${status} and logs no console errors`, async ({ page }) => {
    const errors = watchErrors(page, route);
    const response = await page.goto(route);
    expect(response?.status()).toBe(status);
    await waitForHydration(page);
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });
}

test("every hash link points at an id that exists", async ({ page, baseURL }) => {
  test.setTimeout(120_000);
  // target path -> id -> pages that link to it
  const wanted = new Map<string, Map<string, Set<string>>>();

  for (const route of ROUTES) {
    await page.goto(route);
    await waitForHydration(page);
    const hrefs = await page.$$eval("a[href*='#']", (links) => links.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(baseURL!).origin || url.hash.length < 2) continue;
      const path = url.pathname.replace(/\/$/, "") || "/";
      const id = decodeURIComponent(url.hash.slice(1));
      const ids = wanted.get(path) ?? wanted.set(path, new Map()).get(path)!;
      (ids.get(id) ?? ids.set(id, new Set()).get(id)!).add(route);
    }
  }

  const missing: string[] = [];
  for (const [path, ids] of wanted) {
    await page.goto(path);
    await waitForHydration(page);
    const absent = await page.evaluate((list) => list.filter((id) => !document.getElementById(id)), [...ids.keys()]);
    for (const id of absent) missing.push(`${path}#${id} (linked from ${[...ids.get(id)!].join(", ")})`);
  }

  expect(wanted.size, "found hash links to check").toBeGreaterThan(0);
  expect(missing).toEqual([]);
});
