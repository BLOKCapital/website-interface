import type { Page } from "@playwright/test";
import { expect, rejectAllButton, settleAnimations, test, waitForHydration } from "./support/fixtures";

/**
 * The consent contract (docs/audit/findings/H-security-trust.md): nothing
 * reaches Google before a choice, "Accept all" loads the Google tag, and
 * withdrawing consent stops it. The real gtag.js is never fetched: the
 * fixture serves an empty script or a small emulator in its place.
 */

const GTAG_JS = /^https:\/\/www\.googletagmanager\.com\/gtag\/js/;
const COLLECT = /^https:\/\/(www|region\d+)\.google-analytics\.com\/g\/collect/;

/** dataLayer entries as plain arrays (gtag pushes `arguments` objects). */
const dataLayer = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).map((entry) =>
      Array.from(entry as ArrayLike<unknown>),
    ),
  );

/** The stored consent record, or null. */
const record = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("blok:consent") ?? "null"));

/** Client-side navigation through a footer link (Next's router, no reload). */
async function navigateViaFooter(page: Page, path: string) {
  await page.locator(`footer a[href="${path}"]`).first().click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}

async function acceptAll(page: Page) {
  await page.goto("/");
  await waitForHydration(page);
  const tag = page.waitForRequest(GTAG_JS);
  await page.getByRole("button", { name: "Accept all", exact: true }).first().click();
  await tag;
}

test("first visit makes no requests to Google", async ({ page, external }) => {
  await page.goto("/");
  await waitForHydration(page);
  await expect(rejectAllButton(page)).toBeVisible();
  await page.waitForTimeout(1500);
  expect(external.google()).toEqual([]);
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/(^|; )_ga/);
});

test("Global Privacy Control is honoured as Reject all, with no banner", async ({ page, external }) => {
  await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true }));
  await page.goto("/");
  await waitForHydration(page);
  await expect.poll(() => record(page)).toMatchObject({ v: 2, analytics: false, source: "gpc" });
  await page.waitForTimeout(900);
  await expect(page.getByRole("button", { name: "Reject all", exact: true })).toHaveCount(0);
  expect(external.google()).toEqual([]);
});

test("a version-1 record (with Marketing) is asked again", async ({ page }) => {
  // D-14b: removing Marketing bumped CONSENT_VERSION, so everyone chooses once more.
  await page.addInitScript(() => {
    const v1 = { v: 1, ts: new Date().toISOString(), source: "banner", analytics: true, marketing: true };
    localStorage.setItem("blok:consent", JSON.stringify(v1));
  });
  await page.goto("/");
  await waitForHydration(page);
  await expect(rejectAllButton(page)).toBeVisible();
});

test("the preferences dialog offers Analytics only, off by default", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Manage", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("switch")).toHaveCount(2);
  await expect(dialog.getByRole("switch", { name: /marketing/i })).toHaveCount(0);
  const analytics = dialog.getByRole("switch", { name: /analytics/i });
  await expect(analytics).toHaveAttribute("aria-checked", "false");
  await analytics.click();
  await expect(analytics).toHaveAttribute("aria-checked", "true");
  await dialog.getByRole("button", { name: "Save preferences" }).click();
  await expect(dialog).toBeHidden();
  expect(await record(page)).toMatchObject({ v: 2, analytics: true, source: "preferences" });
});

/* ---------- banner and dialog UI (G-05) ------------------------------------ */

const banner = (page: Page) => page.getByRole("region", { name: /cookies/i });

/** Where focus is, as a short description for assertions. */
const focused = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return "body";
    if (el.id === "main") return "main";
    return `${el.tagName.toLowerCase()}:${(el.getAttribute("aria-label") || el.textContent || "").trim()}`;
  });

async function firstVisit(page: Page) {
  await page.goto("/");
  await waitForHydration(page);
  await expect(rejectAllButton(page)).toBeVisible();
  // The banner rises in after a 600 ms delay; measure where it settles.
  await page.waitForTimeout(700);
  await settleAnimations(page);
}

test.describe("banner layout", () => {
  for (const [width, height, max] of [
    [375, 667, 130],
    [320, 568, 130],
  ] as const) {
    test(`phones: a compact card with all three choices in one row @${width}x${height}`, async ({ page }) => {
      // MOB-01: about 120 px instead of 190–241.
      await page.setViewportSize({ width, height });
      await firstVisit(page);
      const box = (await banner(page).boundingBox())!;
      expect(box.height, "banner height").toBeLessThanOrEqual(max);
      const tops = await Promise.all(
        ["Reject all", "Accept all", "Manage"].map(async (name) => (await banner(page).getByRole("button", { name, exact: true }).boundingBox())!.y),
      );
      expect(new Set(tops.map(Math.round)).size, "one row").toBe(1);
    });
  }

  test("landscape: a full-width bottom bar about 64 px tall @667x375", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await firstVisit(page);
    const box = (await banner(page).boundingBox())!;
    expect(box.width).toBe(667);
    expect(box.height, "bar height").toBeLessThanOrEqual(72);
    expect(Math.round(box.y + box.height)).toBe(375);
  });

  test("Reject all and Accept all look identical", async ({ page }) => {
    // SEC-23, D-15: equal prominence.
    await firstVisit(page);
    const look = (name: string) =>
      banner(page)
        .getByRole("button", { name, exact: true })
        .evaluate((el) => {
          const s = getComputedStyle(el);
          return [s.backgroundColor, s.color, s.borderColor, s.borderWidth, s.fontSize, s.fontWeight, s.height].join(" ");
        });
    expect(await look("Reject all")).toBe(await look("Accept all"));
  });

  test("while the banner shows, scroll padding keeps focused elements clear of it", async ({ page }) => {
    // A11Y-03 (2.4.11).
    await page.setViewportSize({ width: 375, height: 667 });
    await firstVisit(page);
    const box = (await banner(page).boundingBox())!;
    const padding = await page.evaluate(() => parseFloat(document.documentElement.style.scrollPaddingBottom));
    expect(padding).toBeGreaterThanOrEqual(Math.floor(667 - box.y));
    await rejectAllButton(page).click();
    expect(await page.evaluate(() => document.documentElement.style.scrollPaddingBottom)).toBe("");
  });
});

test.describe("focus", () => {
  test("Reject all from the keyboard moves focus to the page, not <body>", async ({ page }) => {
    // A11Y-12(a).
    await firstVisit(page);
    await rejectAllButton(page).focus();
    await page.keyboard.press("Enter");
    await expect(rejectAllButton(page)).toBeHidden();
    await expect.poll(() => focused(page)).toBe("main");
  });

  test("Manage → Escape returns focus to the banner's Manage button", async ({ page }) => {
    // A11Y-12(b).
    await firstVisit(page);
    await page.getByRole("button", { name: "Manage", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect.poll(() => focused(page)).toBe("button:Manage");
  });

  test("footer Cookie settings → close returns focus to the footer button", async ({ page }) => {
    await firstVisit(page);
    await rejectAllButton(page).click();
    // Reject all moves focus to <main> (A11Y-12a) a frame later; let it land
    // first, or under load it can steal focus back from the footer button.
    await expect(rejectAllButton(page)).toBeHidden();
    await expect.poll(() => focused(page)).toBe("main");
    await page.getByRole("button", { name: "Cookie settings" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close cookie preferences" }).click();
    await expect.poll(() => focused(page)).toBe("button:Cookie settings");
  });
});

test.describe("preferences dialog", () => {
  test("each switch is described by its category's detail", async ({ page }) => {
    // A11Y-18.
    await firstVisit(page);
    await page.getByRole("button", { name: "Manage", exact: true }).click();
    const analytics = page.getByRole("dialog").getByRole("switch", { name: /analytics/i });
    await expect(analytics).toHaveAccessibleDescription(/Google Analytics|page views/i);
  });

  test("landscape: both categories show without scrolling @667x375", async ({ page }) => {
    // MOB-14.
    await page.setViewportSize({ width: 667, height: 375 });
    await firstVisit(page);
    await page.getByRole("button", { name: "Manage", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const sw of await dialog.getByRole("switch").all()) await expect(sw).toBeInViewport({ ratio: 1 });
    await expect(dialog.getByRole("button", { name: "Save preferences" })).toBeInViewport({ ratio: 1 });
  });
});

test("the /about video loads nothing from Google before Play, then the privacy-enhanced player", async ({ page, external }) => {
  // SEC-04, A11Y-23: self-hosted poster, youtube-nocookie, focus moves into the player.
  await page.goto("/");
  await waitForHydration(page);
  await rejectAllButton(page).click();
  await page.goto("/about");
  await waitForHydration(page);
  const play = page.getByRole("button", { name: "Play the BLOK Capital introduction video" });
  await play.scrollIntoViewIfNeeded();
  await expect(play).toHaveAccessibleDescription(/Plays from YouTube \(Google\)/);
  await page.waitForTimeout(1000);
  expect(external.urls.filter((u) => /youtube|ytimg|doubleclick|google/.test(new URL(u).hostname)), "before Play").toEqual([]);

  await play.focus();
  await page.keyboard.press("Enter");
  const frame = page.locator('iframe[title="BLOK Capital introduction"]');
  await expect(frame).toHaveAttribute("src", /^https:\/\/www\.youtube-nocookie\.com\/embed\/.*cc_load_policy=1/);
  await expect(frame).toBeFocused();
});

test.describe("after a choice", () => {
  test.use({ gtag: "empty" });

  test('"Accept all" loads the Google tag', async ({ page, external }) => {
    await acceptAll(page);
    expect(external.matching(GTAG_JS)).toHaveLength(1);
  });

  test("Consent Mode starts from denied, then updates", async ({ page }) => {
    await acceptAll(page);
    const entries = await dataLayer(page);
    const defaultAt = entries.findIndex((e) => e[0] === "consent" && e[1] === "default");
    expect(defaultAt, "a consent default is pushed").toBeGreaterThanOrEqual(0);
    const signals = entries[defaultAt][2] as Record<string, string>;
    for (const key of ["analytics_storage", "ad_storage", "ad_user_data", "ad_personalization"]) {
      expect(signals[key], `default ${key}`).toBe("denied");
    }
    const updateAt = entries.findIndex(
      (e, i) => i > defaultAt && e[0] === "consent" && e[1] === "update" && (e[2] as Record<string, string>)?.analytics_storage === "granted",
    );
    expect(updateAt, "an update grants analytics after the default").toBeGreaterThan(defaultAt);
    // SEC-05: there are no ad tags, so no ad signal is ever granted.
    for (const e of entries.filter((x) => x[0] === "consent")) {
      for (const key of ["ad_storage", "ad_user_data", "ad_personalization"]) {
        expect((e[2] as Record<string, string>)[key], `${e[1]} ${key}`).toBe("denied");
      }
    }
  });

  test("the consent record names the Cookie Policy version it was given under", async ({ page }) => {
    // SEC-22: proof of what was agreed to. The policy's own date is its version.
    await acceptAll(page);
    const stored = await record(page);
    expect(stored).toMatchObject({ v: 2, analytics: true, source: "banner" });
    expect(stored).not.toHaveProperty("marketing");
    expect(stored.policy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // The legal page prints the same date the way it formats every policy date.
    const asShown = new Date(stored.policy).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    await page.goto("/legal/cookie-policy");
    await expect(page.getByText(/^Last updated /), "record.policy matches the Cookie Policy date").toContainText(`Last updated ${asShown}`);
  });
});

test.describe("withdrawal", () => {
  test.use({ gtag: "emulate" });

  test("after Cookie settings → Reject all, client-side navigation sends nothing to Google Analytics", async ({ page, external }) => {
    // SEC-03: gtag.js stays loaded until a reload; the ga-disable kill switch silences it.
    await acceptAll(page);

    // Precondition: with consent, a client-side navigation is counted.
    external.clear();
    await navigateViaFooter(page, "/security");
    await expect.poll(() => external.matching(COLLECT).length, { message: "page_view sent with consent" }).toBeGreaterThan(0);

    // Withdraw through the footer's Cookie settings.
    await page.getByRole("button", { name: "Cookie settings" }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Reject all", exact: true }).click();
    await expect(dialog).toBeHidden();

    external.clear();
    await navigateViaFooter(page, "/token");
    await page.waitForTimeout(2000);
    expect(external.matching(COLLECT), "no hits after withdrawal").toEqual([]);
    expect(await page.evaluate(() => document.cookie)).not.toMatch(/(^|; )_ga/);

    // Granting again in the same page view switches it back on.
    await page.getByRole("button", { name: "Cookie settings" }).first().click();
    await dialog.getByRole("button", { name: "Accept all", exact: true }).click();
    await expect(dialog).toBeHidden();
    external.clear();
    await navigateViaFooter(page, "/governance");
    await expect.poll(() => external.matching(COLLECT).length, { message: "page_view sent after a new grant" }).toBeGreaterThan(0);
  });
});

/* ---------- consent-gated events (G-08, CRO-09, MISS-07) ------------------- */

/** GA4 events pushed so far, as [name, params]. */
const events = async (page: Page) =>
  (await dataLayer(page)).filter((e) => e[0] === "event").map((e) => [e[1], e[2]] as [string, Record<string, unknown>]);

/** Keep link clicks on the page (no new tabs) while still letting listeners see them. */
const stayOnPage = (page: Page) =>
  page.evaluate(() =>
    window.addEventListener("click", (e) => {
      if ((e.target as Element).closest("a")) e.preventDefault();
    }),
  );

const fire = (page: Page, type: string, detail: unknown) =>
  page.evaluate(([t, d]) => document.dispatchEvent(new CustomEvent(t as string, { detail: d })), [type, detail] as const);

test.describe("events", () => {
  test.use({ gtag: "emulate" });

  test("nothing is tracked before a choice", async ({ page, external }) => {
    await page.goto("/");
    await waitForHydration(page);
    await stayOnPage(page);
    await page.locator('body > header a[href*="blokc.app"]').filter({ visible: true }).first().click();
    await fire(page, "blok:track", { name: "cta_click", params: { cta_id: "x" } });
    expect(await page.evaluate(() => (window as unknown as { dataLayer?: unknown }).dataLayer)).toBeUndefined();
    expect(external.google()).toEqual([]);
  });

  test("a Discord click sends join_group with its placement (gtag emulator)", async ({ page }) => {
    await acceptAll(page);
    await stayOnPage(page);
    await page.locator('footer a[href*="discord"]').first().click();
    await expect.poll(() => events(page)).toContainEqual(["join_group", { group_id: "discord", placement: "footer" }]);
  });

  test("the announcement bar's Contributor Program link sends cta_click to the contributor app (gtag emulator)", async ({ page }) => {
    await acceptAll(page);
    await stayOnPage(page);
    await page.locator('#announce a[href*="contribute.blokc.app"]').click();
    await expect
      .poll(() => events(page))
      .toContainEqual(["cta_click", { cta_id: "announcement_contribute", destination: "contributor", placement: "announcement_bar" }]);
  });

  test("The header's launch button sends cta_click to the app (gtag emulator)", async ({ page }) => {
    await acceptAll(page);
    await stayOnPage(page);
    await page.locator('body > header > div:not(#announce) a[href*="blokc.app"]').filter({ visible: true }).first().click();
    await expect.poll(() => events(page)).toContainEqual(["cta_click", { cta_id: "nav_launch_app", destination: "app", placement: "header" }]);
  });

  test("[data-cta] links send cta_click with a destination inferred from the host", async ({ page }) => {
    await acceptAll(page);
    await stayOnPage(page);
    await page.evaluate(() => {
      const a = document.createElement("a");
      a.href = "https://docs.blokcapital.io/concepts/blok-c-overview";
      a.dataset.cta = "hero-read-docs";
      a.dataset.placement = "hero";
      a.textContent = "Docs";
      document.getElementById("main")!.prepend(a);
    });
    // A synthetic click: the test link sits under the fixed header.
    await page.locator('[data-cta="hero-read-docs"]').dispatchEvent("click");
    await expect.poll(() => events(page)).toContainEqual(["cta_click", { cta_id: "hero_read_docs", destination: "docs", placement: "hero" }]);
  });

  test("blok:track is the decoupled contract, and its params are sanitised", async ({ page }) => {
    await acceptAll(page);
    await fire(page, "blok:track", {
      name: "select_content",
      params: { content_type: "index", content_id: "BLOKC5", wallet: "0xabc", source: "0x1111111111111111111111111111111111111111" },
    });
    await expect.poll(() => events(page)).toContainEqual(["select_content", { content_type: "index", content_id: "blokc5" }]);
  });

  test("FAQ opens send select_content once per item per page view", async ({ page }) => {
    await acceptAll(page);
    const first = page.locator("#faq details summary").first();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    await first.click();
    await first.click();
    await expect.poll(async () => (await events(page)).filter(([n]) => n === "select_content").length).toBe(1);
    const [, params] = (await events(page)).find(([n]) => n === "select_content")!;
    expect(params).toMatchObject({ content_type: "faq", placement: "home" });
    expect(params.content_id).toMatch(/^[a-z0-9_]+$/);
  });

  test("a key section in view sends section_view once", async ({ page }) => {
    await acceptAll(page);
    const toFaq = () => page.locator("#faq").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await toFaq();
    await expect.poll(() => events(page)).toContainEqual(["section_view", { section_id: "faq" }]);
    await page.evaluate(() => window.scrollBy({ top: -1200, behavior: "instant" }));
    await page.waitForTimeout(200);
    await toFaq();
    await page.waitForTimeout(300);
    expect((await events(page)).filter(([n, p]) => n === "section_view" && p.section_id === "faq")).toHaveLength(1);
  });

  test("errors and live-data failures are reported as exception events, without URL queries", async ({ page }) => {
    await acceptAll(page);
    await page.evaluate(() =>
      setTimeout(() => {
        throw new Error("boom at https://example.com/a?key=secret#x");
      }),
    );
    await fire(page, "blok:error", { source: "Arbitrum RPC", state: "error" });
    await expect.poll(() => events(page)).toContainEqual(["exception", { description: "live_data:arbitrum_rpc:error", fatal: false }]);
    const thrown = () => events(page).then((es) => es.find(([n, p]) => n === "exception" && String(p.description).includes("boom")));
    await expect.poll(thrown).toBeTruthy();
    expect((await thrown())![1].description).not.toMatch(/secret|\?|#x/);
  });

  test("after withdrawal, nothing more is tracked", async ({ page }) => {
    await acceptAll(page);
    await page.getByRole("button", { name: "Cookie settings" }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: "Reject all", exact: true }).click();
    const before = (await events(page)).length;
    await stayOnPage(page);
    await page.locator('footer a[href*="discord"]').first().click();
    await fire(page, "blok:track", { name: "cta_click", params: { cta_id: "x" } });
    await page.waitForTimeout(300);
    expect((await events(page)).length).toBe(before);
  });
});
