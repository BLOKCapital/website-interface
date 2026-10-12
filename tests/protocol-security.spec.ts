import { expect, openWithConsentRejected, test, waitForHydration } from "./support/fixtures";

/**
 * /protocol and /security (P-04, P-05): anchors keep working, product links
 * land on their card after a client-side navigation (UX-02), and the
 * security page never shows a placeholder address or the app domain.
 */

const ANCHORS: Record<string, string[]> = {
  "/protocol": [
    "explore",
    "products",
    "index",
    "yield",
    "gardeners",
    "architecture",
    "glossary",
    "term-garden",
    "term-smart-account",
    "term-diamond",
    "term-facet",
    "term-index",
    "term-gardener",
    "ecosystem",
    "builders",
    "fees",
  ],
  "/security": ["readiness", "contracts", "controls", "rules", "audits", "official", "disclosure"],
};

for (const [route, ids] of Object.entries(ANCHORS)) {
  test(`${route}: every anchor exists exactly once`, async ({ page }) => {
    await page.goto(route);
    await waitForHydration(page);
    const counts = await page.evaluate((list) => list.map((id) => [id, document.querySelectorAll(`[id="${id}"]`).length] as const), ids);
    expect(counts.filter(([, n]) => n !== 1)).toEqual([]);
  });
}

test.describe("UX-02 @1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const id of ["index", "yield", "gardeners"]) {
    test(`client-side link from a scrolled home page lands on #${id}`, async ({ page }) => {
      await openWithConsentRejected(page, "/");
      const link = page.locator(`a[href="/protocol#${id}"]`).first();
      test.skip((await link.count()) === 0, `home no longer links /protocol#${id}`);
      await link.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => scrollY), "home is scrolled").toBeGreaterThan(1000);
      await link.click();
      await page.waitForURL(`**/protocol#${id}`);
      const card = page.locator(`#product-${id}`);
      // The card's heading ends up in the top part of the viewport, not ~2,000px past it.
      await expect
        .poll(async () => (await card.boundingBox())?.y ?? -1, { timeout: 10_000 })
        .toBeGreaterThan(80);
      const y = (await card.boundingBox())!.y;
      expect(y, `#product-${id} top after navigation`).toBeLessThan(450);
    });
  }
});

test("/security shows only published addresses, and not the app domain", async ({ page }) => {
  await page.goto("/security");
  await waitForHydration(page);
  const text = await page.locator("main").innerText();
  const addresses = new Set(text.match(/0x[0-9a-fA-F]{40}/g) ?? []);
  // The $BLOKC token (token.ts) and the DAO (from the Aragon link). Nothing else.
  expect([...addresses].sort()).toEqual(["0x003a7E96B48Ee318DE5200Fcc9504480643237f3", "0xBC4d9D3Dfe6AB1D36Ede90050ce96FCB937469f0"]);
  expect(text).not.toContain("private.blokcapital.io");
  await expect(page.locator("#official")).toContainText("Anything else is not us.");
});
