import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Design tokens. Colours are CSS variables holding R G B triplets (see
 * src/app/globals.css) wired with `<alpha-value>`, so opacity modifiers like
 * `border-line/10` or `bg-leaf/15` work everywhere, and the same utilities
 * render the light "Day garden" by default and the dark "Night garden"
 * inside any `.theme-dark` scope.
 *
 * Every text token is ≥ 4.5:1 on every surface token in both themes
 * (measured; the table is in docs/audit/findings/B-visual-system.md §3.1).
 */
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  // Hover styles only on devices that can hover, so they don't stick after a tap (MOB-06, MOT-16).
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        // Surfaces, darkest to lightest.
        canvas: c("--canvas"),
        surface: c("--surface"),
        card: c("--card"),
        raised: c("--raised"),
        // Hairlines and dividers: always used with an alpha, e.g. border-line/10.
        // Prefer the border-subtle / border / border-strong roles below.
        line: c("--line"),
        // Text.
        fg: {
          DEFAULT: c("--fg"),
          muted: c("--fg-muted"),
          subtle: c("--fg-subtle"),
        },
        // Brand. Leaf is the one accent; sand is warm emphasis; bloom and
        // cobalt are reserved for data and state, never decoration.
        leaf: { DEFAULT: c("--leaf"), deep: c("--leaf-deep"), hover: c("--leaf-hover") },
        sand: c("--sand"),
        // `-text`: the darker step for small text on the tone's own tint.
        bloom: { DEFAULT: c("--bloom"), text: c("--bloom-text") },
        cobalt: c("--cobalt"),
        // Semantic roles: name the meaning, not the hue.
        accent: { DEFAULT: c("--accent"), hover: c("--accent-hover"), fg: c("--on-accent") },
        emphasis: c("--emphasis"),
        data: c("--data"),
        progress: { DEFAULT: c("--progress"), text: c("--progress-text") },
        success: c("--success"),
        warning: { DEFAULT: c("--warning"), text: c("--warning-text") },
        danger: c("--danger"),
        // Deprecated aliases: use success / danger / warning.
        positive: c("--leaf"),
        negative: c("--danger"),
        caution: { DEFAULT: c("--caution"), text: c("--caution-text") },
      },
      // Tint and hairline steps. Without 12, `border-line/12` and
      // `bg-line/12` generate no CSS at all (VIS-01).
      opacity: { 6: "0.06", 7: "0.07", 8: "0.08", 12: "0.12" },
      // A bare `border` (and divide-*) is the default hairline, never
      // Tailwind's grey, in either garden: --line re-resolves per scope.
      borderColor: {
        DEFAULT: "rgb(var(--line) / var(--a-border))",
        subtle: "rgb(var(--line) / var(--a-border-subtle))",
        strong: "rgb(var(--line) / var(--a-border-strong))",
      },
      // The focus colour for components that draw their own ring
      // (`ring-2 ring-inset ring-focus`, `outline-focus`); per scope.
      ringColor: { DEFAULT: c("--focus-ring"), focus: c("--focus-ring") },
      outlineColor: { focus: c("--focus-ring") },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      // Type scale, in rem so it follows the reader's browser font size
      // (px values below are at the default 16px). Display sizes use clamp()
      // so headlines scale smoothly between phone and wide desktop instead of
      // jumping at breakpoints. Register every name in src/lib/utils.ts.
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1.3" }], // 11 · text inside aria-hidden illustrations only
        label: ["0.75rem", { lineHeight: "1.2" }], // 12 · caps labels, numerals, chips
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.14em" }], // 12
        caption: ["0.8125rem", { lineHeight: "1.5" }], // 13
        small: ["0.875rem", { lineHeight: "1.55" }], // 14
        ui: ["0.9375rem", { lineHeight: "1.45" }], // 15 · buttons, card body, step labels
        body: ["1rem", { lineHeight: "1.65" }], // 16
        lead: ["clamp(1.0625rem, 0.75rem + 1.2vw, 1.25rem)", { lineHeight: "1.6" }], // 17 → 20
        h4: ["1.25rem", { lineHeight: "1.3" }], // 20
        h3: ["clamp(1.375rem, 1.0625rem + 1.1vw, 1.75rem)", { lineHeight: "1.2" }], // 22 → 28
        // Stat figures and feature-card titles: between h3 and h2, so a card
        // title never matches the section heading above it.
        "display-sm": ["clamp(1.5rem, 1rem + 1.6vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }], // 24 → 36
        "display-md": ["clamp(1.75rem, 0.875rem + 2.4vw, 2.875rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }], // 28 → 46
        h2: ["clamp(1.875rem, 1.125rem + 2.6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }], // 30 → 52
        h1: ["clamp(2.5rem, 1rem + 5vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }], // 40 → 88
      },
      letterSpacing: { caps: "0.12em", eyebrow: "0.14em" },
      // Measure in ch so it scales with the text: 58ch is about 74
      // characters per line of Inter, 50ch about 63.
      maxWidth: {
        page: "77.5rem", // 1240: the site's one content width
        wide: "85rem", // 1360: dense data consoles on very wide screens
        prose: "68ch",
        measure: "58ch",
        "measure-narrow": "50ch",
      },
      // Layout rhythm (fluid; values in globals.css). The 4px scale stays for
      // component internals.
      spacing: {
        section: "var(--space-section)", // band padding, 80 → 112
        "section-sm": "var(--space-section-sm)", // CtaBand, footer, hero bottom, 64 → 96
        header: "var(--space-header)", // section header → content, 48 → 56
        gutter: "var(--gutter)", // page side padding, 20 → 32
        "pad-card": "var(--pad-card)", // card padding, 24 → 28
        "pad-panel": "var(--pad-panel)", // console / panel padding, 24 → 40
      },
      // Tailwind's own sm…3xl/full stay for now. Nested radius = outer − inset.
      borderRadius: {
        xs: "0.25rem", // 4 · focus on bare links, code, tiny marks
        tag: "0.375rem", // 6 · tags, keycaps
        control: "0.75rem", // 12 · inputs, nested tiles, chips
        card: "1rem", // 16 · cards
        panel: "1.5rem", // 24 · panels, consoles, feature cards
      },
      // Three heights plus two rings, all on the per-theme --shadow colour.
      boxShadow: {
        e1: "0 10px 30px -16px rgb(var(--shadow))", // resting raised tiles, tooltips, chips
        e2: "0 24px 60px -24px rgb(var(--shadow))", // menus, cookie banner, scrolled nav, hover lift
        e3: "0 32px 80px -28px rgb(var(--shadow))", // dialog, sticky product deck, featured tile
        halo: "0 0 0 4px rgb(var(--leaf) / 0.12)", // selected / active node
        "inset-accent": "inset 0 0 0 1px rgb(var(--leaf) / 0.35)",
      },
      // Named layers, lowest to highest.
      zIndex: {
        raised: "10",
        tooltip: "30",
        nav: "50",
        banner: "55",
        overlay: "60",
        toast: "65",
        skip: "70",
      },
      // Motion tokens: the values live in globals.css (--dur-*, --ease-*), so
      // CSS and utilities share one source. Name by intent: press instant,
      // hover fast, UI change base, entrance slow, one-off story scenic.
      transitionDuration: {
        instant: "var(--dur-instant)", // 90
        fast: "var(--dur-fast)", // 150
        base: "var(--dur-base)", // 240
        slow: "var(--dur-slow)", // 420
        scenic: "var(--dur-scenic)", // 700
      },
      transitionTimingFunction: {
        out: "var(--ease-out)", // settle: entrances, reveals, hovers
        expo: "var(--ease-expo)", // snap, then settle: morphs, menus, indicators
        in: "var(--ease-in)", // leave: exits
        inout: "var(--ease-inout)", // travel from A to B
      },
      keyframes: {
        // Transform only, from opacity 1: safe for the LCP element and CTAs.
        rise: { from: { transform: "translate3d(0,var(--move-sm),0)" } },
        // Below the fold only: starts invisible.
        reveal: { from: { opacity: "0", transform: "translate3d(0,var(--move-md),0)" } },
        fadeIn: { from: { opacity: "0" } },
        // Panel crossfade on tab switch; never 0, so the panel keeps its box.
        swap: { from: { opacity: "0.001", transform: "translate3d(0,var(--move-xs),0)" } },
        popIn: { from: { opacity: "0", transform: "scale(var(--scale-pop))" } },
        // Retired by the motion codemod; kept working until then.
        enterUp: {
          "0%": { opacity: "0", transform: "translate3d(0,18px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        enterFade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        // Traffic along a connector: pair with stroke-dasharray "4 6" (period 10).
        flow: { "0%": { strokeDashoffset: "20" }, "100%": { strokeDashoffset: "0" } },
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        blink: { "0%, 49%": { opacity: "1" }, "50%, 100%": { opacity: "0" } },
        // Auto-advance timers: pair with origin-left and an animation-duration.
        progress: { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
        // A verdict stamp landing on the terminal.
        stamp: {
          "0%": { opacity: "0", transform: "rotate(-8deg) scale(1.35)" },
          "60%": { opacity: "1", transform: "rotate(-8deg) scale(0.96)" },
          "100%": { opacity: "1", transform: "rotate(-8deg) scale(1)" },
        },
      },
      animation: {
        rise: "rise var(--dur-slow) var(--ease-out) both",
        reveal: "reveal var(--dur-slow) var(--ease-out) both",
        "fade-in": "fadeIn var(--dur-base) var(--ease-out) both",
        swap: "swap var(--dur-base) var(--ease-out) both",
        "pop-in": "popIn var(--dur-base) var(--ease-expo) both",
        // Retired by the motion codemod (use rise / fade-in / pop-in).
        "enter-up": "enterUp 700ms cubic-bezier(0.22,1,0.36,1) both",
        "enter-fade": "enterFade 600ms cubic-bezier(0.22,1,0.36,1) both",
        flow: "flow 1.2s linear infinite",
        float: "float 4.5s ease-in-out 1 both", // one gentle bob, then rest (D-33: loops settle within 5 s)
        "pulse-ring": "pulseRing 2s cubic-bezier(0.22,1,0.36,1) infinite",
        blink: "blink 1.05s steps(1) infinite",
        progress: "progress 4s linear both",
        stamp: "stamp 450ms cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      // One switch for "no motion": the OS preference OR the site's
      // Pause-motion toggle (html[data-motion="paused"], lib/motion-pref.ts).
      addVariant("motion-off", ["@media (prefers-reduced-motion: reduce) { & }", 'html[data-motion="paused"] &']);
      // Real hover only: a mouse or trackpad, never a tap that sticks.
      addVariant("can-hover", "@media (hover: hover) and (pointer: fine) { & }");
    }),
  ],
};

export default config;
