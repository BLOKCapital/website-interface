# Results: before / after (Oct 2026 audit and improvement pass)

Baseline: `5beb0ee` (2026-10-11, `docs/audit/BASELINE.md`). After: `redesign` @ `fa1e06f` (2026-10-12). Same machine and method for both: static export served locally, Lighthouse 12.2.1 mobile as the **median of 3 runs**, Chrome headless. Everything is local and unpushed.

## Build health

| Check | Before | After |
|---|---|---|
| Typecheck | ✅ | ✅ |
| Lint | 2 warnings | **0 warnings** |
| Build | ✅ 26 pages | ✅ 32 pages (adds per-section social cards) |
| Tests | none | **165 passed, 0 failed** (6 opt-in perf/stress skipped) |
| CI | none | GitHub Actions: typecheck, lint, build, dead-class check, link check, Playwright + axe |
| Known accessibility violations (axe, WCAG 2.2 AA incl. opened menus, sheet, banner, dialog) | 7 rule types | **0** (allow-list empty) |

## Lighthouse mobile (median of 3)

| Page | Perf before → after | A11y before → after | LCP (simulated) before → after | FCP (simulated) before → after | TBT | CLS |
|---|---|---|---|---|---|---|
| home | 89 → **90** | 94 → **100** | 3.69 → 3.59 s | 1.36 → 1.51 s ⚠ | 13 → 1 ms | 0 → 0 |
| about | 92 → **93** | 100 → 100 | 3.34 → 3.13 s | 1.21 → 1.36 s ⚠ | 5 → 0 ms | 0.001 → 0 |
| protocol | 91 → **93** | 100 → 100 | 3.41 → 3.21 s | 1.21 → 1.36 s ⚠ | 5 → 1 ms | 0 → 0 |
| indices | 90 → **91** | 100 → 100 | 3.60 → 3.51 s | 1.36 → 1.36 s | 6 → 2 ms | 0 → 0 |
| indices/blokc5 | 90 → **92** | 100 → 100 | 3.60 → 3.36 s | 1.36 → 1.36 s | 4 → 0 ms | 0 → 0 |
| security | 92 → **93** | 100 → 100 | 3.34 → 3.22 s | 1.21 → 1.36 s ⚠ | 3 → 2 ms | 0.001 → 0 |
| token | 91 → **92** | 96 → **100** | 3.50 → 3.29 s | 1.21 → 1.36 s ⚠ | 7 → 0 ms | 0 → 0 |
| governance | 92 → **93** | 100 → 100 | 3.35 → 3.13 s | 1.21 → 1.36 s ⚠ | 19 → 0 ms | 0.001 → 0 |
| contact | 86 → **92** | 100 → 100 | 4.14 → 3.28 s | 1.21 → 1.36 s ⚠ | 6 → 0 ms | 0.001 → 0 |
| legal/cookie-policy | 90 → **92** | 100 → 100 | 3.54 → 3.29 s | 1.21 → 1.36 s ⚠ | 3 → 4 ms | 0 → 0 |

**Every page is now at or above the ≥ 90 target. Accessibility is 100 on every page. LCP improved on every page.**

⚠ **Regression to fix next:** *simulated* FCP is about 150 ms later on most pages. The likely cause is the bigger render-blocking stylesheet: the new token, motion and print CSS, plus more HTML. The suggested fix is to move the print rules to a `media="print"` stylesheet and re-test inline critical CSS (PERF-10) on a Cloudflare preview. The simulated LCP stays above 2.5 s because Lighthouse's simulation counts every early byte on localhost (PERF-03). The real-user gate is LCP − FCP.

## Lab measurements (throttled Playwright, 4× CPU)

| Metric | Before | After |
|---|---|---|
| LCP − FCP on hero pages (`/`, `/protocol`, `/token`, `/about`) | 412–700 ms (hero lead started invisible) | **0 ms** (opt-in `PERF=1` gate passes) |
| Preloaded fonts per page | 171 kB | **95 kB** |
| `/about` font-swap CLS (throttled) | 0.064 | **≈ 0.004** |
| Idle main thread, no animation in view | 9–34 % busy | **0 %** |
| Footer + CTA canvases while active | 271–505 ms/s | **43–57 ms/s**, then 0 once settled |
| Home DOM nodes | 2,453 | **1,986** |
| Home height at 375 px | 24,689 px | **19,579 px** |
| Phone first screen (375×667): chrome covering the viewport | 46 %, no hero CTA visible | primary CTA visible above a 121 px cookie card |

## Fixed P0s (release blockers)

| ID | Issue | Status |
|---|---|---|
| SEC-03 | Withdrawing consent didn't stop Google Analytics | ✅ fixed and covered by a test |
| A11Y-01 | Desktop menu keyboard focus order | ✅ fixed and covered by a test |
| A11Y-02 | Mobile menu not modal; focus escaped behind it | ✅ fixed and covered by a test |
| SEC-01 / SEC-02 | No Privacy Policy; Cookie Policy contradicts the site | ⚠ **drafts ready for counsel** in `docs/legal-drafts/`; **not published**. GA4 should stay off in production until the Privacy Policy is live. |

Also fixed: an intermittent React hydration error (#418) under load, which was a React 19.2 replay issue. The fix is a keyed `Fragment` in `layout.tsx`, with an opt-in stress test (`STRESS=1`).

**Follow-ups done on 2026-10-12:** print CSS loads with `media="print"`, so it's off the critical path and no longer prints a blank first page; hover styles apply only on hover-capable devices; the last decorative float loop now settles. Tests: 165 passed, 0 failed.

## Remaining backlog (by priority)

**Needs the owner or counsel (not code):**
- **P0:** publish the Privacy Policy and the rewritten Cookie Policy (counsel); until then keep GA4 off in production.
- **P1:** UA §15 arbitration clause, governing law, risk wording, UK/EU crypto-promotion position (counsel).
- **P1:** re-date the frozen roadmap; Q3 '26 items still read "Next" (CRO-03, INS-02, MISS-01).
- **P1:** Cloudflare: www → apex redirect, Access/noindex on previews (the `redesign` preview is public), HSTS, fix the `app.blokcapital.io` redirect loop; DNS DKIM and DMARC.
- **P1:** confirm the "Stay safe" wording, and the `TODO(owner)` items in `src/components/security/*` (readiness rows, audit coverage, the rebalancer "move funds out" cell, ticket channel).
- **P2:** launch date, Discord-vs-X channel order, new FAQ facts, team roles, press email, `security@` mailbox, Aragon parameters, a vector logo, reviewed video captions and transcript, GA4 admin settings.

**Engineering follow-ups:**
- **P2:** the FCP regression above. Print CSS is now split out (render-blocking CSS 21.0 → 20.6 kB gz). Most of the rest is new UI plus about 190 one-off class values; the token codemod (F-08) or a critical-CSS test on a preview are the remaining levers.
- **P2:** enforce the CSP after a Report-Only period on a preview.
- **P2:** the token codemod (F-08): about 190 arbitrary font sizes and other drift onto tokens, plus an ESLint guard. The map is in `docs/DESIGN_SYSTEM.md` §8.
- **P3:**
  - `Card`/`ArrowLink`/`RevealItem` don't pass through `data-*`;
  - `SplitText` keeps a second text copy (SEO-17);
  - home HTML is 33.9 kB br against a 32 kB target;
  - the CTA sits under the cookie card at 320×568 (accepted: fixing it would mean hiding the lead text on tiny screens).
- **P3:** storytelling sequences (X-11), index JSON download, RebalanceLab step buttons.

Before/after screenshots were not retaken in this run, to save time. Re-run them with `node docs/audit/tools/capture.mjs <url> <outdir>` against a build.
