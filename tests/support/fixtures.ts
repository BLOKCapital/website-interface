import { test as base, expect, type BrowserContext, type BrowserContextOptions, type Page } from "@playwright/test";
import { GTAG_EMULATOR } from "./gtag-emulator";

/**
 * Tests that describe correct behaviour the site doesn't have yet are marked
 * `test.fixme(FIXME, "<finding ID>: …")`. The fixing agent deletes that line.
 * Set RUN_FIXME=1 to run them anyway and see which now pass.
 */
export const FIXME = !process.env.RUN_FIXME;

/**
 * How requests for the Google tag (www.googletagmanager.com/gtag/js) are
 * answered. Every other non-localhost request is always aborted.
 * - "block": aborted like everything else (default);
 * - "empty": an empty 200 script, so the attempt is observable and harmless;
 * - "emulate": a minimal gtag.js stand-in (support/gtag-emulator.ts) that
 *   sends page_view hits the way the real tag does.
 */
export type GtagMode = "block" | "empty" | "emulate";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const GOOGLE_HOST = /(^|\.)(google|googletagmanager|google-analytics|googleadservices|googlesyndication|doubleclick|gstatic|googleapis)\.[a-z.]+$/;

/** Every non-localhost request a page attempted (all of them were blocked). */
export class ExternalRequests {
  readonly urls: string[] = [];
  add(url: string) {
    this.urls.push(url);
  }
  clear() {
    this.urls.length = 0;
  }
  google() {
    return this.urls.filter((u) => GOOGLE_HOST.test(new URL(u).hostname));
  }
  matching(re: RegExp) {
    return this.urls.filter((u) => re.test(u));
  }
}

/** Abort every request that leaves localhost, recording it first. */
export async function isolate(context: BrowserContext, log: ExternalRequests, gtag: GtagMode) {
  await context.route(
    (url) => !LOCAL_HOSTS.has(url.hostname) && /^https?:$/.test(url.protocol),
    (route) => {
      const url = new URL(route.request().url());
      log.add(url.href);
      if (gtag !== "block" && url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
        return route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: gtag === "emulate" ? GTAG_EMULATOR : "",
        });
      }
      return route.abort("blockedbyclient");
    },
  );
}

type Fixtures = {
  /** How the Google tag is answered for this test (see GtagMode). */
  gtag: GtagMode;
  /** Non-localhost requests attempted by any page in this test's context. */
  external: ExternalRequests;
  /** A fresh, isolated context for tests that need several (cold caches, widths). */
  newIsolatedContext: (options?: BrowserContextOptions) => Promise<BrowserContext>;
};

export const test = base.extend<Fixtures>({
  gtag: ["block", { option: true }],

  external: [
    async ({ context, gtag }, provide) => {
      const log = new ExternalRequests();
      await isolate(context, log, gtag);
      await provide(log);
    },
    { auto: true },
  ],

  newIsolatedContext: async ({ browser, gtag, external, baseURL }, provide) => {
    const made: BrowserContext[] = [];
    await provide(async (options = {}) => {
      const context = await browser.newContext({ baseURL, ...options });
      await isolate(context, external, gtag);
      made.push(context);
      return context;
    });
    for (const context of made) await context.close();
  },
});

export { expect };

/* ---------- page helpers --------------------------------------------------- */

/**
 * Wait until React has hydrated the page, so that clicks and key presses
 * reach their handlers. React tags every hydrated host node with a
 * `__reactFiber$…` key; effects run one task later.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(
    () => {
      const main = document.getElementById("main");
      return !!main && Object.keys(main).some((k) => k.startsWith("__reactFiber$"));
    },
    undefined,
    { timeout: 60_000 },
  );
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50))));
}

/** The banner's "Reject all" button (only rendered before a choice is made). */
export const rejectAllButton = (page: Page) => page.getByRole("button", { name: "Reject all", exact: true }).first();

/** Dismiss the cookie banner the way a visitor would: "Reject all". */
export async function rejectCookies(page: Page) {
  const reject = rejectAllButton(page);
  await reject.click();
  await expect(reject).toBeHidden();
}

/** Open `route` with the cookie banner already answered "Reject all". */
export async function openWithConsentRejected(page: Page, route: string) {
  await page.goto(route);
  await rejectCookies(page);
  await waitForHydration(page);
}

/**
 * Scroll to the bottom and back so every scroll reveal fires. The site sets
 * `scroll-behavior: smooth`, so every jump is explicitly `instant`.
 */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const go = (top: number) => window.scrollTo({ top, left: 0, behavior: "instant" });
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(200, Math.floor(innerHeight * 0.6));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      go(y);
      await wait(100);
    }
    go(document.documentElement.scrollHeight);
    await wait(300);
    go(0);
  });
  await settleAnimations(page);
}

/**
 * Wait (up to `timeout`) until no finite animation or transition is running,
 * so axe and layout checks see final states rather than mid-fade ones.
 * Infinite decorative loops are ignored.
 */
export async function settleAnimations(page: Page, timeout = 4000) {
  await page
    .waitForFunction(
      () =>
        document
          .getAnimations()
          .every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
      undefined,
      { timeout, polling: 100 },
    )
    .catch(() => {
      /* Long-running finite animations: carry on with what's on screen. */
    });
}
