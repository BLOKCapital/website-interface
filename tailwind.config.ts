import type { Config } from "tailwindcss";

/**
 * Design tokens. Colours are CSS variables holding R G B triplets (see
 * src/app/globals.css) wired with `<alpha-value>`, so opacity modifiers like
 * `border-line/10` or `bg-leaf/15` work everywhere, and the same utilities
 * render the light "Day garden" by default and the dark "Night garden"
 * inside any `.theme-dark` scope.
 *
 * Every foreground token is ≥ 4.5:1 against every surface token in both
 * themes (measured).
 */
const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces, darkest to lightest.
        canvas: c("--canvas"),
        surface: c("--surface"),
        card: c("--card"),
        raised: c("--raised"),
        // Hairlines and dividers: always used with an alpha, e.g. border-line/10.
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
        bloom: c("--bloom"),
        cobalt: c("--cobalt"),
        // Semantic states.
        positive: c("--leaf"),
        negative: c("--danger"),
        caution: c("--caution"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Type scale. Display sizes use clamp() so headlines scale smoothly
      // between phone and wide desktop instead of jumping at breakpoints.
      fontSize: {
        eyebrow: ["12px", { lineHeight: "1", letterSpacing: "0.14em" }],
        caption: ["12.5px", { lineHeight: "1.5" }],
        small: ["14px", { lineHeight: "1.55" }],
        body: ["16px", { lineHeight: "1.65" }],
        lead: ["clamp(17px, 1.2vw + 12px, 20px)", { lineHeight: "1.6" }],
        h4: ["20px", { lineHeight: "1.3" }],
        h3: ["clamp(22px, 1.1vw + 17px, 28px)", { lineHeight: "1.2" }],
        h2: ["clamp(30px, 2.6vw + 18px, 52px)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        h1: ["clamp(40px, 5vw + 16px, 88px)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      maxWidth: { page: "1240px", prose: "68ch" },
      // Motion tokens (mirrored as CSS variables in globals.css): hovers are
      // fast, UI changes base, reveals slow. Popovers open slower than they close.
      transitionDuration: { fast: "150ms", base: "300ms", slow: "600ms" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        // Snappy, then settles: the signature curve for reveals and morphs.
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
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
        // Popover enter: scale 0.96 + 2px blur, the "morph" open state.
        morphIn: {
          "0%": { opacity: "0", transform: "scale(0.96)", filter: "blur(2px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
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
        "enter-up": "enterUp 700ms cubic-bezier(0.22,1,0.36,1) both",
        "enter-fade": "enterFade 600ms cubic-bezier(0.22,1,0.36,1) both",
        flow: "flow 1.2s linear infinite",
        float: "float 9s ease-in-out infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.22,1,0.36,1) infinite",
        "morph-in": "morphIn 350ms cubic-bezier(0.16,1,0.3,1) both",
        blink: "blink 1.05s steps(1) infinite",
        progress: "progress 4s linear both",
        stamp: "stamp 450ms cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
