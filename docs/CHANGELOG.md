# Changelog: `redesign` audit and improvement pass (Oct 2026)

All changes are on the local `redesign` branch (not pushed). Bracketed IDs refer to findings in `docs/audit/findings/*.md`; D-numbers refer to the decision ledger in `docs/audit/PHASE3_BRIEF.md`. The roadmap was deliberately left unchanged, and owner-only facts and legal text were not invented.

## Tooling and safety net (Wave 0)
- **Regression suite** (Playwright + axe) covering routes, console errors, hash links, WCAG 2.2 AA in opened states (menus, sheet, banner, dialog), keyboard order, consent behaviour, reduced motion and layout overflow. It also includes an opt-in LCP gate (`PERF=1`). [T-01]
- **CI workflow** (`.github/workflows/ci.yml`): typecheck, lint, build, a dead-Tailwind-class check, an internal link/anchor check, and the test suite. Node is pinned (`.nvmrc` 22) and a `browserslist` is added, so Safari/iOS 15.4+ get `-webkit-backdrop-filter`. [T-02, MISS-06, MISS-09]
- Dependencies: `next` 15.5.22 → 15.5.27 (patch); `npm audit fix` took advisories from 17 to 11; `@eslint/eslintrc` is declared. [T-03, SEC-21, MISS-05]
- The README is rewritten for the current site. [MISS-12]

## Design foundation (Wave 1)
- **Tokens:** colour primitives with semantic roles (accent, emphasis, data, progress, success, warning, danger) that resolve correctly in Night garden islands; border tokens; opacity steps 6/7/8/12. 23 `border-line/12` / `bg-line/12` uses that rendered as an off-brand grey ring or nothing now render as intended hairlines. Day sand is `#836122` (AA headroom). [F-01, F-02, VIS-01, VIS-08, VIS-15; D-22]
- **Focus ring:** no longer reshapes pill buttons; dark components on light pages get a visible ring; there's an inset variant for clipping containers. [VIS-02, MOT-09, A11Y-05, A11Y-16]
- **Fonts:** Newsreader is loaded at 400 only, and mono falls back to a mono stack. Preloaded fonts dropped from **171 kB to 95 kB** per page, and the `/about` font-swap CLS from 0.064 to about 0.004. [F-03, PERF-02, PERF-09, VIS-07]
- **Type scale:** rem-based with `display-sm`/`display-md` steps; `.label-caps`; measure tokens. [F-04, VIS-03–06]
- **Layout tokens:** spacing, `Container`, radius, elevation and named z-index layers. [F-05]
- **Motion system:** duration, easing, distance and stagger tokens; LCP-safe `rise`; `motion-off:` and `can-hover:` variants; `useMotionAllowed()`. Decorative loops pause when off-screen, which takes idle main thread from **9–34 % to 0 %** at 4× CPU. A site-wide **Pause motion** toggle is applied before paint. Headline words ink in without starting invisible. [F-06, MOT-02/03/13/14/15, PERF-04, A11Y-19; D-12]
- **Print stylesheet:** no repeated header or cookie banner, dark sections print legibly, and token figures print correctly ("10B", not "0B"). [F-07, MISS-02]
- The consent banner comes first in the DOM; `lang="en-GB"`. [A11Y-03, D-20]

## Navigation, consent, shared UI, explainers, data (Wave 2)
- **Navigation:**
  - **P0:** desktop menu keyboard order fixed; Escape closes menus from anywhere; outside taps close them. [A11Y-01, 06, 24; MOB-16]
  - **P0:** the mobile menu is a real modal: focus is trapped, the background is inert, and the Discord button is pinned in the thumb zone. Same-page links close it, and rotating an iPad no longer freezes the page. [A11Y-02, 36; MOB-02, 03, 05, 21; UX-23]
  - Phones get a persistent icon Discord button, and the announcement bar is hidden below 640 px. The bar's CTA no longer truncates or clips its focus ring. Short landscape screens get a compact header that hides on scroll. [CRO-01, UX-03, MOB-01/02/13/15, A11Y-04/40; D-05]
  - Labels: "Protocol overview", "How the DAO decides", "The DAO on Aragon". **Security** is a top-level link, Whitepaper is added, and every Discord button reads "Join the Discord". [UX-12/13, CRO-10/17; D-07, D-13]
- **Consent and analytics:**
  - **P0:** withdrawing consent now stops Google Analytics immediately (`ga-disable` kill switch). Consent Mode defaults to *denied*. The unused **Marketing** category is removed and `CONSENT_VERSION` → 2, so everyone is asked once more. [SEC-03, SEC-05, SEC-22; D-14]
  - Compact phone banner (121 px, was 190–241), landscape bar, Reject and Accept styled identically, focus restored, clearer switches. [A11Y-03/12/18, MOB-01/14, SEC-23; D-15]
  - Video: `youtube-nocookie.com`, a self-hosted poster, a notice, focus on play, and caption parameters. There are no Google requests before Play. [SEC-04, A11Y-09/23, PERF-06; D-26]
  - Consent-gated **event taxonomy**: `join_group` by placement as the key event, plus `cta_click`, `select_content`, `section_view` and `exception`. The cookie copy is now accurate. [CRO-09, CRO-21, MISS-07; D-16]
  - The error page announces correctly; a styled `global-error`. [A11Y-38, CRO-28]
  - **Drafts for counsel (not published):** `docs/legal-drafts/privacy-policy.md` and `cookie-policy.md`. [SEC-01, SEC-02]
- **Shared UI:**
  - `Hint` toggletip; `CopyButton` with a cross-platform fallback; `Button` with a visible ↗ on external links; a fixed `Badge` vocabulary at AA contrast; `Card` variants; `FaqList` CTAs; `Icon`; `RiskNote`; `StatusLine`; `Breadcrumb`. [G-04, G-14; A11Y-10/11/37, SEC-17, UX-11, VIS-09/18, CRO-11/26]
  - `PageHero` is LCP-safe (rise-only), with the keyword in the h1. [PERF-01, MOT-01, SEO-11; D-32]
  - The footer is regrouped to mirror the nav, gains an operator legal line and the Pause-motion toggle, and no longer prefetches every route. [UX-13, SEC-19, SEO-22, PERF-07; D-21]
  - Count-ups show real values ("Decimals 18", never "0"), and the CTA band heading reads correctly to screen readers. [MOT-12, A11Y-21, SEO-17; D-34]
  - Footer and CTA canvases: **271–505 → 43–57 ms/s** while active, then 0 once settled. [G-15, MOT-04]
  - Focus moves to the new page after client navigation. [A11Y-22]
- **Explainers:**
  - Any tap stops autoplay; there's no autoplay on touch or below `lg`; DecisionPipeline gets a pause and plays once. [UX-06, MOB-04/11, A11Y-08/20/34, MOT-05; D-12]
  - Reserved panel heights mean no layout shift during autoplay. [MOB-10, MOT-06]
  - One roving-tab model with visible selection. [A11Y-16/17/35]
  - RebalanceLab moves 1:1 and is accessible. [MOT-07, A11Y-29, MOB-20]
  - AllocationExplorer renders without JS. [MOT-08, A11Y-28]
  - Quiet live status. [A11Y-27]
  - Loops settle within 5 s on composited properties, and the meaningless orbit rotation is removed. [MOT-02/03, PERF-04; D-33]
  - How it works on phones uses one mock instead of three (2,590 → 1,894 px). [UX-14, MOB-17]
- **Data:**
  - The CredShields dates were verified from the report: audited 15–20 Nov 2024, retested 28 Nov 2024, report 1 Dec 2024. [D-04, CRO-05, SEO-04b]
  - The $BLOKC address is stored in EIP-55 form. [SEC-16]
  - The Farcaster and docs links point at their final URLs. [MISS-08]
  - Honest audit-tool labels. [SEC-27]
  - "Professionally curated" is replaced with the accurate split. [CRO-14]
  - FAQ CTAs, and "When can I use it?". [CRO-11, CRO-08 part]

## Pages (Wave 3)
- **Home:**
  - LCP-safe hero (LCP−FCP **412 → 0 ms**) with "Explore the indices", "Hear first on Discord", the status line, a scoped audit claim and a risk line. [P-01; PERF-01, MOT-01, CRO-02/05/07, INS-01; D-06]
  - Restructured as moves and merges: the explorer and full ecosystem move to `/protocol`; index cards replace the duplicate explorer; proof is merged into one section; governance becomes a compact strip. **DOM 2,453 → 1,986; height at 375 px 24,689 → 19,579 px.** Every old anchor still resolves. [UX-04/05/07/09; D-08 a–e]
  - The At-a-glance list markup is fixed. [A11Y-07]
  - Problem table semantics. [A11Y-26]
  - Product art plays once. [MOT-02/03]
- **Protocol:**
  - The canonical "how" page, with the explorer and ecosystem. [UX-04]
  - Product anchors land correctly. [UX-02]
  - A six-term glossary. [CRO-15]
  - The Whitepaper in "Start here". [CRO-24]
  - The receding product deck works again: an existing bug, where the animation shorthand reset the timeline.
- **Security:** a launch-readiness checklist, a contract registry, a who-can-do-what matrix, a "Stay safe" notice, official links and consistent audit dates, all from facts already on the site, with `TODO(owner)` markers. [INS-03/04/05, SEC-09/10/15/27]
- **Indices / detail pages:** a definitional first sentence; detail pages link to the shared method instead of repeating it; the matrix fits at 320 px; the formula wraps; factsheet additions; risk line; contextual links; **lint at 0 warnings**. [SEO-09/12/16, UX-08, MOB-07/08, A11Y-13, INS-08, CRO-07; D-08g]
- **Token:** planned utilities in the future tense; a grouped EIP-55 address with chain ID; key facts; a risk line. [CRO-13, SEC-16, A11Y-14/33, SEO-12]
- **Governance:** the full proposal board with "As of" dates, one status label and one empty state. [UX-07/15/16, CRO-17/23; D-08e]
- **About:** governance wording is true today; the story has a heading; decorative numerals come from CSS; a consistent team grid. [CRO-06, UX-21, A11Y-15, MOB-18, VIS-20]
- **Contact:** a next step after the FAQ. [UX-20]
- **Legal (template only; policy text unchanged):** a sticky Contents sheet on phones; decoded headings; the shared breadcrumb; external links marked. [A11Y-25, UX-11/18/24, SEO-20]
- **404:** five exits plus a Discord line. [UX-19, CRO-28]

## SEO, trust, performance (Wave 4)
- **Per-page metadata:** every page has its own title, description, `og:url` and share image, via the `pageMetadata()` helper. The 404 is `noindex`. [S-01; SEO-01/02/05/10]
- **Social cards:** new Day garden cards with the BLOK mark and Newsreader, plus per-section cards for each index, `/token`, `/security` and `/protocol`. [S-02; SEO-02, MISS-04]
- **Structured data:** now matches the site, with the fee text from the FAQ, limited availability, the full entity and address, a square logo and `<` escaping. [S-03; SEO-03/08/13, SEC-24]
- **`llms.txt` / `llms-full.txt`:** corrected facts, an identity block, and Docs/Legal/Optional sections. Roadmap content is unchanged. [S-04; SEO-04/14]
- **Crawling:** authored sitemap dates; robots cleanup; `noindex` on RSC payloads and preview hosts. [S-05/06; SEO-06/07/18/19]
- **Security headers:**
  - hardening (nosniff, Referrer-Policy, X-Frame-Options, COOP, Permissions-Policy);
  - **CSP in Report-Only**;
  - `security.txt`;
  - long caching for `/tokens/*`.

  [S-06; SEC-06/07/14, PERF-11; D-27]
- **Short redirects:** `/legal`, `/whitepaper`, `/docs`, `/discord`, `/tokenomics`, `/team`, `/roadmap`, `/audits`, and upper-case index tickers. [X-07, MISS-10; D-28]
- **Manifest:** Day garden colours, an honest name, `display: browser`, and an opaque Apple icon. `og:locale` is `en_GB`. [MISS-03 part; D-20]
- **Stay safe notice:** on `/contact`. [SEC-09]
- **Images:** pre-sized to about 2× their display size, and the hero `srcset` matches the real files. [X-01; PERF-05/06]
- **Unused assets:** moved to `design/archive/`, not deleted. Dead code and no-op classes are removed. [X-03; MISS-11; D-24]
- **Live data:** per-feed results, so one bad feed blanks only its own row; honest wording; no 1-second clock. [X-05; UX-10/17, PERF-13; D-29]
- **Lighter pages:** EasterEggs loads after idle; menu contents render on first open; the dark-band watcher uses IntersectionObserver. [X-06; PERF-08/12, MISS-16]
- **Hydration fix:** a keyed `Fragment` in `<main>` stops an intermittent React #418 error under load (React 19.2 replay issue), with an opt-in stress test.
- **Fixes:**
  - the CTA band `id`, so `section_view` fires;
  - a default ring colour from the focus token;
  - `brand/mark.png` restored for social-card rendering.

## Deferred / not done
- **Roadmap:** frozen by the owner. CRO-03, INS-02, MISS-01 (roadmap parts), SEO-04c and D-08f were not touched.
- **Token codemod (F-08):** about 190 arbitrary font sizes and other class drift still to migrate onto the new tokens. Deferred by the owner on 2026-10-12; the plan is in `docs/DESIGN_SYSTEM.md` §8.
- **Needs owner facts:** the launch date, Discord-vs-X channel order, new FAQ facts (pooled rebalancing, exit path, gas, regulation, presale), team roles, press email, `security@` mailbox, Aragon parameters and timelocks, a vector logo, and the items marked `TODO(owner)` in `src/components/security/*`.
- **Needs counsel:** publishing the Privacy Policy and Cookie Policy (drafts are ready), UA §15 arbitration, governing law, risk wording, and the UK/EU crypto-promotion position.
- **Storytelling sequences (X-11):** deferred.
- **Before/after screenshots** were not retaken in the final check (time). Lighthouse, axe and the test results are in `docs/RESULTS.md`.
