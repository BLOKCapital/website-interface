# UI/UX suggestions, page by page

**For:** the owner · **Covers:** `redesign` (audit snapshot `5beb0ee`, docs `d911fab`) · 2026-10-11

This file brings together every UI/UX proposal from the Phase 1 audits (A–K) and the Phase 2 plan, sorted by page, so you can review them in one sitting. **Nothing here is new.** Each line points back to a finding ID in `docs/audit/findings/*.md`, and each approval status comes from the decision ledger in `PHASE3_BRIEF.md`.

**How to read the status labels**

| Label | Meaning |
|---|---|
| **Approved** | Approved on 2026-10-11 and in the Phase 3 backlog. The backlog or decision ID is given. "Polish" means it's in the last wave (Tier 4). |
| **Deferred: roadmap** | Touches the roadmap, which is frozen. |
| **Deferred: owner** | Needs a fact only you can supply (decision ID given). Nothing is guessed in the meantime. |
| **Deferred: counsel** | Legal wording, which counsel drafts. |
| **Deferred: X-11** | An optional storytelling sequence, deferred under D-33. |
| **Not scheduled** | A suggestion from a finding that no backlog item covers yet. It's yours to pick up or drop. |

Heights are measured at 375 px wide on the baseline build unless stated otherwise. Anything estimated is marked "est.".

---

## 1. Design direction

The redesign keeps what already makes BLOK distinct:
- the light **Day garden** palette as the default, with dark **Night garden** islands for consoles and the CTA band (light-only for launch, D-31; the footer stays light, D-21);
- the Inter / Newsreader / JetBrains Mono pairing, with the italic sand payoff on headings;
- the garden metaphor;
- the **honest-data posture**: sourced figures, "Example" badges, the "what's live, what isn't" ledger, and LiveStatus.

What changes is how the site behaves and the order things arrive in:
- **Calmer motion.** Text and buttons are there at first paint. Decorative loops settle within five seconds, explainers wait for the reader, and a site-wide Pause-motion switch backs up the OS setting.
- **Clearer hierarchy.** One type scale with two display steps, so a card title never outranks a section title. One card system, one badge vocabulary, and one focus ring that keeps the control's shape.
- **Trust evidence up front.** The hero gets a scoped audit claim and a risk line, Security is one click away in the nav, and `/security` leads with a launch-readiness checklist and a who-can-do-what matrix.
- **Mobile-first conversion.** A phone header with a permanent Discord button, a consent card that leaves the hero CTA visible, a shorter home page, and one consistent "Join the Discord" label.

---

## 2. Global UI

### 2.1 Header, nav and mobile menu

| Area | Today | Proposed | Why | IDs · status |
|---|---|---|---|---|
| Nav labels | Nav "How it works" opens `/protocol`, the hero's "How it works" jumps to `#explore` (4,900 px past the real `#how`), "Vote on Aragon", and "Governance › Governance". | Nav item **"Protocol"** (hint "How a Garden works, layer by layer"). "How it works" is kept for home `#how` only. Plus **"DAO on Aragon"** and **"How the DAO decides"**. | One label had three destinations. Visitors can't vote before the IDO, so "Vote" sets an expectation they can't act on. | UX-12, CRO-12, CRO-17, A11Y-39 · **Approved** (D-07) |
| Security in nav | Third item inside the Protocol dropdown. | A top-level **"Security"** link. | Trust is the main barrier, so the evidence should be one click from any page. | INS-09 · **Approved** (D-13) |
| Desktop menus | After opening a menu, Tab visits the other triggers before the panel. Escape only works with focus inside. A click after a hover closes the menu. On iPad, a tap outside may leave the 720 px panel open. | Tab goes from a trigger into its panel, and Escape works from anywhere. A click after a hover keeps the menu open, and a tap outside closes it. The panel morphs with `transform`, not width or height. | This is a WCAG 2.4.3 failure (P0) on the primary navigation. | A11Y-01, 06, 24; MOB-16; MOT-10 · **Approved** (G-01) |
| Phone header (< 640 px) | Logo and Menu only, with the Discord button hidden. A 40 px announcement bar folds away on scroll. Header plus bar take 105 px. | Logo, a **44 px Discord icon** and a 44 px Menu button. The bar is hidden below 640 px and its message moves to the hero status line. The header has a fixed height (the pill animates opacity/scale only). | After the first scroll, the next Discord control is about 94% of the way down home, and phones are the main social-traffic device. | UX-03, MOB-01, MOB-02, CRO-01, MOT-10 · **Approved** (D-05, G-03) |
| Landscape / short screens | The header is 113 px at the top of the page (30% of a 375 px-tall screen) and 68 px after scrolling. | A 52 px header that hides on scroll-down and returns on scroll-up. It uses `transform`, switches instantly when motion is off, and never hides while the menu is open. | In landscape, reading happens in about 300 px. | MOB-13, C §4.4 · **Approved** (D-05) |
| Mobile sheet | The sheet is 1,176 px tall, with "Join the Discord" at y = 1,024 (below the fold). Tab escapes into the hidden page behind it. Rotating an iPad with the menu open freezes scrolling. Same-page links leave the sheet open. Groups arrive up to 0.6 s late, and there are no index links. | A modal dialog with a focus trap and an inert background. **Discord is pinned to the sheet's bottom edge** with no delay, and the whole sheet is in by ≤ 250 ms. It closes on any link and when the desktop nav appears. Groups are labelled, a **BLOKC2 · BLOKC5 · BLOKC10** chip row sits under Indices, and `overscroll-contain` is set. | The primary action sits in the thumb zone, and keyboard and screen-reader users get a sensible order. | A11Y-02, 36; MOB-02, 03, 05, 21; MOT-13; UX-23 · **Approved** (G-02) |
| Announcement bar (≥ 640 px) | The link truncates ("Hear first on Di…" at 320) and clips its own focus ring. The hit area is 140×15 px, and dismissing drops focus to the top of the page. | The link is never truncated. It gets a full-height hit area and an inset focus ring, and dismissing returns focus to the logo. | Keyboard users can't see that the primary CTA is focused. | A11Y-04, 40; MOB-09d, 15 · **Approved** (G-03) |

**Not scheduled:** the Whitepaper as a nav item (UX-13). In Phase 3 it gets reached from the `/protocol` "Start here" card (P-04).

### 2.2 Cookie banner

| Area | Today | Proposed | Why | IDs · status |
|---|---|---|---|---|
| Tab order | Last in the DOM. A keyboard user needs about 106 Tabs to reach "Reject all", and at 375, 21 focus stops are fully hidden under it. | **First in the DOM** (the first Tab stop) while staying at the bottom of the screen. Focused elements scroll clear of it (`scroll-padding-bottom`). | Consent is a key flow, and focus shouldn't vanish under the card. | A11Y-03 · **Approved** (G-05) |
| Size on phones | 202 px at 375×667 and 241 px at 320×568. Together with the header, it covers 46% of the first screen. | A **one-row card of about 120 px**: one sentence plus the policy link, then **Reject · Accept · Manage** in a row (Manage is a ghost button of equal height). In landscape it becomes a full-width bar of about 64 px. | The hero CTA becomes visible on a first visit (see the sketch in §4.1). | MOB-01, G §3 · **Approved** (G-05) |
| Button weight | Accept is filled and Reject is an outline. | Reject and Accept **styled identically**. | The UK ICO asks for "equal prominence". | SEC-23 · **Approved** (D-15) |
| Categories and copy | "Marketing: Campaign attribution" has no tag behind it (it only flips Google ad signals). Analytics is described as "Anonymous usage". | **Marketing is removed**, and everyone is asked once more (the consent version is bumped). Analytics becomes "**Aggregated usage**", with an accurate detail line. | Consent given to a purpose that is described wrongly isn't informed consent. | SEC-05, CRO-21 · **Approved** (D-14, D-14b, G-06) |
| Focus and controls | Focus drops to the top of the page after a choice, or after Manage → Escape. The ON switch thumb measures 2.23:1. "Manage" is 53×22 px. In landscape, the dialog scrolls in a 147 px window. | Focus is restored to a sensible element. Switches get a white thumb, an OFF border of at least 3:1 and their descriptions attached. Buttons are 44 px. In landscape the dialog gets a compact header, 2-column categories and `dvh` units. | Keyboard and low-vision users can complete the choice without getting lost. | A11Y-12, 18; MOB-14, 15 · **Approved** (G-05) |

**Deferred: counsel:** the new Privacy Policy and the Cookie Policy rewrite (D-01; SEC-01, 02).

### 2.3 Footer

| Area | Today | Proposed | Why | IDs · status |
|---|---|---|---|---|
| Grouping | Protocol / Company / Resources / Legal. Token and Governance sit under Protocol, and there's no FAQ, Aragon or index link. | **Mirrors the nav: Protocol · Governance · Company · Resources · Legal.** Adds FAQ (→ `/contact#faq`), "DAO on Aragon" and `llms.txt`. | Gives one mental model of the site, and makes the FAQ findable. | UX-13, SEO-22 · **Approved** (G-11) |
| Palette | Light (`bg-canvas`), while the docs said dark. | **Stays light.** The docs get corrected. | The light footer gives the dark CTA band a clean edge. | VIS-23 · **Approved** (D-21) |
| Sign-off line | "It's crypto, but different." is 82 px at 1280 (96 px max), larger than every page's h1. | Set at the h1 size, or at `display-md` if it should recede. | The closing line shouldn't compete with the page title. | VIS-04 · **Approved** (F-04) |
| Operator line | "© BLOK Capital DAO LLC · Built on Arbitrum One". The registration appears only inside the AUP. | "BLOK Capital DAO LLC · Republic of the Marshall Islands · Reg. 10050-23", then Terms · Cookies · Cookie settings, plus Privacy once it exists. It reuses `siteConfig`, with no new facts. | Shows who operates the site, which a privacy notice needs anyway. | SEC-19 · **Approved** (G-11) |
| Risk line | None anywhere a newcomer looks. | One line: *"Crypto prices fall as well as rise, and code can fail. Read what can go wrong →"* (the CRO-07 draft, marked pending counsel). | Keeps risk next to the claims it qualifies. | CRO-07, SEC-20 · **Approved** as a draft (G-14); final wording **Deferred: counsel** (D-03) |
| Links and semantics | External links (Documentation, Whitepaper, GitHub, Audit reports) show no ↗. Column titles are `h2`, which adds 41 h2s across the site. | ↗ on every external item. Visually hidden `h2`, with the columns as `h3`. `prefetch={false}`. | Makes it predictable when a link leaves the site, and gives a clean heading outline. | UX-11, B→D note, PERF-07 · **Approved** (G-11) |
| Glyph canvas | Redraws every cell at 24 fps on every page. | ≤ 15 fps, redraws only changed cells, and settles about 6 s after coming into view. | Battery, and it frees the main thread right where the Discord CTA sits. | MOT-04 · **Approved** (G-15) |

The **Pause-motion switch** also lives in the footer (§2.7).

### 2.4 Buttons, cards, badges and focus

| Area | Today | Proposed | Why | IDs · status |
|---|---|---|---|---|
| Focus ring | The global rule forces a 6 px radius, so pill buttons snap to rectangles on focus (20 of 25 stops on `/protocol`). Dark-island elements on light pages get a mint ring at 1.59:1. Rings are clipped inside scrolling strips. | A 2 px leaf ring with a 3 px offset that **never changes the control's shape**. The ring colour is set per scope, so dark elements on light pages get the light ring. Inside clipping containers the ring is inset. | Keyboard users see a stable, visible ring everywhere. | VIS-02, MOT-09, A11Y-05, 16 · **Approved** (F-01) |
| Buttons | External buttons show no visible ↗ (94 external link instances have no cue). There's no loading state, and hover styles stick after a tap. | An automatic ↗, plus a muted host label on wallet-connecting destinations (e.g. "app.aragon.org ↗"). An equal-weight pair variant (for consent) and a loading state. Press feedback at 0.98 scale that also works on touch, and hover effects only on devices that can hover. | People can see before clicking where a link goes. | UX-11, SEC-17, MOB-06, MOT-16 · **Approved** (G-04, F-09) |
| CTA hierarchy | Seven labels for the Discord action, and two filled primaries in the desktop first screen. | **One button label: "Join the Discord".** The inline form is "Join the Discord to hear first →" (short form "Hear first on Discord →"), and Security keeps "Open a private ticket in Discord". One persistent Discord control per view, with all strings in one module. Under the CTA band: *"Not on Discord? Follow us on X."* | Keeps the one action from being diluted, and makes the analytics readable. | CRO-02, 10, 19 · **Approved** (P-12, D-19, G-09) |
| Cards | `Card` is used 19 times, alongside about 44 hand-built cards with 5 border strengths, 8 paddings and 4 radii. A dead `border-line/12` class renders a grey `#E5E7EB` ring (13.9:1 inside dark islands, right beside the Discord CTA), and the timeline rails vanish. | **One `Card`**, with **tone** (default · feature/dark · tint-cobalt · tint-sand · planned/dashed), **size**, **radius** (card 16 · panel 24) and **interactive**. Hairlines come from three border tokens. Card links are named by their heading instead of 165–269-character names. | Gives one calm surface system and removes off-brand grey. | VIS-01, 09, 11, 12; A11Y-31 · **Approved** (F-01, G-04, F-08) |
| Badges | "In testing" vs "In private testing", "Active" vs "Voting open", and three different ways to mark examples. The bloom and caution tones measure 4.15–4.40:1 on tinted surfaces. | **A fixed set: Live · In private testing · In progress · Planned · Done · Example · Voting open.** Darker text on the bloom and caution tones (≥ 4.5:1). | Status words carry the honest-data contract, so each needs one meaning. | CRO-26, 27; A11Y-10 · **Approved** (G-04, F-02) |
| Hint and Copy | Hint vanishes when you move onto it, and Escape doesn't close it. The Copy fallback says "Press ⌘C". | Hint becomes a **tap/click toggletip** that Escape closes. When copying fails, the address is selected and the button says so. Addresses use the EIP-55 checksummed form. | Works on touch, with a magnifier and on any OS. | A11Y-11, 37; MOB-23; SEC-16 · **Approved** (G-04) |
| Targets and colour | The bar link, Manage, Dismiss, Menu and Copy are all under 44 px. Day sand sits at 4.50:1 on raised surfaces. | Key-flow targets are 44 px and everything else at least 24 px. Day sand goes from `#8A6726` to `#836122` (AA headroom, same hue). | Prevents mis-taps on the primary and consent actions, and gives contrast headroom. | MOB-15, A11Y-32, VIS-08 · **Approved** (D-22) |

### 2.5 Type scale

| Area | Today | Proposed | Why | IDs |
|---|---|---|---|---|
| Sizes | 191 arbitrary sizes (35 distinct values) beside 207 token uses, all in px. | A **rem scale** with a token for every size. The h1, h2 and lead curves are unchanged. | Lets the type change in one place, and respects the browser's font-size setting. | VIS-03 |
| Hierarchy | There's no step between h3 (28 px) and h2 (52 px), so card titles compute at 51 px, the same as section h2s. | **`display-sm` (24→36)** and **`display-md` (28→46)** for stat figures and feature titles, capped below h2. The h3 minimum rises to 24 px. | The eye can tell a section start from a card. | VIS-04 |
| Labels | Four or five caps-label styles, most of them 11 px mono with mixed tracking. | **One `.label-caps`**: mono, 12 px, 0.12em. 11 px is kept only inside decorative art. | Data labels on a finance site get read closely. | VIS-05 |
| Measure | `68ch`, which is about 85 characters per line. 25 of 37 User Agreement paragraphs run over 75. | **`58ch`** (about 74 cpl), and `50ch` for small text. | Long policies become readable. | VIS-06 |
| Fonts | Mono labels first render in Arial, then reflow. Newsreader loads an unused weight. | A mono fallback stack, and Newsreader 400 only. Measured saving: about 74 kB per page. | No visible flash of unstyled text (FOUT), and a faster first paint. | VIS-07, PERF-02 |

Computed sizes (px):

| Token | 375 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| h1 | 40 | 54.4 | 80 | 88 |
| h2 | 30 | 38 | 51.3 | 52 |
| display-md | 28 | 32.4 | 44.7 | 46 |
| display-sm | 24 | 28.3 | 36 | 36 |
| h3 | 24 | 25.4 | 28 | 28 |
| h4 / lead | 18 / 17 | 19.8 / 20 | 20 / 20 | 20 / 20 |

Body copy is 16 px, small text 14, captions 13, and labels and eyebrows 12. **Status: Approved** (F-03, F-04; the codemod F-08 runs after the page work merges).

### 2.6 Motion feel: what you'll see

| Moment | Today | What you'll see after | IDs · status |
|---|---|---|---|
| Page load (hero) | The lead and CTAs fade in from invisible, which adds about 690 ms to LCP on `/`. The hero takes about 1.65 s to settle, and the buttons can be clicked while still invisible. | **Text and buttons are there at first paint** and rise 8 px. The badge, eyebrow and chips fade in up to 150 ms later, and everything is settled by about 700 ms. h1 words start readable (grey) and ink to full colour, with no blur. | MOT-01, PERF-01 · **Approved** (D-32, G-10) |
| Scrolling | Reveals rise 20 px, and uncapped staggers can take up to 1.19 s. The home "third option" statement starts at 3.2:1. | Reveals rise 16 px in 420 ms, with staggers capped at 300 ms. **Data being read (prices, tables, allocations) is never hidden.** The statement starts at 5.4:1. | C §4.4, VIS-17 · **Approved** (F-06, P-03) |
| Decorative loops | About 52 infinite animations run on home at 1280, including off-screen. Flows dash forever, and the index orbit turns for 160 s. | Each illustration **plays briefly, settles within 5 s on a meaningful still frame**, and replays on hover or focus. Loops pause off-screen, with at most 4 in view. | MOT-02, 03 · **Approved** (D-33, X-10) |
| Canvases | The footer and CTA band redraw at 24–30 fps, costing 279–514 ms of main-thread time per second. | ≤ 15 fps, settling about 6 s after coming into view, and skipped when Save-Data is on. | MOT-04 · **Approved** (G-15) |
| Explainers | On touch, autoplay continues after a tap. Panel heights jump by 113–193 px. Tab switches replay 450 ms entrances and re-stagger prices. A RulesDemo pick takes 2.4–3.8 s to reach its verdict. | **No autoplay on touch or below `lg`.** Any input stops autoplay and shows "Resume". Heights are reserved, and panels switch with a 240 ms crossfade and no stagger. A picked RulesDemo scenario reaches its verdict in ≤ 800 ms. | UX-06, MOB-04, 10, 11; MOT-05, 06, 11 · **Approved** (D-12, G-12) |
| Numbers | Count-ups show "0B" and "Decimals 0" until you scroll. | Small and spec figures **just appear**. A live value that changes gets a faint leaf tint (colour only). | MOT-12, 17 · **Approved** (D-34, G-12) |
| Hover and press | 300 ms lifts stick after a tap on phones. | Colour changes at 150 ms. A 2 px lift on pointer devices only, a 0.98 press everywhere, and an instant focus ring. | MOT-16 · **Approved** (F-09) |
| Header and menu | The header pill animates height and padding over 600 ms, and menu items cascade for up to 0.6 s. | A fixed-height header (opacity and scale only). The menu is fully in by 250 ms, with Discord shown immediately. | MOT-10, 13 · **Approved** (G-02, G-03) |
| Page change | A 520 ms page fade plus a replayed hero entrance, about 1.2 s in total. | One 240 ms fade with an 8 px rise. The hero doesn't replay. | MOT-15 · **Approved** (G-13) |

Timing tokens: **90 · 150 · 240 · 420 · 700 ms** (press · hover · panel · entrance · one-off story). Easing is named by intent: settle, snap-settle, leave and travel. No motion library; it stays CSS-first (plan §3.4).

**Deferred: X-11 (storytelling).** These are:
- the hero "value in, keys stay" draw (about 2.4 s);
- How it works showing the delta at each step;
- custody connectors drawn in claim order;
- rebalance presets;
- tokens assembling per index in place of the orbit.

### 2.7 Pause-motion toggle

| | |
|---|---|
| **Today** | There's no site control. Only the OS reduced-motion setting and the per-widget pause buttons on ProtocolExplorer and RulesDemo exist, and DecisionPipeline has no pause at all (WCAG 2.2.2). |
| **Proposed** | A labelled switch, **"Pause motion"** (working label), in the **footer and the mobile menu**, with `aria-pressed`. It's remembered in this browser (`localStorage`, `blok:motion`) and applied **before first paint** as `html[data-motion="paused"]`, so motion never flashes. Paused behaves exactly like reduced motion: still frames, no autoplay, still canvases, final numbers and instant state changes. Per-widget pause buttons stay, and the global switch overrides them. |
| **Why** | It helps people with attention or vestibular needs who haven't set the OS preference, or can't, and it covers 2.2.2 site-wide. |
| **IDs · status** | A11Y-19, MOT-02, INS-12 · **Approved** (D-12, F-06). Reference: Ciechanowski's single global pause. We adapt the function only, not the WebGL rendering. |

---

## 3. Page by page

### 3.1 Home `/`

**Purpose:** say what a Garden is and that it isn't open yet, prove it can be trusted, and send people to the indices or the Discord.

**Proposed section order** (problem → how → proof → act; D-08 a–e approved, (f) declined, roadmap frozen):

1. **Hero:** primary "Explore the indices", secondary "Hear first on Discord", and a "How it works ↓" text link to `#how`. Then the status line, facts and risk line.
2. **At a glance:** unchanged content, as an accessible list.
3. **Why (Problem):** the statement plus the comparison table.
4. **How it works:** three steps. On phones there's a single mock.
5. **What you can do (Products):** three tiles with working links.
6. **The indices:** three cards linking to `/indices/*`. The full explorer stays on `/indices`.
7. **"Don't trust us. Check.":** the security pillars plus RulesDemo as hands-on proof (one section instead of two).
8. **Governance strip:** stats, the latest proposal, "As of {sync date}", and "All proposals" → `/governance`.
9. **Ecosystem logo strip** → `/protocol#ecosystem` (its position is confirmed in P-02).
10. **Built in public:** unchanged.
11. **Roadmap, Now / Next:** frozen and unchanged.
12. **FAQ** (5).
13. **CTA band.**

**Before / after at 375 px**

| Today (order · section) | Today px | After | After px (375) |
|---|---|---|---|
| 1 Hero | 1,222 | 1 Hero | ≈ 1,190 plus two new lines (est.; `pt-24` saves 32 px) |
| 2 At a glance | 321 | 2 At a glance | 321 |
| 3 Why | 1,891 | 3 Why | 1,891 |
| 4 How it works | 2,590 | 4 How it works, one mock | ≈ 1,430 (est.: drops two of three ≈ 580 px mocks) |
| 5 Products | 2,230 | 5 Products | 2,230 |
| 6 Indices (IndexShowcase) | 1,944 | 6 Three index cards | smaller; not measured |
| 7 Explore (ProtocolExplorer) | 1,313 | moved to `/protocol` | 0 |
| 8 Rules (RulesDemo) | 1,094 | merged into 7 | (in 7) |
| 9 Happening now (board) | 1,790 | 8 Governance strip | smaller; not measured |
| 10 Security pillars | 2,147 | 7 Proof (pillars + RulesDemo) | below today's 3,241 combined; not measured |
| 11 Ecosystem (12 tiles) | 2,719 | 9 Logo strip | one strip; not measured |
| 12 Builders | 882 | 10 Built in public | 882 |
| 13 Roadmap | 1,741 | 11 Roadmap (frozen) | 1,741 |
| 14 FAQ | 704 | 12 FAQ | 704 |
| 15 CTA band | 538 | 13 CTA band | 538 |
| Footer | 1,188 | Footer | ≈ 1,188 |
| **Page** | **24,312** | | **≈ 19,100 plus the logo strip, before the savings in rows 6–8 (est.)** |

Agent A's estimate of 15–16k px assumed D-08(f), the Builders and Roadmap merge, which you declined. P-02 re-measures, with targets of ≤ 2,000 DOM nodes and ≤ 32 kB of compressed HTML.

**Top changes**
- **Hero CTAs:** today "Explore the indices" and "How it works" (→ `#explore`), with no Discord path → **primary "Explore the indices"**, **secondary "Hear first on Discord"** (with the Discord icon), and **"How it works ↓"** as a text link to `#how`. UX-01, CRO-02, CRO-12, A11Y-39 · **Approved** (D-06, P-01).
- **Status line:** today only a badge → *"Not open yet. Gardens are in private testing."*, with **no date or quarter**. CRO-02 · **Approved** (P-01). The date is **Deferred: owner** (D-02).
- **Audit claim:** today "Audited by CredShields", although the index and rebalancer code isn't audited → **"Garden contracts audited by CredShields"**, linked to `/security#audits`. CRO-05, INS-01 · **Approved** (P-03). The single audit date is **Deferred: owner** (D-04).
- **Risk line under the hero facts:** today home mentions "risk" 0 times → one line linking to `/protocol#fees`. CRO-07, SEC-13, SEC-20 · **Approved** as a draft (G-14). Final wording **Deferred: counsel** (D-03).
- **First screen on phones:** today 46% chrome and no CTA visible → 28% chrome with the primary CTA visible (sketch §4.1). MOB-01 · **Approved** (D-05, G-05).
- **At a glance:** broken `dl` semantics, "Arbitrum One" clipped at 320 px, and arrows only on hover → a list with the label first, text that wraps, and arrows at half strength by default. A11Y-07, MOB-09a, MOB-19 · **Approved** (P-01, X-04).
- **Why:** the statement starts at 3.2:1, the table corner header is empty, and the table says "Open access" → the statement starts at 5.4:1, the corner header is named, and the column reads "A BLOK Garden (at launch)". VIS-17, A11Y-26, CRO-13 · **Approved** (P-03, P-07).
- **How it works:** three near-identical mocks on phones → **one mock**. The inert BLOKC switcher is styled as a label, and the mock gets an "Example" badge. UX-14, MOB-17, CRO-26 · **Approved** (P-02, G-04).
- **Products:** "professionally curated" → *"Components chosen by the team and approved by the DAO; weights set on-chain by market cap."* The Index Gardens tile → `/indices`. CRO-14, UX-23 · **Approved** (P-03, G-02).
- **Indices:** IndexShowcase (a near-copy of the `/indices` explorer) → **three index cards**. UX-09 · **Approved** (D-08c).
- **Explore:** ProtocolExplorer → `/protocol`, and `#explore` keeps working through an alias or link. UX-04 · **Approved** (D-08a).
- **Proof:** "Read the votes." and "Don't trust us. Check." ran back to back → one proof section. RulesDemo gets a reserved height, 2-column tabs on phones and a verdict in ≤ 800 ms, and it pauses on focus. UX-05, MOB-10, MOT-06, MOT-11, A11Y-20 · **Approved** (D-08d, G-12).
- **Governance:** today a full board with no "as of" date and raw on-chain text → a strip with title, status, meters and "As of {sync date}". UX-07, UX-15, CRO-23 · **Approved** (D-08e, P-08).
- **Ecosystem:** 2,719 px of single-column tiles → a logo strip with *"Integrations in our code, not endorsements."* The full section moves to `/protocol`. UX-04, CRO-22 · **Approved** (D-08b, P-03).
- **FAQ:** answers can't carry a button → an optional button under an answer (e.g. "Join the Discord"). CRO-11 · **Approved** (G-04).
- **CTA band:** its heading reads "plant aGarden" to screen readers → fixed, plus *"Not on Discord? Follow us on X."* A11Y-21, CRO-19 · **Approved** (G-09, D-19).
- **Audience routing:** three text links: "Follow an index → `/indices`" · "Build or manage strategies → `/protocol#builders`" · "Hold or vote $BLOKC → `/governance`". INS-11 · **Approved**, Polish (X-09).

**Reference patterns adapted (J)**
- **Wealthfront:** qualify a claim where it's made. We adapt this as the scoped audit claim, with a marker that links to `/security#audits`. *Not copied:* the grey small-print block, APY or return headlines, award badges, ratings, testimonials.
- **Safe / Morpho:** route each audience early. We adapt this as three plain text links. *Not copied:* illustrated audience cards, partner logos, their naming.
- **Ciechanowski:** demos move at the reader's pace. We adapt this so RulesDemo stops on any input. *Not copied:* WebGL/3D.

**Deferred or not scheduled**
- **Deferred: roadmap:**
  - the Roadmap section and Built in public stay as they are (the D-08(f) merge was declined);
  - the "Recently shipped" list (INS-10, after Linear's dated changelog). J proposed it in place of the roadmap's "Later" column, and it also needs real entries from you.
- **Deferred: owner:**
  - new FAQs and the top-5 order (D-10);
  - "announced on X first" vs Discord in Built in public (D-09).
- **Not scheduled:**
  - a hero lede that names the Garden before using it (CRO-15 §3.2);
  - a community-size line read at build time (CRO-30, your decision);
  - accordions on phones for the pillars (MOB-12).

### 3.2 Protocol `/protocol`

**Purpose:** the canonical "how it works": what a Garden is, its layers, the three products, what it costs and what can go wrong.

**Top changes**
- **Becomes the real "how":** today it's the nav's "How it works" but has no walk-through and no ecosystem, and it links back to `/#ecosystem` → **ProtocolExplorer becomes the centrepiece after the hero, and the Ecosystem section moves here**. The nav label becomes "Protocol". UX-04, UX-12 · **Approved** (D-08a, D-08b, D-07, P-04).
- **Anchors:** on desktop, home tiles land about 2,000 px past `#index`/`#yield`/`#gardeners`, because the ids sit on sticky cards → the ids move to non-sticky markers. UX-02 · **Approved** (P-04).
- **Explorer on touch:** a tap doesn't stop autoplay, there's 6.5 s per 80–100-word layer, and the height swings between 830 and 943 px → no autoplay below `lg`/touch, any input stops it and shows "Resume", dwell is set from word count, height is reserved, and tab orientation follows the breakpoint. UX-06, MOB-04, MOT-05, MOT-06, A11Y-35 · **Approved** (G-12, D-12).
- **Jargon:** four names for the smart wallet, with "facet" and "Diamond" undefined → a **6-term glossary** plus a Hint on first use. Prose says "smart wallet", and spec chips say "smart account (ERC-4337)". CRO-15 · **Approved** (P-04).
- **Start here:** adds the Whitepaper. CRO-24 · **Approved** (P-04).
- **Product cards:** card titles compute at 51 px, the same as the h2 → `display-md` (≤ 46 px). VIS-04 · **Approved** (F-04).
- **Ecosystem tiles (moved here):**
  - Today: a mono label overflows its tile at 1024 and 1280, logos and text wordmarks are mixed, CCTP sits in the wrong group, and ZeroDev links to the docs root.
  - Proposed: labels wrap, CCTP moves to "Network and data", ZeroDev gets a specific evidence link, and the marks become consistent.
  - IDs: VIS-10, MOB-09c, CRO-22, VIS-19 · **Approved** (P-03, X-04). Consistent marks need official or vector logos: **Deferred: owner** (D-23).
- **Custody diagram:** connectors dash forever → they settle within 5 s. MOT-02 · **Approved** (X-10). Drawing them in claim order is **Deferred: X-11**.
- **Wayfinding:** a numbered "On this page" list under the hero, and *"Next: Indices, how the baskets are built →"* above the CTA band. INS-07 · **Approved**, Polish (X-09).
- **CTA band:** a context variant, *"Read the code, then ask the people who wrote it."* CRO-18 · **Approved** (G-09).
- **Not scheduled:** an H1 of *"One wallet. Three ways to steer it."*, so it stops repeating home's "…a strategy on top." (CRO-25).

**Reference patterns adapted**
- **GOV.UK:** numbered contents and a "Next:" link. We adapt the on-page list and the next step. *Not copied:* the typeface and black header.
- **Ciechanowski:** one concept per demo, driven by the reader. *Not copied:* WebGL.
- **Morpho "Open by default":** BLOK already links the source, so we keep that.

### 3.3 Indices `/indices` and index detail `/indices/[id]`

**Purpose:** explain the three baskets, price them live with an honest status, and show the one method they share.

**Top changes**
- **De-duplicated detail pages:** every detail page repeats Methodology, RebalanceLab and DataAvailability (about 3,300 px at 375), and the BTC–ETH example contradicts BLOKC5 and BLOKC10 → each detail page keeps Composition, "Why it looks like this" and Related, plus *"Same method as every BLOKC index → /indices#methodology"*. RebalanceLab stays on `/indices` (or becomes index-aware). UX-08 · **Approved** (D-08g, P-06).
- **Index matrix on phones:** only the BLOKC2 column shows, and 187 px is hidden with no hint → it fits in 335 px using short headers (C2 / C5 / C10), or becomes 3 stacked cards. MOB-07 · **Approved** (P-06).
- **Formula:** cut off at "…= cir" (261 px hidden) and not scrollable by keyboard → wraps at the operators. MOB-08, A11Y-13 · **Approved** (P-06).
- **Factsheet and data:** adds *"Governed by: BLOK DAO (Aragon)"* and *"Rebalance: past 2% drift, at most daily, ≤ 0.5% value loss"*, plus a **"Download data (JSON)"** file built from the existing index data. INS-08 · **Approved** (P-06).
- **Live prices:**
  - Today: one bad feed blanks every price, the message blames Chainlink, and when offline the skeletons keep pulsing.
  - Proposed: only the failed rows show "—", the message reads *"Couldn't reach the Arbitrum network"*, and offline with no data shows "—".
  - IDs: UX-10, UX-17 · **Approved** (D-29, X-05).
- **Explorer:**
  - Today: the selected tab measures 1.2:1 (fill) and 2.36:1 (ring), the copy says "Click a token", and prices re-stagger on every switch.
  - Proposed: an indicator of at least 3:1, "Tap or select a token", a crossfade with no stagger, and a faint tint when a value changes.
  - IDs: A11Y-17, MOB-19, MOT-11, MOT-17 · **Approved** (G-12).
- **RebalanceLab:** the bar lags the slider, values read as "0" instead of "+0%", and the thumb is 16 px → bars move 1:1, the values get proper text, and the thumb is 28 px inside a 44 px hit area. MOT-07, A11Y-29, MOB-20 · **Approved** (G-12). User-pressed presets are **Deferred: X-11**.
- **Risk:** none on the index pages → a RiskNote above DataAvailability. CRO-07, SEC-20 · **Approved** as a draft (G-14). Wording is **Deferred: counsel** (D-03).
- **Closing:**
  - an index variant of the CTA band, *"{BLOKC5} opens with the public launch."*;
  - *"Spotted something wrong or out of date? Tell us in the Discord →"*.

  IDs: CRO-18, INS-13 · **Approved** (G-09, X-09).
- **Basket orbit:** the 160 s rotation settles within 5 s. **Approved** (X-10). Tokens assembling per index is **Deferred: X-11**.
- **Grid orphans:** PENDLE sits alone, and 5 items fall into 2 columns → the last odd item spans the row. MOB-18 · **Approved** (X-04).
- **Deferred: owner:** an "Expected" date column in DataAvailability, filled only where you commit to a date (INS-08). Index value and weights stay "Not published yet".

**Reference patterns adapted**
- **Our World in Data:** "About this data" and "Download data". We adapt this as per-figure provenance plus a static JSON file. *Not copied:* the citation and licence boilerplate, the chart UI.
- **Reserve:** the same spec line on every index, with the rule written as text. We adapt this as the factsheet rows. *Not copied:* Buy buttons, published weights, the performance tab, the partner list.

### 3.4 Security `/security`

**Purpose:** let a sceptic check, in about a minute, what's done, what isn't yet, and who can touch their funds.

**Top changes**
- **In the nav:** third item in a dropdown → a top-level link. INS-09 · **Approved** (D-13).
- **New "Launch readiness" checklist** under the hero (sketch §4.3):
  - Today: the gaps are disclosed honestly but spread across three sections and another page.
  - Proposed: 6–8 criteria, each marked Done / In progress / Planned with an icon plus text, a date only when one is known, and a proof link. It's driven by one data module.
  - IDs: INS-03 · **Approved** (P-05). Statuses must match what the site already states, and dates need you.
- **Contract registry:** today a single "In progress" card → a table of Contract · What it does · Address (copy + Arbiscan) · Source verified · Audit coverage · Upgrade path · Last change. Rows read **"Not deployed yet"**, never a placeholder address. The live $BLOKC row stays, with its checksummed address. INS-04, SEC-16 · **Approved** (P-05).
- **Who can do what:** five prose cards → an **actor × action matrix**, shown as one card per actor on phones, with each cell linking to the code that enforces it (sketch §4.3). INS-05 · **Approved** (P-05). Cell values get checked against the contracts before publishing. Delays and timelocks are stated **only if verified**, so none for now (**Deferred: owner**, D-25).
- **Official links and "Stay safe":** nowhere says "we never DM first", and handles appear only as icons → one section listing the literal domains, handles and addresses, with copy buttons and a last-checked date, plus a short safety notice. SEC-09, SEC-10 · **Approved** (P-05). You approve the wording and decide whether the app domain is listed.
- **Disclosure:** today a generic Discord invite with no safe harbour → a 5-line policy: scope, safe harbour, the 24-hour acknowledgement already promised, a coordinated-disclosure window, and *"we will never ask you to move funds"*. Plus ticket steps. SEC-15, UX-22 · **Approved** (P-05). The ticket channel names and a `security@` mailbox are **Deferred: owner** (D-18).
- **Audit cards:** the SolidityScan and Octane cards link to the vendors' homepages, and a badge is clipped at 768 px → *"Internal tooling · no public report"*, unless public reports exist, and 3 columns only from `lg`. SEC-27, MOB-09b · **Approved** (P-05).
- **RulesDemo** is also shown here. **Approved** (D-08d).
- **Deferred: owner:** the audit date, November or December 2024 (D-04).

**Reference patterns adapted**
- **L2BEAT:** a requirements checklist with a count, and each contract name linking to its explorer source. We adapt this as the readiness list and the registry links. *Not copied:* Stage 0/1/2, the risk rosette, red/amber/green colours, any implied rating.
- **Euler:** deployment checks, with monitoring as a named item. We adapt this as the "Source verified" column and as checklist rows that read "Planned" unless they're real. *Not copied:* "60+ engagements", the auditor-logo row, the bounty headline.
- **Morpho docs:** each role, what it can do, then its constraint. We adapt this as the matrix. *Not copied:* their role names, or timelock claims the contracts don't make.
- **Safe:** "Trust" as a top-level menu, and auditors linked to their reports. *Not copied:* their menu set, "Trusted by" walls, the "$60B+" figure.

### 3.5 Token `/token`

**Purpose:** state the $BLOKC facts, let people verify the live contract, and show the allocation, without selling a token.

**Top changes**
- **Address:** lowercase rather than EIP-55 → **checksummed**, grouped, with the first 6 and last 4 characters emphasised, plus *"Arbitrum One · chain ID 42161"*. SEC-16 · **Approved** (P-07).
- **Figures:** count-ups show "0B" and "Decimals 0" before you scroll → "10B" and "18" shown as they are. MOT-12 · **Approved** (D-34).
- **Utilities:** written as if live ("BLOKC is distributed…") → future tense with a "Planned" badge. CRO-13 · **Approved** (P-07).
- **Allocation strip:** server-rendered at zero width, so it stays blank until JavaScript runs, and one hover sweep makes 11 screen-reader announcements → drawn without JavaScript (revealed only when motion is allowed), with no chatter. MOT-08, A11Y-28 · **Approved** (G-12).
- **Hero:**
  - Today: a glow overlay swallows taps on the bottom of the CTA.
  - Proposed: the overlay passes taps through, and the coin image only rises (it's the LCP element).
  - IDs: A11Y-33, MOT-01 · **Approved** (P-07, G-10).
- **Loading state:** the skeleton has no accessible text → "Loading…" for screen readers. A11Y-14 · **Approved** (P-07).
- **Also approved (P-07):**
  - a key-facts block;
  - a RiskNote (draft; wording **Deferred: counsel**);
  - the CTA band stays generic and never says "hear about the IDO first" (CRO-18).
- **Deferred: roadmap:** the timeline order and statuses. Holders "vote" and "stake" before the IDO, and Q3 '26 still reads "NEXT" (TokenTimeline is frozen; D-02).
- **Deferred: owner / counsel:**
  - the "Is $BLOKC on sale now?" FAQ (D-10);
  - any "not an offer" or jurisdiction note (SEC-13).

**Reference patterns adapted:** L2BEAT's "contract name → explorer source" pattern, which the Arbiscan link next to the address already follows. **Avoided:** an IDO countdown, "Connect wallet", and any price or return claim (§5).

### 3.6 Governance `/governance`

**Purpose:** show how the DAO decides today, and keep the record of every proposal.

**Top changes**
- **Board swap:** today `/governance` shows the plain list and home shows the rich board → the **rich ProposalBoard moves here** (`#proposals`), and home gets a strip. UX-07 · **Approved** (D-08e).
- **Freshness:** an **"As of {sync date}"** stamp on every proposal surface, and one status label, "Voting open". UX-15, CRO-23 · **Approved** (P-08). A scheduled rebuild is an ops task (O-02).
- **Empty state:** "Proposals couldn't be loaded when this page was built" → *"Every proposal and vote lives on Aragon →"*. UX-16 · **Approved** (P-08).
- **Aragon labels:** today nine labels for one destination → "The DAO on Aragon", "All proposals on Aragon" and "See the members on Aragon", with an "app.aragon.org ↗" host label. CRO-17, SEC-17 · **Approved** (P-08, G-04).
- **Decision pipeline:**
  - Today: it advances every 2.6 s forever with no pause, a tap doesn't stop it, reduced motion shows 4 disabled buttons, and the connecting rail is invisible.
  - Proposed: a pause button; it stops on the first tap, plays once, then stops; no autoplay below `lg`; plain list items when motion is reduced or paused; a visible rail; the token moves by `transform`.
  - IDs: A11Y-08, A11Y-34, MOB-11, VIS-01, MOT-10 · **Approved** (G-12, F-01).
- **"Current phase" badge:** 4.31:1 → at least 4.5:1. A11Y-10 · **Approved** (F-02).
- **Deferred: owner:** one mono line per stage with its duration and pass rule (INS-06). These are read from the Aragon plugin and **stated only once verified on-chain** (D-25).
- **Not scheduled:**
  - per-proposal Aragon links (UX-07; the URL format is unverified);
  - a "How can I take part now? Discuss in the Discord" line on the Current-phase card (Lido, below).

**Reference patterns adapted**
- **Lido:** a duration and pass rule for every stage (waits on D-25), on-page contents, and a path for small holders. *Not copied:* Easy Track, Dual Governance, committees, Lido's numbers.
- **L2BEAT:** timestamped records. We keep "Synced from chain … UTC".

### 3.7 About `/about`

**Purpose:** why BLOK exists, its principles, the people, and the press kit.

**Top changes**
- **Governance claim:** "governed by people who actually use it. Not us." isn't true today → *"Community-owned, by design. Today the core members listed on Aragon vote. After the IDO, $BLOKC holders do, and then it stops being up to us."* CRO-06 · **Approved** (P-09).
- **Story heading:** the founder story has no heading → an H2 (e.g. "Why we built it"). UX-21 · **Approved** (P-09). The signature (a named founder, or rewritten as "we") is **Deferred: owner** (D-11).
- **Video:**
  - Today: a `youtube.com` embed that sets ad cookies even after "Reject all", a poster fetched from YouTube on page load, and focus lost on Play.
  - Proposed: `youtube-nocookie`, a self-hosted poster, a one-line notice on the play button, and focus moved to the player.
  - IDs: SEC-04, A11Y-23 · **Approved** (D-26, G-07). Reviewed captions and transcript text are **Deferred: owner** (O-07).
- **Principles:** the big decorative numerals are drawn with CSS, which removes false contrast errors. A11Y-15 · **Approved** (P-09).
- **Team:**
  - Approved (X-04): a grid that divides evenly, so one tile isn't left alone at 768 px.
  - Deferred: owner (D-11): roles and a consistent photo treatment (CRO-16, VIS-20).
- **Deferred: roadmap:** collapsing completed years in the 3,966 px roadmap (34% of the page).
- **Not scheduled:** a Whitepaper link in the story section (CRO-24 covers `/protocol` only).

**Reference patterns:** none adopted directly. **Avoided:** testimonials, and an empty "In the media" section (patterns 3 and 12 in §5).

### 3.8 Contact `/contact`

**Purpose:** send support, partnership, press and security questions to the right channel, and answer common questions.

**Top changes**
- **Ending:** today the page ends at the FAQ with no next step → *"Didn't find it? Ask in the Discord"*, with a button, and *"Not on Discord? Follow us on X."* UX-20 · **Approved** (P-10, D-19).
- **Safety notice** beside the Discord card: *we never DM first, and never ask for a seed phrase, private key or signature*. SEC-09 · **Approved** (P-10). You approve the wording.
- **FAQ:** reachable from the footer, and answers can carry a button. UX-13, CRO-11 · **Approved** (G-11, G-04).
- **Documentation tile:** the text "docs" in a circle → a document icon on the 20 px icon grid. VIS-18 · **Approved** (G-04).
- **Deferred: owner:**
  - a press/partners email (D-17);
  - confirming the "We reply within 24 hours" commitment (A, cross-agent note).

**Reference patterns adapted:** GOV.UK's "Report a problem with this page" becomes a one-line Discord link. *Not copied:* the form or survey. **Avoided:** facts that live only in Discord (pattern 10).

### 3.9 Legal `/legal/*`

**Purpose:** the policies, readable on a phone and printable. **Template changes only; the policy text is untouched.**

**Top changes**
- **Measure:** 76–90 characters per line → `58ch` (about 74). VIS-06 · **Approved** (F-04).
- **Contents on phones:** today only at the top of a 14,673 px page → a small sticky "Contents" button that reopens the list. UX-24 · **Approved** (P-11).
- **Fixes:**
  - "14. Governing Law `&amp;` Jurisdiction" is double-escaped;
  - a nested `aside` becomes a `div`.

  IDs: B note, A11Y-25 · **Approved** (P-11).
- **Breadcrumb:** "Legal" isn't a link, and `/legal` 404s → `/legal` redirects to the User Agreement, and one shared breadcrumb is used. UX-18 · **Approved** (D-28, G-10).
- **Print:** chrome hidden and URLs printed. MISS-02 · **Approved** (F-07).
- **Version and "What changed":** the template slot is **Approved**. The text is **Deferred: counsel** (SEC-26).
- **Deferred: counsel:** the Privacy Policy page, the Cookie Policy rewrite and UA §15 (D-01).

**Reference patterns adapted:** GOV.UK's numbered contents and printable version, adapted as the sticky Contents button and the print stylesheet. *Not copied:* GOV.UK's typography.

### 3.10 404 and error

**Purpose:** get a lost visitor back onto a useful path.

**Top changes**
- **404:** today two exits (Home, "How the protocol works") → adds Indices, Docs, Contact and *"Still lost? Ask in the Discord."*, and the second button becomes "Protocol". UX-19, CRO-28 · **Approved** (P-10).
- **Error page:** today only Try again and Home, with the whole section announced as an alert → adds *"If it keeps happening, tell us in the Discord."* Only the message is the alert, and there's a styled global error page. CRO-28, A11Y-38, MISS-07 · **Approved** (P-10, G-13).
- **Fewer 404s:** vanity redirects (`/whitepaper`, `/docs`, `/team`, `/audits`, `/legal`, uppercase index ids). MISS-10 · **Approved** (X-07, D-28).

**Reference patterns:** none. The page uses the site's own nav labels.

---

## 4. Wireframes (sketches, not to scale)

### 4.1 Home first screen, 375 × 667 phone, first visit (G §3)

```
SKETCH. BEFORE (today)                    AFTER (proposed)
+-------------------------------+ 0      +-------------------------------+ 0
|# Public launch . Hear first...| bar    | BLOK          [Discord] [Menu]| header
+-------------------------------+ 40     +-------------------------------+ 64
| BLOK                   [Menu] |        | badge: In private testing     |
+-------------------------------+ 105    | H1  Grow your crypto.         |
| badge: In private testing     |        |     Keep the keys.            |
| H1  Grow your crypto.         |        | Lead, 4-6 lines ............. |
|     Keep the keys.            |        | ............................. |
| Lead paragraph .............. |        | [    Explore the indices    ] | ~498
| ............................. |        | (Discord CTA just below fold) |
+-------------------------------+ 465    +-------------------------------+ ~547
| Cookie heading                |        | One sentence + policy link    |
| 2-3 lines of text             |        | [Reject] [Accept] [Manage]    | ~120
| policy link                   |        +-------------------------------+ 667
| [Reject all]   [Accept all]   |
| Manage                        |
+-------------------------------+ 667
chrome 307 px = 46%                      chrome ~184 px = 28%
no hero CTA visible                      primary CTA visible above the card
```

The numbers are G's measurements (before) and projections (after). In landscape the card becomes a bar of about 64 px and the header shrinks to 52 px.

### 4.2 Home at desktop (1280), proposed order

```
SKETCH. 13 blocks (was 15)
+--------------------------------------------------------------+
| 1 HERO  h1 + lead                    |   garden render       |
|   [Explore the indices]  [Hear first on Discord]             |
|   How it works (down)  .  status line . facts . risk line    |
+--------------------------------------------------------------+
| 2 AT A GLANCE   sourced figures, each linked to its source   |
+--------------------------------------------------------------+
| 3 WHY   statement  +  custodian / on your own / Garden table |
+--------------------------------------------------------------+
| 4 HOW IT WORKS   steps 1-3           |   sticky GardenMock   |
+--------------------------------------------------------------+
| 5 WHAT YOU CAN DO   3 product tiles -> /protocol anchors     |
+--------------------------------------------------------------+
| 6 THE INDICES   [ BLOKC2 ]  [ BLOKC5 ]  [ BLOKC10 ]  -> pages|  was IndexShowcase
+--------------------------------------------------------------+
| 7 DON'T TRUST US. CHECK.   pillars  |   RulesDemo (try it)   |  Security + Rules
+--------------------------------------------------------------+
| 8 GOVERNANCE STRIP  stats . latest proposal . as of [date]   |  was full board
|   All proposals -> /governance                               |
+--------------------------------------------------------------+
| 9 ECOSYSTEM LOGO STRIP  -> /protocol#ecosystem               |  was 12 tiles
+--------------------------------------------------------------+
| 10 BUILT IN PUBLIC (unchanged)                               |
+--------------------------------------------------------------+
| 11 ROADMAP  now / next  (frozen, unchanged)                  |
+--------------------------------------------------------------+
| 12 FAQ (5)                                                   |
+--------------------------------------------------------------+
| 13 CTA BAND (dark)   [Join the Discord]  [Read the docs]     |
|    Not on Discord? Follow us on X.                           |
+--------------------------------------------------------------+
moved to /protocol: ProtocolExplorer (#explore) and the full Ecosystem
```

### 4.3 `/security`: "Launch readiness" and "Who can do what" (J INS-03, INS-05)

```
SKETCH. Under the page hero (desktop)
+-- Launch readiness -------------------------------- as of [date] --+
| Status          Criterion                              Proof       |
| (v) Done        Garden contracts audited (CredShields) report ->   |
| (~) In progress Mainnet addresses published + verified #contracts  |
| ( ) Planned*    Index and rebalancer audited           -           |
| ( ) Planned     Bug bounty live                        -           |
| ( ) Planned*    Post-deploy monitoring                 -           |
| ( ) Planned     Public $BLOKC voting (after the IDO)   /governance |
+--------------------------------------------------------------------+
  icon + word, never colour alone . dates only when known (D-02, D-04)
  * not stated on the site today: owner confirms before publishing

+-- Who can do what ----------------------------------------------------------+
|                    Move funds  Rebalance  Install or      Pause new  Change |
|                    out                    upgrade facets  Gardens    fees   |
| You                Yes         .          .               .          .      |
| Index rebalancer   .           Yes (2%)   .               .          .      |
| Gardener (2027)    No          .          .               .          .      |
| DAO vote           .           .          Yes             .          Yes    |
| Security council   .           .          .               Yes        .      |
| BLOK Capital team  No          .          .               .          .      |
+-----------------------------------------------------------------------------+
  Filled cells = what the site claims today. "." = not stated; verify in code.
  Every cell links to the contract line that enforces it. Delays and timelocks
  are shown only if the contracts have them (D-25). The rebalancer's
  "Move funds out" cell waits on the pooled-rebalancing answer (CRO-08a, D-10).

Phone (375): one card per actor
+-- Security council ------------+
| Pause new Gardens    Yes   ->  |
| Move funds out       .     ->  |
| ...                            |
+--------------------------------+
```

---

## 5. Patterns we will not use (J, "Patterns to avoid")

1. **Unsourced live tickers or counters.** Every live figure keeps its source, the time it was read and a fallback state (LiveStatus).
2. **TVL, "assets secured", user or volume totals, or "30+ audits" counts.** BLOK has none of these before launch and won't imply any.
3. **"Trusted by" logo walls and testimonials.** Ecosystem tiles keep saying what each integration does, with a link to the code.
4. **Countdown timers and FOMO**, above all around the IDO.
5. **APY, return or backtest headlines.** The "no backtests as history" rule extends to every index page.
6. **Autoplay video, sound, or heavy WebGL or particle heroes.**
7. **Scroll-jacking.** Sticky sections stay only where native scroll and the keyboard still work.
8. **Neon on near-black, and tiny thin mono text.** Night garden islands still pass AA.
9. **"Connect wallet" as a marketing CTA, or any signature request before launch.** Discord and Docs remain the CTAs.
10. **Facts that live only in Discord.** The site stays the record, and Discord the conversation.
11. **Risk text hidden in the footer.** Risks sit next to the claims they qualify. The footer line is an addition, not the only place.
12. **Empty placeholder sections.** A section is left out until it has real content.

---

## Owner inputs these proposals wait on

| Input | Unblocks |
|---|---|
| Launch date, or "not dated yet" (D-02) | A date in the hero status line and the bar; readiness dates |
| True audit date (D-04) | One audit date on home, `/security` and the FAQ |
| Discord or X first (D-09) | Built in public and the CTA band copy |
| FAQ facts (D-10) | New FAQs and the home top-5 |
| Team roles and story signature (D-11) | About team and story |
| Press email (D-17) and `security@` (D-18) | Contact card and disclosure policy |
| Vector logo and official partner marks (D-23) | Consistent Ecosystem marks, icons |
| Aragon parameters and timelocks, verified on-chain (D-25) | Governance stage rules and matrix delays |
| Readiness statuses marked * in §4.3, Discord ticket channel names (UX-22) | Launch readiness and the disclosure steps |
| Counsel: Privacy Policy, Cookie Policy, UA §15, risk wording (D-01, D-03) | Legal pages and the final RiskNote text |
| Reviewed captions and transcript (O-07) | About video |
