import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next still ships as a legacy "extends" preset, so we bridge it
// into ESLint 9's flat config via FlatCompat. Drop this shim once
// eslint-config-next exports a native flat config.
const compat = new FlatCompat({ baseDirectory: __dirname });

// Design-token guard (F-08): one-off values that have a token. Font sizes
// under 40px (bigger ones are decorative numerals), radii, two-digit
// z-indexes, the two caps trackings, hairline alphas and elevation shadows.
// Map in docs/DESIGN_SYSTEM.md §8.1. No "/" in these: esquery regexes can't hold one.
const TOKEN_DRIFT = [
  ["text-\\[([0-9]|[1-3][0-9])(\\.[0-9]+)?px\\]", "a font-size token (text-micro, label, caption, small, ui, body, lead, h4, h3 …)"],
  ["rounded(-[tblr]{1,2})?-(\\[[0-9]|xl\\b|2xl\\b|3xl\\b)", "a radius token (rounded-control, card, panel)"],
  ["\\bz-\\[[0-9]{2,}\\]", "a layer token (z-raised, tooltip, sheet, nav, banner, overlay, toast, skip)"],
  ["tracking-\\[0\\.1[24]em\\]", "tracking-caps or tracking-eyebrow"],
  ["(border|divide)-line.\\[", "border-subtle, border or border-strong"],
  ["shadow-\\[0_[0-9]+px_[0-9]+px_-[0-9]+px_rgb\\(var\\(--shadow\\)\\)\\]", "an elevation token (shadow-e1, e2, e3)"],
];
const tokenGuard = TOKEN_DRIFT.flatMap(([re, use]) =>
  ["Literal[value", "TemplateElement[value.raw"].map((node) => ({
    selector: `${node}=/${re}/]`,
    message: `One-off style value: use ${use}. See docs/DESIGN_SYSTEM.md §8.1.`,
  })),
);

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "tests/.output/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/**/*.{ts,tsx}"],
    // The roadmap is frozen until the owner re-dates it; it moves to tokens then.
    ignores: ["src/components/roadmap/**"],
    rules: { "no-restricted-syntax": ["error", ...tokenGuard] },
  },
];

export default config;
