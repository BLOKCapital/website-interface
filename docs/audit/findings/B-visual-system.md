# B: Visual design system and tokens

Agent B · `redesign` @ `5beb0ee` · 2026-10-11

## 1. Scope & method

- Read the token sources in full (`tailwind.config.ts`, `src/app/globals.css`, all of `src/components/ui/*`, `NavIcons.tsx`, `layout.tsx`, `utils.ts`) and the components that carry the most ad-hoc styling.
- Quantified drift with scripts in `scratchpad/tools/agent-B/`. `drift.mjs` counts arbitrary Tailwind values by utility. `deadclasses.mjs` diffs every class token in `src/**` against the **built** CSS (`baseline-src/out/_next/static/css`) to find classes that generate nothing. I also grepped hex/`rgb(` literals and counted radius, shadow, z-index, alpha and font-size usage.
- Computed WCAG contrast for every text token on every surface token, including alpha-composited tints, in both palettes (`contrast.mjs`).
- Ran a measurement pass with Playwright (`measure.mjs`, `focus.mjs`, `overflow.mjs`) on 10 routes at 1280 and 1920. It covered characters per line for every paragraph over 160 chars, computed heading styles, section padding, the computed border of every `border-line/12` element, the fonts that loaded, keyboard-focus radius and tile overflow. **Note:** the shared `:4173` server was down during the main pass, so I served the same baseline export (`baseline-src/out`) on a private port (:4282) and stopped it afterwards. After the coordinator restarted `:4173`, I re-checked the two key results there and they matched: focus radius (VIS-02) and the `border-line/12` fallback to `rgb(229,231,235)` (VIS-01). No finding comes from a connection error.
- Reviewed the 1280 and 1920 screenshots of every route (sliced), plus `first-visit_*` and the 404.

## 2. Findings

| ID | Page/Component | Problem | Evidence | User impact | Recommended fix | Effort | Priority |
|---|---|---|---|---|---|---|---|
| VIS-01 | Site-wide: CtaBand socials (every page), Nav menu toggle and dropdown, CookieConsent, Hint, CopyButton, DecisionPipeline, TokenTimeline, ControlMap, RulesDemo, Hero, GardenMock, contact, protocol | **`/12` is not on Tailwind's opacity scale, so `border-line/12` and `bg-line/12` generate no CSS.** 23 instances in 18 files fall back to the preflight border colour `#E5E7EB` (a cool grey that isn't a BLOK token). Inside `.theme-dark` that grey is a bright ring at **13.9:1** on the card instead of the intended 1.4:1 hairline. The `bg-line/12` timeline rails render **transparent**, so they are invisible. | Built CSS has `border-line\/10` and `border-line\/15` but no `border-line\/12` (grep: 0 hits). Measured computed `border-top-color: rgb(229,231,235)` on every one of these elements, light and dark; for example, 80 dark CtaBand social circles across 10 pages. `bg-line/12` rails measured as `rgba(0,0,0,0)` (`TokenTimeline.tsx:14`, `DecisionPipeline.tsx:62,78`). Visible in `home_1280.jpg` (CTA socials, "Pause autoplay"). | Bright off-palette rings sit next to the primary "Join the Discord" CTA on every page, and on the governance and token consoles. The governance pipeline track and token timeline lose their connecting line, which carries the sequence. | **Today:** add `opacity: { 7: "0.07", 8: "0.08", 12: "0.12" }` to `theme.extend`, and set `borderColor.DEFAULT` to `rgb(var(--line) / 0.12)` so a bare `border` can never fall back to Tailwind grey again. **Then** migrate to the semantic border tokens in §3. | S | **P1** |
| VIS-02 | Global focus style (`globals.css:128-132`) | **The focus rule reshapes every pill control.** `:focus-visible { border-radius: 6px }` is unlayered and comes after the utilities, so it overrides `rounded-full`. On keyboard focus the button's own background turns from a pill into a 6px rectangle. | Tabbing through `/protocol`: 20 of 25 focus stops declared `rounded-full`/`rounded-md` and computed `border-radius: 6px`. Screenshot `tools/agent-B/focus-btn.png`: "Read the docs" becomes a rectangle beside the "Security" pill. CSS order: `.rounded-full` at byte 21356 and `:focus-visible{…border-radius:6px}` at 55568. | Every keyboard user sees the primary CTAs, nav triggers and social icons jump shape on focus. It reads as a rendering bug, and the ring doesn't match the control's shape. | Delete `border-radius` from the rule: outlines follow the element's own radius in all evergreen browsers. Tokenise the ring (`--focus-ring`, `--focus-width`, `--focus-offset`; §3). For radius-less inline links, add `rounded-xs` where a softer ring is wanted. | S | **P2** |
| VIS-03 | Type scale (all components) | **Nearly half of all font sizes bypass the scale.** There are 191 arbitrary sizes (35 distinct values, in 53 of 94 TSX files) against 207 token uses. They include 180 px values (`11px`×60, `15px`×21, `12px`×18, `11.5px`×16, `13px`×12, `12.5px`×10…) and **11 one-off `clamp()` formulas**. Several duplicate existing tokens with a different line height (`12.5px` = caption, `14px` = small, `16px` = body, `20px` = h4). `globals.css` `.prose-legal` adds 15.5 / 24 / 17 / 13.5px. **Every token is px**, so the min, max and intercept ignore the user's browser font-size setting. | `drift.mjs` output (`text-[size]`: 191). Token counts: small 98, caption 58, h4 18, lead 10, h3 9, body 6, h2 4, h1 4. Examples: `Footer.tsx:63` `clamp(40px,5.5vw+12px,96px)`, `ProductStack.tsx:84` `clamp(34px,2.6vw+18px,56px)`, `ControlMap`, `TokenSpec`, `AllocationExplorer`, `Products`, `ProposalBoard`, `Problem`, `AtAGlance`, `IndexShowcase`, `BasketOrbit`. | Nobody can change the type system in one place. Near-identical sizes (11/11.5/12/12.5/13/13.5) make the rhythm look slightly off, and users who raise their default font size get no benefit. | Adopt the rem-based scale in §3. It keeps the current h1, h2 and lead curves exactly and adds `label`, `ui`, `display-sm` and `display-md` so the one-offs have a home. Codemod using the §3 migration map, and register the new names in `extendTailwindMerge` (`utils.ts:10`). | M | **P2** |
| VIS-04 | Heading hierarchy | **There is no step between h3 (28px) and h2 (52px), so the hierarchy inverts in places.** Card-level h3s are set as large as section h2s: `ProductStack` h3 computes 51.28px at 1280, equal to the h2. Card titles at 41.6–47px sit just below it. The footer tagline (`clamp(40px,5.5vw+12px,96px)` = 82px at 1280, 96px max) is **larger than every page's h1** (80px at 1280, 88 max) and appears on every page. On phones h4 (20px) and h3 (22px) differ by only 1.1×. | Measured computed headings at 1280: H3 Newsreader at 51.28, 44, 41.6 and 34px, against H2 at 51.28px. `Footer.tsx:63`. Slices `protocol_1280_00` (Index Gardens card title vs "Three ways to run a Garden."). | Section starts are harder to scan, because the eye can't tell section from card. The closing line competes with the page's h1. | Add `display-sm` (24→36px) and `display-md` (28→46px) for stat figures and feature-card titles, capped below h2. Raise the h3 minimum to 24px and set h4 to 18→20px. Set the footer tagline at `text-h1` (or `display-md` if it should recede). See §3. | S | **P2** |
| VIS-05 | Caps labels (meta, table headers, chips) | **There are four label styles and the smallest is 11px.** The site has 45 uppercase label declarations: 36 mono (33 at `text-[11px]`, 3 at 11.5px) and 9 sans. Their tracking is split across `0.14em`×18, `0.12em`×14, `0.1em`×3 and `0.2em`×1. The `.eyebrow` class (12px/0.14em, leaf) is a fifth near-twin. Content text also appears at 10–10.5px inside product art. | `grep` of `"…uppercase…"` class strings. Typical: `font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle` (`TokenSpec.tsx:36`, `ProposalBoard.tsx:21,49,69,75,110,170`, `NavFeature.tsx:18`, `GardenMock.tsx:60` …). `ProductArt.tsx:138,172` at 10.5px. | Data labels on a finance site are read closely, and 11px mono caps with wide tracking is near the floor of comfortable reading, especially on Windows ClearType. The inconsistent tracking is visible next to eyebrows. | Create one `.label-caps` component class (`font-mono text-label uppercase tracking-caps text-fg-subtle`, 12px / 0.12em). Reserve `text-micro` (11px) for text inside `aria-hidden` illustrations only. | S | **P2** |
| VIS-06 | Long-form and small-text measure | **`max-w-prose: 68ch` gives about 85 characters per line in Inter**, because `ch` is the width of "0" (≈0.63em) and Inter's running text averages ≈0.5em. On `/legal/user-agreement`, **25 of 37 paragraphs exceed 75 cpl (max 90)**. `max-w-2xl` (sized for 20px lead) is reused on 14px text, giving 87–92 cpl. | `measure.mjs`: legal paragraphs at 15.5px in a 665px column, 76–90 cpl. `/security` "Mainnet deployment…" 87 cpl (14px, `max-w-2xl`). Home IndexShowcase description 92 cpl (14px). Everything else is 59–70 cpl, and 1920 matches 1280 because the container is capped. | Legal text and small explanatory copy are tiring to read and easy to lose your place in. The policies are text people are asked to accept. | Set the measure in `ch` so it scales with font size: `measure: 58ch` (≈74 cpl at any size) and `measure-narrow: 50ch` (≈63 cpl). Apply `max-w-measure` to `.prose-legal` and to paragraphs set in `text-small`/`text-body`; keep `max-w-2xl` only for `text-lead`. | S | **P2** |
| VIS-07 | Font loading (`layout.tsx:14-26`) | **The mono face swaps from Arial on every page.** JetBrains Mono has `preload: false` ("not needed for first paint"), yet it appears above the fold on every route: the announcement bar label, the PageHero eyebrow and the AtAGlance labels. Its next/font fallback is **`local("Arial")` with `size-adjust: 134.59%`**. Because "JetBrains Mono Fallback" precedes `ui-monospace` in the stack, labels and addresses first render in a proportional face, then reflow when the 21 kB woff2 arrives. Inter and Newsreader fallbacks are metric-matched (verified: Inter→Arial 107.12%, Newsreader→Times New Roman 105.48%). Newsreader also declares weight 500, but every Newsreader element computes to 400. | Built CSS `e12a3a3c….css`: `@font-face{font-family:JetBrains Mono Fallback;src:local("Arial");…size-adjust:134.59%}`. `--font-mono:"JetBrains Mono","JetBrains Mono Fallback"`. Preloads on `/` are Inter latin 48 kB, Newsreader 58 kB and 64 kB; mono is not preloaded. Measured headings: all `Newsreader 400`. | Above-the-fold mono text visibly changes width and letterforms after load (FOUT). Measured CLS stays ≤0.015, so the cost is visual polish rather than CWV. | Mono: `adjustFontFallback: false` with `fallback: ["ui-monospace","SFMono-Regular","Menlo","Consolas","monospace"]`, so the swap is mono→mono at zero bytes. Whether to also preload the 21 kB file is E's call. Newsreader: `weight: ["400"]`, since no 500 is rendered. This may also shrink the preloaded files (unverified; E to measure). | S | **P2** |
| VIS-08 | Sand/bronze emphasis token (Day) | **Sand sits right at the AA line on light surfaces:** 4.497:1 on `raised` and **4.43:1** on the Gardeners card tint (`sand/12`). On that tint it colours an 11px label (`ProductStack.tsx:42,79`, "03 / 03 · STEERED BY A MANAGER YOU HIRE"). Every other text token clears 4.5:1 on every surface in both palettes; the config comment claims "every foreground token ≥ 4.5:1". | `contrast.mjs` matrix (§3.1 table). `#8A6726` on `#ECF0EA` = 4.497, and on `mix(sand,card,.12)` = 4.43. | A small-text AA miss on `/protocol`, and no headroom for any future tinted surface. | Darken Day sand to **`#836122`** (5.32 canvas / 4.93 raised / 4.82 on its own 12% tint). The hue is unchanged and the shift is visually negligible in the italic payoffs. Night sand is unaffected (≥9.8:1). | S | **P2** |
| VIS-09 | Cards (`ui/Card.tsx` vs ad-hoc) | **Most cards don't use the "one card surface".** `Card` has 19 uses; about 44 hand-built card containers repeat `rounded-* border bg-card p-*`. They use **5 border alphas** (`[0.07]`, `[0.08]`, `/10`, dead `/12`, `/15`) plus leaf/20–40, **8 paddings** (`p-4`…`p-10`, mostly `p-5`/`p-6`) and **4 radii** (16/24/28/32px). Hover treatments differ too: lift, border-leaf, bg-raised, or none. | `grep` of `bg-card` with border and rounded on the same line: 44. Border alpha: `[0.08]`×33, `leaf/30`×7, `/12`×3, `/10`×3. `Card.tsx:4` defines `rounded-2xl border-line/[0.08] p-6 sm:p-7`. | Adjacent cards on the same page differ subtly in corner, edge and padding (for example `/security` audits vs controls, `/governance` board vs pipeline). That weakens the "one calm system" the design aims for. | Extend `Card` with variants: `tone` (default · feature/dark · tint-cobalt · tint-sand · dashed/planned), `size` (sm p-5 · md p-6/7 · lg p-8/10), `radius` (card 16 · panel 24) and `interactive`. Migrate the ad-hoc containers (map in §3.10). | M | **P2** |
| VIS-10 | Home `#ecosystem` Chainlink tile | **Text overflows its tile.** The mono evidence label "IndexComponentRegistry.sol" runs past the tile edge. | `overflow.mjs`: label right edge exceeds card by **15px at 1280/1920** and **51px at 1024**. Visible in `home_1280.jpg` (ecosystem row 1). `Ecosystem.tsx:63`. | It is a visible layout defect in the trust section. | Add `break-all` (or `truncate` with `title`) on the evidence label, or shorten the label to "Registry.sol". | S | **P2** |
| VIS-11 | Hairline and tint alphas | **There are 143 arbitrary alpha values** (`/[0.08]`×67, `/[0.07]`×51, `/[0.06]`×12, `/[0.05]`×5, plus 0.1, 0.12, 0.14, 0.18 and 0.92), mixed with on-scale `/10` and `/15` for the same job. In total there are 9 hairline strengths. | `grep '[a-z-]+/\[[0-9.]+\]'`: `border-line/[0.08]`×59, `border-line/[0.07]`×38, `bg-leaf/[0.06]`×7 … | Hairlines vary between adjacent components (0.07 vs 0.08 vs 0.10), and authors have to guess. | Use three semantic border tokens (`border-subtle` 0.08, `border` 0.12, `border-strong` for control boundaries) and two tint steps (`/6`, `/10`). See §3. | S | P3 |
| VIS-12 | Radius | **Large radii drift.** Panels use `rounded-3xl` (24)×10, `rounded-[24px]`×4 (a duplicate of 3xl), `rounded-[28px]`×10 and `rounded-[32px]`×1. Below that there are 8 more steps in use (4/6/8/12/16/full). | `drift.mjs`, `grep rounded-` (e.g. `Principles.tsx:44`, `ProposalBoard.tsx:44,107,142,166`, `TokenSpec.tsx:21`, `HowItWorksScroller.tsx:131`). | Panels side by side have visibly different corners (for example token `TokenSpec` at 28 vs `IndexExplorer` at 24). | Use the radius tokens `xs 4 · tag 6 · control 12 · card 16 · panel 24 · full`, folding 28 and 32 into 24. Nested elements use the outer radius minus the inset. | S | P3 |
| VIS-13 | Shadows/elevation | **There are 23 arbitrary shadows (22 distinct) and no elevation scale.** Only one named shadow (`shadow-sm`) is used. | `drift.mjs` SHADOW list: `0_10px_30px_-18px`, `0_12px_30px_-12px`, `0_14px_40px_-24px`, `0_16px_40px_-16px/-20px`, `0_24px_60px_-20px/-30px`, `0_30px_70px_-34px`, `0_30px_80px_-50px`, `0_32px_80px_-24px`, `0_40px_90px_-30px` … all on `rgb(var(--shadow))`. | Popovers, banner, dialog and sticky cards each float at a different "height", so depth doesn't communicate layering. | Use 3 elevations plus 2 rings: `e1` (resting tiles, tooltips), `e2` (menus, cookie banner, scrolled nav), `e3` (dialog, sticky deck), `halo`, `inset-accent`. See §3.6. | S | P3 |
| VIS-14 | Z-index | **Layers are ad hoc and two of them collide.** nav `z-50`, cookie banner `z-[55]`, preferences dialog `z-[60]`, **easter-egg toast also `z-[60]`**, skip link `z-[70]`, Hint `z-30`, local `z-10`/`z-[1]`. | `CookieConsent.tsx:144,174`, `EasterEggs.tsx:87,118`, `layout.tsx:97`, `Nav.tsx:68`, `Hint.tsx:24`. | It works today, but any new overlay (toast, drawer) will be guessed. The toast and dialog tie is resolved only by DOM order. | Use named layers (§3.8): `raised 10 · tooltip 30 · nav 50 · banner 55 · overlay 60 · toast 65 · skip 70`. | S | P3 |
| VIS-15 | Colour roles | **Semantic roles are implicit.** Leaf is both the brand accent and "success". The config exposes `positive` (0 uses), `negative` (4) and `caution` (6) but no `danger`/`info`/`progress` names, so code writes `text-leaf` for "Allowed" and `bg-cobalt` for turnout. The config says cobalt and bloom are "never decoration", yet `ProductStack` tints whole cards cobalt and sand. `indices.ts:58-69` holds 12 pastel per-token colours tuned for dark (1.36–2.69:1 on white) that nothing renders. | `tailwind.config.ts:33-42`. `ProductStack.tsx:24-45`. `grep '\.color'`: 0 consumers of `Component.color`. | It is hard to retune state colours without touching brand accents, and the dead palette would fail contrast if someone wired it up for light surfaces. | Add semantic aliases (`accent`, `emphasis`, `data`, `progress`, `success`, `warning`, `danger`) over the existing variables, and keep `positive`/`negative`/`caution` as deprecated aliases for one release. Either document product tints as a sanctioned "product colour" role or retune them. Delete or re-derive the `color` field. | S | P3 |
| VIS-16 | Undefined or needless utilities | **Some utilities are dead and some are arbitrary values that standard utilities already cover.** `ease-in-soft` (`GardenAsset.tsx:74`) and `duration-400` (`EasterEggs.tsx:87`) generate no CSS; the latter falls back to Tailwind's 150ms. 12 `fill-[rgb(var(--x))]` in `CustodyDiagram.tsx` duplicate the built-in `fill-fg-subtle`/`fill-leaf`. One `stroke-[rgb(var(--line)/0.16)]` duplicates `stroke-line/15`. | `deadclasses.mjs` against the built CSS. Tailwind v3 `fill` and `stroke` read `theme('colors')`. | Silent no-ops mislead maintainers, and there is more arbitrary-value noise. | Delete `GardenAsset`'s unused `interactive`/`blend` path or define the easing. Use `duration-base` (or C's motion token). Swap to `fill-*`/`stroke-*` token utilities. | S | P3 |
| VIS-17 | ScrollInk statement (home `#why`) | **The un-inked start colour is `fg-subtle/0.75`, 3.23:1 on canvas**, not "6.5:1" as `globals.css:261` claims (that is the Night value at full opacity). It passes AA only because the text is large (24–36px serif). | `globals.css:277-279`; `contrast.mjs`. It appears grey in `home_1280.jpg` and `home_1920.jpg`. | The key "third option" statement reads faded until it is scrolled through, which is the moment people skim. | Start at `fg-subtle` full (5.39:1) and ink to `fg`, or use at least `/0.85` (3.93:1). Fix the comment. | S | P3 |
| VIS-18 | Iconography | **Icons are drawn on 6 grids** (16, 18, 20, 24 fill, 32, 48 viewBoxes), with rendered strokes from 1.1px (Principles marks, CopyButton) to 1.6px (Menu). The `/contact` "Documentation" tile uses the **text "docs" in a circle** where siblings use glyphs. | `icons.tsx:7` (1.6 on 16), `NavIcons.tsx:5` (1.5 on 20), `PillarIcons.tsx:11` (1.4 on 32), `Principles.tsx` (1.6 on 48 at 34px), `CopyButton.tsx:31` (1.5 on 16 at 12px). `contact_1280.jpg`. | Icon weight varies subtly between nav, cards and buttons, and the text-as-icon tile looks unfinished. | Standardise on a 20px grid with a 1.5px stroke (`vector-effect: non-scaling-stroke` for scaled marks). Add an `<Icon size="sm·md·lg">` wrapper (16/20/24) and a book/doc glyph for Documentation. | S | P3 |
| VIS-19 | Ecosystem partner logos | **Partner tiles are treated inconsistently.** 6 of 12 tiles use logos (3 SVG plus 3 large PNGs, e.g. `Aave-logo.png` 1666×278 for a 112×24 slot) and 6 use Inter 17px text "wordmarks". Optical weight is uneven: aave and GMX are heavy, Uniswap is light. The `scale` field exists for tuning but is unused. **`aragon-logo.svg` exists, but the Aragon tile is text.** | `ecosystem.ts:30-62`, `Ecosystem.tsx:41-58`, `public/Socialtrust/`. `home_1280.jpg` ecosystem rows. | The trust strip looks assembled rather than curated. | Use monochrome SVG for all 12 where available (owner to source official marks), or text for all. Balance with `scale` so each mark has similar visual area (≈ cap-height 14–16px). Use the existing Aragon SVG. | M | P3 |
| VIS-20 | `/about` team grid | **Team imagery is mixed:** pixel-art avatars, an illustration, a studio portrait on white, and low-light snapshots, all under one greyscale filter. Tones range from near-white to near-black tiles. | `about_1280.jpg` (team section). | It reads as uneven, but the content is the owner's. | Give every tile one treatment: the same crop, a leaf-tinted duotone and a `raised` backdrop behind cut-outs. Owner to supply consistent sources where possible. | M | P3 |
| VIS-21 | Colour-scheme strategy | **Light-only is deliberate but undocumented as a decision.** `colorScheme: "light"`, `:root{color-scheme:light}`, no `prefers-color-scheme` handling. `.theme-dark` islands set `color-scheme: dark` locally (good for scrollbars and controls). `theme-color #F7F8F4` meets a near-black announcement bar, which leaves a seam in Safari's tinted toolbar on first visit. | `layout.tsx:75-78`, `globals.css:15-17,60-61`. `first-visit_*.jpg`. | OS-dark users get a bright page. It is acceptable for launch, but it is a choice. | **Owner decision.** Light-only is defensible (brand, renders on paper). If a Night-garden site mode is wanted, the token architecture makes it a 1–2 day job: re-map `:root` under `@media (prefers-color-scheme: dark)` plus a `data-theme` override, add an extra elevation so dark islands still read as islands, extend the logo swap selector, and add `theme-color` with `media`. Optionally match `theme-color` to the bar while it shows. | M (if pursued) | P3 |
| VIS-22 | Layout at 1920 | **Not too wide, and only locally sparse.** The single `max-w-page` 1240 container (65% of 1920) with full-bleed bands and art reads well, and paragraph measure is identical to 1280. The sparse spots are: the `/security` ControlMap feature card (dark tile ≈45% empty), the `/about` roadmap 2023/2024 rows (one card in a two-column grid), and the `/protocol` Risks card's empty lower half. | `home_1920_*`, `protocol_1920_00`, `security_1280_00`, `about_1280_02`. 0 uses of `2xl:` and 3 of `xl:`. | This is minor; dense consoles (IndexExplorer, RulesDemo) could use more room on wide screens. | Optional: add `max-w-wide` (1360) for data consoles at ≥1600 (`3xl` breakpoint). Rebalance the sparse cards (ControlMap: move the "Read the source" link up, or `items-start` the row). | S | P3 |
| VIS-23 | Palette assignment: footer | **Code and docs disagree on which palette the footer uses.** SITE_MAP §1 and code comments list the footer as a Night-garden component ("running into the dark footer", `CtaBand.tsx:15`), but `Footer.tsx:55` renders the Day palette. Visually: dark CTA band → light footer. | `Footer.tsx:55` (no `theme-dark`), `globals.css:53-58`, `CtaBand.tsx:13-15`. | Future work may "fix" it in either direction. | Owner to confirm which is intended, then align comments, SITE_MAP and code. Visually the light footer gives the dark CTA band a clean edge, so I would keep it light and fix the docs. | S | P3 |

**Counts:** P0 0 · P1 1 · P2 9 · P3 13.

## 3. Proposed token set

Principles: **evolve, don't replace.** The R G B-triplet variables and `<alpha-value>` wiring stay. Every existing variable name stays, because canvases read `--leaf`, `--line`, `--sand`, `--cobalt` and `--fg-subtle` (`DotField.tsx:10`, `GlyphField.tsx:69-71`). Existing utilities keep working, and new semantic names are added on top. Units move from px to rem; the h1, h2 and lead curves are numerically unchanged.

### 3.1 Colour: primitives → semantic aliases

Primitives are theme-independent. Semantic variables point at them. Only Day sand changes value (VIS-08).

```css
/* globals.css: primitives (R G B triplets) */
:root {
  /* Paper: Day surfaces */
  --p-paper-0: 255 255 255;   /* #FFFFFF */
  --p-paper-50: 247 248 244;  /* #F7F8F4 */
  --p-paper-100: 239 242 236; /* #EFF2EC */
  --p-paper-150: 236 240 234; /* #ECF0EA */
  --p-paper-200: 222 228 220; /* plate-l */
  --p-paper-250: 208 215 206; /* plate-r */
  /* Night surfaces */
  --p-night-950: 9 13 11;     /* #090D0B */
  --p-night-900: 15 21 18;    /* #0F1512 */
  --p-night-850: 21 29 25;    /* #151D19 */
  --p-night-800: 27 37 32;    /* #1B2520 */
  /* Ink (Day text) and Mist (Night text) */
  --p-ink-900: 17 26 21;      /* #111A15 */
  --p-ink-700: 67 80 73;      /* #435049 */
  --p-ink-600: 92 105 98;     /* #5C6962 */
  --p-mist-50: 236 241 237;   /* #ECF1ED */
  --p-mist-300: 170 182 175;  /* #AAB6AF */
  --p-mist-400: 138 152 143;  /* #8A988F */
  /* Brand + state hues, Day (700) / Night (300) */
  --p-leaf-800: 26 92 57;   --p-leaf-700: 33 112 70;  --p-leaf-500: 63 138 95;
  --p-leaf-300: 143 214 168; --p-leaf-200: 170 226 189; --p-leaf-glow: 120 200 150;
  --p-bronze-700: 131 97 34;  /* #836122 (was #8A6726; 4.50 → 4.93 on raised) */
  --p-sand-200: 230 216 188;  /* #E6D8BC */
  --p-bloom-700: 178 58 98;   --p-bloom-300: 240 163 180;
  --p-cobalt-600: 37 99 196;  --p-cobalt-300: 125 180 255;
  --p-ember-700: 190 62 40;   --p-ember-300: 242 145 127;   /* danger */
  --p-amber-700: 140 98 10;   --p-amber-300: 227 192 122;   /* caution */
}

/* Day garden (default) */
:root, .theme-light {
  color-scheme: light;
  --canvas: var(--p-paper-50);  --surface: var(--p-paper-100);
  --card: var(--p-paper-0);     --raised: var(--p-paper-150);
  --line: var(--p-ink-900);
  --fg: var(--p-ink-900); --fg-muted: var(--p-ink-700); --fg-subtle: var(--p-ink-600);
  --leaf: var(--p-leaf-700); --leaf-deep: var(--p-leaf-800); --leaf-hover: var(--p-leaf-800);
  --sand: var(--p-bronze-700);
  --bloom: var(--p-bloom-700); --cobalt: var(--p-cobalt-600);
  --danger: var(--p-ember-700); --caution: var(--p-amber-700);
  /* semantic aliases (new) */
  --accent: var(--leaf); --accent-hover: var(--leaf-hover); --on-accent: var(--canvas);
  --emphasis: var(--sand); --data: var(--cobalt); --progress: var(--bloom);
  --success: var(--leaf); --warning: var(--caution);
  /* borders = --line at a role alpha */
  --a-border-subtle: 0.08;  /* dividers, card edges: 1.17:1 */
  --a-border: 0.12;         /* default hairline: 1.28:1 */
  --a-border-strong: 0.5;   /* control boundary when the border is the affordance: 3.3:1 */
  /* focus */
  --focus-ring: var(--leaf); --focus-width: 2px; --focus-offset: 3px;
  /* effects (unchanged values) */
  --glow: var(--p-leaf-glow); --shadow: 17 26 21 / 0.16;
  --plate-l: var(--p-paper-200); --plate-r: var(--p-paper-250);
  --fx-glow: 0.34; --fx-line: 0.8; --fx-sweep: 0.16;
  --scrim: 9 13 11 / 0.6;
  --logo-filter: grayscale(1) brightness(0);
}

/* Night garden (islands; and the basis for an OS dark mode if the owner wants one) */
.theme-dark {
  color-scheme: dark;
  --canvas: var(--p-night-950); --surface: var(--p-night-900);
  --card: var(--p-night-850);   --raised: var(--p-night-800);
  --line: var(--p-mist-50);
  --fg: var(--p-mist-50); --fg-muted: var(--p-mist-300); --fg-subtle: var(--p-mist-400);
  --leaf: var(--p-leaf-300); --leaf-deep: var(--p-leaf-500); --leaf-hover: var(--p-leaf-200);
  --sand: var(--p-sand-200);
  --bloom: var(--p-bloom-300); --cobalt: var(--p-cobalt-300);
  --danger: var(--p-ember-300); --caution: var(--p-amber-300);
  --a-border-subtle: 0.08; --a-border: 0.12; --a-border-strong: 0.4; /* 3.5:1 on card */
  --glow: var(--p-leaf-300); --shadow: 0 0 0 / 0.6;
  --plate-l: var(--p-night-800); --plate-r: var(--p-night-900);
  --fx-glow: 0.18; --fx-line: 0.5; --fx-sweep: 0.09;
  --logo-filter: grayscale(1) brightness(0) invert(1);
  /* --accent, --emphasis … re-resolve automatically (they reference --leaf etc. in this scope) */
}
```

> Note: aliases such as `--accent: var(--leaf)` must be **re-declared inside `.theme-dark`**, or declared on `*`. A custom property's `var()` resolves on the element where it is declared, so a `:root` alias would keep the Day value inside a dark island. The simplest approach is to keep the alias block in a shared rule: `:root, .theme-light, .theme-dark { --accent: var(--leaf); … }`.

**Contrast matrix (measured, text token on surface).** Proposed sand is shown in brackets.

| Day | canvas | surface | card | raised | leaf/10 tint |
|---|---|---|---|---|---|
| fg | 16.65 | 15.72 | 17.76 | 15.41 | 15.45 |
| fg-muted | 7.93 | 7.49 | 8.46 | 7.34 | 7.36 |
| fg-subtle | 5.39 | 5.09 | 5.75 | 4.99 | 5.00 |
| leaf | 5.67 | 5.35 | 6.05 | 5.25 | 5.26 |
| sand | 4.86 [5.32] | 4.59 [5.02] | 5.19 | **4.50** [4.93] | 4.51 |
| bloom / cobalt | 5.36 / 5.38 | 5.06 / 5.08 | 5.71 / 5.74 | 4.96 / 4.98 | 4.97 / 4.99 |
| danger / caution | 5.04 / 5.09 | 4.75 / 4.81 | 5.37 / 5.43 | 4.66 / 4.71 | 4.67 / 4.73 |
| canvas on leaf (primary button) | 5.67 | | | | |

| Night | canvas | surface | card | raised | leaf/10 tint |
|---|---|---|---|---|---|
| fg | 17.11 | 16.17 | 15.04 | 13.79 | 12.11 |
| fg-muted | 9.33 | 8.82 | 8.20 | 7.52 | 6.61 |
| fg-subtle | 6.49 | 6.13 | 5.70 | 5.23 | 4.59 |
| leaf / sand | 11.50 / 13.89 | 10.87 / 13.12 | 10.11 / 12.21 | 9.27 / 11.20 | 8.14 / 9.83 |
| bloom / cobalt / danger / caution | ≥8.50 | ≥8.04 | ≥7.48 | ≥6.86 | ≥6.02 |
| canvas on leaf (primary button) | 11.50 | | | | |

Hairlines are decorative at 1.17–1.39:1 in both themes. Use `border-strong` wherever a border is the only thing identifying a control (WCAG 1.4.11; D to confirm which cases).

### 3.2 Tailwind config (colour, border, ring)

```ts
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;
// theme.extend
colors: {
  canvas: c("--canvas"), surface: c("--surface"), card: c("--card"), raised: c("--raised"),
  line: c("--line"),
  fg: { DEFAULT: c("--fg"), muted: c("--fg-muted"), subtle: c("--fg-subtle") },
  leaf: { DEFAULT: c("--leaf"), deep: c("--leaf-deep"), hover: c("--leaf-hover") },
  sand: c("--sand"), bloom: c("--bloom"), cobalt: c("--cobalt"),
  // semantic roles (new)
  accent: { DEFAULT: c("--accent"), hover: c("--accent-hover"), fg: c("--on-accent") },
  emphasis: c("--emphasis"), data: c("--data"), progress: c("--progress"),
  success: c("--success"), warning: c("--warning"), danger: c("--danger"),
  // deprecated aliases, remove after migration
  positive: c("--leaf"), negative: c("--danger"), caution: c("--caution"),
},
opacity: { 6: "0.06", 7: "0.07", 8: "0.08", 12: "0.12" },          // safety net (VIS-01)
borderColor: {
  DEFAULT: "rgb(var(--line) / var(--a-border))",                     // bare `border` = hairline, never Tailwind grey
  subtle: "rgb(var(--line) / var(--a-border-subtle))",
  strong: "rgb(var(--line) / var(--a-border-strong))",
},                                                                   // divide-* inherits borderColor
ringColor: { DEFAULT: "rgb(var(--focus-ring))" },
ringOffsetColor: { DEFAULT: "rgb(var(--canvas))" },
outlineColor: { focus: "rgb(var(--focus-ring))" },
```

```css
/* globals.css: replaces lines 128-132 */
:focus-visible {
  outline: var(--focus-width) solid rgb(var(--focus-ring));
  outline-offset: var(--focus-offset);
  /* no border-radius: the outline follows the element's own radius */
}
```

### 3.3 Type scale

The ratio is about 1.25 (major third) from body to display-md, with h1 kept as the dramatic jump. Display steps are fluid between 375 and ~1300px. Values are listed as min → max.

```ts
fontSize: {
  micro:   ["0.6875rem", { lineHeight: "1.3" }],                                        // 11 · aria-hidden illustration text ONLY
  label:   ["0.75rem",   { lineHeight: "1.2" }],                                        // 12 · caps labels, numerals, chips
  eyebrow: ["0.75rem",   { lineHeight: "1", letterSpacing: "0.14em" }],                 // 12 · unchanged
  caption: ["0.8125rem", { lineHeight: "1.5" }],                                        // 13 (was 12.5)
  small:   ["0.875rem",  { lineHeight: "1.55" }],                                       // 14
  ui:      ["0.9375rem", { lineHeight: "1.45" }],                                       // 15 · buttons, card body, step labels
  body:    ["1rem",      { lineHeight: "1.65" }],                                       // 16
  lead:    ["clamp(1.0625rem, 0.75rem + 1.2vw, 1.25rem)", { lineHeight: "1.6" }],       // 17 → 20 (same curve)
  h4:      ["clamp(1.125rem, 1rem + 0.5vw, 1.25rem)", { lineHeight: "1.3" }],           // 18 → 20
  h3:      ["clamp(1.5rem, 1.0625rem + 1.1vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],    // 24 → 28
  "display-sm": ["clamp(1.5rem, 1rem + 1.6vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }], // 24 → 36
  "display-md": ["clamp(1.75rem, 0.875rem + 2.4vw, 2.875rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }], // 28 → 46
  h2:      ["clamp(1.875rem, 1.125rem + 2.6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }], // 30 → 52 (same curve)
  h1:      ["clamp(2.5rem, 1rem + 5vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],          // 40 → 88 (same curve)
},
letterSpacing: { caps: "0.12em", eyebrow: "0.14em" },
maxWidth: { page: "77.5rem" /* 1240 */, wide: "85rem" /* 1360, ≥3xl consoles */, measure: "58ch", "measure-narrow": "50ch" },
```

Computed sizes:

| token | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| h1 | 40 | 54.4 | 80 | 88 |
| h2 | 30 | 38 | 51.3 | 52 |
| display-md | 28 | 32.4 | 44.7 | 46 |
| display-sm | 24 | 28.3 | 36 | 36 |
| h3 | 24 | 25.4 | 28 | 28 |
| h4 / lead | 18 / 17 | 19.8 / 20 | 20 / 20 | 20 / 20 |

```css
/* globals.css @layer components: one caps label (VIS-05) */
.label-caps { @apply font-mono text-label uppercase tracking-caps text-fg-subtle; }
.prose-legal { max-width: 58ch; font-size: 0.9375rem; /* 15 */ }
.prose-legal h2 { font-size: theme(fontSize.h3); }   /* 24 → 28, was 24px fixed */
```

`utils.ts` → `classGroups["font-size"]` must list `micro, label, eyebrow, caption, small, ui, body, lead, h4, h3, display-sm, display-md, h2, h1`. Otherwise `cn()` drops them as colours, as the existing comment warns.

**Fonts (`layout.tsx`):** Newsreader `weight: ["400"]` (500 is never rendered). JetBrains Mono gets `adjustFontFallback: false, fallback: ["ui-monospace","SFMono-Regular","Menlo","Consolas","monospace"]`. Whether to also preload it is E's call.

### 3.4 Spacing and layout

The 4px Tailwind scale stays for component internals (it is already 95%+ on-scale). Layout gets named tokens:

```css
:root {
  --space-section: clamp(5rem, 4.15rem + 3.7vw, 7rem);    /* 80 → 112, replaces py-20 sm:py-24 lg:py-28 */
  --space-section-sm: clamp(4rem, 3.15rem + 3.7vw, 6rem); /* 64 → 96: CtaBand, footer, hero bottom */
  --space-header: clamp(3rem, 2.8rem + 0.6vw, 3.5rem);   /* section header → content (mb-12/14) */
  --gutter: clamp(1.25rem, 0.6rem + 2.8vw, 2rem);         /* px-5 → px-8 */
  --pad-card: clamp(1.5rem, 1.35rem + 0.6vw, 1.75rem);    /* p-6 → p-7 */
  --pad-panel: clamp(1.5rem, 0.9rem + 2.4vw, 2.5rem);     /* p-6 → p-10 consoles */
}
```

```ts
spacing: { section: "var(--space-section)", "section-sm": "var(--space-section-sm)", gutter: "var(--gutter)",
           "pad-card": "var(--pad-card)", "pad-panel": "var(--pad-panel)", header: "var(--space-header)" },
```

Add a `<Container size="page|wide|measure">` component (`mx-auto w-full max-w-page px-gutter`) to replace the 13 hand-written copies.

### 3.5 Radius

```ts
borderRadius: { xs: "0.25rem", tag: "0.375rem", control: "0.75rem", card: "1rem", panel: "1.5rem" },
// keep Tailwind's sm/md/lg/xl/2xl/3xl/full for one release; lint against new uses
```

Rule: nested radius = outer − inset (a panel at 24 with p-2 → inner control 16).

### 3.6 Shadow / elevation

```ts
boxShadow: {
  e1: "0 10px 30px -16px rgb(var(--shadow))",          // resting raised tiles, tooltips, chips
  e2: "0 24px 60px -24px rgb(var(--shadow))",          // dropdown, cookie banner, scrolled nav, hover lift
  e3: "0 32px 80px -28px rgb(var(--shadow))",          // dialog, sticky product deck, featured index tile
  halo: "0 0 0 4px rgb(var(--leaf) / 0.12)",           // selected/active node ring
  "inset-accent": "inset 0 0 0 1px rgb(var(--leaf) / 0.35)",
},
```

### 3.7 Breakpoints

Keep Tailwind's defaults: `sm 640 · md 768 · lg 1024` (the main layout switch, 213 uses) `· xl 1280`. Optionally add `3xl: "100rem"` (1600) for `max-w-wide` consoles only.

### 3.8 Z-index layers

```ts
zIndex: { raised: "10", tooltip: "30", nav: "50", banner: "55", overlay: "60", toast: "65", skip: "70" },
```

Uses: nav plus the mobile sheet → `z-nav`; cookie banner → `z-banner`; preferences dialog and scrim → `z-overlay`; easter-egg toast → `z-toast`; skip link → `focus:z-skip`; Hint → `z-tooltip`.

### 3.9 Focus ring

`--focus-ring` (leaf: 5.67:1 Day / 11.5:1 Night on canvas), `--focus-width: 2px`, `--focus-offset: 3px` (2px inside dense controls via `focus-visible:outline-offset-2`). There is no radius on the ring. Use the same token for `ring-*` when a component needs an inset ring (`ring-2 ring-inset`) inside `overflow-hidden` containers.

### 3.10 Migration map (most common drift)

| Old | Count | New |
|---|---|---|
| `border-line/[0.08]`, `border-line/[0.07]`, `divide-line/[0.0x]`, `border-line/[0.06]`, `border-line/[0.05]` | ~110 | `border-subtle` / `divide-subtle` |
| `border-line/10`, `border-line/12` (dead), `border-line/15` | 23 dead + ~30 | `border` (DEFAULT = line/0.12) |
| `bg-line/12` (dead rails) | 3 | `bg-line/12` (valid after the opacity extension) |
| `border-line/30…/50` on controls whose border is the affordance | case by case | `border-strong` |
| `bg-leaf/[0.06]`, `bg-leaf/[0.07]`, `bg-sand/[0.06]`, `bg-cobalt/[0.05]`, `bg-caution/[0.07]` | 14 | `bg-*/6` |
| `font-mono text-[11px] uppercase tracking-[0.12em\|0.14em\|0.1em] text-fg-subtle` | 33 | `.label-caps` |
| `text-caption font-semibold uppercase tracking-[0.12em]` (sans labels, footer column heads) | 6 | `text-label font-semibold uppercase tracking-caps` |
| `text-[11.5px]` (Badge, footer strapline) | 16 | `text-label` |
| `text-[10px]`, `text-[10.5px]`, `text-[11px]` inside `aria-hidden` art | ~10 | `text-micro` |
| `text-[12px]`, `text-[12.5px]`, `text-[13px]`, `text-[13.5px]` | 42 | `text-label` (numerals) / `text-caption` |
| `text-[14px]`, `text-[14.5px]`, `text-[15px]`, `text-[15.5px]`, `text-[16px]`, `text-[16.5px]` | 40 | `text-small` / `text-ui` / `text-body` |
| `text-[17px]`–`text-[20px]` | 8 | `text-h4` / `text-lead` |
| `text-[22px]`–`text-[28px]` and `clamp(22px,1.4vw+14px,28px)` (AtAGlance), `clamp(22px,1.2vw+16px,30px)` (IndexShowcase) | 11 | `text-h3` |
| `clamp(24px,1.5vw+16px,36px)` (Problem), `clamp(24px,1.6vw+16px,34px)` (ProposalBoard) | 2 | `text-display-sm` |
| `clamp(28px,2vw+16px,42px)` (Products), `clamp(28px,2.4vw+14px,46px)` (TokenSpec), `clamp(30px,2.4vw+16px,44px)` (ControlMap), `clamp(30px,2.6vw+14px,48px)` (AllocationExplorer), `clamp(34px,2.6vw+18px,56px)` (ProductStack) | 5 | `text-display-md` |
| `clamp(40px,5.5vw+12px,96px)` + `leading-[0.98] tracking-[-0.025em]` (Footer) | 1 | `text-h1` |
| `rounded-3xl`, `rounded-[24px]`, `rounded-[28px]`, `rounded-[32px]` | 25 | `rounded-panel` |
| `rounded-2xl` on card surfaces | ~45 | `rounded-card` |
| `rounded-xl` on nested tiles / chips | 22 | `rounded-control` |
| 22 distinct `shadow-[…]` | 23 | `shadow-e1` / `e2` / `e3` / `halo` / `inset-accent` |
| `z-50`, `z-[55]`, `z-[60]`, `z-[60]` (toast), `z-[70]`, `z-30` | 6 | `z-nav`, `z-banner`, `z-overlay`, `z-toast`, `z-skip`, `z-tooltip` |
| `max-w-prose` (68ch) | 4 | `max-w-measure` (58ch) |
| `max-w-2xl` on `text-small` / `text-body` paragraphs | ~5 | `max-w-measure` |
| `mx-auto w-full max-w-page px-5 sm:px-8` | 13 | `<Container>` |
| `py-20 sm:py-24 lg:py-28` (Section) / `py-20 sm:py-24` (CtaBand) | 2 sources | `py-section` / `py-section-sm` |
| `fill-[rgb(var(--fg-subtle))]` etc. | 12 | `fill-fg-subtle`, `fill-leaf`, `fill-cobalt`… |
| `text-leaf` for state ("Allowed", "Executed"), `text-negative`, `bg-cobalt` meters | ~20 | `text-success`, `text-danger`, `bg-data` |
| `ease-in-soft`, `duration-400` | 2 | remove / `duration-base` (C's motion tokens) |

**Suggested order:** (1) the safety-net PR: opacity extension, `borderColor.DEFAULT`, focus rule, sand value and mono fallback (S, under 2 hours, fixes VIS-01, 02, 07 and 08). (2) Add the tokens, the `twMerge` config, `.label-caps`, `Container` and the `Card` variants (M). (3) A regex codemod using the table above, then re-run the baseline screenshot capture at 375 and 1280 to compare (M). (4) Add an ESLint rule (`no-restricted-syntax` on className literals matching `-\[\d+(\.\d+)?px\]|shadow-\[|rounded-\[|z-\[`) to stop new drift.

## 4. Keep

- **The variable architecture:** R G B triplets with `<alpha-value>`, `.theme-dark` re-declaring every token, and canvases reading theme variables. As a result only **2 raw colour literals** exist outside the OG image and manifest (`EasterEggs.tsx:121`, `BasketOrbit.tsx:119`).
- **Contrast discipline:** every text token is ≥4.5:1 on all four surfaces in both gardens, except the 4.497 sand/raised edge.
- **One container** (`max-w-page` 1240 plus consistent gutters) and a **consistent section rhythm** (112px desktop padding everywhere, alternating canvas/surface bands with CornerMarks). The layout holds at 1920 without overflow.
- **Paragraph measure** is 59–70 cpl everywhere except legal and the small-text cases (VIS-06).
- **The type pairing:** Newsreader display with the italic **sand payoff** on headings, `text-balance`, tabular figures and the `// eyebrow`. It is distinctive and on-brand.
- **The Badge vocabulary** with fixed meanings (live / current / done / soon / example), including the "example" honesty badge.
- **Metric-matched `next/font` fallbacks** for Inter and Newsreader (size-adjust and ascent overrides verified).
- **The garden renders:** one consistent photographic style, alpha WebP, plus CSS-driven light/dark logo swap with no JS.
- **`extendTailwindMerge`** knows the custom scale. Extend it rather than remove it.

## 5. Cross-agent notes

- **D:** The /about `color-contrast` axe hits are the decorative `aria-hidden` numerals (`Principles.tsx:45`, `text-line/[0.05]`). Render them via CSS `content` or SVG, or document them as decorative. Footer column titles are `<h2>` styled as 12.5px caps (`Footer.tsx:91`), which adds 41 h2s across the site to the outline. Hairline control borders are 1.36:1 (`Button` secondary `border-line/15`); check 1.4.11 where the border is the only affordance (e.g. `RebalanceLab` inputs). VIS-02 focus reshaping is also relevant to your keyboard pass.
- **C:** There are 30 arbitrary `transition-[…]` property lists and one undefined `duration-400` (`EasterEggs.tsx:87`, which falls back to 150ms). Reveal and `enter-up` timings use literal cubic-beziers rather than the `--ease-*` tokens (`globals.css:363`, `tailwind.config.ts:105`).
- **E:** Newsreader `weight:["400"]` may shrink the two preloaded 58 kB and 64 kB files (unverified). The JetBrains Mono preload trade-off (21 kB, used above the fold on every page) is yours. `text-rendering: optimizeLegibility` on `body` (`globals.css:120`) applies to the 2.3k-node home. `Aave-logo.png` is 1666×278 (30 kB) and `uniswap-logo.svg.png` is 1280×320 (40 kB), both for 112×24 slots.
- **K:** Unused assets: `public/Socialtrust/{chainforce.png, gmx-logo.jpeg, pimlico-logo.svg, quick-logo.png, quick-logo-transparent.png, aragon-logo.svg}`. The `Component.color` field is unused (`indices.ts:58-69`), as are `GardenAsset`'s `interactive`/`blend` props. Stale comments: `CtaBand.tsx:15` ("dark footer"), `globals.css:261` ("6.5:1"), `tailwind.config.ts:10` ("every foreground ≥ 4.5:1"). SITE_MAP §1 lists the footer as Night garden, but the code renders it as Day.
- **I/K:** The legal TOC shows a double-escaped entity: "14. Governing Law `&amp;` Jurisdiction" (`legal_user-agreement_1280.jpg`, `PolicyTOC` / `policies.ts`).
- **G:** The ecosystem evidence label overflows its tile by 51px at 1024 (VIS-10). Check 768 and 375.
- **Orchestrator:** `localhost:4173` was down during my main pass. I used a private `serve` of the same export on :4282 (since stopped) and re-verified VIS-01 and VIS-02 on the restarted `:4173`.
