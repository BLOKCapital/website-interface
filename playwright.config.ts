import fs from "node:fs";
import { defineConfig, devices } from "@playwright/test";

/**
 * Regression suite for the static export (T-01).
 *
 * The suite tests what ships: it serves `out/` exactly as Cloudflare Pages
 * would see it (minus `_headers`), so run `npm run build` first. `npm run
 * test:ci` does both. Every non-localhost request is blocked by the shared
 * fixture in tests/support/fixtures.ts, so no test depends on the Arbitrum
 * RPC, YouTube or Google.
 *
 * Locally the suite drives the installed Google Chrome (no browser download);
 * CI uses Playwright's bundled Chromium (`npx playwright install chromium`).
 */
// Override with TEST_PORT when 4310 is taken (e.g. parallel worktrees).
const PORT = Number(process.env.TEST_PORT ?? 4310);
const CI = !!process.env.CI;

if (!fs.existsSync("out/index.html")) {
  throw new Error("No static export found in out/. Run `npm run build` first (or `npm run test:ci`).");
}

export default defineConfig({
  testDir: "./tests",
  // Git-ignored by tests/.gitignore.
  outputDir: "./tests/.output/results",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  // The opt-in performance gate measures timings, so it runs alone.
  workers: process.env.PERF ? 1 : CI ? 2 : undefined,
  // Generous: a scroll-through of the longest page plus axe takes ~15 s on a
  // quiet machine, and CI runners and shared dev boxes are not quiet.
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: CI ? [["github"], ["list"], ["html", { open: "never", outputFolder: "./tests/.output/report" }]] : [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
        channel: CI ? undefined : "chrome",
      },
    },
  ],
  webServer: {
    // `serve` gives the same clean URLs and 404.html fallback as Pages.
    command: `npx --no-install serve out -l ${PORT} --no-port-switching --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 30_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
