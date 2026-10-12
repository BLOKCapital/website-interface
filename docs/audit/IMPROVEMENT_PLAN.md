# IMPROVEMENT_PLAN: BLOK Capital marketing site

**Phase 2 synthesis.** It covers `redesign` @ `5beb0ee` as of 2026-10-11, and draws on 11 Phase 1 audits (A–K): 252 raw findings, merged here into 56 repo backlog items plus 9 owner/ops actions. The raw findings are in `docs/audit/findings/*.md`, and IDs in brackets point back to them.

> **Status (2026-10-11): approved by the owner, with the roadmap frozen.** See `PHASE3_BRIEF.md` for the decision ledger. Recommended answers are approved; roadmap items and owner-fact items are skipped.

---

## 0. Baseline corrections

| BASELINE said | Re-measured | Action |
|---|---|---|
| Home mobile Lighthouse **perf 63, TBT 942 ms** | Three independent re-measures agree: Agent E (perf 88–89, TBT 13–18 ms), Agent C (TBT 12–22 ms) and the orchestrator's clean median of 3 (**perf 89, TBT 13 ms**). The original run was CPU-contended: its observed FCP was 4× the reruns'. | BASELINE §3/§7 now shows the median of 3 for every page. Home is **not** CPU-bound. Every later Lighthouse comparison uses the median of ≥3 runs. |
| Mobile LCP 3.3–4.5 s "because of the hero animation" | **Two separate effects:** (1) the opacity-0 hero lead only counts as LCP at the web-font swap, which adds 0.6–0.7 s to the throttled LCP of real users [PERF-01]; (2) Lighthouse's *simulated* LCP on localhost tracks early bytes (fonts + JS) and barely moves with motion fixes [PERF-03]. | LCP is judged by three gates: a throttled Playwright LCP−FCP ≤ 50 ms, Lighthouse in devtools-throttling mode, and PageSpeed Insights on a Cloudflare preview. Mobile Lighthouse ≥ 90 stays as a target. |
| CLS ≤ 0.015 | `/about` shows **CLS 0.064** under throttling: the Newsreader swap re-wraps the h1 [PERF-09]. | Fixed by the font change (F-03). |
| Footer is dark | The footer is **light** (`bg-canvas`). | SITE_MAP corrected. Keeping it light is a decision for you (D-21). |

---

## 1. Executive summary: top 10 issues by user and business impact

| # | Issue | Why it matters | Sources | Fix size |
|---|---|---|---|---|
| 1 | **Consent and privacy are non-compliant. This blocks release for this branch.** There is no Privacy Policy, although GA4 is live in this branch and the User Agreement incorporates the missing policy. The Cookie Policy says "only strictly necessary cookies". **Withdrawing consent doesn't stop GA** until a reload. The YouTube embed sets ad cookies after "Reject all". The "Marketing" category enables Google ad signals although no marketing tags exist. | This is a legal exposure that becomes live the day `redesign` ships (production doesn't have GA4 yet). It also undercuts the brand promise in the banner itself. | SEC-01, 02, 03, 04, 05, 22; CRO-21 | S code + M legal text |
| 2 | **Honest-data drift.** Q3 '26 milestones still read as "Next" on 11 Oct 2026. Holders "vote" (Q3 '26) and "stake" (Q4 '26) *before* the Q2 '27 IDO. The hero says "Audited by CredShields" without the scope the Security page discloses, and the audit date is both Nov and Dec 2024. About says the DAO is governed by users, "Not us", but only core members vote today. Planned features are written in the present tense. The home schema says fees apply per transaction while the FAQ says fee-free. `llms.txt` contradicts the site. | Honesty is the brand's main asset, and this audience checks claims. It also feeds AI answer engines that quote verbatim. | CRO-03, 05, 06, 13, 14; INS-01, 02; SEO-03, 04; MISS-01 | S code + **owner facts** |
| 3 | **Both navigation menus break keyboard focus order (WCAG A).** In the desktop menus, panel links come after the other triggers. In the mobile sheet, Tab escapes into the hidden page. Hover-opened menus ignore Escape, and on iPad, rotating with the menu open freezes the page. | Primary navigation fails for keyboard, switch and zoom users. These are the only two P0 accessibility findings. | A11Y-01, 02, 06, 24; MOB-03, 16 | S–M |
| 4 | **The primary conversion is unreachable on phones, and nobody measures it.** Below 640 px there's no Discord control after the first scroll; the next one is about 94% down the home page. The first screen at 375×667 is 46% chrome (bar, header, cookie card), with no hero CTA visible, and 77–80% in landscape. GA4 records page views only, so Discord clicks aren't measured. | Mobile social traffic (X, Telegram, Discord) is the main acquisition channel, and nothing can tell whether a fix works. | CRO-01, 02, 09, 10; UX-03; MOB-01, 02, 15; A11Y-03, 04 | S–M |
| 5 | **Every shared link previews as the homepage.** The 10 inner pages and the 404 inherit the home `og:title`, `og:description` and `og:url`. The index pages have **no** share image. The single OG card is the old dark design, with no logo and a fallback font. | Shares on X, Telegram and Discord are the acquisition loop, and "look at BLOKC5" unfurls as bare home text. | SEO-01, 02, 05, 10; MISS-04; SEO-08 | S + M (cards) |
| 6 | **Hero LCP is gated on a fade-in plus web-font arrival.** The LCP element (hero lead) starts at opacity 0. Newsreader requests an unused weight (500), so Google serves heavier variable files (189 kB of fonts per page). | Measured fixes: LCP −0.6 to −0.7 s, fonts −74 kB per page, `/about` CLS 0.064 → 0.004, and mobile Lighthouse → 91–93. | PERF-01, 02, 05, 09; VIS-07 | S |
| 7 | **Wayfinding breaks on the core "understand" flow.** The hero's "How it works" jumps 4,900 px past the actual "How it works" section. The home product tiles land about 2,000 px past their targets on `/protocol` (desktop, client-side navigation). "How it works" has three destinations. "Vote on Aragon" invites visitors to do something they can't. | Flow F2 (understand the product) starts wrong for every new visitor. | UX-01, 02, 12; CRO-12, 17; A11Y-39 | S |
| 8 | **The home page is too long and repeats deeper pages.** It has 15 sections and is 24,300 px at 375 (about 30 screens). "How" is told twice; five proof sections run back to back; the index explorer is duplicated from `/indices`; and `/protocol` (the nav's "How it works") lacks the explorer and the ecosystem. | The CTA band sits at about screen 29 on phones. Home has 2,343 DOM nodes and 466 kB of HTML. | UX-04, 05, 07, 09, 14; MOB-12, 17; PERF-08 | M (**owner approval**) |
| 9 | **Autoplay explainers fight the reader, and decorative loops never stop.** On touch, ProtocolExplorer and DecisionPipeline ignore taps and keep advancing. DecisionPipeline has no pause (WCAG 2.2.2). Panel heights jump by 110–190 px per step. Home runs about 50 infinite CSS loops (20+ on non-composited properties), mostly off-screen, keeping the main thread 9–38% busy while idle. The two footer canvases cost another 279–514 ms/s on every page. | The explainers are where trust gets built; motion-sensitive users and battery suffer. | UX-06; MOB-04, 10, 11; A11Y-08, 19, 20; PERF-04; INS-12; MOT-02–06 | S–M |
| 10 | **Security headers and anti-phishing are thin for a crypto brand.** There's no CSP, HSTS, framing protection or Permissions-Policy, and no `security.txt`. No "we never DM first" warning or official-links list exists. The **unreleased `redesign` preview is publicly indexable**, `www` doesn't redirect, and `app.blokcapital.io` is a redirect loop. | An injected script could swap addresses or invites, and impersonation is the top user risk in crypto. Verified: a CSP is feasible on the static export with 0 violations. | SEC-06–11, 14, 18; SEO-06; MISS-08 | S code + owner DNS/Cloudflare |

**Underneath all ten:** there are no tests and no CI, so 23 Tailwind classes that render nothing have shipped. Examples: every `border-line/12` falls back to an off-brand grey ring beside the Discord CTA, and the governance and token timeline rails are invisible [VIS-01, MISS-06]. The plan adds a smoke/a11y/visual check suite first, so Phase 3 has a regression net.

---

## 2. Conflict resolutions (accessibility and performance win ties)

| Conflict | Resolution |
|---|---|
| **Hero entrance motion vs LCP** (C vs E) | **Perf wins.** Rule R1: the LCP candidate (hero/PageHero lead on mobile; h1 on desktop `/about` and `/token`; the `/token` coin; the desktop home render) is fully visible at first paint: opacity 1, no delay, no clip, no blur. Transform-only motion starting at opacity 1 is allowed, and siblings (eyebrow, chips, CTAs) may still animate. Gate: LCP − FCP ≤ 50 ms. |
| **Decorative loops vs CPU, battery and 2.2.2** (C vs E, D) | **Perf and a11y win.** Loops pause off-screen (`data-loop` + `data-inview`), use composited properties only, run ≤ 4 in view, and settle within 5 s on a still frame, replaying on hover/focus (D-33). A site-wide "Pause motion" control is recommended (D-12). |
| **Autoplay storytelling vs reading control** (C/A vs D/G) | **A11y wins.** Any tap, click or focus on a tab stops autoplay (RulesDemo's existing rule). There's no autoplay below `lg` or on `(hover: none)`. Every autoplaying widget gets a pause button, and panel height is reserved to stop jumps. |
| **Compact consent banner vs "equal prominence" vs keyboard order** (G vs H vs D) | They are compatible. The banner moves to the start of the DOM (first Tab stop), stays visually at the bottom, and on phones becomes a one-row card with Reject and Accept styled identically and Manage as an equal-height ghost button. Landscape gets a bottom bar. `scroll-padding-bottom` is set while it shows. |
| **Announcement bar vs phone first screen** (I vs G) | Below 640 px the bar is hidden and replaced by a **persistent icon Discord button in the header** (44 px). Its message moves to the hero status line. This changes navigation structure, so it's listed as decision D-05. |
| **Render menus on open (perf) vs crawlability and a11y** (E vs F, D) | Allowed. Footer links stay in the HTML, so crawlability holds. Menu panels render on first open, `aria-controls` targets are re-checked, and focus management is tested (A11Y-01/02 tests). |
| **Inline CSS (−0.4 s FCP) vs HTML weight** (E) | **Not now.** It adds 35 kB gz to every page and brings CLS back. It will be re-tested on a Cloudflare preview after the font and DOM fixes. |
| **`<Suspense>` per home section** | **Rejected.** Measured worse early-tap INP (192 vs 144 ms). |
| **Stage-2 CSP hashes (+6 kB HTML) vs perf** (H vs E) | Do Stages 0–1 now (header, no HTML cost). Stage 2 (meta hashes) comes later as an opt-in. |
| **Removing duplicate home sections vs content preservation** (A vs Ground Rule 7) | Nothing is deleted. Each item is a **move or merge**, listed individually in decision D-08 for approval. |
| **Hover-only-when-supported (fixes stuck hover on touch) vs Hint tooltip on iOS** (G) | Ordered: Hint becomes a tap/click toggletip **before** `hoverOnlyWhenSupported` is enabled. |

---

## 3. Design system spec

The full proposal is in `findings/B-visual-system.md` §3 (tokens, Tailwind config, migration map) and `findings/C-motion.md` (motion system). This section is the approved-to-be summary that `DESIGN_SYSTEM.md` will grow from in Phase 5.

### 3.1 Principles
1. **Evolve, don't replace.** Keep the Day garden default and the Night garden `.theme-dark` islands, the RGB-triplet variables with `<alpha-value>`, every existing variable name (canvases read them), Inter / Newsreader / JetBrains Mono, and the garden metaphor.
2. **Semantic aliases sit on top of the brand tokens:** `accent` (leaf), `emphasis` (sand), `data` (cobalt), `progress` (bloom), `success`, `warning`, `danger`.
3. **Nothing on screen without a token.** An ESLint rule blocks new arbitrary `px` font sizes, `shadow-[…]`, `rounded-[…]` and `z-[…]`.

### 3.2 Tokens (summary)

| Group | Tokens |
|---|---|
| **Colour** | Primitives (paper / night / ink / mist / leaf / bronze / sand / bloom / cobalt / ember / amber) → semantic per theme. **One value change:** Day sand `#8A6726` → `#836122` (AA headroom 4.50 → 4.93 on raised; hue unchanged) [VIS-08]. Badge `current`/`example` text darkened to ≥ 4.5:1 on all light surfaces [A11Y-10]. |
| **Borders** | `border-subtle` (line/0.08), `border` DEFAULT (line/0.12, which also stops the fallback to Tailwind grey), `border-strong` (control boundaries, ≥ 3:1). Opacity scale extended with 6/7/8/12 [VIS-01, VIS-11]. |
| **Focus** | `--focus-ring` (per scope, plus a dark-root-on-light override), `--focus-width: 2px`, `--focus-offset: 3px`. **No border-radius in the focus rule** (it reshaped pill buttons) [VIS-02, A11Y-05]. Inset ring variant for clipping containers [A11Y-16]. |
| **Type (rem, fluid)** | `micro 11` (aria-hidden art only) · `label 12` · `eyebrow 12` · `caption 13` · `small 14` · `ui 15` · `body 16` · `lead 17→20` · `h4 18→20` · `h3 24→28` · **`display-sm 24→36`** · **`display-md 28→46`** · `h2 30→52` · `h1 40→88`. The h1/h2/lead curves are unchanged. One `.label-caps` (mono 12 / 0.12em). Measure `58ch` / `50ch` [VIS-03–06]. |
| **Fonts** | Newsreader `weight: ["400"]` (normal + italic, both preloaded, about 47 kB total). Mono falls back to a mono stack (no Arial reflow). Inter unchanged [PERF-02, VIS-07]. |
| **Spacing / layout** | The 4 px scale stays for internals. Layout tokens: `section` 80→112, `section-sm` 64→96, `header`, `gutter` 20→32, `pad-card`, `pad-panel`. A `<Container size="page·wide·measure">` component (page 1240, wide 1360) [B §3.4]. |
| **Radius** | `xs 4 · tag 6 · control 12 · card 16 · panel 24 · full` (28/32 fold into 24) [VIS-12]. |
| **Elevation** | `e1` (resting/tooltip), `e2` (menus, banner, scrolled nav), `e3` (dialog, sticky deck), `halo`, `inset-accent` [VIS-13]. |
| **Z-index** | `raised 10 · tooltip 30 · nav 50 · banner 55 · overlay 60 · toast 65 · skip 70` [VIS-14]. |
| **Breakpoints** | Tailwind defaults (`sm 640 · md 768 · lg 1024 · xl 1280`), plus an optional `3xl 1600` for wide consoles only. |
| **Motion** | See §3.4. |
| **Print** | A `@media print` layer that hides chrome/banner/canvases, makes fixed elements static, re-maps `.theme-dark` to light, expands `details`, prints CountUp final values, and appends URLs on legal pages [MISS-02]. |

### 3.3 Components and their required states

Every interactive component ships **default · hover (pointer only) · focus-visible · active/pressed · disabled · loading · error** where applicable, with all motion reduced-motion safe. New or changed primitives:

| Component | Change |
|---|---|
| `Button` | Visible ↗ plus a muted host label for external links; equal-weight variant for the consent pair; loading state [SEC-17, UX-11] |
| `Card` | Variants `tone` (default · feature/dark · tint-cobalt · tint-sand · planned/dashed) × `size` × `radius` × `interactive`, replacing about 44 hand-built cards [VIS-09] |
| `Badge` | Fixed status vocabulary: Live · In private testing · In progress · Planned · Done · Example · Voting open [CRO-26, CRO-27] |
| `Hint` | A toggletip: tap/click to toggle, hoverable bubble, Escape closes [A11Y-11, MOB-06] |
| `CopyButton` | A cross-platform failure path ("Select the address to copy"), EIP-55 display [A11Y-37, MOB-23, SEC-16] |
| `FaqList` | Optional `cta` per answer; links allowed in answers (stripped for JSON-LD) [CRO-11, SEO-16] |
| `CtaBand` | `context` variants (default · index · protocol/security); Scramble accessible name fixed [CRO-18, A11Y-21, SEO-17] |
| `PageHero` | LCP-safe lead; keyword label inside the h1; shared `Breadcrumb` [PERF-01, SEO-11, UX-18] |
| **New** `RiskNote` | One line plus links to `/protocol#fees` and the UA; counsel-approved wording [CRO-07, SEC-20] |
| **New** `StatusLine` | Launch status driven by `status.ts.publicLaunch` [CRO-02, CRO-03] |
| **New** `useRovingTabs` | One tab model (arrows, Home/End, orientation by breakpoint) for all 4 tablists [A11Y-35] |
| **New** `Container`, `Icon` | Container widths; a 20 px grid with a 1.5 px stroke [VIS-18] |
| Nav / MobileMenu | Disclosure focus order, modal sheet (dialog, inert background, trap), Escape anywhere, outside-tap close, close on `lg` match, header Discord icon on phones, Discord pinned in the sheet [A11Y-01/02/06/24, MOB-02/03/05/16/21] |
| CookieConsent | First in the DOM, compact phone layout, landscape bar, equal-weight buttons, focus restore, accessible switches [A11Y-03/12/18, MOB-01/14, SEC-23] |
| Footer | Groups mirror the nav (Protocol · Governance · Company · Resources · Legal), operator legal line, FAQ / DAO / llms links, `prefetch={false}`, sr-only h2 + h3 columns [UX-13, SEC-19, SEO-22, PERF-07] |

### 3.4 Motion system

The full spec is in `findings/C-motion.md` §4. Agent C measured every option against the performance rules below.

**Hard rules (E §4, adopted):**
- **R1:** LCP candidates are visible at first paint.
- **R2:** word-split h1s are LCP-safe.
- **R3:** loops use composited properties only, pause off-screen, run ≤ 4 in view, and keep the idle main thread < 5% at 4× CPU.
- **R4:** JS motion runs only in view, at ≤ 15 fps timers.
- **R5:** post-load interactions < 100 ms.

There are no motion libraries; this stays CSS-first.

| Token | Values | Intent |
|---|---|---|
| Duration | `instant 90` · `fast 150` · `base 240` · `slow 420` · `scenic 700` ms (exits ≈ 0.75×) | press · hover/selected · panel/menu · entrance/reveal · one-off storytelling only |
| Easing | `--ease-out (0.22,1,0.36,1)` settle · `--ease-expo (0.16,1,0.3,1)` snap-settle · `--ease-in (0.4,0,1,1)` leave · `--ease-inout (0.65,0,0.35,1)` travel · `linear` loops/timers | named by intent |
| Distance | `xs 2` · `sm 8` · `md 16` · `lg 24` px · press `0.98` · pop `0.96` · blur ≤ 4 px (never on data or LCP) | |
| Stagger | tight 30 · default 60 · words 35 ms · cap 300 ms (words 400) | first reveal only, never repeated UI |
| Variants | `motion-off:` = `prefers-reduced-motion: reduce` **or** `html[data-motion="paused"]`; `can-hover:` = `(hover:hover) and (pointer:fine)`; `future.hoverOnlyWhenSupported` | |
| Keyframes | `rise` (transform only, LCP-safe) · `reveal` (below fold) · `fade-in` · `swap` (panel crossfade) · `pop-in` · `progress` | `enter-up` and `morph-in` are retired |

**Patterns:**
- **Hero:** the LCP group (h1, lead, hero media, CTAs) uses `rise` with opacity 1 on the first frame and no delay [measured: LCP = FCP on `/`, `/protocol` and `/token`; a shorter fade gives no gain]. Only secondary items fade (delay ≤ 150 ms). Settled by about 700 ms.
- **H1 word reveal:** stays as a signature, but words start readable (`fg-subtle`, 5.4:1) and ink to `fg` with a 0.25 em rise. No opacity-0 start, no blur.
- **Scroll reveals:** `RevealScript` stays (`reveal`, md, slow, capped stagger). **Never reveal data being read.**
- **Panel swap:** a crossfade at `base` with no stagger. Height is reserved, never animated.
- **Hover, press and focus:** colour at `fast`, card lift `xs` (pointer only), press `scale(.98)`. The focus ring appears instantly and never reshapes the control.
- **Loops:** composited only, `data-loop` pauses them off-screen, they **settle within 5 s** and rest on a meaningful still frame, and they replay on hover or focus (⚑ D-33).
- **Canvases** (footer `GlyphField`, CtaBand `DotField`): capped at 12–15 fps, redraw dirty cells only, settle about 6 s after entering view, honour `saveData`.
- **Page transitions:** CSS `.page-enter` at `base`/`sm`. The hero doesn't re-run its entrance on soft navigation. View Transitions are a later progressive enhancement only (Next's API is still experimental).
- **Short viewports (≤ 500 px tall):** the header hides on scroll-down via `transform` (spec in C §4.4).

**When NOT to animate:**
1. The LCP element.
2. Primary CTAs (never invisible).
3. Data being read (no count-ups on small or spec values; change feedback is colour only).
4. Repeated UI, and explainers after the user has touched them.
5. Direct manipulation (1:1).
6. Layout properties (height, width, top, left, padding, grid-rows).
7. Off-screen, hidden tab or `saveData`.
8. `motion-off`.
9. Focus.
10. Print.

**Reduced-motion contract:**
- The global override gains `transition-delay: 0s`.
- Hidden states exist only under `html.js` + no-preference + not paused, with no SSR `opacity:0` or `scaleX(0)`.
- One reactive `useMotionAllowed()` hook (`useSyncExternalStore` over `matchMedia` and `data-motion`). Motion-only controls become plain content, not disabled buttons.
- An optional **"Pause motion"** switch in the footer and mobile menu, stored in `localStorage` and applied before first paint by `RevealScript` (⚑ D-12).

**Storytelling (P3, optional, ⚑ D-33):**
- **Hero:** one sequence of about 2.4 s ("value in, keys stay": three lines draw in claim order, chips settle, then rest) replaces the four endless dashes and the float.
- **How it works:** "show the delta" per step.
- **Custody diagram:** connectors draw in order; "funds out" lights only for "You".
- **Rebalance:** user-pressed presets, 1:1 bars.
- **Index basket:** drop the meaningless 160 s orbit rotation. Tokens assemble per index.

---

## 4. Prioritised backlog

Tiers run in order: **Foundation → Global components → Page-by-page → Polish**, plus **Owner/ops actions** that happen outside the repo. P = merged priority, E = effort (S < 2 h, M ½–2 d, L > 2 d). ⚑ means the item needs a decision from §5 first, and § means it touches a proposed do-not-touch area.

### Tier 0: Safety net (runs first, alone)

| ID | Item | Sources | P | E |
|---|---|---|---|---|
| T-01 | **Regression harness in the repo:** Playwright smoke (every route 200, no console errors, no hydration warnings in dev), axe on routes plus opened states (menus, sheet, banner, dialog), Tab-order tests for both menus, the LCP−FCP gate, the capture script from `docs/audit/tools`. Adds devDependencies ⚑ D-30 | MISS-06, A11Y-*, PERF-03 | P1 | M |
| T-02 | **CI (GitHub Actions)** on PR: typecheck, lint (0 warnings), build, link/anchor check on `out/`, dead-Tailwind-class check, the T-01 suite. Node pinned (`.nvmrc`, `engines`), `browserslist` added ⚑ D-30 | MISS-05, 06, 09 | P1 | M |
| T-03 | Patch dependencies: `next` 15.5.27 (non-major), `npm audit fix`, declare `@eslint/eslintrc`, `next dev -H 127.0.0.1`. **No major upgrades.** | SEC-21, MISS-05 | P2 | S |

### Tier 1: Foundation (one agent; owns `tailwind.config.ts`, `globals.css`, `layout.tsx`, `utils.ts`)

| ID | Item | Sources | P | E |
|---|---|---|---|---|
| F-01 | Safety-net tokens: opacity 6/7/8/12, `borderColor.DEFAULT`, focus rule without radius plus a dark-root ring, inset-ring utility | VIS-01, 02; MOT-09; A11Y-05, 16 | P1 | S |
| F-02 | Colour tokens: primitives, semantic aliases (declared in both scopes), Day sand `#836122` ⚑ D-22, badge tone contrast | VIS-08, 15; A11Y-10 | P2 | S |
| F-03 | Fonts: Newsreader `400` only, mono fallback stack | PERF-02, 09; VIS-07 | P1 | S |
| F-04 | Type scale (rem, two display steps), `.label-caps`, measure, `twMerge` registration | VIS-03, 04, 05, 06 | P2 | M |
| F-05 | Spacing/layout tokens, `Container`, radius, elevation, z-index tokens | VIS-11–14; B §3.4–3.8 | P2 | S |
| F-06 | Motion system: duration, easing, distance and stagger tokens; `rise`/`reveal`/`swap` keyframes; `motion-off:` and `can-hover:` variants; off-screen loop pausing (`data-loop` + `data-inview` from RevealScript); reduce contract fix (`transition-delay: 0s`); reactive `useMotionAllowed()` in `lib/motion.ts`; `data-motion="paused"` applied before paint ⚑ D-12 | PERF-04; A11Y-19; MOT-02, 03, 13, 14, 15 | P1 | S–M |
| F-07 | Print stylesheet | MISS-02 | P2 | S |
| F-08 | Codemod of the drift (migration map, B §3.10) plus an ESLint rule against new arbitrary values. **Done after Tier 2/3 merge** to avoid conflicts. | VIS-03, 09, 11, 12, 13, 16 | P2 | M |
| F-09 | `hoverOnlyWhenSupported` plus `active:` press feedback, **after** G-04 (Hint) lands | MOB-06; MOT-16 | P2 | S |

### Tier 2: Global components (parallel; file ownership in §6)

| ID | Item | Sources | P | E |
|---|---|---|---|---|
| G-01 | **Desktop nav keyboard and pointer:** panel focus order (F85), Escape from anywhere, hover-then-click keeps open, outside-tap close. Polish: panel morph/highlight on transform, not width/height | A11Y-01, 06, 24; MOB-16; MOT-10 | **P0** | S |
| G-02 | **Mobile sheet as a modal:** dialog semantics, `inert` background, trap, close on same-page links, close on `lg` match (iPad freeze), `overscroll-contain`, Discord pinned to the sheet bottom with no stagger delay, the whole sheet in by ≤ 250 ms, labelled groups, BLOKC chip row | A11Y-02, 36; MOB-02, 03, 05, 21; UX-23; MOT-13 | **P0** | S–M |
| G-03 | **Phone header:** an icon Discord button (44 px) below 640; announcement bar hidden below 640 ⚑ D-05; bar CTA no longer truncated and given a full-height hit area; dismiss focus to the logo; landscape compact header with hide on scroll-down (transform) ⚑ D-05; fixed-height header (pill surface animates opacity/scale, not height/padding) | CRO-01; UX-03; MOB-01, 02, 13, 15; A11Y-04, 40; MOT-10 | P1 | S–M |
| G-04 | UI primitives: `Hint` toggletip, `CopyButton`, `Button` external cue, `Badge` vocabulary, `Card` variants, `FaqList` cta, `Icon` | A11Y-11, 37; MOB-23; SEC-16, 17; UX-11; VIS-09, 18; CRO-11, 26 | P2 | M |
| G-05 | **Consent UI:** first in the DOM, compact phone card, landscape bar, equal-weight buttons ⚑ D-15, focus restore, switch contrast and descriptions, `dvh` | A11Y-03, 12, 18; MOB-01, 14; SEC-23 | P1 | M |
| G-06 | **Consent logic §** (consent semantics, a do-not-touch area; this is a bug fix): `ga-disable` on withdrawal, Consent Mode defaults to *denied* then update, policy version in the record, remove Marketing and bump `CONSENT_VERSION` ⚑ D-14 | **SEC-03 (P0)**, SEC-05, 22; CRO-21 | **P0** | S |
| G-07 | `ProductVideo`: `youtube-nocookie`, self-hosted poster, notice on the facade, focus the iframe on play, caption params; transcript slot ⚑ D-26 | SEC-04; A11Y-09, 23; PERF-06 | P1 | S |
| G-08 | **Analytics events** (consent-gated `track()`, delegated `data-cta` listener, `join_group` key event, `cta_click`, `select_content`, `section_view`, `exception` events for errors) ⚑ D-16. Only after G-06 and the Privacy Policy. | CRO-09; MISS-07 | P1 | M |
| G-09 | `CtaBand` (context variants, a "Not on Discord?" line, Scramble name fix), `Scramble` and `CountUp` single-copy DOM text, **no count-ups on small or spec values** (they show "0B" and "Decimals 0" before scrolling) ⚑ D-34, `SplitText` LCP-safe ink-in and VoiceOver check | CRO-18, 19; A11Y-21, 41; SEO-17; MOT-12; MISS-02 | P2 | S |
| G-10 | `PageHero` plus home `Hero`: **LCP-safe entrance**: rise-only for h1, lead, media and CTAs; secondary items fade ≤ 150 ms; settled by about 700 ms ⚑ D-32. Keyword label in the h1; shared `Breadcrumb` with labels from `nav.ts` | PERF-01; MOT-01; SEO-11; UX-18; SEO-20 | P1 | S |
| G-11 | **Footer:** regrouped to mirror the nav, legal line (entity, registration), FAQ, DAO and llms links, Privacy link once it exists, heading semantics, `prefetch={false}` on footer/legal links | UX-13; SEC-19; SEO-22; PERF-07; INS (llms link) | P2 | S |
| G-12 | **Explainers:** any input stops autoplay for the visit ("Resume" shown); no autoplay below lg or on `(hover:none)`; dwell from word count; pause on focus-within; DecisionPipeline pause button and play-once; **reserved panel heights** (no CLS from autoplay); `useRovingTabs`; panel swap = crossfade, no re-stagger of prices; user-picked RulesDemo verdict in ≤ 800 ms; RebalanceLab 1:1 bars, `aria-valuetext`, thumb; AllocationExplorer drawn without JS (no SSR `scaleX(0)`) and live-region noise; `LiveStatus` de-dupe; colour-only change tint on live values; layout-property animations to transform (rail, pipeline token, tabs) | UX-06; MOB-04, 10, 11, 20; A11Y-08, 17, 20, 27, 28, 29, 34, 35; MOT-05, 06, 07, 08, 10, 11, 17 | P1 | M |
| G-13 | `src/app/template.tsx` client-navigation focus to `#main` and a lighter `.page-enter` (no double hero choreography); styled `global-error.tsx`; error page `role` fix | A11Y-22, 38; MISS-07; MOT-15 | P2 | S |
| G-14 | New `RiskNote` (wording ⚑ D-03) and `StatusLine` (`status.ts.publicLaunch` ⚑ D-02) | CRO-02, 07; SEC-20 | P1 | S |
| G-15 | **Canvases** (`GlyphField`, `DotField`): ≤ 15 fps timers, dirty-cell redraw from a glyph atlas, settle about 6 s after entering view, `saveData` skip, reactive motion hook | MOT-04, 14 | P2 | M |

### Tier 3: Page by page

| ID | Page(s) | Item | Sources | P | E |
|---|---|---|---|---|---|
| P-01 | Home | **Wayfinding:** hero "How it works" → `#how` (or rename) ⚑ D-07; hero CTAs = Explore the indices + "Hear first on Discord" + status line ⚑ D-06; AtAGlance `<dl>` → list | UX-01; CRO-02, 12; A11Y-07, 39 | P1 | S |
| P-02 | Home | **Restructure to about 11 sections** (moves and merges only) ⚑ D-08: Explorer + Ecosystem → `/protocol`; IndexShowcase → 3 index cards; Rules merged into Security; compact governance strip; Builders + Roadmap merged; single mobile GardenMock. Target ≤ 2,000 DOM nodes, ≤ 32 kB br. | UX-04, 05, 07, 09, 14; MOB-12, 17; PERF-08; INS-10, 11 | P1 | M–L |
| P-03 | Home | Honest claims: hero audit-scope line, Ecosystem "integrations, not endorsements", Transak framing, "professionally curated" fix, ScrollInk start contrast, Problem table header and `th` | INS-01; CRO-05, 14, 22; VIS-17; A11Y-26 | P1 | S |
| P-04 | `/protocol` | Fix sticky anchor ids; become the canonical "how" (receives Explorer + Ecosystem ⚑ D-08); glossary (6 terms); Whitepaper in "Start here" | UX-02, 04; CRO-15, 24 | P1 | S–M |
| P-05 | `/security` | "Launch readiness" checklist; contract registry (honest "Not deployed yet" rows); who-can-do-what matrix (verify timelocks ⚑ D-25); official links + "Stay safe"; disclosure policy and safe harbour; ticket steps; audit cards labelled honestly; audit tiles fixed at 768 | INS-03, 04, 05; SEC-09, 10, 15, 27; UX-22; MOB-09 | P1 | M |
| P-06 | `/indices`, `/indices/[id]` | Definitional first sentence; de-duplicate detail pages (link to methodology; RebalanceLab on BLOKC2 or index-aware); IndexMatrix fits at 375; formula wraps; factsheet "Governed by / Rebalance"; JSON download; RiskNote; contextual links to Security/Governance | UX-08; SEO-09, 12, 16; MOB-07, 08; A11Y-13; INS-08 | P2 | M |
| P-07 | `/token` | Timeline order and statuses ⚑ D-02; planned utilities in future tense; EIP-55 address; RiskNote; key facts block; glow tap fix; skeleton a11y | CRO-03, 13; SEC-16; SEO-12; A11Y-14, 33 | P1 | S |
| P-08 | `/governance` | Rich ProposalBoard here (swap ⚑ D-08); "As of" stamps everywhere; one empty state; stage parameters read from Aragon (⚑ D-25); "DAO on Aragon" labels | UX-07, 15, 16; INS-06; CRO-17, 23 | P2 | M |
| P-09 | `/about` | Governance copy truthful ("core members vote today…"); story heading and signature ⚑ D-11; team roles ⚑ D-11; roadmap collapsible; decorative numerals via CSS; transcript ⚑ D-26 | CRO-06, 16; UX-21; A11Y-15 | P1 | S |
| P-10 | `/contact`, 404, error | Closing next step; safety notice; press contact ⚑ D-17; wider 404 exits plus Discord; error help line | UX-19, 20; CRO-28, 29; SEC-09 | P3 | S |
| P-11 | `/legal/*` § | **Privacy Policy page** (new slug), **Cookie Policy rewrite**, UA §15 completion, AUP reference fix, version and "what changed": **counsel text only** ⚑ D-01. Template: `aside` → `div`, mobile sticky Contents, entity unescape, longer descriptions | SEC-01, 02, 12, 26; A11Y-25; UX-24; B (`&amp;`); SEO-10 | **P0** | M (+ counsel) |
| P-12 | Data modules | `milestones.ts` re-dated ⚑ D-02, build-time staleness guard; `audits.ts` one date ⚑ D-04; `faqs.ts` +6 objections ⚑ D-10; `socials.ts` Farcaster URL and label; one `ctas.ts` string source; British spelling and "Aragon OSx"; `indices.ts` dead `color` field | CRO-03, 04, 08, 10, 27; MISS-01, 08, 14; SEO-04; VIS-15 | P1 | S (+ owner facts) |

### Tier 3b: SEO and trust (one agent, after the page merges)

| ID | Item | Sources | P | E |
|---|---|---|---|---|
| S-01 | `pageMetadata()` helper; per-page OG/Twitter/`og:url`; layout canonical removed; 404 `noindex, follow` without canonical; titles and descriptions per F §4 | SEO-01, 02, 05, 10 | P1 | S |
| S-02 | New OG card on the Day palette with the real mark and Newsreader; per-section cards (indices/[id], token, security, protocol) | SEO-02; MISS-04 | P1 | M |
| S-03 | Structured data truthfulness: WebApplication offer = FAQ text, `LimitedAvailability`, "In private testing"; Organization `alternateName`, full address, square logo; `VideoObject`; JSON-LD `<` escaping | SEO-03, 08, 13, 21; SEC-24 | P1 | S |
| S-04 | `llms.txt` / `llms-full.txt`: facts corrected, roadmap sorted with "as of", identity block, index, token, fees and governance sections generated from data | SEO-04, 13, 14 | P1 | S–M |
| S-05 | Sitemap authored `lastmod`; robots cleanup; RSC `.txt` `X-Robots-Tag` | SEO-07, 18, 19 | P2 | S |
| S-06 | **Headers (`public/_headers`):** hardening block, CSP **Report-Only** → enforce (Stage 1), `security.txt`, `/tokens/*` cache rule, `X-Robots-Tag: noindex` on `*.pages.dev` ⚑ D-27 | SEC-06, 07, 14; PERF-11; SEO-06 | P1 | S |

### Tier 4: Performance and polish

| ID | Item | Sources | P | E |
|---|---|---|---|---|
| X-01 | Image sizing: hero `sizes` and `deviceSizes` matched to the real files; logos, avatars, mark and tokens pre-sized to 2× display (WebP/SVG); self-hosted YouTube poster | PERF-05, 06 | P2 | S–M |
| X-02 | Icon set and manifest from a vector master ⚑ D-23 (`favicon.ico` multi-size, SVG icon, 192/512, maskable, opaque apple icon, palette `#F7F8F4`, `display: browser`) | MISS-03; SEO-08 | P2 | S (after the vector) |
| X-03 | Remove dead code: exports, imports (2 lint warnings), no-op classes; unused public assets (about 205 kB plus about 3.9 MB of unused garden renders) ⚑ D-24 | MISS-11; VIS-16 | P3 | S |
| X-04 | Grid orphans, clipped labels (320/768/1024), Ecosystem logo consistency ⚑ D-23, touch affordances, team imagery ⚑ D-11 | MOB-09, 18, 19; VIS-10, 19, 20 | P3 | S–M |
| X-05 | `useLive`: per-call results (one bad feed no longer blanks all), correct source wording, offline skeleton → "—", 1 s clock removed, ref required § ⚑ D-29 | UX-10, 17; PERF-13 | P2 | S |
| X-06 | `EasterEggs` dynamic import plus reduced motion; `NavFeature` data out of the layout chunk; render menu panels on open | PERF-08, 12; MISS-16 | P3 | S |
| X-07 | Vanity redirects and old-anchor aliases (`/legal`, `/whitepaper`, `/docs`, `/team`, `/roadmap`, `/audits`, uppercase index ids) § ⚑ D-28 | MISS-10; SEO-20, 23; UX-18 | P3 | S |
| X-08 | README rewrite; stale comments; `react-doctor` directives; `lib/format.ts`; one locale (en-GB?) ⚑ D-20 | MISS-12, 13; SEO (locale) | P3 | S |
| X-09 | "Recently shipped" list (real entries only), "Spotted something wrong?" line, audience routing links, "On this page" for long pages | INS-07, 10, 11, 13 | P3 | M |
| X-10 | **Loop rebuild on composited properties:** dash flows as translating patterns or one-shot `pathLength` draws; SVG pulse rings as HTML; shadow/border/background pulses as pseudo-element opacity; spoke flow moved outside the rotating layer; loops settle within 5 s ⚑ D-33 (Hero, ProductArt, CustodyDiagram, LayerStack, BasketOrbit) | MOT-02, 03; PERF-04 | P2 | M |
| X-11 | Storytelling sequences (hero "value in, keys stay", how-it-works delta, custody draw order, rebalance presets, index assembly instead of the orbit) ⚑ D-33 | MOT-18 | P3 | M |

### Owner / ops actions (outside the repo; Claude cannot do these)

| ID | Action | Sources | P |
|---|---|---|---|
| O-01 | **Counsel:** Privacy Policy, Cookie Policy, UA §15, governing-law alignment, UK/EU crypto-promotion position and risk wording, EU/UK representative | SEC-01, 02, 12, 13 | **P0** |
| O-02 | **Cloudflare:** www → apex 301, pages.dev noindex or Cloudflare Access for previews (**the `redesign` preview is public and indexable today**), HSTS staged at the zone, fix or park `app.blokcapital.io` (redirect loop), AI Crawl Control allow-list, Crawler Hints, scheduled deploy hook | SEO-06, 15; SEC-08, 18; MISS-01, 08 | P1 |
| O-03 | **DNS/email:** DKIM, DMARC `p=none` → reject, optional CAA; `security@` mailbox (D-18) | SEC-11, 15 | P1 |
| O-04 | **GA4 admin:** Google signals and ad personalisation off, shortest retention, register custom dimensions | SEC-05; CRO-09 | P1 |
| O-05 | **Discord:** guild description on-message, onboarding to announcements, dedicated website invite ⚑ D-16, ticket channel name for security reports | CRO-20; UX-22 | P2 |
| O-06 | **Search Console + Bing Webmaster** verified; submit the sitemap at launch; watch Coverage for 4 weeks | SEO-15, 23 | P2 |
| O-07 | **YouTube:** reviewed English captions for the intro video; transcript text | A11Y-09 | P1 |
| O-08 | **Brand:** vector logo master; confirm the Figma brand kit matches the Day garden palette | MISS-03, 14; VIS-19 | P2 |
| O-09 | Move the governance worker from `sn-75f.workers.dev` to an org-owned host; schema-validate | SEC-25 | P3 |

---

## 5. Decisions needing your approval

Answer by ID; "accept recommendation" is fine for most. **Bold = blocks a P0 or P1.**

### Facts only you can supply
- **D-01:** Counsel engagement for the Privacy Policy, the Cookie Policy rewrite and UA §15. *Until the Privacy Policy exists, GA4 must stay off on this branch.* Recommendation: ship with GA4 disabled if counsel is late.
- **D-02:** Re-dated roadmap (Q3 '26 items: done, slipped to when, and why?), order of holder voting/staking vs the IDO, and the public-launch date or "not dated yet".
- **D-03:** Risk line wording for home, indices and token (draft in CRO-07; counsel reviews).
- **D-04:** The true CredShields audit date (Nov or Dec 2024; e.g. "audited Nov 2024 · report Dec 2024").
- D-09: Which channel gets launch news first, Discord or X? (Today the site says both.)
- D-10: Facts for 6 new FAQs: pooled rebalancing vs custody, the exit path if BLOK disappears, gas sponsor, tester recruitment, regulatory position, "no presale before the IDO".
- D-11: Team roles, a signed founder story (or rewrite as "we"), consistent team photos.
- D-25: Aragon plugin parameters and any timelocks (only stated if verified on-chain).

### Product, IA and UX
- **D-05:** Below 640 px, replace the announcement bar with a header Discord icon button; compact landscape header. *Recommended.*
- **D-06:** Hero CTAs: primary "Explore the indices", secondary "Hear first on Discord", "How it works ↓" as a text link, plus a status line. *Recommended.*
- **D-07:** "How it works" naming: the nav item becomes "Protocol" (hint "How a Garden works, layer by layer"), the hero links to `#how`, the "Vote on Aragon" nav item becomes "DAO on Aragon", and "Governance › Governance" becomes "How the DAO decides". *Recommended.*
- **D-08:** Home restructure (each is a move or merge; nothing is deleted). *Recommended as a set; approve or reject individually.*
  - (a) ProtocolExplorer → `/protocol`
  - (b) Ecosystem → `/protocol` (logo strip stays on home)
  - (c) IndexShowcase → 3 index cards
  - (d) RulesDemo merged into home Security (and added to `/security`)
  - (e) ProposalBoard ↔ ProposalList swap
  - (f) Builders + Roadmap merged (the "Later" column stays on `/about`)
  - (g) Index detail pages link to the shared methodology instead of repeating it
- D-12: A site-wide "Pause animations" control (footer), and no autoplay on touch or below `lg`. *Recommended.*
- D-13: Security as a top-level nav item (or a "Trust" group). *Recommendation: top-level "Security" link.*
- D-17: A press/partners email alias on `/contact`.
- D-19: Email waitlist alongside Discord. *Recommendation: not now. Add a "Not on Discord? Follow on X" line, and revisit with a launch date plus the Privacy Policy.*

### Consent and analytics
- **D-14:** Remove the "Marketing" category, keep all `ad_*` signals denied, and bump `CONSENT_VERSION` (re-asks everyone once). *Recommended.*
- D-15: Style Reject and Accept identically (ICO "equal prominence"). *Recommended.*
- **D-16:** Approve the event taxonomy (I §3.1) with `join_group` as the key event; optional dedicated Discord invite for the website; consent-rate counting (recommendation: don't measure).
- D-26: Self-host the video poster and use `youtube-nocookie` (*recommended*); publish a transcript.

### Brand and visual
- D-20: English variant: **en-GB** (the copy is British) or en-US. *Recommendation: en-GB, which aligns `og:locale`.*
- D-21: Footer palette: keep **light** (as the code is) and fix the docs. *Recommended.*
- D-22: Day sand `#8A6726` → `#836122` (AA headroom; visually negligible). *Recommended.*
- D-23: Commission a vector logo master (needed for icons, OG and ecosystem consistency).
- D-24: Delete unused assets from `public/` (about 4.1 MB, including 8 unused garden renders kept in a brand archive). *Recommended.*
- D-31: Light-only (current) or an OS dark mode built on the Night garden tokens (about 1–2 d). *Recommendation: light-only for launch.*
- D-32: Hero entrance becomes **rise-only** (no fade) for the h1, lead, media and CTAs (required by perf rule R1; measured LCP = FCP). *Recommended.*
- D-33: Decorative loops **play briefly, settle within 5 s and rest on a still frame** (replay on hover/focus) instead of looping forever; optional storytelling sequences (X-11). *Recommended for the loops; storytelling optional.*
- D-34: Remove 0→N count-ups on small or spec figures (3 indices, 18 decimals, 10B supply); keep reveal motion only. *Recommended.*

### Do-not-touch exceptions and tooling
- **D-14b:** Allow edits to `src/lib/consent.ts` and `Analytics.tsx` (consent semantics) for SEC-03/05/22. These are bug fixes that make withdrawal work as promised. *Required for a P0.*
- D-27: Allow `public/_headers` changes (security headers, CSP Report-Only first, caching).
- D-28: Allow `public/_redirects` additions (vanity redirects, `/legal`).
- D-29: Allow `src/lib/live/*` changes (per-feed failures, wording, polling nits). Values and sources are unchanged.
- **D-30:** Add Playwright and axe as devDependencies, a `tests/` folder and a GitHub Actions workflow (T-01/T-02). *Strongly recommended: there is no regression net today.*
- D-18: A `security@` mailbox, listed in `security.txt` and on the disclosure page.

---

## 6. Phase 3 execution plan

**Branching:** every agent works in its own git worktree off `redesign`, on a branch named `p3/<id>`, with one concern per commit (finding IDs in the message). I merge sequentially into `redesign` and run the T-01 suite plus typecheck, lint and build after each merge. Builds run only in worktrees, never in your main checkout (the shared `.next`).

| Wave | Agents (parallel within a wave) | Owns (exclusive files) |
|---|---|---|
| 0 | **Tooling** (T-01–T-03) | `package.json`, lockfile, `.github/`, `tests/`, `.nvmrc`, `eslint.config.mjs` |
| 1 | **Foundation** (F-01–F-07) | `tailwind.config.ts`, `globals.css`, `layout.tsx`, `utils.ts`, `RevealScript.tsx`, `lib/motion.ts` |
| 2 | **Nav** (G-01–G-03) | `components/nav/*`, `lib/nav.ts`, `lib/announce.ts` |
| 2 | **Consent and analytics** (G-05–G-08) | `CookieConsent.tsx`, `Analytics.tsx`, `lib/consent.ts`, new `lib/analytics.ts`, `about/ProductVideo.tsx` |
| 2 | **UI primitives** (G-04, G-09–G-11, G-13–G-15) | `components/ui/*`, `components/motion/*`, `components/footer/*`, `app/template.tsx`, `app/error.tsx`, `app/global-error.tsx` |
| 2 | **Explainers** (G-12) | `explore/*`, `guard/*`, `governance/DecisionPipeline.tsx`, `indices/{IndexShowcase,IndexExplorer,RebalanceLab,BasketOrbit}.tsx`, `token/AllocationExplorer.tsx`, `home/HowItWorksScroller.tsx`, `home/how/*`, `live/LiveStatus.tsx` |
| 3 | **Home** (P-01–P-03) | `app/page.tsx`, `components/home/*` (except the explainers) |
| 3 | **Protocol + Security** (P-04, P-05) | `app/protocol/*`, `app/security/*`, `components/protocol/*`, `components/security/*` |
| 3 | **Indices + Token + Governance** (P-06–P-08) | `app/{indices,token,governance}/*`, remaining `components/{indices,token,governance,live}/*` |
| 3 | **About + Contact + Legal + 404** (P-09–P-11) | `app/{about,contact,legal}/*`, `app/not-found.tsx`, `components/{about,legal}/*` (except ProductVideo) |
| 3 | **Data/content** (P-12) | `src/lib/data/*` (facts from §5 only) |
| 4 | **SEO + trust** (S-01–S-06) | `lib/seo/*`, `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image*`, `llms*`, `seo/JsonLd.tsx`, `public/_headers`, `public/.well-known/`; metadata blocks in page files (after Wave 3 merges) |
| 4 | **Performance + polish** (X-01–X-11, F-08, F-09) | `public/{brand,Socialtrust,tokens,teamgrid}`, `next.config.ts`, `lib/image-loader.ts`, `ui/GardenAsset.tsx`, `lib/live/*` (if D-29), codemod across files **after** all other merges |

**About 10 agents across 5 waves.** Waves 2–4 run in parallel within each wave. Anything blocked on an unanswered decision is skipped and reported, not guessed.

---

## 7. Phase 4 acceptance bar (from BASELINE §7, corrected)

| Metric | Bar |
|---|---|
| Build / typecheck / lint | ✅ / ✅ / **0 warnings** |
| T-01 suite | all pass (new) |
| Mobile Lighthouse perf (median of 3) | ≥ 90 every page (baseline: contact 86, home 89, others 90–92) |
| LCP − FCP (throttled lab) | ≤ 50 ms on every hero page (baseline about 700 ms) |
| Fonts preloaded | ≤ 100 kB (baseline 171 kB) |
| CLS (throttled) | ≤ 0.02 (baseline `/about` 0.064) |
| Idle main thread, no loop in view (4× CPU) | < 5% (baseline 9–33%) |
| Post-load interactions (4× CPU) | < 100 ms (baseline 24–72 ms, hold) |
| Home HTML / DOM | ≤ 32 kB br / ≤ 2,000 nodes (baseline 36 kB / 2,343) |
| First-load JS | no increase (141 kB home / 103 kB shared) |
| axe serious/critical (incl. opened states) | 0 (baseline 7 rule types) |
| Lighthouse a11y / BP / SEO | 100 / 100 / 100 |
| Keyboard: both menus, sheet, banner, dialog | Tab-order tests pass |
| Horizontal overflow 320–1920, console errors, broken links | none (hold) |
| Reduced motion | no hidden reveal targets, 0 infinite animations, no smooth scroll |
| Consent | 0 Google requests before consent **and after withdrawal** (scripted) |
