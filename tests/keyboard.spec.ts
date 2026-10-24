import type { Page } from "@playwright/test";
import { expect, openWithConsentRejected, test } from "./support/fixtures";

/**
 * Keyboard and focus behaviour of the shell: skip link, desktop menus,
 * mobile sheet. Known failures are `test.fixme` with their finding ID
 * (docs/audit/findings/D-a11y.md, G-mobile.md).
 */

const primaryTrigger = (page: Page, label: string) =>
  page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: label, exact: true });

/** Where focus is: "main", "header", "inside #<id>", "body", … */
const focusIn = (page: Page, id?: string) =>
  page.evaluate((sheetId) => {
    const el = document.activeElement;
    if (!el || el === document.body) return "body";
    if (sheetId && document.getElementById(sheetId)?.contains(el)) return `inside #${sheetId}`;
    if (el.closest("main")) return "main";
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    return el.tagName.toLowerCase();
  }, id);

test.describe("desktop @1280", () => {
  test("the skip link moves focus to #main", async ({ page }) => {
    await openWithConsentRejected(page, "/");
    // Start from a fresh load so the first Tab begins at the top of the document.
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    // Focus is on #main itself, or the next Tab lands inside it.
    if (!(await page.evaluate(() => document.activeElement?.id === "main"))) await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.getElementById("main")?.contains(document.activeElement))).toBe(true);
  });

  test("Enter on a menu trigger, then Tab, lands on the first link in its panel", async ({ page }) => {
    // A11Y-01 (F85): Tab goes to the next trigger, and the panel comes after Docs.
    await openWithConsentRejected(page, "/");
    const trigger = primaryTrigger(page, "Protocol");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = await trigger.getAttribute("aria-controls");
    await page.keyboard.press("Tab");
    const onFirstLink = await page.evaluate((id) => {
      const first = document.getElementById(id ?? "")?.querySelector("a[href], button:not([disabled])");
      return !!first && document.activeElement === first;
    }, panel);
    expect(onFirstLink, "focus is on the panel's first link").toBe(true);
  });

  test("Escape closes a menu opened by hover, wherever focus is", async ({ page }) => {
    // A11Y-06 (1.4.13): Escape is only handled while focus is inside the nav.
    await openWithConsentRejected(page, "/");
    const trigger = primaryTrigger(page, "Company");
    await trigger.hover();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("mobile @375", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  test("the open menu sheet keeps Tab inside it and makes the page inert", async ({ page }) => {
    // A11Y-02 (F85, 2.4.11): Tab walks into <main> behind the opaque sheet.
    await openWithConsentRejected(page, "/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    const sheet = (await toggle.getAttribute("aria-controls")) ?? "mobile-menu";
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(`[aria-controls="${sheet}"]`).first()).toHaveAttribute("aria-expanded", "true");

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const where = await focusIn(page, sheet);
      const onClose = await page.evaluate(() => /close menu/i.test(document.activeElement?.getAttribute("aria-label") ?? ""));
      expect(where === `inside #${sheet}` || onClose, `Tab ${i + 1} stays in the sheet (focus is in ${where})`).toBe(true);
    }
    expect(await page.evaluate(() => !!document.getElementById("main")?.closest("[inert]")), "main is inert").toBe(true);
  });
});

test.describe("tablet rotation", () => {
  test.use({ viewport: { width: 768, height: 1024 }, hasTouch: true });

  test("rotating to landscape with the sheet open leaves the page scrollable", async ({ page }) => {
    // MOB-03: the sheet hides at lg, but `open` stays true and body keeps overflow:hidden.
    await openWithConsentRejected(page, "/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    const sheet = (await toggle.getAttribute("aria-controls")) ?? "mobile-menu";
    await toggle.click();
    await expect(page.locator(`[aria-controls="${sheet}"]`).first()).toHaveAttribute("aria-expanded", "true");
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflowY), "body scroll is unlocked").not.toBe("hidden");
    await page.mouse.move(512, 500);
    await page.mouse.wheel(0, 1500);
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: "the wheel scrolls the page" }).toBeGreaterThan(0);
  });
});
