# BLOK Capital — marketing site

Production-ready marketing site for BLOK Capital, a non-custodial on-chain wealth
management protocol on Arbitrum.

> "It's Crypto But Different."

This README covers what's in the repo today (scaffold + global nav/footer + Home
hero with owl + dashboard card), how to wire the Spline owl, where to swap in
live on-chain data, and the build order for the remaining sections.

---

## Stack

- **Next.js 15** · App Router · React 19 · TypeScript · React Server Components by default
- **Tailwind CSS** + CSS variables for design tokens
- **Framer Motion** (UI micro-interactions) · **GSAP + ScrollTrigger** (scroll storytelling) · **Lenis** (smooth scroll)
- **Spline** (3D owl, embed) · **React Three Fiber + drei** (Garden growth scene, section 1.3)
- **wagmi + viem** (on-chain reads) · **TanStack Query** (caching)
- **Lottie** (loading owl planting a seed, light illustrated moments)
- Deploys on **Vercel** with ISR

GSAP, R3F, Spline, Lottie, and wagmi are listed as deps and will be wired as the
relevant sections come online (build order below).

---

## Setup

```bash
pnpm install     # or npm/yarn
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

### Env

| var | purpose |
|---|---|
| `NEXT_PUBLIC_ARBITRUM_RPC` | Arbitrum One RPC for `viem` reads |
| `NEXT_PUBLIC_BLOKC_TOKEN` | $BLOKC contract address |
| `NEXT_PUBLIC_SUBGRAPH_URL` | BLOK subgraph for TVL / Gardens / tx counts |
| `NEXT_PUBLIC_SPLINE_OWL_URL` | Spline scene URL for the 3D owl mascot |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | analytics |

---

## File structure (today)

```
.
├── next.config.ts
├── tailwind.config.ts                # design tokens exposed via Tailwind
├── postcss.config.js
├── tsconfig.json
├── package.json                      # Next 15 / R3F / Spline / GSAP / Framer / wagmi
├── public/
│   ├── owl/
│   │   └── PLACEHOLDER_README.md     # how to wire the Spline owl
│   └── textures/
│       └── noise.svg                 # 3% overlay on dark surfaces
└── src/
    ├── app/
    │   ├── globals.css               # CSS vars, .eyebrow / .mono / .display / .glass / .noise
    │   ├── layout.tsx                # Nav + Footer + skip link, dark color-scheme, OG metadata
    │   └── page.tsx                  # Home — currently mounts <Hero /> (other 9 sections stubbed)
    ├── components/
    │   ├── nav/Nav.tsx               # transparent → backdrop-blur on scroll, mobile sheet
    │   ├── footer/Footer.tsx         # mega footer: sitemap, newsletter, audits, socials, lang
    │   ├── home/
    │   │   ├── Hero.tsx              # Section 1.1
    │   │   ├── DashboardCard.tsx     # Glassmorphic Garden card with donut + tx ticker
    │   │   └── LiveProofBar.tsx      # Server Component, awaits getProtocolStats()
    │   └── ui/
    │       ├── Button.tsx            # primary (green) / secondary (gold) / outline / ghost
    │       ├── Logo.tsx
    │       ├── SeedIcon.tsx          # custom two-tone seed
    │       ├── OwlMascot.tsx         # Spline if env set, else SVG fallback (blink + hover wink)
    │       ├── ParticleField.tsx     # CSS/SVG particles, drift behind owl
    │       └── AnimatedNumber.tsx    # IntersectionObserver + cubic ease-out count-up
    └── lib/
        ├── utils.ts                  # cn(), shortAddress()
        └── data/
            └── stats.ts              # getProtocolStats() — subgraph drop-in point
```

---

## Design system

CSS variables live in [globals.css](src/app/globals.css), exposed via Tailwind in
[tailwind.config.ts](tailwind.config.ts).

| token | value | use |
|---|---|---|
| `--bg-base` | `#15101c` | page background — deep midnight-eggplant, never pure black |
| `--bg-raised` | `#1f1828` | cards, panels |
| `--bg-elevated` | `#2a2236` | hover, modals |
| `--accent-primary` | `#5fd991` | living-green — Garden, primary CTA, focus ring |
| `--accent-primary-deep` | `#2f9e63` | deeper green for borders/glows |
| `--accent-secondary` | `#f5b54a` | sunrise-gold — roadmap pins, secondary highlights |
| `--accent-warm` | `#f17b5d` | warm coral — Garden Owner persona |
| `--accent-cool` | `#6ea8fb` | cool blue — Builder persona |
| `--text-primary` | `#ffffff` | body |
| `--text-muted` | `rgba(255,255,255,0.6)` | secondary copy |
| `--text-subtle` | `rgba(255,255,255,0.38)` | tertiary copy |
| `--border-soft` | `rgba(255,255,255,0.1)` | dividers |

Utility classes:
- `.eyebrow` — tracked small-caps (11px, 0.22em letter-spacing) for metadata
- `.mono` — JetBrains Mono with tabular-nums (numbers, addresses, tx hashes)
- `.display` — display font for headings
- `.noise` — adds 3% noise overlay to any dark surface
- `.glass` — glassmorphic surface with inset highlight + drop shadow

Motion easings exposed as Tailwind `ease-in-soft` and durations
`duration-150 / 400 / 800 / 1200`. Custom keyframes wired into Tailwind:
`animate-float / float-slow / breathe / pulse-dot / glow-pulse / ticker / blink / drift`.

### Fonts

The site references General Sans (display), Inter (body), and JetBrains Mono (mono)
via CSS variables — see the spec's "PP Neue Montreal OR Satoshi OR General Sans"
choice. Until the variable font files are added, the fallback stack renders a
sensible substitute. To add them: drop `.woff2` files into `public/fonts/` and
register them with `next/font/local` in [src/app/layout.tsx](src/app/layout.tsx),
then point `--font-display`, `--font-body`, `--font-mono` at the resulting CSS vars.

---

## Owl mascot pipeline

The owl is the brand's recurring 3D character. It blinks idle, winks on hover,
flies between pages during route transitions, and replaces every loading state.

The default render path is the in-house SVG fallback in
[OwlMascot.tsx](src/components/ui/OwlMascot.tsx) — eyes blink on a 6s loop and
the right eye winks on container hover.

To wire the real Spline owl: see
[`/public/owl/PLACEHOLDER_README.md`](public/owl/PLACEHOLDER_README.md). Set
`NEXT_PUBLIC_SPLINE_OWL_URL` and the embed swaps in automatically. The Spline
runtime is dynamic-imported so it isn't shipped to users who never see the owl.

---

## Live data wiring

`getProtocolStats()` in [src/lib/data/stats.ts](src/lib/data/stats.ts) returns
seed values today. To wire the real subgraph:

```ts
const r = await fetch(process.env.NEXT_PUBLIC_SUBGRAPH_URL!, {
  method: "POST",
  body: JSON.stringify({ query: `{ protocolStats { tvlUsd gardens txSettled } }` }),
  next: { revalidate: 60 },
});
const { data } = await r.json();
return data.protocolStats;
```

Then the live proof bar in the hero — and every other on-chain element on the
site — picks it up automatically (`<LiveProofBar />` is an async Server Component).

---

## Build order (remainder)

This scaffold ships sections **1.1, the global nav, and the global footer** for
the new direction. Remaining work, in priority order per the brief:

1. **Dashboard Preview** (`/preview`) — interactive sandbox, highest conversion
2. **1.3 Garden Metaphor** — signature R3F scroll-scrubbed grow scene (Seed → Sprout → Bloom)
3. Live on-chain data wiring (subgraph + wagmi)
4. **1.2 The Problem** — pinned 3-column comparison
5. **1.4–1.10** Home sections
6. **About** (`/about`)
7. **Features** (`/features`)
8. **Contact** (`/contact`) + easter eggs (Konami → owl in a hat, "wagmi" sticker)

Per-section components live under `src/components/<section>/` and are imported
into the corresponding page.

---

## TODO (placeholders to replace)

- [ ] Set `NEXT_PUBLIC_SPLINE_OWL_URL` and publish the Spline owl scene
- [ ] Add General Sans (or Satoshi/PP Neue Montreal), Inter Variable, JetBrains Mono font files to `public/fonts/`
- [ ] Add Lottie owl-planting-seed loader to `public/lottie/`
- [ ] Replace audit partner placeholder strings in [Footer.tsx](src/components/footer/Footer.tsx)
- [ ] Wire subgraph in [stats.ts](src/lib/data/stats.ts)
- [ ] Replace `https://app.blokcapital.io` link target if app subdomain differs
- [ ] Add `favicon.svg` to `public/brand/`

---

## Performance targets

Lighthouse targets per the brief: Performance ≥90 · Accessibility ≥95 · Best Practices ≥95 · SEO ≥95.

Performance approach:
- Spline runtime is dynamic-imported (only loads when env var is set).
- Particle field is pure CSS keyframes — zero JS animation cost.
- Dashboard card tilt uses a single `requestAnimationFrame` lerp loop, not per-frame React state.
- All ambient motion respects `prefers-reduced-motion` via [globals.css](src/app/globals.css).
- WebGL/R3F (section 1.3) will be lazy-loaded via `next/dynamic` with `{ ssr: false }`.
# blokc-website
# website-interface
