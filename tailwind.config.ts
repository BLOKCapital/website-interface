import type { Config } from "tailwindcss";

/**
 * "Night garden" design tokens. Colours are CSS variables holding R G B
 * triplets (see src/app/globals.css) wired with `<alpha-value>`, so opacity
 * modifiers like `border-line/10` or `bg-leaf/15` work everywhere.
 *
 * Every foreground token is ≥ 5:1 against every surface token (measured).
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
        leaf: { DEFAULT: c("--leaf"), deep: c("--leaf-deep") },
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
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
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
      },
      animation: {
        "enter-up": "enterUp 700ms cubic-bezier(0.22,1,0.36,1) both",
        "enter-fade": "enterFade 600ms cubic-bezier(0.22,1,0.36,1) both",
        flow: "flow 1.2s linear infinite",
        float: "float 9s ease-in-out infinite",
        "pulse-ring": "pulseRing 2s cubic-bezier(0.22,1,0.36,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
