# SITE_MAP: BLOK Capital marketing site

Snapshot of `redesign` @ `5beb0ee` (2026-10-11). Every audit and implementation agent reads this file and `BASELINE.md` before starting.

## 1. Project context

The orchestration brief left these as placeholders. The values below are **inferred from the repo**. Items marked ⚠ need the owner to confirm them.

| Field | Value |
|---|---|
| Site / repo | https://blokcapital.io · `website-interface`, branch `redesign` (main = `main`) |
| Stack | Next.js 15.5.22 App Router · React 19.2 · TypeScript 5 · Tailwind 3.4.19 · `clsx` + `tailwind-merge`. No motion library: Framer Motion was removed on purpose and motion is CSS-first. (README still says "Framer Motion", which is stale.) |
| Rendering / hosting | `output: "export"`, a fully static export to `out/` for **Cloudflare Pages**. There are no server actions and no middleware, and all route handlers are `force-static`. Cloudflare reads `public/_headers` and `public/_redirects`. Images use a custom loader (`src/lib/image-loader.ts`), and Cloudflare Image Transformations is gated behind `NEXT_PUBLIC_CF_IMAGES=1`. |
| Business goal ⚠ | The product is pre-launch ("currently in private testing"). The site's job is to earn trust in a non-custodial protocol, explain how it works, and build an audience for the public launch. |
| Primary audience ⚠ | Crypto-native investors and DeFi users, prospective strategy managers and builders, and $BLOKC holders / DAO voters. Desktop-heavy research, with significant mobile traffic from X, Telegram and Discord links. |
| Primary conversion ⚠ | **Join the Discord** ("Join the Discord to hear first"). It appears in the announcement bar, the nav button, the mobile menu, the CTA band and the security disclosure. |
| Secondary conversions | Read the Docs · explore indices (`/indices/*`) · Whitepaper (DocSend) · vote/delegate on Aragon · GitHub / audits |
| Brand constraints | Keep BLOK's own palettes. The light **Day garden** palette is the default. Selected components keep the dark **Night garden** palette via `.theme-dark` (verified by grep): `AnnouncementBar`, nav menus/`NavFeature`, `Products` (featured tile), `IndexExplorer`/`IndexShowcase` (index console), `ProductStack`, `ControlMap`, `TokenSpec`, `DecisionPipeline`, `ProposalBoard`, `CtaBand`, and `Section` dark tone. **The footer is light** (`bg-canvas`). Tokens: leaf accent, sand/bronze emphasis, cobalt data, bloom state. Fonts: Inter (body), Newsreader (display serif, 400/500 + italic), JetBrains Mono (figures/addresses). The garden metaphor stays. **Honest data:** no invented figures, and illustrative content carries an "example" badge. |
| Do not touch (proposed) ⚠ | Live on-chain reads (`src/lib/live/*`: Arbitrum RPC, Chainlink feeds), consent semantics (`src/lib/consent.ts`, GA4 loads only after analytics consent), legal policy text (`src/lib/data/policies.ts`), token/index/proposal data values, `_redirects`. |
| Environment caveat | The owner often runs `next dev` on :3001. `next build` shares `.next/`, so **never build in the main checkout while dev is up**. Build in a worktree/copy instead (the baseline was built in a scratch copy). |

## 2. Commands

| Task | Command | Baseline result |
|---|---|---|
| Dev | `npm run dev` | owner runs it on :3001 |
| Build (static export → `out/`) | `npm run build` | ✅ 26 static pages, 15.2 s |
| Lint | `npm run lint` (eslint 9, `next/core-web-vitals`) | ✅ 0 errors, 2 warnings (`src/app/indices/[id]/page.tsx:19`, unused `components`, `sources`) |
| Type check | `npm run typecheck` | ✅ clean |
| Tests | none | **No test suite exists**: no unit, e2e or visual tests. Phase 4 relies on build + lint + typecheck + the capture scripts (see BASELINE.md §6). |
| Preview the export | `npx serve out` (cleanUrls) | used for the baseline at :4173 |

## 3. Routes

| Route | File | Purpose | Key sections / components (in order) |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Pitch + overview | `Hero` → `AtAGlance` → `Problem` → `HowItWorks` (`HowItWorksScroller`, `GardenMock`) → `Products` (`ProductArt`) → `IndicesSection` → `ExploreSection` #explore (`ProtocolExplorer`, `LayerStack`) → `RulesSection` (`RulesDemo`) → `HappeningNow` → `SecurityPillars` → `Ecosystem` #ecosystem → `BuiltInOpen` → Roadmap now/next #roadmap → FAQ #faq (5 of `faqs`) → `CtaBand` |
| `/protocol` | `src/app/protocol/page.tsx` | How it works / architecture | `PageHero` → `CustodyDiagram` → smart accounts / diamond contracts cards → `ProductStack` (#ids targeted by home `Products`) → `FeesRisks` → `CtaBand` |
| `/indices` | `src/app/indices/page.tsx` | Index family overview | `PageHero` (`TokenStack`) → `IndexExplorer` #explore → `IndexMatrix` → `Methodology` #methodology → `RebalanceLab` (only `<input>` on the site) → `DataAvailability` → `CtaBand` |
| `/indices/[id]` (`blokc2`, `blokc5`, `blokc10`) | `src/app/indices/[id]/page.tsx` | Single index detail | `PageHero` → #composition → `IndexExplorer` → `Methodology` #methodology → `RebalanceLab` → `DataAvailability` → other indices → `CtaBand` |
| `/security` | `src/app/security/page.tsx` | Contracts, controls, audits | `PageHero` → `StepFlow` → `ControlMap` → #contracts → audits → #disclosure (Discord) → `CtaBand` |
| `/token` | `src/app/token/page.tsx` | $BLOKC token | `PageHero` → `TokenSpec` #facts (`TokenContract` live) → utilities → `AllocationExplorer` → `TokenTimeline` → `CtaBand` |
| `/governance` | `src/app/governance/page.tsx` | DAO process + proposals | `PageHero` → `DecisionPipeline` #process → `ProposalList` / `ProposalBoard` (Aragon, Arbiscan links) → `CtaBand` |
| `/about` | `src/app/about/page.tsx` | Story, values, team, roadmap, press | `PageHero` → `ProductVideo` (YouTube) → `Principles` → values → `TeamPhoto` #team → `RoadmapTimeline` #roadmap → #press (brand kit) → `CtaBand` |
| `/contact` | `src/app/contact/page.tsx` | Channels + FAQ | `PageHero` → Discord primary card → social channel tiles → FAQ #faq |
| `/legal/[slug]` (`cookie-policy`, `acceptable-use`, `user-agreement`) | `src/app/legal/[slug]/page.tsx` | Policies | `PolicyTOC` (client, scroll-spy), `CookieSettingsButton` on the cookie policy, cross-links between policies |
| 404 | `src/app/not-found.tsx` | Not found | `GardenAsset`, links to `/` and `/protocol` |
| error boundary | `src/app/error.tsx` | Runtime error | button home |

**Metadata / machine routes:** `/sitemap.xml` (`sitemap.ts`: 13 URLs incl. legal), `/robots.txt` (`robots.ts`: allow all + explicit AI crawlers), `/manifest.webmanifest`, `/opengraph-image` (PNG, `_headers` forces the content type), `/icon.png`, `/apple-icon.png`, `/favicon.ico`, `/llms.txt`, `/llms-full.txt` (`src/lib/seo/llms.ts`).

**Redirects (`public/_redirects`):** `/features` → `/protocol`, `/preview` → `/` (301, with and without a trailing slash).

## 4. Global shell (every page)

`src/app/layout.tsx` renders, in order:
1. `RevealScript`: an inline script, first in `<body>`. It adds `html.js`, uses IntersectionObserver/MutationObserver to set `data-revealed` for `[data-reveal]`, `[data-reveal-group]` and `[data-split]`, and hides the dismissed announcement bar before paint.
2. Skip link → `#main`.
3. JSON-LD: `organizationSchema`, `websiteSchema` (`src/lib/seo/schema.ts`). Pages add their own schemas.
4. `Nav` (`nav/Nav.tsx`): `AnnouncementBar` (dark, dismissible, localStorage `blok:bar-dismissed`), `DesktopNav` (3 menu groups: Protocol / Governance / Company, plus Docs; `NavFeature` promo panels), `MobileMenu` (sheet), Discord button. Nav data: `src/lib/nav.ts`.
5. `<main id="main">` wrapped by `app/template.tsx`, which adds `.page-enter` on client-side navigation only.
6. `Footer` (light, `bg-canvas`, with the big "It's crypto, but different." sign-off): protocol, company, resource and legal links plus socials.
7. `EasterEggs`, `CookieConsent` (banner + preferences dialog with focus handling; "Reject all" and "Accept all" equally prominent), `Analytics` (GA4 `G-D3Q5JCYWJR`, injected only after analytics consent, Consent Mode v2 signals).

`<html>` sets `data-scroll-behavior="smooth"`. Viewport `themeColor #F7F8F4`, `colorScheme: light`.

## 5. Shared UI inventory (`src/components/ui`, `motion`)

`Button`, `ArrowLink`, `Badge`, `Card`, `CopyButton`, `CtaBand`, `FaqList`, `GardenAsset`, `Hint`, `Logo`, `PageHero`, `PillarIcons`, `Reveal`/`Stagger`/`RevealItem`, `Section` (tones), `SocialLinks`, `StepFlow`, `icons`.
Motion: `CornerMarks`, `CountUp`, `DotField`, `GlyphField`, `Scramble`, `ScrollInk`, `SplitText`, plus `src/lib/motion.ts`. Hooks: `src/lib/hooks.ts`.
Design tokens live in `tailwind.config.ts` (120 lines) and `src/app/globals.css` (620 lines, including the `.theme-dark` scope and keyframes).

**Data modules (`src/lib/data`):** audits, ecosystem, faqs, gardens, indices, milestones, pillars, policies, proposals, scenarios, socials, status, team, token.
**Live data (`src/lib/live`):** `rpc.ts` (Arbitrum RPC `arb1.arbitrum.io`), `feeds.ts` (Chainlink), `prices.ts` (30 s poll, 120 s stale), `useLive.ts` (visibility-gated polling).

## 6. Client islands (`"use client"`)

nav (`Nav`, `DesktopNav`, `MobileMenu`, `AnnouncementBar`) · `CookieConsent` · `Analytics` · `EasterEggs` · `template` · `error` · home (`HowItWorksScroller`, `GardenMock`) · explore (`ProtocolExplorer`) · guard (`RulesDemo`) · indices (`IndexExplorer`, `IndexShowcase`, `BasketOrbit`, `RebalanceLab`) · token (`AllocationExplorer`) · governance (`DecisionPipeline`) · live (`TokenContract`, `LiveStatus`) · about (`ProductVideo`, `TeamPhoto`) · legal (`PolicyTOC`) · motion (`GlyphField`, `Scramble`, `CountUp`, `DotField`) · `CopyButton`.

## 7. Key user flows

| # | Flow | Path |
|---|---|---|
| F1 | **Hear first (primary)** | Any page → announcement bar / nav "Discord" / CTA band → discord.com/invite/blokc (external) |
| F2 | Understand the product | `/` hero → "Explore" (#explore) or `/indices` → `/protocol` → `/security` |
| F3 | Evaluate an index | `/` IndicesSection or nav → `/indices` → `/indices/blokc5` → live prices, methodology, rebalance lab → Docs / Discord |
| F4 | Verify trust | nav Security → `/security` → contracts (Arbiscan), audits repo (GitHub), disclosure (Discord) |
| F5 | Token / governance | nav Governance → `/token` (live contract, allocation) → `/governance` → Aragon (vote/delegate) |
| F6 | Contact / support | `/contact` → Discord (the only support channel; no email inbox) → FAQ |
| F7 | Consent | first visit → banner → Reject / Accept / Preferences (dialog) → `/legal/cookie-policy` → "Cookie settings" reopens the dialog |
| F8 | Recovery | unknown URL → 404 → home / protocol; legacy `/features`, `/preview` → 301 |

There are **no forms, accounts, auth, checkout or email capture** on the site. The only form control is the range/number input in `RebalanceLab`.

## 8. External dependencies at runtime

Google Fonts are self-hosted by `next/font` at build time · GA4 (`googletagmanager.com`) only after consent · Arbitrum public RPC + Chainlink (price/token reads) · YouTube (`ProductVideo`, check whether it is a facade) · outbound links to Discord, X, Telegram, Warpcast, GitHub, YouTube, docs.blokcapital.io, DocSend, Aragon, Arbiscan, Figma.
