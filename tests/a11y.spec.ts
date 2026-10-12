import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import {
  expect,
  openWithConsentRejected,
  rejectAllButton,
  scrollThrough,
  settleAnimations,
  test,
  waitForHydration,
} from "./support/fixtures";
import { ROUTES } from "./support/routes";

/**
 * axe (WCAG 2.0/2.1 A + AA, 2.2 AA) on every route at 375 and 1280, after
 * "Reject all" and a scroll-through, plus the states a page load never
 * shows: both desktop menus, the mobile sheet, the cookie banner and the
 * cookie preferences dialog.
 *
 * Serious and critical violations fail the test unless KNOWN_VIOLATIONS
 * lists them. Each entry names the finding that fixes it
 * (docs/audit/findings/D-a11y.md §3); the fixing agent deletes the entry in
 * the same commit as the fix. Moderate and minor results are attached to the
 * report but don't fail.
 */

type Known = {
  /** Routes, or opened states such as "menu:governance". */
  routes: string[];
  /** Widths where it occurs; omitted = every width. */
  widths?: number[];
  finding: string;
};

export const KNOWN_VIOLATIONS: Record<string, Known[]> = {
};

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const BLOCKING = new Set(["serious", "critical"]);

function knownFor(rule: string, where: string, width: number) {
  return (KNOWN_VIOLATIONS[rule] ?? []).find(
    (k) => k.routes.includes(where) && (!k.widths || k.widths.includes(width)),
  );
}

/** Run axe (optionally scoped to `include`) and fail on unexpected serious/critical violations. */
async function audit(page: Page, where: string, width: number, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(TAGS);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();

  const unexpected: string[] = [];
  const excused: string[] = [];
  for (const v of violations) {
    const line = `${v.id} (${v.impact}, ${v.nodes.length}×): ${v.help}\n      ${v.nodes
      .slice(0, 3)
      .map((n) => n.target.join(" "))
      .join("\n      ")}`;
    if (!BLOCKING.has(v.impact ?? "")) continue;
    const known = knownFor(v.id, where, width);
    if (known) excused.push(`${known.finding} ${line}`);
    else unexpected.push(line);
  }

  const info = test.info();
  await info.attach(`axe ${where} @${width}`, {
    body: JSON.stringify(violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, targets: nodes.map((n) => n.target) })), null, 2),
    contentType: "application/json",
  });
  for (const e of excused) info.annotations.push({ type: "known violation", description: e });
  // An allow-list entry that no longer fires here is a hint that it can go.
  for (const [rule, entries] of Object.entries(KNOWN_VIOLATIONS)) {
    for (const k of entries) {
      const applies = k.routes.includes(where) && (!k.widths || k.widths.includes(width));
      if (applies && !violations.some((v) => v.id === rule)) {
        info.annotations.push({ type: "stale known violation?", description: `${rule} (${k.finding}) did not occur on ${where} @${width}` });
      }
    }
  }

  expect(unexpected, `unexpected serious/critical axe violations on ${where} @${width}`).toEqual([]);
}

/** Tag the closest container of `inner` so axe can be scoped to it. */
async function scopeTo(inner: Locator, name: string) {
  await inner.evaluate((el, n) => {
    const box = el.closest("[role=region], [role=dialog], aside, section, form") ?? el.parentElement;
    box?.setAttribute("data-axe-scope", n);
  }, name);
  return `[data-axe-scope="${name}"]`;
}

/* ---------- every route ---------------------------------------------------- */

for (const width of [375, 1280]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: width < 768 ? 812 : 900 }, isMobile: width < 768, hasTouch: width < 768 });

    for (const route of ROUTES) {
      test(`axe: ${route}`, async ({ page }) => {
        await openWithConsentRejected(page, route);
        await scrollThrough(page);
        await audit(page, route, width);
      });
    }
  });
}

/* ---------- opened states -------------------------------------------------- */

test.describe("opened states", () => {
  test.describe("desktop menus @1280", () => {
    for (const [label, where] of [
      ["Protocol", "menu:protocol"],
      ["Governance", "menu:governance"],
    ] as const) {
      test(`axe: ${label} menu`, async ({ page }) => {
        await openWithConsentRejected(page, "/");
        const trigger = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: label, exact: true });
        // Keyboard, not a click: a mouse click lands after the hover has
        // already opened the menu, and toggles it shut (A11Y-24).
        await trigger.focus();
        await page.keyboard.press("Enter");
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        const panel = await trigger.getAttribute("aria-controls");
        expect(panel, "the trigger names its panel").toBeTruthy();
        await settleAnimations(page);
        await audit(page, where, 1280, `#${panel}`);
      });
    }
  });

  test.describe("mobile @375", () => {
    test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

    test("axe: mobile menu sheet", async ({ page }) => {
      await openWithConsentRejected(page, "/");
      const toggle = page.getByRole("button", { name: "Open menu" });
      const sheet = await toggle.getAttribute("aria-controls");
      expect(sheet, "the menu button names its sheet").toBeTruthy();
      await toggle.click();
      await expect(page.locator(`[aria-controls="${sheet}"]`).first()).toHaveAttribute("aria-expanded", "true");
      await settleAnimations(page);
      await audit(page, "sheet", 375, `#${sheet}`);
    });

    // UX-24: the sticky Contents button on a long policy, and its sheet.
    test("axe: legal Contents sheet", async ({ page }) => {
      await openWithConsentRejected(page, "/legal/user-agreement");
      const button = page.getByRole("button", { name: "Contents", exact: true });
      await expect(button, "hidden while the top Contents list is on screen").toBeHidden();
      await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: "instant" }));
      await expect(button).toBeVisible();
      await button.click();
      const sheet = page.getByRole("dialog", { name: "Contents" });
      await expect(sheet).toBeVisible();
      await settleAnimations(page);
      await audit(page, "sheet:contents", 375, "dialog[open]");

      // Choosing a section closes the sheet and moves focus to its heading.
      const link = sheet.getByRole("link").nth(13);
      const id = (await link.getAttribute("href"))!.slice(1);
      await link.click();
      await expect(sheet).toBeHidden();
      await expect(page.locator(`[id="${id}"]`)).toBeFocused();
    });
  });

  // A11Y-25 (moderate, so the route audits above don't fail on it): the
  // contents column is no longer an <aside> nested in the article.
  test.describe("legal template @1280", () => {
    for (const route of ROUTES.filter((r) => r.startsWith("/legal/"))) {
      test(`no nested complementary landmark: ${route}`, async ({ page }) => {
        await page.goto(route);
        const { violations } = await new AxeBuilder({ page }).withRules(["landmark-complementary-is-top-level"]).analyze();
        expect(violations.map((v) => v.id)).toEqual([]);
      });
    }
  });

  for (const width of [375, 1280]) {
    test.describe(`cookie consent @${width}`, () => {
      test.use({ viewport: { width, height: width < 768 ? 812 : 900 }, isMobile: width < 768, hasTouch: width < 768 });

      test("axe: cookie banner (first visit)", async ({ page }) => {
        await page.goto("/");
        await waitForHydration(page);
        const reject = rejectAllButton(page);
        await expect(reject).toBeVisible();
        await settleAnimations(page);
        await audit(page, "banner", width, await scopeTo(reject, "banner"));
      });

      test("axe: cookie preferences dialog", async ({ page }) => {
        await page.goto("/");
        await waitForHydration(page);
        await page.getByRole("button", { name: "Manage", exact: true }).click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await settleAnimations(page);
        await audit(page, "dialog", width, '[role="dialog"]');
      });
    });
  }
});
