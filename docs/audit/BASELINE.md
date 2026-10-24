# BASELINE: BLOK Capital marketing site

Measured **2026-10-11** on `redesign` @ `5beb0ee`. Every later change is compared against these numbers, and Phase 4 re-runs the same scripts.

## 0. How this was measured (reproducible)

- **Build under test:** `git archive HEAD` into a scratch directory, then `npm run build` (static export). The owner's checkout, `.next/` and `out/` were not touched.
- **Server:** `serve out` (clean URLs, gzip) on `localhost:4173`. Cloudflare `_headers` are **not** applied locally, so header and caching checks are code reviews of `public/_headers`.
- **Browser:** Google Chrome (stable), headless, via Playwright 1.48.
- **Screenshots** (`docs/audit/baseline/screenshots/`, git-ignored): full page at **375 / 768 / 1280 / 1920**, 15 routes, 61 files. The script scrolls through each page so scroll reveals fire, rejects cookies first, and also saves `first-visit_<w>.jpg` (above the fold, with the consent banner).
- **Accessibility:** axe-core 4.10 with tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa best-practice`, at 375 and 1280, run after the scroll-through.
- **Lighthouse 12.2.1:** mobile (default: Moto G Power emulation, simulated slow 4G, 4× CPU) and desktop presets, 10 representative routes. **Mobile is the median of 3 runs** (`lh3.sh` + `lh-median.mjs`, raw JSON in `baseline/lighthouse-median/`); desktop is 1 run (100 everywhere). Local server, so network numbers are optimistic and CPU-bound metrics (TBT/INP proxy) are the meaningful ones.
- **Core Web Vitals:** lab only (LCP, CLS, TBT as the INP proxy). Field data (CrUX / Search Console for blokcapital.io) was **not** checked from here. If the owner has it, add it to §7. The Phase 4 comparison is lab vs lab.
- **Scripts** (Phase 4 reruns these unchanged): `docs/audit/tools/capture.mjs`, `lh.sh`, `summarize.mjs`, `lcp.mjs`. They need `playwright@1.48.2 @axe-core/playwright@4.10.1 lighthouse@12.2.1 serve@14.2.4` installed **outside** the repo; nothing was added to `package.json`.
- **Known tool limit:** Lighthouse 12.2.1 cannot read the current Chrome trace format for *element attribution* ("RootCauses … frame_sequence"). Its metric values are unaffected, so the LCP element was taken from a throttled Playwright pass instead (`lcp.mjs`: 375px, DPR 2, 4× CPU, 1.6 Mbps / 150 ms RTT).

## 1. Build health

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ pass (2.3 s) |
| `npm run lint` | ✅ 0 errors, **2 warnings**: `src/app/indices/[id]/page.tsx:19` unused imports `components`, `sources` |
| `npm run build` | ✅ 26 static pages, 15.2 s |
| Tests | ❌ **none exist** (no unit, e2e or visual tests) |

## 2. Bundle & asset weight

| Item | Size |
|---|---|
| First-load JS shared by all routes | **103 kB** (gz, per Next) |
| First-load JS by route | `/` **141 kB** · `/indices`, `/indices/[id]` 135 kB · `/token` 127 kB · `/about`, `/governance` 122 kB · `/protocol`, `/security` 121 kB · `/legal/*` 120 kB · `/contact` 106 kB |
| All JS in export | 1,010 kB raw / 304 kB gz |
| CSS | 2 files: 80.7 kB raw / **15.7 kB gz** + 8.4 kB / 1.1 kB gz |
| Fonts | **19 woff2 files** (Inter, Newsreader 400/500 normal+italic, JetBrains Mono), 3 of them preloaded (`.p.woff2`: 48 / 58 / 64 kB) |
| HTML (raw / gz) | `/` **478 kB / 63 kB** · `/indices` 256 / 36 · `/indices/blokc5` 219 / 32 · `/about` 211 / 30 · `/protocol` 199 / 34 · `/security` 174 / 27 · `/contact` 155 / 23 · `/token` 151 / 24 · `/governance` 133 / 22 · legal 99 / 18 · 404 85 / 14 |
| Images in `public/` | gardens 7.0 MB (12 renders × 4 sizes, WebP) · Socialtrust 332 kB (13 logos, several PNG/JPEG) · teamgrid 108 kB · brand 100 kB · tokens 64 kB |
| Export total | 14 MB |

## 3. Core Web Vitals & Lighthouse

**Targets:** LCP < 2.5 s, INP < 200 ms, CLS < 0.1, strong mobile Lighthouse.
### Lighthouse mobile (median of 3 runs)

> **Correction (2026-10-11):** the first single run reported home at **perf 63 / TBT 942 ms**. That run was CPU-contended (its observed FCP was 4× the reruns'). Three clean reruns, and independent reruns by Agents C and E, give **perf 88–89 / TBT 11–35 ms**. The table below replaces it. Always compare medians of ≥3 runs.

| Page | Perf | A11y | FCP | LCP | TBT | CLS | SI | runs (perf / TBT) |
|---|---|---|---|---|---|---|---|---|
| about | 92 | 100 | 1.21s | 3.34s | 5ms | 0.001 | 1.21s | 92/5, 92/5, 92/3 |
| contact | 86 | 100 | 1.21s | 4.14s | 6ms | 0.001 | 1.21s | 86/6, 86/8, 86/5 |
| governance | 92 | 100 | 1.21s | 3.35s | 19ms | 0.001 | 1.21s | 92/19, 92/25, 92/17 |
| home | 89 | 94 | 1.36s | 3.69s | 13ms | 0.000 | 1.36s | 88/35, 89/11, 89/13 |
| indices | 90 | 100 | 1.36s | 3.60s | 6ms | 0.000 | 1.36s | 90/14, 90/5, 90/6 |
| indices_blokc5 | 90 | 100 | 1.36s | 3.60s | 4ms | 0.000 | 1.36s | 89/4, 90/4, 90/5 |
| legal_cookie-policy | 90 | 100 | 1.21s | 3.54s | 3ms | 0.000 | 1.21s | 90/3, 90/4, 90/2 |
| protocol | 91 | 100 | 1.21s | 3.41s | 5ms | 0.000 | 1.21s | 91/4, 91/5, 91/5 |
| security | 92 | 100 | 1.21s | 3.34s | 3ms | 0.001 | 1.21s | 92/3, 92/3, 92/3 |
| token | 91 | 96 | 1.21s | 3.50s | 7ms | 0.000 | 1.21s | 91/8, 91/7, 91/5 |

### Lighthouse desktop

| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Weight |
|---|---|---|---|---|---|---|---|---|---|---|
| about | 100 | 100 | 100 | 100 | 0.33s | 0.69s | 0ms | 0.000 | 0.35s | 747KB |
| contact | 100 | 100 | 100 | 100 | 0.33s | 0.79s | 0ms | 0.000 | 0.33s | 604KB |
| governance | 100 | 100 | 100 | 100 | 0.33s | 0.69s | 0ms | 0.000 | 0.35s | 709KB |
| home | 100 | 94 | 100 | 100 | 0.37s | 0.77s | 0ms | 0.000 | 0.37s | 737KB |
| indices_blokc5 | 100 | 100 | 100 | 100 | 0.33s | 0.71s | 0ms | 0.000 | 0.35s | 603KB |
| indices | 100 | 100 | 100 | 100 | 0.33s | 0.71s | 0ms | 0.000 | 0.36s | 620KB |
| legal_cookie-policy | 100 | 100 | 100 | 100 | 0.33s | 0.74s | 0ms | 0.000 | 0.33s | 589KB |
| protocol | 100 | 100 | 100 | 100 | 0.33s | 0.69s | 0ms | 0.000 | 0.36s | 617KB |
| security | 100 | 100 | 100 | 100 | 0.33s | 0.69s | 0ms | 0.000 | 0.36s | 677KB |
| token | 100 | 96 | 100 | 100 | 0.33s | 0.69s | 0ms | 0.000 | 0.38s | 722KB |

### Lighthouse failing audits (score < 0.9), mobile

`largest-contentful-paint` ×10 · `uses-long-cache-ttl` ×10 · `uses-responsive-images` ×10 · `unused-css-rules` ×9 · `dom-size` ×5 · `modern-image-formats` ×3 · `interactive` ×2 · `total-blocking-time` ×1 · `max-potential-fid` ×1 · `mainthread-work-breakdown` ×1 · `bootup-time` ×1 · `definition-list` ×1 · `dlitem` ×1 · `aria-prohibited-attr` ×1

### LCP element (throttled Playwright pass, 375px)

| Page | FCP | LCP | LCP element |
|---|---|---|---|
| / | 1240 ms | 1676 ms | hero lead `p.animate-enter-up.text-lead` |
| /about | 896 ms | 1596 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /protocol | 948 ms | 1600 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /indices | 888 ms | 1612 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /indices/blokc5 | 868 ms | 1596 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /security | 876 ms | 1596 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /token | 896 ms | 1576 ms | `img.animate-float` `/brand/token-front.webp` |
| /governance | 864 ms | 1564 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /contact | 880 ms | 1584 ms | PageHero lead `p.animate-enter-up.text-lead` |
| /legal/cookie-policy | 868 ms | 868 ms | body paragraph (no entrance animation, so LCP = FCP) |

**Reading:** on every page that has a hero, the LCP element is the lead paragraph with an **entrance animation** (`animate-enter-up`, which starts at opacity 0). LCP therefore lands about **700 ms after FCP** for motion alone. The legal page has no hero animation and its LCP equals its FCP. Under Lighthouse's simulated mobile throttling this pushes LCP to **3.3–4.5 s, failing the 2.5 s target on every page**. This is a motion-vs-performance conflict, and performance wins the tie.

**No page is CPU-bound in Lighthouse** (median TBT 3–19 ms). An earlier single run showed home at 942 ms TBT; it did not reproduce (see the correction above). Agents C and E measured that the remaining main-thread cost is **idle animation work**: infinite CSS loops plus the footer canvases keep the main thread 9–38% busy at 4× CPU even with nothing animating in view. Early taps during hydration measured 120–200 ms INP (4× CPU), and post-load interactions measured 24–72 ms.

**CLS:** 0.000–0.001 in Lighthouse. During the scripted scroll-through it stays at or below 0.015 on every page and width, which is well under 0.1.

## 4. Accessibility (axe)

Lighthouse a11y: 100 everywhere except **home 94** and **token 96**.

| Page | 375 violations | 1280 violations |
|---|---|---|
| / | definition-list (serious, 1); dlitem (serious, 10) | definition-list (serious, 1); dlitem (serious, 10); empty-table-header (minor, 1) |
| /about | color-contrast (serious, 4) | color-contrast (serious, 4) |
| /protocol | none | none |
| /indices | scrollable-region-focusable (serious, 1) | none |
| /indices/blokc2 | scrollable-region-focusable (serious, 1) | none |
| /indices/blokc5 | scrollable-region-focusable (serious, 1) | none |
| /indices/blokc10 | scrollable-region-focusable (serious, 1) | none |
| /security | none | none |
| /token | aria-prohibited-attr (serious, 1) | aria-prohibited-attr (serious, 1) |
| /governance | none | none |
| /contact | none | none |
| /legal/cookie-policy | landmark-complementary-is-top-level (moderate, 1) | landmark-complementary-is-top-level (moderate, 1) |
| /legal/acceptable-use | landmark-complementary-is-top-level (moderate, 1) | landmark-complementary-is-top-level (moderate, 1) |
| /legal/user-agreement | landmark-complementary-is-top-level (moderate, 1) | landmark-complementary-is-top-level (moderate, 1) |
| /this-page-does-not-exist | none | none |

**Axe rules hit:**

- `definition-list` (serious): <dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script>, <template> or <div> elements. 1 page(s), 2 node-instances. e.g. `.md\:grid-cols-6`
- `dlitem` (serious): <dt> and <dd> elements must be contained by a <dl>. 1 page(s), 20 node-instances. e.g. `a[href$="protocol#architecture"] > .text-\[clamp\(22px\,1\.4vw\+14px\,28px\)\]`
- `empty-table-header` (minor): Table header text should not be empty. 1 page(s), 1 node-instances. e.g. `.w-\[22\%\]`
- `color-contrast` (serious): Elements must meet minimum color contrast ratio thresholds. 1 page(s), 8 node-instances. e.g. `.h-full[data-reveal-item=""]:nth-child(1) > article > .-right-2.-top-6.text-\[96px\]`
- `scrollable-region-focusable` (serious): Scrollable region must have keyboard access. 4 page(s), 4 node-instances. e.g. `.overflow-x-auto.mt-1\.5.text-\[13px\]`
- `aria-prohibited-attr` (serious): Elements must only use permitted ARIA attributes. 1 page(s), 2 node-instances. e.g. `.h-4`
- `landmark-complementary-is-top-level` (moderate): Aside should not be contained in another landmark. 3 page(s), 6 node-instances. e.g. `aside`

Automated tools catch roughly 30–40% of WCAG issues. Keyboard, screen-reader, focus-order, target-size and contrast-in-state checks are Agent D's manual pass.

## 5. Page metrics, console, SEO surface

| Page | Status | CLS 375 | CLS 1280 | Height 375 / 1280 (px) | DOM nodes | Images (no alt) | Console errors | Failed requests |
|---|---|---|---|---|---|---|---|---|
| / | 200 | 0.01 | 0.0145 | 24411 / 16164 | 2337 | 110 (0) | 0 | 0 |
| /about | 200 | 0.0104 | 0.0063 | 11628 / 8462 | 968 | 28 (0) | 0 | 0 |
| /protocol | 200 | 0.0099 | 0.0061 | 9674 / 7159 | 912 | 28 (0) | 0 | 0 |
| /indices | 200 | 0.0099 | 0.0061 | 10322 / 7177 | 1309 | 66 (0) | 0 | 0 |
| /indices/blokc2 | 200 | 0.0099 | 0.0061 | 8878 / 6569 | 1015 | 41 (0) | 0 | 0 |
| /indices/blokc5 | 200 | 0.0099 | 0.0061 | 9192 / 6645 | 1056 | 47 (0) | 0 | 0 |
| /indices/blokc10 | 200 | 0.0104 | 0.0061 | 9498 / 6729 | 1127 | 57 (0) | 0 | 0 |
| /security | 200 | 0.0099 | 0.0061 | 7597 / 5169 | 785 | 17 (0) | 0 | 0 |
| /token | 200 | 0.0099 | 0.0061 | 6550 / 4485 | 786 | 19 (0) | 0 | 0 |
| /governance | 200 | 0.01 | 0.0063 | 4882 / 3765 | 659 | 17 (0) | 0 | 0 |
| /contact | 200 | 0.0099 | 0.0058 | 3973 / 3163 | 675 | 16 (0) | 0 | 0 |
| /legal/cookie-policy | 200 | 0.0099 | 0.0058 | 3787 / 2877 | 536 | 16 (0) | 0 | 0 |
| /legal/acceptable-use | 200 | 0.0099 | 0.0058 | 5089 / 3775 | 571 | 16 (0) | 0 | 0 |
| /legal/user-agreement | 200 | 0.0099 | 0.0058 | 14673 / 8739 | 595 | 16 (0) | 0 | 0 |
| /this-page-does-not-exist | 404 | 0.0099 | 0.0058 | 1838 / 1491 | 439 | 17 (0) | 1 | 0 |

**Console errors (unique):** 
- `Failed to load resource: the server responded with a status of 404 (Not Found)`

**Failed requests (unique):** none

The only console error is the expected `404` document response on the not-found route. No hydration warnings appear (but this is a production build; dev-mode hydration checks are Agent K's job). There are no failed network requests. The live Arbitrum RPC and Chainlink reads succeeded during capture.

### SEO surface (from rendered DOM, 1280)

| Page | <title> | H1 count | Meta description | Canonical |
|---|---|---|---|---|
| / | BLOK Capital · Non-custodial wealth management on Arbitrum | 1 | 157 chars | / |
| /about | About · BLOK Capital | 1 | 91 chars | /about |
| /protocol | Protocol · BLOK Capital | 1 | 145 chars | /protocol |
| /indices | Indices: BLOKC2, BLOKC5, BLOKC10 · BLOK Capital | 1 | 168 chars | /indices |
| /indices/blokc2 | BLOKC2: Bitcoin and Ether · BLOK Capital | 1 | 121 chars | /indices/blokc2 |
| /indices/blokc5 | BLOKC5: Five DeFi blue chips · BLOK Capital | 1 | 141 chars | /indices/blokc5 |
| /indices/blokc10 | BLOKC10: The wider DeFi stack · BLOK Capital | 1 | 168 chars | /indices/blokc10 |
| /security | Security · BLOK Capital | 1 | 99 chars | /security |
| /token | $BLOKC token · BLOK Capital | 1 | 86 chars | /token |
| /governance | Governance · BLOK Capital | 1 | 87 chars | /governance |
| /contact | Contact · BLOK Capital | 1 | 118 chars | /contact |
| /legal/cookie-policy | Cookie Policy · BLOK Capital | 1 | 36 chars | /legal/cookie-policy |
| /legal/acceptable-use | Acceptable Use Policy · BLOK Capital | 1 | 44 chars | /legal/acceptable-use |
| /legal/user-agreement | User Agreement · BLOK Capital | 1 | 37 chars | /legal/user-agreement |
| /this-page-does-not-exist | Page not found · BLOK Capital | 1 | 167 chars | / |

Note: the 404 route's canonical resolves to `/`, inherited from the layout's `alternates.canonical`.

## 6. Responsive & motion
### Horizontal overflow sweep (320–1920)

No page overflows horizontally at 320 / 375 / 414 / 768 / 1024 / 1280 / 1440 / 1920.

### Reduced motion (1280, prefers-reduced-motion: reduce, no scroll)

| Page | Reveal targets still hidden | Infinite animations running |
|---|---|---|
| / | 0 | 0 |
| /about | 0 | 0 |
| /protocol | 0 | 0 |
| /indices | 0 | 0 |
| /indices/blokc2 | 0 | 0 |
| /indices/blokc5 | 0 | 0 |
| /indices/blokc10 | 0 | 0 |
| /security | 0 | 0 |
| /token | 0 | 0 |
| /governance | 0 | 0 |
| /contact | 0 | 0 |

The reduced-motion check passes on all 11 primary pages: no reveal target is left hidden and no infinite animation keeps running.

## 7. Headline baseline (the "no regression" bar for Phase 4)

| Metric | Baseline | Target |
|---|---|---|
| Mobile Lighthouse perf (median of 3) | 89 home · 86 contact · 90–92 others | ≥ 90 every page |
| Mobile LCP (Lighthouse sim) | 3.34–4.47 s (all fail) | < 2.5 s |
| Mobile TBT (INP proxy, median of 3) | 3–19 ms all pages (home 13) | hold ≤ 50 ms; early-tap INP ≤ 150 ms at 4× CPU |
| CLS | ≤ 0.015 everywhere | < 0.1 (hold) |
| Lighthouse a11y | 94 home · 96 token · 100 others | 100 all |
| axe violations (rule × page, 375+1280) | 7 rule types, 12 rule×page instances | 0 serious/critical |
| Lighthouse BP / SEO | 100 / 100 everywhere | hold |
| Horizontal overflow 320–1920 | none | hold |
| Console errors | 0 (besides the 404 doc) | hold |
| First-load JS | 141 kB home · 103 kB shared | no increase |
| HTML weight | 478 kB raw / 63 kB gz home | reduce |
| Build / typecheck / lint | ✅ / ✅ / 2 warnings | ✅ / ✅ / 0 warnings |
| Tests | none | add smoke + a11y + visual checks (proposal) |
| Field CWV (CrUX) | not checked | owner to supply if available |
