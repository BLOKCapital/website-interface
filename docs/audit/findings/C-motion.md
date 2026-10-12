# C · Motion & micro-interactions

Agent C · `redesign` @ `5beb0ee` · 2026-10-11 · ID prefix `MOT-`

## 1. Scope & method

- **Code read** of every keyframe and transition: `globals.css`, `tailwind.config.ts`, `RevealScript`, `ui/Reveal`, `components/motion/*`, `lib/motion.ts`, `app/template.tsx`, nav, cookie, explainers (`ProtocolExplorer`, `RulesDemo`, `DecisionPipeline`, `HowItWorksScroller`/`GardenMock`, `RebalanceLab`, `AllocationExplorer`, `IndexShowcase`/`BasketOrbit`) and the shared UI primitives.
- **Measured** in Chrome 154 via Playwright against my own `serve` of the same export (`:4273`; `:4173` was down while I started). The scripts are in `scratchpad/tools/agent-C/`:
  - `inventory.mjs`: `getAnimations()` per route plus layout-shift sources.
  - `lcpvar.mjs`, `lcpvar-desk*.mjs`: entrance variants injected as CSS. n=3 at 375 px, DPR 2, 4× CPU, 1.6 Mbps / 150 ms.
  - Lighthouse 12.2.1 on a patched copy of the export (`site-tonly/`), simulated and `--throttling-method=devtools`.
  - `steady2.mjs`, `canvas.mjs`, `loadcost.mjs`: CDP `Performance.getMetrics` at 1× and 4× CPU.
  - `inp.mjs` (Event Timing), `rm.mjs` and `sheet.mjs` (reduced motion), `focus.mjs`, `autoshift.mjs`, `rulesh.mjs`.
- The machine is shared, so all numbers are medians and should be read as relative. E (PERF-01/03/04), D (A11Y-08/19/20) and G (MOB-04/06/11/13) overlap with some findings here. I mark those `≈ ID` so the orchestrator can merge them. This file adds the motion-side fix for each.
- **Not present at HEAD:** a marquee, tilt cards and a "price tape". `grep` finds none in `src/`. The only remaining mention is a stale comment at `globals.css:54`.

## 2. Findings

| ID | Page/Component | Problem | Evidence | User impact | Recommended fix | Effort | Priority |
|---|---|---|---|---|---|---|---|
| MOT-01 | Every hero · `PageHero.tsx:67,71,77`, `Hero.tsx:81,86,94,107` (≈ PERF-01) | The LCP element (the lead `p`, and the token image inside the `/token` aside) starts at `opacity:0` (`enterUp`, `tailwind.config.ts:74-76,105`). Chrome records it only on a later main-thread repaint. **Shortening the fade does not help.** The hero CTAs are also invisible for 260–960 ms, and the hero takes about 1.65 s to settle (chips land at 700–940 ms + 700 ms). | `lcpvar.mjs`, n=3, LCP−FCP: `/` **+692 ms**, `/protocol` **+688**, `/token` **+544**. Variants: **transform-only → +0 on all three**, lead static → +0, *300 ms fade with no delay → +696 (no gain)*. Lighthouse devtools throttling: home LCP 2203→**1643** and 3852→**2678** ms (= FCP), `/protocol` 2187→**1679** ms. Lighthouse *simulated* LCP is unchanged (3.41 vs 3.41 s), which is the PERF-03 bytes issue. | First-time mobile visitors wait 0.5–1.2 s longer for the main message. The conversion buttons are clickable while still invisible. | Use the §4 entrance pattern. LCP group (h1, lead, hero media, CTAs): `animate-rise`, a transform-only 8–12 px rise with opacity 1 on the first frame, no delay, `--dur-slow`. Only secondary items (badge, eyebrow, breadcrumb, chips, flow lines, facts) may fade, with delay ≤150 ms. Total hero choreography ≤700 ms. Gate: LCP−FCP ≤ 50 ms (E §4 R1). | S | **P1** |
| MOT-02 | Site-wide, heaviest on `/` (≈ A11Y-08, A11Y-19, MOB-11) | Decorative loops run with no way to stop them except the OS setting (WCAG 2.2.2 Level A on a strict reading). `DecisionPipeline` advances every 2.6 s forever, pausing only on mouse hover. The only pause buttons are in `ProtocolExplorer` and `RulesDemo`. | `inventory.mjs` at 1280: infinite animations running on `/` **52**, `/protocol` 29, `/indices` 14, `/indices/blokc5` 8, `/token` 6. `DecisionPipeline.tsx:22,41-45,52-53`. Loops: `Hero.tsx:39-60,108` (flow, pulse rings, float), `globals.css:401-512` (art-\*, orbit), `.scanlines` (`:186-195`), blink. | Distracting for people with attention or vestibular needs who haven't set the OS preference. The pipeline can't be held still to read. | (1) Make decorative loops **finite**: settle within 5 s of entering view (≤3 cycles), then rest on the still frame, with replay on hover or focus. That puts them under the 2.2.2 five-second exemption. (2) Add a global **"Pause motion"** toggle (spec in §4). (3) `DecisionPipeline`: add a pause button, stop on the first tap, and play once through then stop. D makes the conformance call. If D rules this a hard 2.2.2 failure on `/`, the rubric makes it P0. | M | **P1** |
| MOT-03 | `/`, `/protocol`, `/indices*` · CSS loops (≈ PERF-04) | Infinite CSS loops keep the main thread busy **even when none is on screen**. More than 20 of them animate properties Chrome can't composite: `stroke-dashoffset` (`flow`, `artDash`), transforms on SVG children (`pulseRing` on `<circle>`, `artSpin`, `artPulse`, `artRoute`), `box-shadow`/`border-color` (`artChip`, `artDrift`) and `background-color` (`artSwitch`). Nothing pauses them off-screen. The selected-spoke `flow` sits *inside* the rotating orbit layer (`BasketOrbit.tsx:68,90`), so it repaints that layer every frame. | `steady2.mjs`, ms of main thread per second, idle, 4×. At 1280: hero **311**, `#ecosystem` (no loop in view) **285**. At 375: top 379, `#products` 291, `#ecosystem` 178. With CSS animations paused, and under reduce: **0**. At 1×: 86–147. Home load, 375, 4×, first 8 s: busy 2,545 ms vs 806 ms with the loops removed (`loadcost.mjs`). TBT is unchanged (24–38 ms). Tap INP +0–16 ms (`inp.mjs`). | Battery and heat on phones. It competes with input during long visits. It is not a Core Web Vitals failure today. | Mark each looping illustration `data-loop`. Extend `RevealScript` with a second IntersectionObserver that sets `data-inview`, plus the CSS `[data-loop]:not([data-inview]) * {animation-play-state:paused}`. Rebuild the loops on composited properties: dashes become a translating HTML/`::before` pattern or a one-shot `pathLength` draw; pulse rings become HTML spans over the SVG; shadow pulses become the opacity of a pseudo-element shadow. Move the selected-spoke flow outside the rotating layer. Gate: idle < 5 % at 4× with no loop in view (E R3). | M | P2 |
| MOT-04 | Every page · `Footer.tsx:58-59` (`GlyphField`), `CtaBand.tsx:21-23` (`DotField`, lg+) | Both canvases redraw continuously while visible: GlyphField at 24 fps calls `fillText` on **every cell every frame**, and DotField runs at 30 fps. They share the bottom of every page, so both run together. `useCanvasLoop` schedules a rAF every frame (120 rAF/s for the pair) even though it draws at 24–30 fps. | `canvas.mjs`, 4×, CSS paused, at the CTA and footer. 1280: both **279 ms/s** (DotField alone 163, GlyphField alone 177). 1920: both **514 ms/s** (295 and 215). `rm.mjs`: 120 rAF callbacks/s with motion, 0 under reduce. | The page bottom (CTA → Discord, the primary conversion) is where the main thread is busiest. On laptops it costs battery and fan noise. | Cap at 12–15 fps. GlyphField: redraw only dirty cells (heat > 0 or churned) from a pre-rendered glyph atlas with `drawImage`. Let both fields **settle** about 6 s after entering view and resume on scroll or pointer (garden metaphor: settling soil). Use `setTimeout`-paced frames rather than a rAF every frame. Use a coarser gap on ≥1440 px. Skip animation when `navigator.connection?.saveData` is set. | M | P2 |
| MOT-05 | `/` #explore `ProtocolExplorer`, `/governance` `DecisionPipeline` (≈ MOB-04, A11Y-20) | Autoplay keeps going **while the visitor reads on touch**. ProtocolExplorer pauses only on mouse hover or `:focus-visible`. Tapping a tab "carries on" (`ProtocolExplorer.tsx:41,57-58,89-95,124`). Its 6.5 s dwell (`:27`) covers 80–100 words per layer. RulesDemo already stops autoplay on select (`RulesDemo.tsx:92-96`), so the pattern is inconsistent. | Code as cited. G measured a tab tap followed by an auto-advance 7.2 s later (MOB-04). | People lose their place in the core "how it works" explainer. Content is replaced under the reader. | One rule for every explainer: any user input (tap, click, key, swipe on the strip, Prev/Next) **stops autoplay for the visit** and shows "Resume". Autoplay only from `lg` with `(hover:hover)`. Set the dwell from word count (≈200 wpm + 2 s, about 25–30 s per layer) or play once, then stop on the last step. | S | P2 |
| MOT-06 | `/` `RulesDemo` (and `ProtocolExplorer`, MOB-04) | The autoplay changes the explainer's **height** on phones, so everything below jumps. The `› ▍` cursor line is appended when a trace finishes (`RulesDemo.tsx:283-287`, +36 px), and scenario 1 is taller than the rest. `min-h-[320px]` (`:241`) holds only at desktop. | `rulesh.mjs` at 375: `#rules` height **1094 vs 936 px** across scenarios (stable at 863 px at 1280). `autoshift.mjs` while idle at 375: a **0.0375** single layout shift (the `#now` section moved 768 px) and 43 shift entries in 20 s. G measured 830–943 px for ProtocolExplorer. | Content the reader is looking at jumps with no input. CLS stays under 0.1 per window but rises to about 0.05 on `/`. | Reserve the height. Stack the scenarios and traces in one grid cell (`grid-area:1/1`, inactive ones `invisible` + `inert`) or set `min-height` to the tallest per breakpoint. Always render the cursor line (hidden until done). **Never animate height** (E R5). | S | P2 |
| MOT-07 | `/indices*` `RebalanceLab` | During a slider drag the holding bar eases (`transition-[width] duration-300`, `RebalanceLab.tsx:104`), while the target marker (`:107`) and the 2 % band (`:97-101`) jump instantly. The bar visibly **lags the marker**, so the picture briefly contradicts the drift figure. Width is also a layout property. | Code as cited. Three elements share one value and use two timings. | The one hands-on explainer feels sluggish and is momentarily wrong, which undercuts the "real maths" message. | Direct manipulation should be 1:1: no transition while the input changes (use `transform: scaleX()` if any). Animate only the *verdict* change: when drift crosses 2 %, the band tints caution once (`--dur-fast`) and the "≈ $X moves" note rises 8 px. See also §5, Rebalance. | S | P2 |
| MOT-08 | `/token` `AllocationExplorer` | The supply strip is **server-rendered at `scaleX(0)`** and appears only after hydration plus an IntersectionObserver. Without JS it never appears. Under reduced motion it still waits for hydration. This breaks the site's own contract (hidden only under `html.js` and no-preference). | `AllocationExplorer.tsx:65-76` (`transform: seen ? scaleX(1) : scaleX(0)`). The exported `token.html` contains `transform:scaleX(0)`. | The headline allocation chart is blank on slow phones until hydration, and missing for no-JS readers and crawlers' screenshots. | Use the `.meter-fill` pattern (`globals.css:612-620`): render full width. Hide only via `html.js [data-reveal-group]:not([data-revealed]) …` inside `(prefers-reduced-motion: no-preference)`, driven by `RevealScript`. | S | P2 |
| MOT-09 | Every page · `globals.css:128-132` | The global `:focus-visible` rule sets `border-radius: 6px`. It comes after the utilities, so it overrides `rounded-full`: **pill buttons and nav triggers snap to square-ish corners on keyboard focus.** That is a shape jump on every key press. | `focus.mjs`, home tab walk: 12 of the first 16 stops change radius **9999px → 6px** ("Explore the indices", "How it works", "Join Discord", the nav triggers). | The focus state looks broken and jittery for keyboard users. The ring no longer hugs the control. | Remove `border-radius` from the rule (outlines follow the element's own radius in current browsers). Add `border-radius: 6px` only to bare text links that need it (`a:not([class*="rounded"])`). Tell D (focus ring work, A11Y-05). | S | P2 |
| MOT-10 | Header, nav, How it works, explainers | **Layout and paint properties are animated.** Header pill: `height`, `padding-top`, `border-radius`, `box-shadow` and logo `height` over 600 ms (`Nav.tsx:72,77,84`). Announcement collapse: `grid-template-rows` (`AnnouncementBar.tsx:30`). Desktop panel: `width`/`height`/`filter` (`DesktopNav.tsx:227`). Highlight: `width` (`:165`). GardenMock `Fold`: `grid-template-rows` (`GardenMock.tsx:47-58`). Rail: `height` (`HowItWorksScroller.tsx:82`). Pipeline token: `left` (`DecisionPipeline.tsx:71`). Explorer tabs: `top` (`ProtocolExplorer.tsx:132`). EasterEggs bloom: `left`/`top` per pointermove (`EasterEggs.tsx:85-88`). | `inventory.mjs`: the only non-input layout shifts on every page come from the header pill, **0.0025 at 1280 / 0.0042 at 375**. Home 1280 adds the HowItWorks callouts and caption, for 0.0111 total. Every shift is far below 0.1. | No CLS risk, but it means layout and paint per frame during scroll and menu use, and a softer feel on low-end phones. | Fixed-height header. The pill surface is an absolutely positioned layer animated with `opacity` + `transform: scale`, and the logo uses `transform: scale`. Nav highlight: a fixed-width element with `scaleX`/`translateX`. Panel morph: FLIP a background layer with `transform` and crossfade the content. GardenMock: reserve full height and reveal the stage content with opacity and transform. Rail: `scaleY`. Pipeline token: `translateX`. Tabs: `translate`. | M | P3 |
| MOT-11 | Tabs and panels: `ProtocolExplorer`, `IndexExplorer`, `IndexShowcase`, `RulesDemo` | **Repeated UI replays long entrances.** Each tab switch remounts the panel with a 450 ms rise from opacity 0. IndexShowcase list items stagger 40 ms each, **prices included** (`IndexShowcase.tsx:127,142`), so about 0.8 s passes before settling. Selection colour on ProtocolExplorer tabs takes 600 ms (`:132`). A user-picked RulesDemo scenario needs about **2.4–3.8 s** to reach its verdict (24 ms per 2 chars of typing, 380/560 ms per line, `RulesDemo.tsx:66-78`). | Code as cited. Time-to-verdict is computed from `scenarios.ts` line lengths. | Feedback feels slow, data flickers on every switch, and a visitor who asked "what happens if…" waits for the answer. | Panel swap: crossfade `--dur-base` with ≤2 px movement and no per-item stagger on switch. Selected state: colour at `--dur-fast`. User-initiated RulesDemo run: type the call instantly and reveal checks every 90 ms, so the verdict lands in ≤800 ms. Keep the slow typewriter for autoplay only. | S | P3 |
| MOT-12 | `/` `AtAGlance`, `/token` `TokenSpec`, `/governance` `ProposalBoard` | `CountUp` animates **small, factual figures**: 3 indices, Decimals 18, 10B supply, executed proposals. After hydration it shows **0** until seen (`CountUp.tsx:48-49`), so a hydrated `/token` reads "0B" and "0" before scrolling. Counting 0→3 tells the reader nothing. | `rm.mjs`: no-preference `/token` shows `0B,0` and `/` shows `0,0,0B…` before scroll. Reduce shows the real `10B,18`. `TokenSpec.tsx:8,10`, `AtAGlance.tsx:25-30`. | Momentarily wrong numbers on an "honest data" site. Screenshots and screen recordings can catch "Decimals 0". | Drop `CountUp` for spec facts and values < 100. If it stays for large figures, start at the real value and animate only the figure's reveal (rise), never the digits. | S | P3 |
| MOT-13 | Mobile menu · reduce contract (`globals.css:386-396,565-576`) | The reduce override zeroes durations but **not `transition-delay`**, so under reduce the sheet groups pop in 140–420 ms late onto an empty sheet. With motion, the menu's Discord CTA, the primary conversion, is the **last** item to appear (≈0.6 s after tapping Menu). | `sheet.mjs`: under reduce the last item is at opacity 0 at 300 ms and 1 at 600 ms, `transition-delay: 0.42s`. Without reduce it is opacity 0 at 300 ms. | Blank, laggy menu for reduce users. The CTA is delayed for everyone. | Add `transition-delay:0s !important` to the reduce block. Stagger sheet groups at 40 ms from a 60 ms base, so the whole sheet is in by ≤250 ms. The CTA gets no delay. | S | P3 |
| MOT-14 | `lib/motion.ts:95`, `Scramble.tsx:21`, `GardenMock.tsx:25` | JS motion reads `prefers-reduced-motion` **once**, inside effects whose dependencies don't include it. Turning the OS setting on mid-visit doesn't stop a running canvas. `CountUp` and the explorers use the reactive `useReducedMotion()` correctly. | Code as cited (`const reduce = prefersReducedMotion()` inside `useEffect(…, [ref, fps, stillAt])`). | Rare, but the contract says "never". | Use one reactive hook, `useMotionAllowed()` = !reduce && !paused (§4), as an effect dependency everywhere. | S | P3 |
| MOT-15 | Client navigation · `app/template.tsx`, `globals.css:600-607` | Soft navigations choreograph twice. `.page-enter` (520 ms, the whole page from opacity 0) **and** the PageHero entrance (delays 60–320 ms, h1 words re-split) both run, so the new page needs about 1.2 s to settle. | Code as cited. Every PageHero element carries its own `animate-enter-up`/`split-load`. | Navigation feels slower than it is. | Shorten `pageEnter` to `--dur-base` with an 8 px move, and suppress hero entrances inside `.page-enter` (`.page-enter :is(.animate-rise,.split-load .split-word){animation:none}`). View Transitions only as described in §4. | S | P3 |
| MOT-16 | Global hover (≈ MOB-06) | `hover:` utilities aren't gated by `(hover:hover)`, so after a tap on a phone, card lifts and tints stick (`Card.tsx:26`, `ProposalBoard.tsx:107`, `IndexShowcase.tsx:79`, `Principles.tsx:44`, `ControlMap.tsx:96`). | `tailwind.config.ts` has no `future.hoverOnlyWhenSupported`. | Cards look "stuck selected" after a tap. | Set `future: { hoverOnlyWhenSupported: true }`. Hint and DesktopNav already use focus and pointer events, so they are unaffected. Add `active:` press feedback for touch (§4). | S | P3 |
| MOT-17 | Live data · `IndexExplorer.tsx:157`, `IndexShowcase.tsx:162`, `TokenContract.tsx:48` | Live values give no change feedback. The skeleton swaps to the value abruptly, the skeleton width differs from the value, and the 30 s refresh is silent apart from the LiveStatus clock. "Live" is asserted, not shown. | Code as cited. | The live quality of real on-chain data is easy to miss. | When a value changes, tint its background `leaf/10 → transparent` over 600 ms (colour only, no movement, none under reduce or paused). Size skeletons to the value's width (`ch` units, tabular). Keep the LiveStatus 1.5 s "updating" rule. | S | P3 |
| MOT-18 | `/` hero, How it works, CustodyDiagram, Rebalance, orbit | The loops **decorate rather than explain**. The flows dash forever, the orbit turns for 160 s with no meaning (an index basket doesn't rotate), and the custody diagram animates every connector the same. | §5 lists each with evidence. | A missed chance to make "your keys, your address, every move on-chain" visible. | The §5 proposals: one-shot sequences that settle, are tied to the claims, and run CSS-only. | M | P3 |

**Count:** P0 0 · P1 2 · P2 7 · P3 9.

## 3. Motion inventory

The 1280 `getAnimations()` census is in §2 (MOT-02). In the table, "Compositor" means transform and opacity on HTML elements only. ✗ marks main-thread layout or paint work every frame. RM = reduced motion. Unless noted, RM is handled by the global override at `globals.css:386-396` (duration 0.001 ms, one iteration).

| What | Where | Duration · delay | Easing | Properties | Reduced motion | Compositor |
|---|---|---|---|---|---|---|
| `enter-up` | Hero/PageHero lead, CTAs, facts, chips, aside; cookie banner/dialog; explorer panels; GardenMock tokens; RulesDemo verdict | 700 ms (450 for panels) · 60–940 ms | `out` (0.22,1,0.36,1) | opacity 0→1, translateY 18 px | global | ✓, but opacity 0 delays LCP (MOT-01) |
| `enter-fade` | Hero badge, render, flow SVG; breadcrumb; nav panel content (250); Hint (150); orbit logos (500); panel notes; cookie backdrop | 600 ms · 0–500 | `out` | opacity | global | ✓ |
| `.split-load` words | Hero/PageHero h1 | 900 ms · 80/120 + 55 ms/word | `expo` | opacity, translateY 0.4em, `filter: blur(6px)` | global | ✓ (filter composites in Chrome). LCP-safe today only through the whitespace text nodes (E R2) |
| `[data-split]` words | Section h2 (`Section.tsx:56`) | 650/900/700 ms · 45 ms/word, cap 650 | `expo` | opacity, transform, blur | hidden only under `html.js` + no-preference | ✓ |
| Scroll reveals | `Reveal`/`Stagger` via `RevealScript` | 700 ms · stagger 40–100 ms, no cap (longest settles in 1.19 s) | `out` | opacity, translateY 20 px | not hidden under reduce; print override | ✓ |
| `.draw-path` | Principles, ControlMap icons | 1.4 s · 250 + 120 ms/i | `expo` | `stroke-dashoffset` (one-shot) | no-preference only | ✗ (one-shot, fine) |
| `.meter-fill` | ProposalBoard bars | 1.1 s · 200 + 90 ms/i | `expo` | scaleX | no-preference only | ✓ (model pattern) |
| `inkIn` (ScrollInk) | Home Problem statement | scroll-linked, `view()` | linear | `color` | `@supports` + no-preference | ✗ (paint while scrolling; small) |
| `pstackRecede` | ProductStack (lg) | scroll-linked | linear | scale, `filter: brightness` | `@supports` + no-preference + ≥1024 | ✓ |
| `details.smooth` | FaqList | 300 ms | `expo` | height (`interpolate-size`) | `@supports` + no-preference | ✗, user-initiated (no CLS) |
| `.page-enter` | `template.tsx`, client navigation only | 520 ms | `expo` | opacity, translateY 14 px | no-preference only | ✓ (MOT-15) |
| `.mobile-sheet` | MobileMenu | open 700 / close 500 ms; items 300/500 ms · 140 + 70 ms/group | `expo` | `clip-path: circle()`, visibility; items opacity + translate | durations collapse, **delays don't** (MOT-13) | ✗ in Safari/Firefox; Chrome may composite clip-path (unverified) |
| `flow` dash | Hero ×4 (1.6–2.4 s), CustodyDiagram ×3, LayerStack, BasketOrbit spoke | ∞ | linear | `stroke-dashoffset` (SVG) | global | ✗ (MOT-03) |
| `pulse-ring` | Hero ends ×4 and LayerStack (SVG); Badge "live" and LiveStatus (HTML) | 2 s ∞ | `out` | scale, opacity | global | ✗ on SVG `<circle>`, ✓ on HTML |
| `float` | Hero render, CtaBand render, `/token` hero + TokenSpec | 9 s ∞ | ease-in-out | translateY 10 px | global | ✓ (but infinite: MOT-02) |
| `scanSweep` | RulesDemo `.scanlines::after` | 7 s ∞ | linear | translate | global | ✓ (runs off-screen) |
| ProductArt `art-*` | Home Products, `/protocol` ProductStack | 6–8 s ∞ (artDash 1.2 s, artSpin 30 s) | expo / ease | ✓ artDot, artKnob, artOn/Off, artFlag. ✗ artChip (border-color + box-shadow), artDrift (box-shadow), artSwitch (background-color), artRoute/artDash/artPulse/artSpin (SVG) | still frame by design | mixed (MOT-03) |
| `orbitTurn` | BasketOrbit (`/`, `/indices*`) | 160 s ∞, paused on mouse hover | linear | rotate | global | ✓, but the spoke `flow` inside forces repaints |
| `blink` | RulesDemo cursor | 1.05 s steps ∞ | steps | opacity | not rendered | ✓ |
| `progress` | ProtocolExplorer timer 6.5 s, RulesDemo hold 4.5 s | one-shot; `animationend` drives autoplay | linear | scaleX | autoplay off | ✓ |
| `stamp` | RulesDemo verdict | 450 ms | `expo` | opacity, rotate/scale | not rendered | ✓ |
| `animate-pulse` / `animate-spin` | Price, address and supply skeletons; LiveStatus loading/updating; DecisionPipeline dot | 2 s / 1 s ∞ | Tailwind default | opacity / rotate | global | ✓ |
| `.sheen` | Featured product tile hover | 900 ms | `expo` | `background-position` | global | ✗ (hover only) |
| `morph-in` | Defined in `tailwind.config.ts:90-92,110`, **unused** | | | | | dead token |
| Header pill | `Nav.tsx:72-84`, scroll > 8 px | 600 ms | `expo` | height, padding, radius, bg, border, box-shadow; logo height | global | ✗ (MOT-10) |
| AnnouncementBar | collapse on scroll / dismiss | 300 ms / instant `display:none` | `expo` | `grid-template-rows` | global | ✗ |
| DesktopNav | panel morph, highlight, chevron, 160 ms close grace | 300 ms; content fade 250 ms | `expo` | transform, **width, height**, opacity, blur 2 px; highlight width | global | mixed |
| Burger ↔ cross | `Nav.tsx:104-105` | 300 ms | `expo` | rotate (top swaps instantly) | global | ✓ |
| HowItWorksScroller | rail, markers, titles, progress, callouts | 300–600 ms | `expo` | rail **height**; markers bg/box-shadow; progress scaleX; callouts opacity/translate | global | mixed (MOT-10) |
| GardenMock | `Fold` and balance tween | 600 ms; tween 1.2 s rAF with setState per frame | `expo` / quart | `grid-template-rows`, opacity | `prefersReducedMotion()` once | ✗ (MOT-10) |
| ProtocolExplorer / LayerStack | tabs, plates, signal, panel | 300–600 ms; panel 450 ms + facts 60 ms stagger | `expo` | tabs **top** and colours; SVG `<g>` translateY (main thread); fill/stroke | autoplay off | mixed |
| DecisionPipeline | track, token, stages | 300–600 ms; 2.6 s auto-step | `expo` | scaleX; token **left**; bg/box-shadow | static, buttons disabled | mixed |
| RebalanceLab | holding bar | 300 ms | `out` | **width** | global | ✗ (MOT-07) |
| AllocationExplorer | supply segments | 600 ms + 45 ms/i | `expo` | scaleX, bg | needs hydration (MOT-08) | ✓ |
| Index tabs / tiles | IndexShowcase, IndexExplorer | 300 ms; underline 600 ms; list 40 ms stagger | `expo` | bg, border, translateY −2 px, box-shadow; scaleX | global | mostly ✓ |
| Hover lifts | `Card`, ProposalBoard, ControlMap, Principles, index tiles | 300 ms | `expo` | translateY −2 / −4 px plus colour | global | ✓ (sticky on touch: MOT-16) |
| `Button` | `Button.tsx:8` | 150 ms | `out` | bg/border/colour; `active:scale-[0.98]` | global | ✓ |
| ArrowLink / NavFeature arrows | `ArrowLink.tsx:28-30` | 150 ms | default | translate 2 px | global | ✓ |
| FaqList plus icon | `FaqList.tsx:23` | 300 ms | `expo` | rotate 45° | global | ✓ |
| CopyButton | `CopyButton.tsx` | label swap instant, reverts after 1.8 s | none | colour 150 ms | n/a | ✓ |
| Cookie banner / dialog | `CookieConsent.tsx:144-145,175,184` | 700 ms · banner 600 ms delay; backdrop fade + `backdrop-blur` | `out` | opacity, translate | global | ✓ (blur behind a fading overlay is costly; no exit animation) |
| TeamPhoto / Ecosystem logos | hover | 500 / 300 ms | default | grayscale filter + scale; filter/opacity | global | ✓ |
| `GlyphField` canvas | Footer, every page | 24 fps, rAF every frame | n/a | canvas | IO + tab visibility + still frame; RM read once | main-thread JS (MOT-04) |
| `DotField` canvas | CtaBand, lg+ | 30 fps | n/a | canvas | same | main-thread JS (MOT-04) |
| `Scramble` | CtaBand "Garden." | 1.1 s once, setState per frame | linear | text | RM read once; invisible copy holds the layout | ✓, no CLS |
| `CountUp` | AtAGlance, TokenSpec, ProposalBoard | 1.4 s once | ease-out quart | text | reactive RM ✓; shows 0 before seen (MOT-12) | ✓ |
| RulesDemo typing | `RulesDemo.tsx:66-80` | 24 ms per 2 chars, 380/560 ms per line, hold 4.5 s | n/a | DOM text | instant | pause button ✓, stops on select ✓ |
| Smooth scroll | `html { scroll-behavior: smooth }`; logo-to-top; tab strips | n/a | n/a | scroll | `auto` under reduce (verified) | ✓ |
| EasterEggs | bloom follows the pointer; sticker | 300 ms | `out` | `left`/`top` via React state | global | ✗ (rare) |

**CLS from motion (confirmed):** every non-input layout shift I recorded comes from layout-property animation or from autoplay changing heights:

- the header pill on every page;
- the HowItWorks fold on `/`;
- RulesDemo and ProtocolExplorer autoplay on phones.

All are below 0.1 per session window. MOT-06 and MOT-10 remove them.

## 4. Motion system (proposal)

### 4.1 The LCP-entrance decision (MOT-01): options weighed

| Option | LCP effect (measured) | Feel | Verdict |
|---|---|---|---|
| A. Lead paragraph static (no animation) | LCP = FCP (`/`, `/protocol`, `/token`) | The hero loses some life | Acceptable fallback |
| **B. Transform-only rise** (8–12 px, opacity 1 on the first frame, no delay) | **LCP = FCP** at 375 on all three routes. Lighthouse devtools: −0.56 to −1.17 s | Keeps the "rising" signature. Text is readable at first paint | **Recommended**, for the LCP group (h1, lead, hero media, CTAs) |
| C. Animate only secondary elements | LCP = FCP | The fade stays where it can't hurt | **Combine with B** (badge, eyebrow, breadcrumb, chips, flows, facts) |
| D. Much shorter fade / no delay (300 ms, 0 delay, from 0) | **No gain: +696 ms**. Chrome records the element on a later repaint, not when the fade ends (E: the font-swap repaint) | n/a | Rejected |
| E. Start at opacity 0.01, or clip/mask reveals | Games the metric, or is uncounted while clipped | n/a | Rejected (E R1) |

Performance wins the tie, so the choice is **B + C**. The h1 word reveal stays a signature, but in an LCP-safe form. Words start **readable** (`--fg-subtle`, 5.4:1, the ScrollInk idea), ink to `--fg` and rise 0.25 em, at 35 ms per word with a 400 ms cap. There is no opacity-0 start and no blur. This satisfies E R2 where the h1 is the desktop LCP.

### 4.2 Tokens (CSS custom properties, `globals.css`)

```css
:root {
  /* Duration: what the motion is for, not how it looks */
  --dur-instant: 90ms;   /* press, toggle, icon swap, copy tick */
  --dur-fast: 150ms;     /* hover/focus colour, tooltip, selected state */
  --dur-base: 240ms;     /* panel crossfade, menu open, small morph, header show */
  --dur-slow: 420ms;     /* entrances, scroll reveals, sheet, explainer stage change */
  --dur-scenic: 700ms;   /* one-off storytelling (hero sequence, diagram draw); never on repeated UI */
  /* Exits run at ~0.75× the matching enter (popovers open slower than they close). */

  /* Easing: named by intent */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);   /* "settle": entrances, reveals, hovers */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* "snap then settle": morphs, menus, indicators */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);        /* "leave": exits, header hide */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1); /* "travel": A→B on screen (pipeline token, plates) */
  /* linear: loops, timers, scroll-linked only */

  /* Distance */
  --move-xs: 2px;   /* hover lift, arrow nudge, panel swap */
  --move-sm: 8px;   /* hero rise (LCP-safe), toasts */
  --move-md: 16px;  /* scroll reveals */
  --move-lg: 24px;  /* sheets, dialogs on phones */
  --scale-press: 0.98;
  --scale-pop: 0.96;  /* popover/panel enter */
  --blur-max: 4px;    /* only on non-LCP display text; never on data */

  /* Stagger */
  --stagger-tight: 30ms;  /* chips, logos */
  --stagger: 60ms;        /* cards, list items on reveal */
  --stagger-words: 35ms;  /* headline words */
  --stagger-cap: 300ms;   /* no item waits longer than this (words: 400ms) */
}
```

Rules:
- Stagger only on **first reveal**, never on repeated UI.
- Delay is `min(var(--i) * var(--stagger), var(--stagger-cap))`.
- Do not nest reveals (a group inside a revealing parent).

### 4.3 Tailwind (`tailwind.config.ts`)

```ts
import plugin from "tailwindcss/plugin";

future: { hoverOnlyWhenSupported: true },          // MOT-16
theme: { extend: {
  transitionDuration: { instant: "90ms", fast: "150ms", base: "240ms", slow: "420ms", scenic: "700ms" },
  transitionTimingFunction: { out: "var(--ease-out)", expo: "var(--ease-expo)", in: "var(--ease-in)", inout: "var(--ease-inout)" },
  keyframes: {
    rise:     { from: { transform: "translate3d(0,var(--move-sm),0)" } },                 // LCP-safe
    reveal:   { from: { opacity: "0", transform: "translate3d(0,var(--move-md),0)" } },   // below the fold only
    fadeIn:   { from: { opacity: "0" } },
    swap:     { from: { opacity: "0.001", transform: "translate3d(0,var(--move-xs),0)" } }, // panel swap
    popIn:    { from: { opacity: "0", transform: "scale(var(--scale-pop))" } },
    progress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
  },
  animation: {
    rise:     "rise var(--dur-slow) var(--ease-out) both",
    reveal:   "reveal var(--dur-slow) var(--ease-out) both",
    "fade-in":"fadeIn var(--dur-base) var(--ease-out) both",
    swap:     "swap var(--dur-base) var(--ease-out) both",
    "pop-in": "popIn var(--dur-base) var(--ease-expo) both",
    progress: "progress 4s linear both",
  },
}},
plugins: [plugin(({ addVariant }) => {
  // One switch for "no motion": OS preference OR the site's Pause-motion toggle.
  addVariant("motion-off", ["@media (prefers-reduced-motion: reduce) { & }", 'html[data-motion="paused"] &']);
  addVariant("can-hover", "@media (hover: hover) and (pointer: fine) { & }");
})],
```

Retire `enter-up` and `morph-in`, and replace the hard-coded `700ms`, `900ms`, `520ms` and `450ms` with tokens. Note that `duration-base` (25 uses) moves 300 → 240 ms and `duration-slow` (17 uses) moves 600 → 420 ms. That is intended: the UI gets crisper.

### 4.4 Patterns

**Entrance.** Above the fold, the LCP group uses `animate-rise` with no delay. Secondary items use `animate-fade-in` with delay ≤150 ms. The hero is fully settled by about 700 ms. CTAs are never invisible.

Below the fold, keep `RevealScript`: `reveal` with `--move-md`, `--dur-slow` and `--ease-out`, staggered and capped. Hide only under `html.js` + no-preference, and keep the print override. **Never reveal data that is being read** (prices, tables, allocation numbers); those are simply present.

**Panel swap** (tabs, explorers): `animate-swap`, crossfading at `--dur-base` with no stagger. The selected indicator travels at `--dur-base` `--ease-expo`. Height is reserved, never animated.

**Hover / press / focus:**
- Colour changes at `--dur-fast` `--ease-out`.
- Navigating cards (`can-hover:`) lift `--move-xs` at `--dur-base` `--ease-expo`.
- Press is `scale(var(--scale-press))` at `--dur-instant`, and works on touch through `active:`.
- Arrows nudge `--move-xs`.
- The focus ring appears **instantly** and never changes the element's size or shape (MOT-09).
- Loading: a skeleton sized to the value, then a single colour tint when the value arrives or changes (MOT-17).
- Success: an icon swap at `--dur-instant` plus text ("Copied"), reverting after 1.8 s (keep).

**Loops** (illustrations): composited properties only. Mark them `data-loop` so they pause off-screen. They settle within 5 s, at most 4 in the viewport, then rest on a meaningful still frame. Replay on hover or focus of the figure (E R3).

**JS motion:** canvases, count-ups and typing start only in view, stop off-screen and in hidden tabs, depend on `useMotionAllowed()` reactively, and run on ≤15 fps timers (E R4).

**Page transitions:** keep the CSS `.page-enter` from `template.tsx`, but use `--dur-base` with `--move-sm`, and the hero doesn't re-run its entrance on soft navigation (MOT-15). **View Transitions are progressive enhancement only.** Next 15.5's `experimental.viewTransition` / React `<ViewTransition>` are still experimental, so don't ship them in Phase 3. Cross-document `@view-transition` doesn't apply to soft navigations. A later candidate is in-page `document.startViewTransition()` for the index switch, letting the basket morph between BLOKC2/5/10. Guard it with `'startViewTransition' in document && motionAllowed`, keep it ≤250 ms, and never wrap data fetches in it.

**Header in short viewports** (G MOB-13 spec): under `@media (max-height: 500px)`:
- hide the announcement bar and use a 52 px bar;
- a rAF-throttled passive scroll listener sets `html[data-header="hidden"]` after more than 8 px of downward scroll past 120 px, and clears it on any upward scroll;
- motion is `transform: translateY(-100%)` over `--dur-fast` `--ease-in` to hide, and `--dur-base` `--ease-out` to show;
- never hide while the menu is open or focus is inside the header;
- under `motion-off`, show and hide instantly with no transition (transform, so no CLS).

### 4.5 When NOT to animate

1. **The LCP element**: no opacity, clip, blur or delay on the first frame.
2. **Primary CTAs**: they are never invisible, and transform is the only entrance.
3. **Data being read**: prices, figures, token facts, allocation percentages, tables. No count-ups on small or spec values. Change feedback is colour-only.
4. **Repeated UI**: no re-stagger and no replayed typewriter on user-initiated changes. No autoplay after the user has touched an explainer.
5. **Direct manipulation** (sliders, drag): 1:1, with no easing lag.
6. **Layout properties**: no height, width, top, left, padding or grid-rows animation. Reserve space instead.
7. **Off-screen, hidden tab, `saveData`**: pause loops and canvases.
8. **Reduced motion or "Pause motion"**: still frames and instant state changes (§4.6).
9. **Focus**: the ring never moves or reshapes the control.
10. **Print**: everything visible and static (keep `globals.css:377-383`).

### 4.6 Reduced-motion contract

- **CSS:** keep the global override and **add `transition-delay:0s !important`** (MOT-13). Mirror the whole block for `html[data-motion="paused"]`. Every keyframed component's base style must be a meaningful still frame (ProductArt already is).
- **Hidden states:** only under `html.js` **and** `(prefers-reduced-motion: no-preference)` **and** `:not([data-motion="paused"])`. No SSR `opacity:0` or `scaleX(0)` (MOT-08).
- **JS:** use one reactive hook, `useMotionAllowed()`, built with `useSyncExternalStore` over `matchMedia` plus the `data-motion` attribute. Autoplay off, canvases on their still frame, CountUp and Scramble final, typing instant. Under reduce, controls that only exist for motion become plain content, not `disabled` buttons (A11Y-34).
- **Allowed under reduce:** colour and opacity changes ≤150 ms for state feedback (non-vestibular). Smooth scrolling is off (verified `scroll-behavior:auto`).
- **Global "Pause motion" toggle** (≈ INS-12, A11Y-19):
  - a labelled switch in the footer and in the mobile menu, `aria-pressed`;
  - stored in `localStorage` `blok:motion` (in try/catch);
  - applied **before first paint** by `RevealScript` as `html[data-motion="paused"]`, like the announcement-bar flag;
  - every explainer's own pause button stays; the global switch overrides them.

## 5. Storytelling opportunities (MOT-18)

Each idea is adapted for BLOK, with no reference layout copied. All are CSS-first, one-shot, settle to a still frame, and fall back to that frame under `motion-off`.

1. **Home hero, "value in, keys stay":** replace the four endless dashes and the float with one sequence of about 2.4 s that starts after LCP:
   - a leaf line draws (`pathLength` `.draw-path` pattern) from the left into the Garden, and chip 1, "Assets stay at your address", settles in;
   - a cobalt line draws out to the right, and chip 2, "Every move written on-chain", settles in;
   - a sand line draws, and chip 3, "Upgrades approved by the DAO", settles in;
   - then everything rests, with static dashed lines. Replay on hover or focus of the figure.

   On phones the chips are `hidden` (`Hero.tsx:115`), so show them as one caption row under the render, revealed in the same order.
2. **How it works, "show the delta":** each step should highlight *what changed*: the address appears, then the deposit row lands, then the strategy attaches with "can move funds out: Never".
   - Desktop: reserve the mock's full height and fade or rise only the new row (MOT-10).
   - Phones: the inline mocks are static (`animate={false}`). Use `animation-timeline: view()` (in `@supports`) so the new row of each inline mock rises as it scrolls in.
3. **Custody diagram (`/protocol`, `CustodyDiagram.tsx`):** draw the connectors in claim order when the diagram reveals: sign → steer → record. Then stop. The grey "funds out" path stays dashed and lights only while "You" is hovered or focused, showing that only your signature opens it. No infinite `flow`.
4. **Rebalance (`RebalanceLab` + ProductArt `RebalanceArt`):**
   - Lab: add two user-pressed presets, "ETH +30 %" and "ETH supply +8 %", which tween the slider over `--dur-scenic`. The first shows "price moves, target moves with it, no trade"; the second crosses the 2 % band and produces the one pooled trade. Keep the bars 1:1 (MOT-07) and label it as an example.
   - The ProductArt tile plays its drift → band → pull-back twice on entering view, then rests.
5. **Index basket (`BasketOrbit`):** drop the meaningless 160 s rotation. On index switch, tokens assemble onto their rings (staggered `--stagger-tight`, rise + fade, later a View Transition candidate). Motion is used only for selection (the spoke). This saves CPU and frees the orbit's clickable targets from movement.

## 6. Keep

- `RevealScript`:
  - reveals before hydration;
  - hidden only under `html.js` + no-preference;
  - a fast-scroll catch-up check;
  - a print override;
  - the announcement flag applied before paint.
- The `useCanvasLoop` contract: IntersectionObserver + tab-visibility gating, a still frame, DPR capped at 2, theme colours read from the element.
- `Scramble`/`CountUp` accessibility: sr-only real text, an invisible layout-holding copy, tabular digits (no CLS).
- `ScrollInk` starts readable (≥5.4:1) and has an `@supports` fallback. `details.smooth` uses `::details-content` as progressive enhancement. `.meter-fill` and `.draw-path` are drawn by default.
- The `ProtocolExplorer` timer as a CSS `progress` animation with a pause button and off-screen pause. `RulesDemo` stops autoplay when a tab is selected.
- `LiveStatus` shows "updating" only after 1.5 s (no flicker), and `useLive` polls only while visible.
- The global reduced-motion override with `scroll-behavior:auto` (verified). Nav and strip `scrollTo` respect reduce.
- Mobile sheet: `inert` while closed, Escape returns focus, visibility flips after the close animation. DesktopNav keeps a 160 ms close grace. `.page-enter` uses `backwards` fill, so no transform lingers.
- ProductArt still frames are meaningful under reduce. Motion tokens already exist and are mirrored in Tailwind; extend them rather than replace them.

## 7. Cross-agent notes

- **Orchestrator / E:**
  - Lighthouse-simulated LCP does **not** move with the motion fix: transform-only gives 3.41 vs 3.41 s on `/protocol`, and 3.69–3.85 s both ways on home. Judge MOT-01 by the lab gate (LCP−FCP ≤ 50 ms) and devtools throttling (PERF-03).
  - My two Lighthouse runs give home TBT **12–22 ms**, which agrees with E that the baseline 942 ms isn't reproducible.
- **E:**
  - `useLive`'s 1 s clock re-renders the whole consumer, including BasketOrbit (PERF-13 agrees).
  - `useOverDarkBand` runs `querySelectorAll` + `getBoundingClientRect` on every scroll event (`hooks.ts:38-65`).
  - GardenMock is rendered 4× on home.
- **D:**
  - The `:focus-visible` radius snap (MOT-09) should be bundled with the A11Y-05 ring work.
  - `DecisionPipeline` uses disabled buttons under reduce (A11Y-34).
  - `RebalanceLab`'s `aria-live` result updates on every slider step (`RebalanceLab.tsx:115`).
  - The phone tab strips declare `aria-orientation="vertical"`.
  - The global pause toggle spec is in §4.6.
- **G:** the header hide-on-scroll spec for short viewports is in §4.4. Explainer heights should be reserved, not animated (MOT-06).
- **I:** the `CopyButton` failure text "Press ⌘C" is Mac-only (`CopyButton.tsx:34`).
- **B:**
  - `morph-in` keyframe and animation are unused.
  - The `EasterEggs` sticker has a hard-coded `rgb(143 214 168)` shadow (`EasterEggs.tsx:121`).
  - The `globals.css:54` comment mentions a "price tape" that no longer exists.
  - The duration and easing tokens in §4.2 replace `duration-400`/`ease-in-soft` (VIS-16).
- **K:** the docs and brief mention a marquee, tilt cards and Framer Motion (README), none of which exist at HEAD.
