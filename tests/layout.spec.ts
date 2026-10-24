import { expect, test, waitForHydration } from "./support/fixtures";
import { ROUTES } from "./support/routes";

/** No page scrolls sideways, from the smallest phone to desktop. */

for (const width of [320, 375, 768, 1280]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 800 }, isMobile: width < 768, hasTouch: width < 768 });

    for (const route of ROUTES) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        await page.goto(route);
        await waitForHydration(page);
        await page.waitForTimeout(300);
        const result = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const offenders: string[] = [];
          if (document.documentElement.scrollWidth > viewport) {
            for (const el of document.querySelectorAll("body *")) {
              const box = el.getBoundingClientRect();
              if (box.right > viewport + 1 && box.width > 0 && getComputedStyle(el).position !== "fixed") {
                offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")}`);
                if (offenders.length >= 6) break;
              }
            }
          }
          return { scrollWidth: document.documentElement.scrollWidth, viewport, offenders };
        });
        expect(result.scrollWidth, `wider than the viewport: ${result.offenders.join(", ")}`).toBeLessThanOrEqual(result.viewport);
      });
    }
  });
}
