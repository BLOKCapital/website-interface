# BLOK Capital design system

The reference for anyone building UI on the marketing site. It describes **what the code does today**: the code is the source of truth. The reasons behind it are in `docs/audit/findings/B-visual-system.md` §3 (tokens, migration map), `docs/audit/findings/C-motion.md` §4 (motion), `docs/audit/IMPROVEMENT_PLAN.md` §2–3 (conflict rulings, spec summary) and `docs/audit/PHASE3_BRIEF.md` (approved decisions, house rules). Where the code differs from those proposals, this document follows the code and flags the difference.

| What | Where |
|---|---|
| Colour, spacing, motion and effect variables | `src/app/globals.css` |
| Tailwind names for those variables, keyframes and variants | `tailwind.config.ts` |
| `cn()`, which must know every custom scale name | `src/lib/utils.ts` |
| Motion hooks and the Pause-motion switch | `src/lib/motion.ts`, `src/lib/motion-pref.ts` |
| Reveal, Pause-motion and off-screen pausing script (inline, pre-paint) | `src/components/system/RevealScript.tsx` |
| Explainer autoplay rules and the `blok:track` helper | `src/lib/explainers.ts` |
| Tab keyboard model | `src/lib/useRovingTabs.ts` |
| Consent-gated analytics | `src/lib/analytics.ts`, `src/components/system/Analytics.tsx` |
| Shared components | `src/components/ui/*`, `src/components/motion/*` |
| Dead-class check (run after a build) | `npm run check:classes` (`scripts/check-classes.mjs`) |

## 1. Principles

1. **Two gardens.** The **Day garden** (`:root`, light paper) is the default and the only page theme. The site is light-only (D-31): `colorScheme: "light"`, `themeColor: #F7F8F4`. The **Night garden** exists only as `.theme-dark` *islands*: the announcement bar, consoles, the featured card (`Card tone="feature"`), `Section tone="dark"` and the closing `CtaBand`. The footer stays light (D-21).
2. **Three typefaces, no more.** Inter for body and UI (`--font-body`, `font-sans`). Newsreader 400, regular and italic, for display (`--font-display`, `font-display` / `font-serif` / `.display`). JetBrains Mono 400 for labels, addresses and figures (`--font-mono`, `font-mono`). The mono is not preloaded and falls back to a mono stack, so the swap never changes width.
3. **The garden metaphor.** A Garden is the visitor's own wallet. Gardens appear as photographic renders (`GardenAsset`), the `// eyebrow` label reads like a code comment, headings end on an italic sand payoff (`<em className="text-sand">`), and bands carry "+" registration marks (`CornerMarks`) like sheets of one engineering drawing.
4. **Honest data.** Never invent figures, dates, partners, quotes or claims. Anything illustrative carries `<Badge status="example" />` ("Example"). Real figures come from `src/lib/data/*` or the live readers in `src/lib/live/*`. The launch state comes only from `protocolStatus` (`src/lib/data/status.ts`) and never carries a date or quarter (D-02). `CountUp` is for real numbers only.
5. **CSS-first motion, no motion libraries.** Motion is CSS keyframes, transitions and scroll timelines driven by tokens. JavaScript runs only the few effects CSS can't do (canvases, `Scramble`, explainer timers), always through the helpers in `src/lib/motion.ts`.
6. **Accessibility and performance win ties.** When a visual idea conflicts with WCAG 2.2 AA or a performance gate (LCP, idle CPU, INP), the visual idea gives way. The rulings are in `IMPROVEMENT_PLAN.md` §2.
7. **Evolve, don't replace; nothing on screen without a token.** Variable *names* never change, because canvases and inline styles read them (`DotField`, `GlyphField`). Add semantic names on top; don't hard-code values.

## 2. Tokens

### 2.1 How colour works

Every colour variable holds an `R G B` triplet. Tailwind wraps each one as `rgb(var(--x) / <alpha-value>)`, so alpha modifiers work on every utility (`bg-leaf/10`, `border-line/12`). The same utilities render Day or Night depending on the nearest `.theme-dark` ancestor, which re-declares every semantic variable.

```css
--p-leaf-700: 33 112 70;                               /* primitive: theme-independent */
:root, .theme-light { --leaf: var(--p-leaf-700); }     /* semantic, Day */
.theme-dark        { --leaf: var(--p-leaf-300); }      /* semantic, Night (inside @media not print) */
/* <div className="theme-dark bg-card text-fg">…</div> is a Night island */
```

- Components use semantic tokens only, never `--p-*` primitives and never raw colours.
- Semantic **aliases** (`--accent`, `--emphasis` …) are declared on `:root, .theme-light, .theme-dark` together, because a `var()` resolves on the element that declares it. An alias declared only on `:root` would keep its Day value inside a Night island.
- A band that should flip the sticky header to dark while it passes under it also carries `data-band="dark"` (`Section tone="dark"` and `CtaBand` do this for you).

### 2.2 Primitives

| Family | Primitives (hex) | Feeds |
|---|---|---|
| Paper (Day surfaces) | `--p-paper-0` #FFFFFF · `-50` #F7F8F4 · `-100` #EFF2EC · `-150` #ECF0EA · `-200` #DEE4DC · `-250` #D0D7CE | canvas, surface, card, raised; plate sides |
| Night surfaces | `--p-night-950` #090D0B · `-900` #0F1512 · `-850` #151D19 · `-800` #1B2520 | Night canvas…raised |
| Ink (Day text) | `--p-ink-900` #111A15 · `-700` #435049 · `-600` #5C6962 | fg, fg-muted, fg-subtle, line |
| Mist (Night text) | `--p-mist-50` #ECF1ED · `-300` #AAB6AF · `-400` #8A988F | Night fg…fg-subtle, line |
| Leaf | `-800` #1A5C39 · `-700` #217046 · `-500` #3F8A5F · `-300` #8FD6A8 · `-200` #AAE2BD · `-glow` #78C896 | leaf (Day 700, Night 300) |
| Bronze / sand | `--p-bronze-700` #836122 (D-22; was #8A6726) · `--p-sand-200` #E6D8BC | sand (Day bronze, Night sand) |
| Bloom | `-800` #A3325A · `-700` #B23A62 · `-300` #F0A3B4 | bloom, bloom-text |
| Cobalt | `-600` #2563C4 · `-300` #7DB4FF | cobalt |
| Ember | `-700` #BE3E28 · `-300` #F2917F | danger |
| Amber | `-800` #7A5508 · `-700` #8C620A · `-300` #E3C07A | caution, caution-text |

### 2.3 Semantic roles

| Variable | Tailwind | Day | Night | Role |
|---|---|---|---|---|
| `--canvas` | `bg-canvas` | paper-50 | night-950 | page background |
| `--surface` | `bg-surface` | paper-100 | night-900 | alternate band |
| `--card` | `bg-card` | paper-0 | night-850 | cards |
| `--raised` | `bg-raised` | paper-150 | night-800 | inputs, nested tiles, hover fill, skeletons |
| `--line` | `border-line/…`, `bg-line/…` | ink-900 | mist-50 | hairlines; **always with an alpha** |
| `--fg` / `--fg-muted` / `--fg-subtle` | `text-fg`, `text-fg-muted`, `text-fg-subtle` | ink 900/700/600 | mist 50/300/400 | text, three steps |
| `--leaf`, `--leaf-deep`, `--leaf-hover` | `leaf`, `leaf-deep`, `leaf-hover` | leaf 700/800/800 | leaf 300/500/200 | the one brand accent |
| `--sand` | `text-sand` | bronze-700 | sand-200 | warm emphasis, the italic payoff |
| `--bloom`, `--bloom-text` | `bloom`, `bloom-text` | bloom 700 / 800 | bloom 300 | "in progress" only |
| `--cobalt` | `cobalt` | cobalt-600 | cobalt-300 | data / info only |
| `--danger` | `danger` | ember-700 | ember-300 | losses, risks |
| `--caution`, `--caution-text` | `caution`, `caution-text` | amber 700 / 800 | amber 300 | warnings |
| `--accent`, `--accent-hover`, `--on-accent` | `accent`, `accent-hover`, `accent-fg` | → leaf, leaf-hover, canvas | same | primary actions |
| `--emphasis` | `emphasis` | → sand | same | emphasis |
| `--data` | `data` | → cobalt | same | charts, meters, info tints |
| `--progress`, `--progress-text` | `progress`, `progress-text` | → bloom, bloom-text | same | in-progress state |
| `--success` | `success` | → leaf | same | allowed, done, live |
| `--warning`, `--warning-text` | `warning`, `warning-text` | → caution, caution-text | same | warnings, "Example" |

Prefer the **role** names (`text-success`, `bg-data`) over hue names when the colour carries meaning. Bloom and cobalt are reserved for state and data, never decoration. `positive`, `negative` and `caution` are **deprecated aliases** (use `success`, `danger`, `warning`).

Effect variables, also per theme: `--glow` (garden glow), `--shadow` (elevation colour), `--plate-l` / `--plate-r` (isometric plate sides, LayerStack), `--fx-glow` / `--fx-line` / `--fx-sweep` (effect strengths, stronger on paper so accents don't turn grey) and `--logo-filter` (monochrome partner logos).

### 2.4 Contrast

Measured text-on-surface ratios across canvas, surface, card and raised (B §3.1; the Day sand row uses the new #836122). Every text token is at least 4.5:1 on every surface in both themes.

| Text token | Day garden | Night garden | Notes |
|---|---|---|---|
| `fg` | 15.4–17.8 | 13.8–17.1 | |
| `fg-muted` | 7.3–8.5 | 7.5–9.3 | default secondary text |
| `fg-subtle` | 5.0–5.8 | 5.2–6.5 | lowest text step: Day 4.99 on raised, Night 4.59 on a `leaf/10` tint (avoid subtle text on tints) |
| `leaf` / `accent` / `success` | 5.3–6.1 | 9.3–11.5 | also the focus ring (5.7 / 11.5 on canvas) |
| `sand` / `emphasis` | 4.9–5.7 | 11.2–13.9 | Day 4.93 on raised |
| `bloom`, `cobalt`, `danger`, `caution` | 4.7–5.7 | ≥ 6.9 | Day is tightest on raised (danger 4.66); use the `*-text` steps for small text on their own tint |
| `accent-fg` on `accent` (primary button) | 5.7 | 11.5 | |

Badge tones are measured under their own 10 % tint at 12 px (Day): live 4.59–5.25, current 5.01–5.74, done 4.85–5.56, soon 7.3–8.5, example 5.13–5.86. Night tones are all 6.5:1 or more.

### 2.5 Borders and opacity steps

Borders are `--line` at a role alpha. A bare `border` (and `divide-*`) is the default hairline in either garden, never Tailwind's grey.

| Utility | Alpha (Day / Night) | Contrast | Use |
|---|---|---|---|
| `border-subtle`, `divide-subtle` | 0.08 / 0.08 | ~1.17:1 | dividers, card edges |
| `border` (DEFAULT) | 0.12 / 0.12 | ~1.28:1 | default hairline |
| `border-strong` | 0.5 / 0.4 | 3.3:1 / 3.5:1 | a control whose border is its only boundary (WCAG 1.4.11) |

Hairlines are decorative (1.17–1.39:1). Where a border is the only thing that identifies a control, use `border-strong`.

**Opacity steps.** The config adds `6`, `7`, `8` and `12` to Tailwind's 5-step scale. Without them, `border-line/12` or `bg-leaf/6` silently generate no CSS (VIS-01). Use `/6` for faint tints (`bg-data/6`), `/10` for state tints (`bg-success/10`), and `/[0.0x]` arbitrary alphas never.

### 2.6 Focus ring

One ring everywhere, drawn by the global `:focus-visible` rule:

```css
:focus-visible { outline: var(--focus-width) solid rgb(var(--focus-ring)); outline-offset: var(--focus-offset); }
/* --focus-ring = leaf per scope · --focus-width 2px · --focus-offset 3px */
```

- **No border radius in the rule.** An outline follows the element's own corners, so pills stay pills. Bare text links (no `rounded*` class) get a 0.25rem radius.
- A Night element sitting on a Day page draws its ring over paper, so `.theme-dark:focus-visible` takes the **Day** ring (the Night ring is 1.6:1 on paper). Inside another dark scope, or with `.focus-inset`, it keeps the Night ring.
- **`.focus-inset`** pulls the ring inside the element. Use it on items in `overflow: hidden/auto` containers, or on the container to cover everything in it.
- Components that draw their own ring use `ring-focus` or `outline-focus`. The config defines no `ringColor.DEFAULT`, so always name a ring colour.
- The ring appears instantly and never changes the element's size or shape. Dense controls may use `focus-visible:outline-offset-2`.

### 2.7 Type scale

All sizes are in rem, so they follow the reader's browser font size. Display sizes use `clamp()`. Pixel values are at the default 16 px root.

| Utility | Size | Line height / tracking | 375 px | 1280 px | Use |
|---|---|---|---|---|---|
| `text-micro` | 0.6875rem | 1.3 | 11 | 11 | text inside `aria-hidden` illustrations **only** |
| `text-label` | 0.75rem | 1.2 | 12 | 12 | caps labels, numerals, chips, badges |
| `text-eyebrow` | 0.75rem | 1 / 0.14em | 12 | 12 | `.eyebrow` only |
| `text-caption` | 0.8125rem | 1.5 | 13 | 13 | breadcrumbs, captions, tooltips |
| `text-small` | 0.875rem | 1.55 | 14 | 14 | secondary copy, `sm` buttons |
| `text-ui` | 0.9375rem | 1.45 | 15 | 15 | buttons, card body, step labels |
| `text-body` | 1rem | 1.65 | 16 | 16 | running text |
| `text-lead` | clamp(1.0625rem, 0.75rem + 1.2vw, 1.25rem) | 1.6 | 17 | 20 | hero and section ledes |
| `text-h4` | 1.25rem | 1.3 | 20 | 20 | minor headings |
| `text-h3` | clamp(1.375rem, 1.0625rem + 1.1vw, 1.75rem) | 1.2 | 22 | 28 | card and sub-section headings |
| `text-display-sm` | clamp(1.5rem, 1rem + 1.6vw, 2.25rem) | 1.15 / −0.01em | 24 | 36 | stat figures, feature-card titles |
| `text-display-md` | clamp(1.75rem, 0.875rem + 2.4vw, 2.875rem) | 1.08 / −0.015em | 28 | 44.7 | large feature statements |
| `text-h2` | clamp(1.875rem, 1.125rem + 2.6vw, 3.25rem) | 1.08 / −0.015em | 30 | 51.3 | section titles |
| `text-h1` | clamp(2.5rem, 1rem + 5vw, 5.5rem) | 1.02 / −0.02em | 40 | 80 | page titles (88 from 1440 px) |

*Differs from B §3.3:* `h3` starts at 22 px (proposal 24) with no tracking, and `h4` is a fixed 20 px (proposal 18 → 20).

**Type classes** (`globals.css`, components layer)

| Class | What it is |
|---|---|
| `.display` | Newsreader 400, −0.015em. Pair with `text-h1`…`text-h3` and `text-balance`. |
| `.eyebrow` | Mono, `text-eyebrow`, uppercase, leaf, with a `// ` prefix hidden from screen readers. |
| `.label-caps` | **The one caps label**: mono, `text-label`, uppercase, `tracking-caps` (0.12em), `text-fg-subtle`. Table heads, meta, chips, data labels. |
| `.tabular` | Tabular figures for data. |

Every new font-size name must also be added to `classGroups["font-size"]` in `src/lib/utils.ts`. Otherwise `cn("text-small", "text-fg-muted")` reads `text-small` as a colour and drops it.

### 2.8 Measure and widths

| Utility | Value | Use |
|---|---|---|
| `max-w-page` | 77.5rem (1240 px) | the site's one content width |
| `max-w-wide` | 85rem (1360 px) | dense data consoles only |
| `max-w-measure` | 58ch (~74 characters of Inter) | paragraphs, legal prose |
| `max-w-measure-narrow` | 50ch (~63 characters) | narrow columns |
| `max-w-prose` | 68ch | legacy; prefer `max-w-measure` |

### 2.9 Spacing and layout

The Tailwind 4 px scale stays for component internals. Layout rhythm uses fluid tokens:

| Utility | Variable | Value | 375 px | 1280 px | Use |
|---|---|---|---|---|---|
| `py-section` | `--space-section` | clamp(5rem, 4.15rem + 3.7vw, 7rem) | 80 | 112 | band padding |
| `py-section-sm` | `--space-section-sm` | clamp(4rem, 3.15rem + 3.7vw, 6rem) | 64 | 96 | CtaBand, footer, hero bottom |
| `mb-header` | `--space-header` | clamp(3rem, 2.8rem + 0.6vw, 3.5rem) | 48 | 52.5 | section header → content |
| `px-gutter` | `--gutter` | clamp(1.25rem, 0.6rem + 2.8vw, 2rem) | 20 | 32 | page side padding |
| `p-pad-card` | `--pad-card` | clamp(1.5rem, 1.35rem + 0.6vw, 1.75rem) | 24 | 28 | card padding |
| `p-pad-panel` | `--pad-panel` | clamp(1.5rem, 0.9rem + 2.4vw, 2.5rem) | 24 | 40 | console / panel padding |

The names work with every spacing utility (`gap-gutter`, `mt-header`…). Use `<Container>` for page width and gutters (§4), never a hand-written `mx-auto max-w-page px-5 sm:px-8`.

### 2.10 Radius, elevation and layers

| Radius | Value | Use |
|---|---|---|
| `rounded-xs` | 4 px | focus on bare links, code, tiny marks |
| `rounded-tag` | 6 px | tags, keycaps, CopyButton |
| `rounded-control` | 12 px | inputs, nested tiles, chips, tooltips |
| `rounded-card` | 16 px | cards |
| `rounded-panel` | 24 px | panels, consoles, feature cards, sheets |
| `rounded-full` | | pills, buttons, icon buttons |

Nested radius = outer − inset (a `rounded-panel` with `p-2` holds a `rounded-card` inside). Tailwind's own `sm`…`3xl` still work but are drift (§8).

| Shadow | Value | Use |
|---|---|---|
| `shadow-e1` | `0 10px 30px -16px` | resting raised tiles, tooltips, chips |
| `shadow-e2` | `0 24px 60px -24px` | menus, cookie banner, scrolled nav, hover lift, floating buttons |
| `shadow-e3` | `0 32px 80px -28px` | dialogs, sheets, sticky product deck, featured tile |
| `shadow-halo` | 4 px leaf ring at 0.12 | selected / active node |
| `shadow-inset-accent` | inset 1 px leaf at 0.35 | selected tile edge |

All three heights use the per-theme `--shadow` colour (Day ink at 0.16, Night black at 0.6).

| Layer | z | Use |
|---|---|---|
| `z-raised` | 10 | local stacking inside a component, sticky in-flow buttons |
| `z-tooltip` | 30 | Hint bubble |
| `z-nav` | 50 | header |
| `z-banner` | 55 | cookie banner |
| `z-overlay` | 60 | preferences dialog and scrim |
| `z-toast` | 65 | toasts (easter eggs) |
| `z-skip` | 70 | skip link (`focus:z-skip`) |

### 2.11 Breakpoints and media queries

Tailwind's defaults: `sm` 640 · `md` 768 · **`lg` 1024 (the main layout switch)** · `xl` 1280 · `2xl` 1536. There is no custom `3xl`. Other queries in use:

| Query | Where | Meaning |
|---|---|---|
| `(max-height: 500px)` | header, mobile sheet | short viewport (phone landscape): 52 px header that hides on scroll-down |
| `LG_QUERY` = `(min-width: 1024px)` | `lib/explainers.ts` | JS mirror of `lg` |
| `AUTOPLAY_QUERY` = `(min-width: 1024px) and (hover: hover)` | `lib/explainers.ts` | where explainers may autoplay |
| `can-hover:` = `(hover: hover) and (pointer: fine)` | everywhere | real hover |

Phones below 640 px get no announcement bar; a 44 px Discord icon button sits in the header instead (D-05).

### 2.12 Print

`@media print` in `globals.css` makes paper a first-class output:

- hides screen chrome: header, announcement bar, skip link, cookie banner and dialog, the easter-egg layer, every `<canvas>`, and anything marked **`data-print-hide`**;
- makes `.fixed` / `.sticky` static, stops every animation, and shows every reveal target, split word, drawn path, meter and allocation segment in its final state;
- re-maps `.theme-dark` to the Day tokens (the Night rule lives inside `@media not print`), so dark islands print dark-on-light;
- prints closed `<details>` open and appends the URL after external links in `.prose-legal`;
- avoids breaks inside figures, tables, `pre` and legal notices, and after headings.

Add `data-print-hide` to anything new that only makes sense on screen.

## 3. Motion system

### 3.1 Tokens

Values live in `globals.css`; Tailwind maps them, so CSS and utilities share one source.

| Duration | Value | Tailwind | For |
|---|---|---|---|
| `--dur-instant` | 90 ms | `duration-instant` | press, toggle, icon swap, copy tick |
| `--dur-fast` | 150 ms | `duration-fast` | hover / focus colour, tooltip, selected state |
| `--dur-base` | 240 ms | `duration-base` | panel crossfade, menu open, small morph, page change |
| `--dur-slow` | 420 ms | `duration-slow` | entrances, scroll reveals, sheets, explainer stage |
| `--dur-scenic` | 700 ms | `duration-scenic` | one-off storytelling only; never on repeated UI |

Exits run at about 0.75× the matching entrance (`calc(var(--dur-slow) * 0.75)`).

| Easing | Curve | Tailwind | Intent |
|---|---|---|---|
| `--ease-out` | (0.22, 1, 0.36, 1) | `ease-out` | settle: entrances, reveals, hovers |
| `--ease-expo` | (0.16, 1, 0.3, 1) | `ease-expo` | snap, then settle: morphs, menus, indicators |
| `--ease-in` | (0.4, 0, 1, 1) | `ease-in` | leave: exits, header hide |
| `--ease-inout` | (0.65, 0, 0.35, 1) | `ease-inout` | travel from A to B |
| `linear` | | `ease-linear` | loops, timers and scroll-linked only |

`ease-out` and `ease-in` are the site's curves, not Tailwind's defaults.

| Distance, scale and stagger | Value | For |
|---|---|---|
| `--move-xs` | 2 px | hover lift, arrow nudge, panel swap |
| `--move-sm` | 8 px | hero rise (LCP-safe), toasts, page change, sheet items |
| `--move-md` | 16 px | scroll reveals (`animate-reveal`) |
| `--move-lg` | 24 px | sheets and dialogs on phones |
| `--scale-press` | 0.98 | `active:scale-[var(--scale-press)]` |
| `--scale-pop` | 0.96 | popover / panel enter |
| `--blur-max` | 4 px | non-LCP display text only; never on data |
| `--stagger-tight` | 30 ms | chips, logos |
| `--stagger` | 60 ms | cards, list items |
| `--stagger-words` | 35 ms | headline words |
| `--stagger-cap` / `--stagger-cap-words` | 300 / 400 ms | the longest any item waits |

Stagger only on a first reveal, never on repeated UI. Delay = `min(i × stagger, cap)`.

### 3.2 Keyframes and animations

| Utility | Does | Timing | Use |
|---|---|---|---|
| `animate-rise` | transform from `--move-sm`, **opacity stays 1** | slow · out | the LCP group: h1, lede, hero media, CTAs |
| `animate-reveal` | opacity 0 + `--move-md` | slow · out | below-the-fold one-off entrances (cookie banner) |
| `animate-fade-in` | opacity 0 → 1 | base · out | secondary hero items (breadcrumb, eyebrow), Hint bubble |
| `animate-swap` | opacity 0.001 + `--move-xs` | base · out | tab-panel crossfade (never 0, so the panel keeps its box) |
| `animate-pop-in` | scale from `--scale-pop` | base · expo | popovers |
| `animate-progress` | `scaleX` 0 → 1, linear 4 s | set `animation-duration` | autoplay step timers (with `origin-left`) |
| `animate-flow` | dash offset loop, 1.2 s | infinite | connectors with `stroke-dasharray="4 6"` |
| `animate-pulse-ring` | ring grows and fades, 2 s | infinite | the "live" dot |
| `animate-blink` | caret blink | infinite | terminal caret |
| `animate-float` | 10 px bob, 9 s | infinite | legacy; see §8 |
| `animate-stamp` | rotate and land, 450 ms | once | the verdict stamp in RulesDemo |
| `animate-enter-up`, `animate-enter-fade`, `animate-morph-in` | | | **retired**; don't use in new code |

**Named CSS patterns** in `globals.css`:

| Hook | Pattern |
|---|---|
| `.split-load`, `[data-split]`, `.split-word` | word ink-and-rise for `SplitText` |
| `.ink-scope`, `.ink-word` | scroll-linked word ink for `ScrollInk` (CSS view timeline) |
| `details.smooth` | `<details>` that animates to `height: auto` where supported |
| `.page-enter` | marks a soft-navigation page (`app/template.tsx`): no entrance of its own (removed 2026-10-22, it made page changes feel slow); it only stops the hero replaying its load entrance |
| `.value-tint` | a live value that changed: leaf tint fading over 600 ms, colour only |
| `.meter-fill`, `.alloc-seg` | bars that fill from the left when their reveal group reveals |
| `.draw-path` | line icons that draw in on reveal (`pathLength="1"`) |
| `.art-*`, `.art-tile` | hero and product illustrations that play once and settle |
| `.orbit-pulse`, `.stack-signal` | a selection pulse that runs 2–3 times, then rests |
| `.scanlines`, `.sheen` | monitor texture with one sweep; diagonal sheen on hover |
| `.mobile-sheet`, `.sheet-item` | the mobile menu's circular reveal and item stagger |
| `.pstack` | sticky product deck that recedes via scroll timeline (lg, no JS) |

### 3.3 Variants

```tsx
className="transition-colors duration-fast can-hover:hover:text-fg"   // hover only with a real pointer
className="animate-spin motion-off:animate-none"                       // no motion: OS setting OR Pause motion
```

- **`motion-off:`** matches `@media (prefers-reduced-motion: reduce)` **or** `html[data-motion="paused"]`. Use it for anything the global contract (§3.10) doesn't already cover, such as swapping an animated element for a static one.
- **`can-hover:`** matches `@media (hover: hover) and (pointer: fine)`. Every hover style goes through it, so a tap never leaves a stuck hover. Touch gets `active:` feedback instead.

### 3.4 JavaScript helpers (`src/lib/motion.ts`)

| Helper | Returns |
|---|---|
| `useMotionAllowed()` | `true` while motion may run (no reduced-motion preference **and** Pause motion off). Reactive (`useSyncExternalStore` over `matchMedia` and `data-motion`), so use it as an effect dependency. `true` on the server. |
| `useReducedMotion()` | the inverse; `false` on the server |
| `useMotionPaused()` | whether the Pause-motion switch is on |
| `prefersReducedMotion()` | one-off, non-reactive read (e.g. choosing `behavior: "smooth"` for a scroll) |
| `useInView(ref, { once, rootMargin, threshold })` | whether an element is on screen; `true` without IntersectionObserver |
| `themeRgb(name, el)` | a theme variable's `"r g b"`, read on `el` so a surrounding `.theme-dark` applies (canvases) |
| `useFieldLoop(ref, draw, { fps, stillAt })` (`components/motion`) | the canvas loop: ≤ 15 fps timers, settles 5 s after entering view or the last scroll / pointer move, still frame with motion off or Save-Data |

Every JS effect follows one contract: it never runs off-screen or in a hidden tab, and with motion off it shows its final, static state.

### 3.5 The Pause-motion toggle (D-12)

| Piece | Value |
|---|---|
| Attribute | `<html data-motion="paused">` |
| Storage | `localStorage["blok:motion"] = "paused"` (`MOTION_KEY`), wrapped in try/catch |
| Change event | `window` event `"blok:motion"` (`MOTION_EVENT`) |
| Setter | `setMotionPaused(paused)` in `lib/motion-pref.ts` |
| UI | `<MotionToggle className="…" />`: an unstyled `aria-pressed` button, always named "Pause motion"; placed in the footer and the mobile menu |
| Pre-paint | `RevealScript`, inline and first in `<body>`, reads the key and sets the attribute before first paint, so nothing animates even for a frame |

From then on `globals.css` treats the page exactly like `prefers-reduced-motion`, and every hook in §3.4 reports motion as off. `motion-pref.ts` has no `"use client"` because the server-rendered `RevealScript` imports the key as a plain string.

### 3.6 Scroll reveals

Wrap a block in `<Reveal>`, or a cascade in `<Stagger as="ul"><RevealItem as="li">…</RevealItem></Stagger>`. `RevealScript` adds `html.js`, watches every `[data-reveal]`, `[data-reveal-group]` and `[data-split]` with an IntersectionObserver (60 px above the viewport bottom, plus a rAF scroll check for fast jumps), numbers group items as `--i` and sets `data-revealed`. Targets are hidden only under `html.js` **and** no reduced-motion preference **and** not paused. Without JS, or before the script runs, content is simply visible. Reveals need no client JS and work before hydration.

*Differs from C §4.4:* `[data-reveal]` transitions use a literal 700 ms and 20 px (not `--dur-slow` / `--move-md`), and `Stagger` defaults to 70 ms per item with **no cap**. See §8.

### 3.7 Off-screen pausing (`data-loop` / `data-inview`)

After `load`, once the main thread is idle, `RevealScript` keeps `data-inview` on every page band (`main > section`, `main > div > section`, `main section[id]`), the footer and every `[data-loop]` element while it is within 300 px of the viewport, and then sets `html[data-io]`. CSS then:

- inside a band without `data-inview`, pauses the known loop utilities (`animate-flow`, `-float`, `-pulse-ring`, `-pulse`, `-ping`, `-spin`, `-bounce`, `-blink`, the `.art-*` and `.orbit-*` classes, the `.scanlines` sweep);
- pauses **everything** inside a `[data-loop]` element that is away.

**Mark every new looping illustration with `data-loop`.** A paused loop resumes from the same frame. `.art-tile` illustrations also wait, paused, until `html[data-io]` exists, so a tile below the fold doesn't spend its play before it's seen.

### 3.8 LCP rules (R1–R5, from E §4)

| Rule | Requirement |
|---|---|
| **R1** | The LCP candidate is fully visible at first paint: opacity 1, no delay, no clip, no blur. Transform-only motion from opacity 1 (`animate-rise`) is allowed. Gate: LCP − FCP ≤ 50 ms. |
| **R2** | Word-split h1s are LCP-safe: every word starts readable in `--fg-subtle` (≥ 5:1) at full opacity, rises 0.25em and inks to its own colour. No opacity-0 start, no blur. |
| **R3** | Loops animate composited properties only (transform, opacity), pause off-screen, run ≤ 4 at once in view, and keep the idle main thread under 5 % at 4× CPU throttling. |
| **R4** | JS motion runs only in view, on ≤ 15 fps timers (`useFieldLoop` caps at 15; `Scramble` ticks at 15). |
| **R5** | Interactions after load respond in under 100 ms. |

`PageHero` and the home `Hero` implement R1: h1, lede, actions and aside use `animate-rise` with no delay; only the breadcrumb and eyebrow fade in (any delay ≤ 150 ms); everything settles by `--dur-slow`, well inside the 700 ms budget. After a client-side navigation the hero doesn't replay its entrance and the page appears at once (`.page-enter`).

### 3.9 Patterns, and when not to animate

- **Panel swap** (tabs, explorers): `animate-swap` at base, no stagger. **Reserve the height**: stack every panel in one grid cell (`col-start-1 row-start-1`) and mark the inactive ones `invisible` and `inert`, so the box is as tall as the tallest panel and never jumps.
- **Hover / press:** colour at `duration-fast ease-out`; navigating cards lift `--move-xs` (`-translate-y-0.5`) at `duration-base ease-expo`, pointer only; press `active:scale-[var(--scale-press)] active:duration-instant`.
- **Loops:** composited properties only, `data-loop`, settle within 5 s on a meaningful still frame (D-33). The base (non-animated) style **is** the still frame.
- **Live values:** a skeleton sized to the value, then `.value-tint` (colour only) when the value arrives or changes.

**When not to animate**

1. The LCP element: no opacity, clip, blur or delay on the first frame.
2. Primary CTAs: never invisible; transform is the only entrance.
3. Data being read (prices, figures, token facts, allocation percentages, tables): no count-ups, no reveals that hide them. Change feedback is colour only (D-34; `CountUp` no longer counts at all).
4. Repeated UI: no re-stagger or replayed typing on user-initiated changes, and no autoplay once the visitor has touched an explainer.
5. Direct manipulation (sliders, drag): 1:1, no easing lag.
6. Layout properties: no `height`, `width`, `top`, `left`, `padding` or `grid-rows` animation. Reserve space instead. (`details.smooth` animating to `height: auto` is the one accepted exception, behind `@supports`.)
7. Off-screen, in a hidden tab, or with Save-Data on.
8. With motion off (reduced motion or Pause motion).
9. Focus: the ring never moves or reshapes the control.
10. Print.

### 3.10 Reduced-motion contract

- **CSS:** one block for both `prefers-reduced-motion: reduce` and `html[data-motion="paused"]` sets, on every element and pseudo-element, `animation-duration: 0.001ms`, `animation-iteration-count: 1`, `animation-delay: 0s`, `transition-duration: 0.001ms`, `transition-delay: 0s` and `scroll-behavior: auto`. Everything jumps to its end state and stays there.
- **Still frames:** every keyframed component's base style is a meaningful still frame.
- **Hidden states** (reveal targets, collapsed meters, undrawn paths, uninked words) exist only under `html.js` + no-preference + not paused. Never hide content with `opacity: 0` or `scaleX(0)` in the server HTML.
- **JS:** depend on `useMotionAllowed()`. With motion off: no autoplay, canvases hold a still frame, `Scramble` shows the real text, smooth scrolls become instant. Controls that exist only for motion become plain content, not disabled buttons.
- *Differs from C §4.6:* the proposal allowed colour fades of ≤ 150 ms under reduce; the code makes every transition instant.

### 3.11 Explainer autoplay rule (`useAutoplay`, `lib/explainers.ts`)

ProtocolExplorer, RulesDemo and DecisionPipeline share one rule set:

- Autoplay runs only at `lg` and up with a hover-capable pointer (`AUTOPLAY_QUERY`), only with motion allowed, and only on screen in a visible tab. **Never on touch or below `lg`** (D-12).
- Any user input (a tap, click or key on a tab, stage or Prev/Next, a swipe) calls `stop()`, which ends autoplay for the rest of the visit. The toggle then offers "Resume".
- The pointer over the explainer, or keyboard focus inside it, holds it paused (the toggle itself, marked with `TOGGLE_ATTR`, doesn't count).
- Each step stays up for `dwellMs(text)`: its words at about 200 a minute, plus 2 s. A walk plays once and stops on its last step (`end()`); the toggle then reads "Replay".
- Render `<AutoplayToggle>` only while `eligible`. Analytics fire from user input only, never from autoplay.

```tsx
const ap = useAutoplay(rootRef);
<div ref={rootRef} {...ap.rootProps}>…{ap.eligible && <AutoplayToggle on={ap.on} ended={ap.ended} onClick={ap.toggle} what="the walkthrough" />}</div>
```

### 3.12 Machine figures (`components/iso`)

Protocol ideas drawn as small working machines, in the style of an engineering drawing: paper-white parts with three shades and a fine ink outline, bolted to a rounded mounting plate (screws, ruler ticks), labels engraved on the parts they name. Colour is kept for meaning (a lit lamp, a coin's gold, a fill). Each figure sits in one frame (`MachineFigure`): "Fig n" and a title, the drawing, step tabs, a Pause button, a live mono readout, and a caption that says "Illustrative".

- **Built so far:** Fig 1 `GardenMachine` (/protocol#architecture: strategies trade inside, only your key moves funds out) Fig 2 `IndexMachine` (/indices#methodology: Price → Size → Weigh → Floor, the four steps in `methodology`) Fig 3 `ReleaseMachine` (/security#audits: write → test → audit → scan → approve → ship, from the page's `pipeline`), Fig 4 `ProposalMachine` (/governance#process: propose → discuss → vote → execute, from the page's `process`; it replaced DecisionPipeline) and Fig 5 `OpenGardenMachine` (home #how: open → fund → strategy, driven by the How it works scroller instead of tabs; it replaced GardenMock).
- **Replaced and removed:** CustodyDiagram (by Fig 1), StepFlow (by Fig 3), DecisionPipeline (by Fig 4), GardenMock (by Fig 5).
- **Not a figure:** home #app shows the BLOKC app's Index Gardens screen, rebuilt in HTML (`home/GardenScreen`) from the app repo's own components and tokens, with example data and an "Example" badge. `ScaledScreen` lays it out at a real window width (1280, or 430 in a narrow frame) and scales it to the frame like a screenshot; its CSS uses container queries, so the layout follows the frame, not the viewport.
- **Kit:** `geometry.ts` (2:1 projection, rounded plates, iso circles, face transforms for engraved text), `machine.tsx` (Part, Slab, Cyl, Screw, Flat, OnFace/Engrave), `Iso.tsx` (the stage, moving HTML layers, marks), `iso.module.css` (motions; a CSS module, so it ships only with pages that show a figure).
- **They loop, on purpose** (owner's call, 2026-10-23), unlike the one-pass explainers of §3.11: `useFigureLoop` plays the steps round and round until the visitor presses Pause, and picking a step carries the loop on from there. It never runs with reduced motion or Pause motion (the figure then holds the picked step's still frame), off screen, or in a hidden tab.
- **Honest data:** the rules and limits in readouts come from `lib/data`; sizes and amounts in the drawing are made up, and the caption says so.

## 4. Components

Every interactive component ships the states that apply: **default · hover (pointer only) · focus-visible · active · disabled · loading · error**, all reduced-motion safe. All are server components unless marked *client*.

### Button (`ui/Button.tsx`)
A button, or a link styled as one when `href` is set.
- **Props:** `variant` `primary` (accent fill) · `secondary` (card fill, hairline) · `ghost` (text); `size` `sm` (36 px, dense desktop rows) · `md` (44 px, default) · `lg` (48 px); `href`; `host` (`true` or a string) adds a muted mono host label for destinations that ask for a wallet (Aragon, Arbiscan); `externalIcon` (default `true`); `loading` (buttons only).
- **States:** `can-hover:` fill / border change at `duration-fast`; global focus ring; press scales to `--scale-press` at `duration-instant`; `disabled` / `aria-disabled` at 45 % opacity with no pointer events; `loading` sets `disabled` + `aria-busy` and shows a spinner.
- External `href`s open in a new tab with ↗ and a screen-reader "(opens in a new tab)". Internal ones use `next/link`.
- **Usage:** `<Button href="/indices" size="lg" data-cta="hero_explore_indices">Explore the indices</Button>`

### Card (`ui/Card.tsx`)
The one card surface (VIS-09).
- **Props:** `tone` `default` · `feature` (a Night island with `shadow-e3`) · `tint-cobalt` · `tint-sand` · `planned` (dashed, no fill); `size` `sm` (p-5) · `md` (`p-pad-card`) · `lg` (`p-pad-panel`); `radius` `card` · `panel`; `href` makes the whole card a link; `aria-labelledby` (the heading's id, so the link reads as its title); `aria-describedby`; `interactive` for a card that contains its own stretched link; `as`.
- **States:** linked cards lift 2 px with a leaf border and raised fill on pointer hover; `interactive` cards do the same while their inner link is hovered or focus-visible.
- **Usage:** `<Card href="/security" aria-labelledby="sec-h"><h3 id="sec-h" className="text-h3">Security</h3>…</Card>`

### Badge (`ui/Badge.tsx`)
A status chip with one wording and one tone per meaning, site-wide (CRO-26, 27).
- **Props:** `status` `live` · `testing` (the protocol's launch state) · `progress` · `planned` · `done` · `example` · `voting`. The older `tone` + children form (`live` · `current` · `done` · `soon` · `example` · `neutral`) is kept while pages move over.
- Only `live` / `voting` pulse. `example` marks illustrative content and has no dot.
- **Usage:** `<Badge status="example" />`

### Hint (`ui/Hint.tsx`, *client*)
A toggletip explaining a term (A11Y-11, MOB-06).
- **Props:** `text`, `children` (the term), `className`.
- **States:** click or tap pins it open, a second click closes it; Enter / Space toggle; with a mouse or pen it also shows on hover over the term **or the bubble** (WCAG 1.4.13); keyboard focus shows it; Escape closes it from anywhere; an outside tap or focus leaving closes it. On phones the bubble is a bottom sheet. The text is also part of the button's accessible name; the bubble is `aria-hidden`.
- **Usage:** `<Hint text="Chainlink posts a new price when it moves past a set threshold…">Oracle last updated</Hint>`

### CopyButton (`ui/CopyButton.tsx`, *client*)
Copies a value and confirms it.
- **Props:** `value`, `label` (default "Copy"), `selectTarget` (an element id or ref showing the value).
- **States:** idle; **copied** (check icon, "Copied", 1.8 s); **failed** (clipboard refused: selects the on-page text and says "Copy failed. Select the address to copy" for 8 s). The label is `aria-live="polite"`.
- **Usage:** `<CopyButton value={address} selectTarget="token-address" />`

### FaqList (`ui/FaqList.tsx`)
FAQ as native `<details class="smooth">`: keyboard, screen-reader and no-JS support, and every answer in the static HTML.
- **Props:** `items: { question, answer, cta? }[]`. `answer` is plain text (so FAQPage JSON-LD stays clean) and may contain `[text](/path)` or full-URL links. `cta` adds a small secondary button under the answer.
- **States:** pointer-hover turns the question leaf; open rotates the plus 45° and tints the number.
- Put it inside `<section id="faq">` so opens are tracked (§6).
- **Usage:** `<section id="faq"><FaqList items={faqs} /></section>`

### CtaBand (`ui/CtaBand.tsx`)
The closing call to action on every page: a Night band (`data-band="dark"`) with a `DotField` of rings, a `Scramble` payoff, Discord (primary) and docs (secondary) buttons, a "Not on Discord? Follow us on X" fallback and `SocialLinks`.
- **Props:** `context` `default` · `index` (pass `indexName`) · `protocol` (protocol and security pages). The Discord button, the X link and the social links carry `data-placement="cta_band"`; states come from `Button`.
- **Usage:** `<CtaBand context="index" indexName="BLOKC5" />`

### PageHero (`ui/PageHero.tsx`)
The inner-page header: breadcrumb, h1, lede, optional actions and aside, LCP-safe (R1).
- **Props:** `title`, `description` (required); `eyebrow` (rendered as the h1's first line, so the topic keyword is part of the heading, SEO-11); `crumb` + optional `parent`, or a full `crumbs` trail; `actions`; `aside`.
- Pair it with `breadcrumbSchema()` JSON-LD using the same labels.
- **Usage:** `<PageHero crumb="Security" eyebrow="Security" title={<>… <em className="text-sand">…</em></>} description="…" actions={<Button href="…">…</Button>} />`

### Breadcrumb (`ui/Breadcrumb.tsx`)
The one trail (UX-18, SEO-20). Home comes first unless `home={false}`; the last crumb is the current page (`aria-current="page"`, never a link). Labels match `lib/nav.ts` and the page's JSON-LD word for word. Links brighten to `fg` on pointer hover.
- **Usage:** `<Breadcrumb items={[{ label: "Indices", href: "/indices" }, { label: "BLOKC5" }]} />`

### RiskNote (`ui/RiskNote.tsx`)
One-line risk statement linking to `/protocol#fees`, for the places a newcomer weighs the product (hero facts, index pages, token page). The wording is pending counsel review (SEC-13, D-03). **Place it; don't restyle or reword it.**
- **Usage:** `<RiskNote className="mt-6" />`

### StatusLine (`ui/StatusLine.tsx`)
The launch state in one plain sentence under a hero's CTAs ("Not open yet: Gardens are in private testing."). It reads `protocolStatus`, so it can't drift from the badges, and never carries a date.
- **Usage:** `<StatusLine className="mt-4" />`

### Icon (`ui/Icon.tsx`)
The site's line icons on one grid (VIS-18): 20 × 20, 1.5 px non-scaling stroke, round caps, `currentColor`.
- **Props:** `name` (`arrow-right`, `arrow-down`, `external`, `check`, `cross`, `plus`, `minus`, `menu`, `chevron-down`, `copy`, `doc`, `info`, `shield`); `size` `sm` 16 · `md` 20 · `lg` 24; `label` (only for a stand-alone icon that carries meaning; otherwise it is `aria-hidden`).
- Brand glyphs (Discord, X, Telegram, Farcaster, GitHub, YouTube) live in `ui/icons.tsx` as `SOCIAL_ICONS`.
- **Usage:** `<Icon name="external" size="sm" />`

### Section (`ui/Section.tsx`)
A full-bleed band around a centred container, with an optional header whose h2 is a scroll-revealed `SplitText`.
- **Props:** `id`, `eyebrow`, `title`, `description`, `actions`, `align` `left` · `center`, `tone` `canvas` · `surface` (bordered alternate band) · `dark` (Night island, flips the header). Surface and dark bands get `CornerMarks`.
- **Usage:** `<Section id="security" eyebrow="Security" title={…} description="…" tone="surface">…</Section>`

### Container (`ui/Container.tsx`)
`mx-auto`, a max width and the fluid gutter (`px-gutter`).
- **Props:** `size` `page` (1240) · `wide` (1360, consoles) · `measure` (58ch of text, gutters outside it); `as`; any `div` props.
- **Usage:** `<Container size="wide" className="py-section">…</Container>`

### SocialLinks (`ui/SocialLinks.tsx`)
A row of 40 px icon links to the official channels, each named "X (opens in a new tab)" etc. Pointer hover turns the ring and icon leaf; press scales to `--scale-press`.
- **Props:** `only` (a subset, in order), `placement` (sets `data-placement` on every link for analytics).
- **Usage:** `<SocialLinks only={["x", "github"]} placement="footer" />`

### ArrowLink (`ui/ArrowLink.tsx`)
An inline "learn more" link in leaf with an arrow that nudges 2 px on hover (still a bare `hover:`, §8.2); external links get ↗ and the new-tab note. The only prop besides `href` is `className`.
- **Usage:** `<ArrowLink href="/protocol#fees">See fees and risks</ArrowLink>`

### Motion helpers (`components/motion/*`)

| Component | Purpose · key props | Usage |
|---|---|---|
| `CountUp` | A real figure, formatted (`en-GB`) in tabular digits. **Doesn't animate** (D-34); the name stays for compatibility and `duration` is ignored. `value`, `prefix`, `suffix`. Never on an invented number. | `<CountUp value={supply} suffix=" BLOK" />` |
| `Scramble` (*client*) | Text that decodes from glyphs into the real words, once, when it scrolls into view, at 15 fps. The real text is the only DOM copy (an `aria-hidden` overlay paints the glyphs), so the accessible name never changes. `text`, `duration` (1100 ms). | `<em className="text-sand"><Scramble text="Garden." /></em>` |
| `SplitText` | A heading whose words ink in and rise (R2). `as` (`h1`…`span`), `reveal` `scroll` (default, via RevealScript) · `load` (above-the-fold heroes), `delay` (ms). The full text sits in an `sr-only` span; the word spans are `aria-hidden`. `splitWords()` is the shared splitter. | `<SplitText as="h2" className="display text-h2">…</SplitText>` |
| `ScrollInk` | A paragraph whose words darken from `fg-subtle` to full ink as it scrolls through the viewport (CSS view timeline, no JS; plain text where unsupported). | `<ScrollInk className="text-h3">…</ScrollInk>` |
| `DotField` (*client*) | Halftone dot-matrix canvas art. `variant` `orb` · `wave` · `rings` · `drift`; `tone` `leaf` · `sand` · `cobalt` · `mute`; `gap`. 12 fps via `useFieldLoop`. Decorative; wrap it in an `aria-hidden`, sized box. | `<DotField variant="rings" tone="leaf" gap={11} />` |
| `GlyphField` (*client*) | A canvas of hex glyphs with falling leaf columns, drawn from a pre-rendered atlas, redrawing changed cells only. 12 fps. | `<GlyphField className="opacity-60" />` |
| `CornerMarks` | "+" registration marks where a band's edges meet the gutter. `only` `top` · `bottom`. Inside a `relative` band. | `<CornerMarks only="top" />` |
| `Reveal`, `Stagger`, `RevealItem` (`ui/Reveal.tsx`) | Scroll reveals with no client JS (§3.6). `delay` (s), `step` (s), `as`. | `<Stagger as="ol"><RevealItem as="li">…</RevealItem></Stagger>` |
| `StepFlow` (`ui/StepFlow.tsx`) | A linear process: a vertical rail on phones, a horizontal track from `md`, in real DOM text. `steps`, `label`. | `<StepFlow label="How a deposit works" steps={steps} />` |
| `MotionToggle` (*client*) | The Pause-motion switch (§3.5). Unstyled; style it with `className`. | `<MotionToggle className="…" />` |
| `AutoplayToggle` (*client*, `explore/`) | The explainers' Pause / Resume / Replay control, sized for its longest label. | see §3.11 |

## 5. Interaction patterns

### 5.1 Roving tabs (`useRovingTabs`)

Every tablist uses one keyboard model (WAI-ARIA tabs, automatic activation): only the selected tab is in the Tab order; the arrow keys of the strip's orientation move and select, wrapping at the ends; Home and End jump to the first and last tab. A strip that is a row on phones and a column from `lg` passes `verticalFrom`, and `aria-orientation` follows.

```tsx
const rt = useRovingTabs({ count: items.length, selected, onSelect: (i) => { ap.stop(); select(i); }, verticalFrom: LG_QUERY });
<div {...rt.tablist} aria-label="Protocol layers">
  {items.map((x, i) => <button key={x.id} {...rt.tab(i)} aria-controls={`panel-${x.id}`} onClick={() => select(i)}>{x.label}</button>)}
</div>
```

`onSelect` fires only for arrow / Home / End; clicks stay with the caller. Both count as user input, so explainers call `stop()` in each.

### 5.2 Modal sheets, dialogs and disclosures

**Prefer a native `<dialog>` with `showModal()`** (as `ContentsSheet` does). It brings focus containment, Escape and focus return for free. Give it `aria-labelledby`, close on a backdrop click (`e.target === e.currentTarget`), and animate with `open:animate-rise motion-off:open:animate-none`.

A **custom modal** (the mobile menu sheet, the cookie preferences dialog) must:

1. be `role="dialog"` + `aria-modal="true"` with an accessible name, and `inert` while closed;
2. on open, move focus inside (the first link, or the panel itself), make the page behind `inert` (`#main` and the footer) and lock body scroll;
3. keep Tab inside. The mobile sheet's cycle includes the menu button, which stays visible above the sheet as its close control, and the sheet repeats a close button because `aria-modal` can hide the outside button from some screen readers;
4. close on Escape and on its close buttons, and **return focus to the opener**. The cookie dialog falls back to the banner's Manage button, then to where focus was before the banner, then `#main`;
5. close on navigation, and the mobile sheet also when the viewport reaches `lg`.

**Disclosure menus** (DesktopNav): Escape closes from anywhere and returns focus to the trigger if focus was inside; a pointer-down outside closes (iPadOS never blurs a tapped button); ArrowDown on a trigger opens and focuses the first item; Tab from an open trigger goes into its panel; closed panels are `inert`.

**Page changes:** after a client-side navigation, `app/template.tsx` moves focus to `#main` (`tabindex="-1"`, no ring) unless something on the new page already took focus.

**Cookie banner:** first in the DOM after the skip link (the first Tab stop) while sitting visually at the bottom; it sets `scroll-padding-bottom` while shown so anchors don't land under it. Reject and Accept are styled identically (D-15), and every consent control is 44 px.

### 5.3 External-link cue

Every link that opens a new tab has `target="_blank" rel="noopener noreferrer"` and says so twice: a visible ↗ (`<Icon name="external" size="sm" />`) and a screen-reader note, `<span className="sr-only"> (opens in a new tab)</span>` (or the same words in an icon-only link's `aria-label`).

`Button`, `Card`, `ArrowLink`, `FaqList` and `SocialLinks` do this automatically. A linked `Card` with `aria-labelledby` points at the note's id too. Destinations that ask for a wallet also show their host (`<Button host>`). Internal links never get the cue. Link lists and inline text links (footer, risk and audit notes, FAQ answers) use `IntentLink`: it prefetches on hover, touch or focus instead of on sight, so a click doesn't wait for the network and scrolling doesn't prefetch every route. Don't use a bare `prefetch={false}`.

### 5.4 Hover only where hover exists

- Write every hover style as `can-hover:hover:…` (and `can-hover:group-hover/x:…`), never bare `hover:`. Tailwind's `hoverOnlyWhenSupported` is **not** enabled, so a bare `hover:` sticks after a tap on touch screens.
- Give touch its own feedback with `active:` (press scale).
- Never put information only on hover. Use a tap-toggle (`Hint`) or show it inline.
- Hover-revealed bubbles must be hoverable themselves and dismissible with Escape (WCAG 1.4.13).

## 6. Analytics contract

Analytics is GA4 (`G-D3Q5JCYWJR`), **consent-gated** end to end:

- gtag.js loads only after the visitor allows Analytics. Consent Mode starts from "denied" and grants `analytics_storage` only; ad signals stay denied for good;
- every listener in `Analytics.tsx` is attached only while consent is granted, so events before consent are **dropped**, not queued (the one queue holds up to 20 events that arrive *with* consent before gtag is set up);
- withdrawal sets the `ga-disable-G-D3Q5JCYWJR` kill switch and deletes the `_ga` cookies;
- parameters are filtered against an allow-list and slugged to snake_case; values that look like wallet addresses or emails are dropped; error descriptions lose URL queries and mask addresses, emails and long numbers.

**Markup attributes** (no import needed):

| Attribute | Effect |
|---|---|
| `data-cta="<id>"` | a click on it (or inside it) sends `cta_click` with `cta_id`, `destination` and `placement`. Ids are snake_case, `<page or section>_<what>`: `hero_explore_indices`, `gov_aragon_proposals`. |
| `data-placement="<where>"` | overrides where a click happened. Otherwise placement is `announcement_bar`, `mobile_menu`, `header`, `footer`, or the closest `section[id]`. |

Discord invite links are tracked automatically as `join_group` (and never also as `cta_click`); don't add `data-cta` to them.

**CustomEvents** on `document`:

```ts
document.dispatchEvent(new CustomEvent("blok:track", { detail: { name: "select_content", params: { content_type: "index", content_id: "blokc5" } } }));
document.dispatchEvent(new CustomEvent("blok:error", { detail: { source: "prices", state: "error" } }));
```

Client islands can call `track()` / `trackSelect()` from `lib/explainers.ts` (dispatches `blok:track`) or `track()` from `lib/analytics.ts` (sends directly; still consent-gated).

| Event | Fired when | Parameters |
|---|---|---|
| `join_group` | click on any Discord invite link | `group_id: "discord"`, `placement` |
| `cta_click` | click on a `[data-cta]` element | `cta_id`, `destination` (`docs` · `whitepaper` · `aragon` · `github` · `audit_report` · `arbiscan` · `internal` · `other`), `placement` |
| `select_content` (FAQ) | a `<details>` inside `#faq` opens; once per item per page view | `content_type: "faq"`, `content_id` (question slug), `placement` (page) |
| `select_content` | a pick in an explorer (`trackSelect`) | `content_type` (`index` · `index_component` · `protocol_layer` · `rules_scenario` · `allocation_share`), `content_id` |
| `section_view` | a key `section[id]` is ≥ 50 % visible (or fills half the screen); once per view | `section_id` |
| `announcement_dismiss` | the announcement bar is dismissed; once per view | `announcement_id` |
| `video_start` | Play on the /about video facade | `video_provider: "youtube"`, `video_title` |
| `rebalance_lab_use` | first slider or number change in RebalanceLab; once per view | `index_id` |
| `exception` | window error, unhandled rejection, error boundary (max 10 per view) | `description`, `fatal` |
| `exception` | a `blok:error` live-data failure; once per source and state | `description: "live_data:<source>:<state>"`, `fatal: false` |

Key sections for `section_view`: `how`, `products`, `indices`, `explore`, `rules`, `now`, `security`, `ecosystem`, `builders`, `roadmap`, `faq`, `cta_band`, `fees`, `methodology`, `data`.

**Rules:** fire from user input only, never from autoplay, hover or page load. Event names are lowercase snake_case (≤ 40 characters). A new parameter must be added to `PARAMS` in `lib/analytics.ts` or it is silently dropped. Never send free text typed by a visitor, addresses, emails or IDs.

## 7. Do / don't checklist for new UI

**Tokens**

- [ ] Font sizes come from the scale (`text-label` … `text-h1`). **No `text-[13px]`**, no `clamp()` in a class.
- [ ] Colours are semantic utilities. No hex, `rgb()`, `bg-white`, `bg-black` or Tailwind palette colours (`gray-*`, `red-*`).
- [ ] Borders use `border-subtle` / `border` / `border-strong`; tints use `/6`, `/10`. **No `/[0.07]`.**
- [ ] Radii are `rounded-xs/tag/control/card/panel/full`. **No `rounded-[…]`**, and no new `rounded-xl/2xl/3xl`.
- [ ] Shadows are `shadow-e1/e2/e3/halo/inset-accent`. **No `shadow-[…]`.**
- [ ] Layers are `z-raised` … `z-skip`. **No `z-[…]`**, no `z-50`.
- [ ] Layout uses `Container`, `py-section(-sm)`, `mb-header`, `p-pad-card`, `p-pad-panel`.
- [ ] Durations and easings are `duration-instant…scenic` and `ease-out/expo/in/inout`. No `duration-300`, no literal `cubic-bezier`.
- [ ] Caps labels use `.label-caps`; paragraphs use `max-w-measure`.
- [ ] Any new scale name is registered in `cn()` (`src/lib/utils.ts`), and `npm run check:classes` passes after a build.

**Motion**

- [ ] The LCP element and CTAs are visible on the first frame (R1).
- [ ] Below-the-fold entrances use `Reveal` / `Stagger` / `SplitText`, never a client-side `opacity: 0`.
- [ ] Data being read is never hidden or counted up.
- [ ] Loops use transform / opacity only, carry `data-loop`, settle within 5 s, and have a still-frame base style.
- [ ] JS motion depends on `useMotionAllowed()`, runs only in view, at ≤ 15 fps.
- [ ] It looks right with reduced motion, with Pause motion, without JS, and printed.

**Accessibility**

- [ ] Text meets 4.5:1 (3:1 for ≥ 24 px, or ≥ 18.66 px bold) on its actual surface, in whichever garden it sits in. Use the `*-text` steps for small text on a tint.
- [ ] A border that is a control's only boundary uses `border-strong` (≥ 3:1).
- [ ] Targets are at least **24 × 24 px**, and **44 px on key flows** (primary CTAs, navigation, consent, the mobile menu, dialogs). `Button` `md` and `lg` qualify; `sm` (36 px) is for dense desktop rows only.
- [ ] Hover styles use `can-hover:`; there is `active:` feedback for touch; focus uses the global ring (or `ring-focus`).
- [ ] Disabled, loading and error states exist where the control can be in them.
- [ ] External links carry the cue (§5.3); decorative SVGs and canvases are `aria-hidden`.
- [ ] Illustrative content carries `<Badge status="example" />`; no invented numbers, dates or names.
- [ ] Tracked CTAs carry `data-cta`; sections worth counting have a stable `id`.

## 8. Known gaps and follow-ups

### 8.1 F-08: the deferred token codemod

> **Done 2026-10-22.** The map below was applied across `src/` (63 files), and `eslint.config.mjs` now has the guard: one-off font sizes under 40px, off-scale radii, two-digit arbitrary z-indexes, the two caps trackings, `border-line/[…]` alphas and elevation `shadow-[…]` fail lint. Section, Nav, AtAGlance and the hand-written page wrappers use `Container` / `px-gutter`; `Section` uses `py-section` and `mb-header`. A new `z-sheet` (49) layer holds the mobile menu sheet.
>
> Choices that differ from the table: 11px *text* became `text-label` (12px); only `aria-hidden` art (GardenMock, ProductArt, CustodyDiagram, the easter eggs) keeps `text-micro`. Wordmarks in the ecosystem strip are `text-body`, not `text-lead`. 28/32px panel radii are now `rounded-panel` (24px).
>
> Left on purpose: `src/components/roadmap/*` (frozen until the owner re-dates it; the guard ignores it), the decorative 40px and 96px numerals, BasketOrbit's fluid `clamp(12px,1.4vw,16px)`, `z-[1]` in DecisionPipeline, the four one-off trackings, the leaf glow and ring shadows (effects, not elevation), and `.prose-legal`'s px sizes in `globals.css`.

The tokens exist, but most components predate them. When this was written, the code still had **about 190 arbitrary font sizes** (172 `text-[…]` utilities across 46 files, plus px sizes in `.prose-legal` and a few inline styles), alongside 21 `shadow-[…]`, 14 `rounded-[…]`, 6 `z-[…]`, about 125 `line/[0.0x]` alphas, 38 `tracking-[…]` and 71 `rounded-xl/2xl/3xl`. `<Container>` has 6 uses against 9 hand-written `mx-auto … max-w-page px-5 … sm:px-8` copies (Section, Nav, Hero, AtAGlance, the mobile menu, the legal, error and 404 pages). The plan is the migration map from B §3.10, as one codemod after the Tier 2/3 merges, followed by a baseline screenshot comparison at 375 and 1280:

| Old | New |
|---|---|
| `border-line/[0.05…0.08]`, `divide-line/[0.0x]` | `border-subtle` / `divide-subtle` |
| `border-line/10`, `/12`, `/15` | `border` |
| `border-line/30…/50` where the border is the affordance | `border-strong` |
| `bg-leaf/[0.06]`, `bg-sand/[0.06]`, `bg-cobalt/[0.05]`, `bg-caution/[0.07]` | `bg-*/6` |
| `font-mono text-[11px] uppercase tracking-[0.1x em] text-fg-subtle` | `.label-caps` |
| `text-caption font-semibold uppercase tracking-[0.12em]` (sans labels) | `text-label font-semibold uppercase tracking-caps` |
| `text-[11.5px]` | `text-label` |
| `text-[10px]`, `text-[10.5px]`, `text-[11px]` inside `aria-hidden` art | `text-micro` |
| `text-[12px]` … `text-[13.5px]` | `text-label` (numerals) / `text-caption` |
| `text-[14px]` … `text-[16.5px]` | `text-small` / `text-ui` / `text-body` |
| `text-[17px]` … `text-[20px]` | `text-h4` / `text-lead` |
| `text-[22px]` … `text-[28px]`, `clamp(22px,…,28/30px)` | `text-h3` |
| `clamp(24px,…,34/36px)` | `text-display-sm` |
| `clamp(28…34px,…,42…56px)` | `text-display-md` |
| Footer `clamp(40px,5.5vw+12px,96px)` | `text-h1` |
| `rounded-3xl`, `rounded-[24/28/32px]` | `rounded-panel` |
| `rounded-2xl` on cards / `rounded-xl` on nested tiles | `rounded-card` / `rounded-control` |
| `shadow-[…]` | `shadow-e1` / `e2` / `e3` / `halo` / `inset-accent` |
| `z-50`, `z-[55]`, `z-[60]`, `z-[70]`, `z-30` | `z-nav`, `z-banner`, `z-overlay` / `z-toast`, `z-skip`, `z-tooltip` |
| `max-w-prose`, `max-w-2xl` on body paragraphs | `max-w-measure` |
| `mx-auto w-full max-w-page px-5 sm:px-8` | `<Container>` |
| `py-20 sm:py-24 lg:py-28` / `py-20 sm:py-24` | `py-section` / `py-section-sm` |
| `fill-[rgb(var(--fg-subtle))]` etc. | `fill-fg-subtle`, `fill-leaf` … |
| `text-leaf` for state, `text-negative`, `bg-cobalt` meters | `text-success`, `text-danger`, `bg-data` |
| `ease-in-soft`, `duration-400` (dead classes) | remove / `duration-base` |

F-08 also adds the ESLint guard (`no-restricted-syntax` on class literals matching `-\[\d+(\.\d+)?px\]|shadow-\[|rounded-\[|z-\[`). **It isn't in `eslint.config.mjs` yet**, so nothing stops new drift except review.

### 8.2 Other places the code contradicts the system

| Where | Problem | Fix |
|---|---|---|
| `ui/Section.tsx` | The shared band doesn't use its own tokens: `py-20 sm:py-24 lg:py-28`, `px-5 sm:px-8`, `mb-12 sm:mb-14`, `border-line/[0.07]`. | `py-section`, `Container`, `mb-header`, `border-subtle` |
| `globals.css` reveals, `ui/Reveal.tsx` | `[data-reveal]` uses literal 700 ms / 20 px; `Stagger` defaults to 70 ms with no cap. | `--dur-slow`, `--move-md`, `--stagger`, `min(…, --stagger-cap)` |
| `tailwind.config.ts` | F-09 (`future.hoverOnlyWhenSupported`) not done; about 87 bare `hover:` remain (ArrowLink, AutoplayToggle, the mobile-menu MotionToggle, GardenAsset …). | migrate to `can-hover:`, then enable the flag |
| Infinite loops | `animate-float` (CtaBand, TokenSpec, `/token`) never settles, against D-33. `Badge` live and LiveStatus pulse indefinitely (status indicators; decide whether they're exempt). | play once and rest, or record the exemption |
| Retired animations | `animate-enter-up` / `enter-fade` still used by CookieConsent and DesktopNav; `animate-stamp` and `morph-in` keep literal curves. | `animate-reveal` / `fade-in` / `pop-in` |
| Unused tokens | `--move-lg`, `--blur-max`, `--stagger-tight` and `--stagger` are defined but nothing reads them. | adopt in the codemod or drop |
| Dead / off-scale classes | `ease-in-soft`, `duration-400` (listed in `KNOWN_DEAD`); `duration-300/500/700` in five components. | duration tokens |
| Z-index | skip link `focus:z-[70]` (layout), easter eggs `z-[60]`, header and sheet `z-[49]`. | `z-skip`, `z-toast`, `z-nav` (the sheet needs a token just below nav) |
| Scrims and white chips | `bg-black` and `backdrop:bg-black/40` scrims; `bg-white` behind token logos. B proposed a `--scrim` token that doesn't exist. | add `--scrim`; decide whether logo chips stay white |
| Deprecated aliases | about 22 uses of `positive` / `negative` / `caution` remain. | `success` / `danger` / `warning` |
| Two icon sets | `ArrowLink` and others use `ui/icons.tsx` (16 grid, 1.6 stroke) beside `Icon` (20 grid, 1.5 stroke). `ArrowLink` also has `text-[14.5px]`. | move line icons to `Icon`; keep `icons.tsx` for brand glyphs |
| `GardenAsset` | `interactive` uses dead classes and bare `hover:`; `blend` is legacy. | remove the unused props |
| `lib/motion.ts` | `useCanvasLoop` is unused, and its 30 fps default breaks R4. | delete, or cap at 15 |
| `.prose-legal` | px font sizes (15.5, 24, 17, 13.5) and a 10 px radius. | `text-ui`, `text-h3`, `text-h4`, `text-caption`, `rounded-control` |
| Analytics | `cta_band` is a key section, but `CtaBand`'s `<section>` has no `id`, so its `section_view` never fires. Nothing dispatches `blok:error` yet (live hooks don't report). Two `track()` / `slug()` helpers exist (`explainers.ts` uses hyphens, `analytics.ts` snake_case; the second re-slugs, so output is consistent). `rebalance_lab_use` is missing from the table in `lib/analytics.ts`. | add `id="cta_band"`; emit `blok:error` from `useLive`; consolidate helpers; update the table |
| Targets | `SocialLinks` (40 px) sit in the CtaBand key flow; `CopyButton` and `AutoplayToggle` are 32 px. All clear 24 px. | consider 44 px on CtaBand socials |
| Rings | no `ringColor.DEFAULT`, so a bare `ring-2` falls back to Tailwind's blue. | always name a ring colour, or add a DEFAULT |
| `label-caps` adoption | used in 11 files; about 29 hand-written `font-mono text-[11px] … uppercase` labels remain. | codemod (§8.1) |
