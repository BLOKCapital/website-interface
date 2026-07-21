import type { Config } from "tailwindcss";

/**
 * Garden Journal tokens. Colors are wired with `<alpha-value>` so opacity
 * modifiers (`bg-moss/10`, `border-ink/10`) expand to
 * `rgb(var(--moss) / 0.1)` in compiled CSS.
 *
 * The CSS variables themselves live in src/app/globals.css as space-separated
 * R G B triplets (no rgb() wrapper).
 */

const c = (varName: string) => `rgb(var(${varName}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paper surfaces.
        paper: c("--paper"),
        "paper-warm": c("--paper-warm"),
        "paper-deep": c("--paper-deep"),

        // Ink.
        ink: {
          DEFAULT: c("--ink"),
          muted: c("--ink-2"),
          subtle: c("--ink-3"),
        },

        // Garden palette.
        moss: {
          DEFAULT: c("--moss"),
          deep: c("--moss-deep"),
          soft: c("--moss-soft"),
        },
        sage: c("--sage"),
        clay: {
          DEFAULT: c("--clay"),
          deep: c("--clay-deep"),
        },
        ochre: c("--ochre"),

        // Rules / borders driven by ink at low alpha.
        rule: c("--rule"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        script: ["var(--font-script)", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      transitionTimingFunction: {
        "in-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        150: "150ms",
        400: "400ms",
        800: "800ms",
        1200: "1200ms",
      },
      keyframes: {
        // Gentle paper-leaf sway — replaces synthetic float.
        sway: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(-1.4deg)" },
          "50%": { transform: "translate3d(2px,-6px,0) rotate(1.2deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(4px,-10px,0)" },
        },
        // Slow, leaf-like rotational breath for hero/illustration accents.
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.015)" },
        },
        // Pencil-stroke ink-in for understated emphasis.
        inkIn: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        // Editorial ticker — the track holds two identical copies, so a
        // -50% translate loops seamlessly.
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
      },
      animation: {
        sway: "sway 9s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
        breathe: "breathe 6s ease-in-out infinite",
        "ink-in": "inkIn 900ms cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
