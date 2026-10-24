# BLOK Capital website

The marketing site for [BLOK Capital](https://blokcapital.io), a non-custodial wealth management protocol on Arbitrum.

## Stack

- **Next.js 15** (App Router), React 19 and TypeScript, built as a **fully static export** (`output: "export"` → `out/`) and hosted on **Cloudflare Pages**. There are no server actions or middleware, and the route handlers (`sitemap`, `robots`, `llms.txt`, OG image) are prerendered.
- **Tailwind CSS 3**, with design tokens as CSS variables in `src/app/globals.css` and `tailwind.config.ts`. The Day garden palette is the default; `.theme-dark` islands use the Night garden palette.
- **CSS-first motion.** There is no Framer Motion or any other motion library. Scroll reveals are driven by a small inline script (`RevealScript`) and CSS, and every animation respects `prefers-reduced-motion`.
- **Live data:** index prices and token data are read in the browser from Chainlink feeds over the public Arbitrum RPC (`src/lib/live/`).
- **Analytics:** GA4 loads only after a visitor allows Analytics in the cookie banner (`src/lib/consent.ts`, `src/components/system/Analytics.tsx`).

## Pages

| Route | What it covers |
|---|---|
| `/` | The pitch and an overview of everything below |
| `/protocol` | How a Garden works: custody, smart accounts, the architecture, fees and risks |
| `/indices`, `/indices/blokc2` · `blokc5` · `blokc10` | The index family, live composition, methodology and the rebalance lab |
| `/security` | Contracts, controls, audits and disclosure |
| `/token` | $BLOKC supply, utility and allocation |
| `/governance` | How the DAO decides, and its proposals |
| `/about` | Story, principles, team, roadmap and press kit |
| `/contact` | Channels and common questions |
| `/legal/*` | Cookie Policy, Acceptable Use Policy, User Agreement |

## Scripts

Use the Node version in `.nvmrc` (22; `engines` requires ≥ 20.9).

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export to `out/` (also fetches the governance snapshot, see below) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (`next/core-web-vitals`, `next/typescript`) |
| `npm test` | Playwright suite against `out/`; run `npm run build` first |
| `npm run test:ci` | Build, then the Playwright suite |
| `npm run check:classes` | Fails if a Tailwind class in `src/` generates no CSS (needs `out/`) |
| `npm run check:links` | Internal links, anchors and assets in `out/`; no network |

**Tests** (`tests/`) serve `out/` on port 4310 and block every non-localhost request, so they never depend on the RPC, YouTube or Google. They cover status codes and console errors, hash-link targets, axe (WCAG 2.2 AA) on every route and on opened menus, the mobile sheet and the cookie banner and dialog, keyboard focus, the consent contract, reduced motion and horizontal overflow. Locally they drive your installed Chrome; CI uses Playwright's Chromium (`npx playwright install chromium`).

- Known failures are `test.fixme(FIXME, "<finding ID>: …")`. Run them with `RUN_FIXME=1 npm test`, and delete the line once the finding is fixed.
- Accepted axe violations live in `KNOWN_VIOLATIONS` (`tests/a11y.spec.ts`) and known dead classes in `KNOWN_DEAD` (`scripts/check-classes.mjs`). Remove an entry in the same change that fixes it.
- The LCP gate (LCP − FCP ≤ 50 ms on a throttled phone profile) is opt-in: `PERF=1 npx playwright test --grep @perf`.

CI (`.github/workflows/ci.yml`) runs typecheck, lint, build, both checks and the suite on every pull request and on pushes to `main` and `redesign`.

## Environment variables

Both are optional and read at build time.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_CF_IMAGES` | `1` routes images through Cloudflare Image Transformations (`/cdn-cgi/image/`). Leave it unset unless Transformations is enabled on the zone, because the path 404s in dev and on `*.pages.dev` previews. Unset, the garden renders use the pre-built width variants in `public/gardens/`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Adds the Google Search Console verification meta tag. |

## Deploy (Cloudflare Pages)

- Build command `npm run build`, output directory `out`. Pages reads the Node version from `.nvmrc`.
- `public/_headers` (cache rules, content types) and `public/_redirects` (old routes) are copied to the export root, where Pages applies them. Local `serve` ignores both, so review header changes in the file itself.
- **Governance snapshot:** proposals are fetched from the governance API **at build time** (`src/lib/data/proposals.ts`), because the API doesn't accept browser requests from the site. The page shows when they were last synced. Redeploy to refresh them. If the fetch fails, the build logs a `[governance]` warning and ships an empty proposals panel.

## Honest data

Every figure, date, partner and quote on the site must be real and sourced. Live values come from the chain, and illustrative content carries an **Example** badge. Don't invent numbers to fill a layout.

## Audit docs

`docs/audit/` holds the October 2026 site audit: the site map, the measured baseline, the findings by area, and the improvement plan with its finding IDs (for example `A11Y-01` or `SEC-03`), which commits and tests refer to.
