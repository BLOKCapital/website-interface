# J · Inspiration & pattern research

Agent J · `redesign` @ `5beb0ee` · researched 2026-10-11 · ID prefix `INS-`

## Scope & method

- Read SITE_MAP and BASELINE. Re-sliced the 1280px full-page screenshots for home, protocol, indices, indices_blokc5, security, token and governance into 2000px strips so they could be read, and viewed the home At-a-glance and Problem sections live on :4173, because the baseline capture misses them (see Cross-agent notes).
- Fetched 16 candidate sites with WebFetch on 2026-10-11 and kept the **11** that were live and useful: 6 in BLOK's industry and 5 best-in-class sites from other fields. Five were set aside (listed below with reasons). WebFetch returns page text, not pixels. So **this file describes structure, labels and content only, never visual styling or motion I could not see.**
- Each finding below is an **opportunity**. "Problem" is the gap in BLOK today. "Evidence" pairs a BLOK screenshot or file with the reference URL. Fixes describe a *function* to adapt within BLOK's palettes, fonts, garden metaphor, CSS-first motion and honest-data rules, plus what not to copy.
- The current site is already unusually honest: it has sourced figures, "Illustrative" badges, a "what's live / what isn't" table and "See the proof" links. Most opportunities therefore extend patterns BLOK already has rather than replace them.

## Findings (opportunities)

| ID | Page/Component | Problem | Evidence | User impact | Recommended fix | Effort | Priority |
|---|---|---|---|---|---|---|---|
| INS-01 | Home › Hero trust facts | The hero says "✓ Audited by CredShields" with no qualifier. The audit covers only the Garden contracts; the index and rebalancer code is unaudited, which `/security` says openly two pages later. | `src/components/home/Hero.tsx:11`; audit scope at `src/lib/data/audits.ts:12`; `home_1280.jpg` (hero); `security_1280.jpg` ("One published audit so far"). Refs: wealthfront.com (numbered footnote markers on each claim, with the disclosure next to the performance graphic); l2beat.com (caveats stated inline) | The most-read trust line claims more than the evidence supports. Crypto-native readers check, and a caveat they find later costs more trust than one stated up front. | Qualify the claim where it appears, e.g. "Garden contracts audited by CredShields · index review pending", or add a footnote marker beside it that links to `/security#audits`. Keep it to one line. **Don't copy** a block of grey legal small print at the foot of the page. | S | P1 |
| INS-02 | Roadmap (home #roadmap, /about#roadmap) + `/token` TokenTimeline | Milestones whose quarter has ended still read as current or next. "DAO Voting Live", "Index Expansion" and "Mainnet Protocol Launch" are Q3 '26 with status `future`, and four Q2 '26 items are still `current`. Today is 11 Oct 2026 (Q4). The token timeline marks "Q3 '26 NEXT". Nothing marks a slip. | `src/lib/data/milestones.ts:38-52`, `ROADMAP_UPDATED = "2026-09-23"` (:11); `home_1280.jpg` ("Where things stand"); `token_1280.jpg` (timeline). Refs: l2beat.com/scaling/projects/arbitrum (dated, timestamped update log; "part of the information might be outdated" notice); linear.app (dated changelog) | Stale dates read as missed deadlines, the opposite of "working in public". | Show slips openly: strike through the original quarter, give the new one, and add a one-line reason. Add a build-time warning when a milestone that isn't done has a quarter that has already ended. **The new quarters and reasons need owner input.** **Don't copy** a red alert banner; use the existing Badge tones. | S (+ owner) | P1 |
| INS-03 | `/security`, new block under PageHero | The pre-launch gaps are disclosed honestly but spread across three sections: contract addresses "In progress", index code not audited, bug bounty and contests "Planned", and core-member-only voting (on `/governance`). Nothing answers "what's done and what isn't yet?" at a glance. | `security_1280.jpg` (#contracts card, "Planned" card, audits heading); `governance_1280.jpg` ("Current phase"). Refs: l2beat.com/scaling/projects/arbitrum (requirements listed as "Met:" / "Issue:" with a count); euler.finance/security (deployment checks and post-deploy monitoring as named items) | Trust is the main barrier. A single checklist shows the remaining risk in seconds, and it gives people a reason to return or join the Discord as items move to done. | Add a "Launch readiness" checklist with 6–8 criteria: Garden contracts audited · index & rebalancer audited · mainnet addresses published and source-verified · bug bounty live · post-deploy monitoring · public token voting. Each shows Done / In progress / Planned (icon + text, never colour alone), a date if one is known, and a proof link. Drive it from one data module. **Don't copy** L2BEAT's Stage 0/1/2 names, risk rosette or red/amber/green scale, and don't score BLOK against their framework. | M | P1 |
| INS-04 | `/security` #contracts | The contracts section is a single "In progress" card. It doesn't show what will be published or where, so the verification flow (F4) ends in a paragraph. | `security_1280.jpg` ("Contract addresses · In progress"); `src/app/security/page.tsx`. Refs: euler.finance/security ("Deployment checks": bytecode matched to source commits, per-network table); l2beat.com (each contract name links to its explorer `#code` page, with implementation diff links) | Crypto-native readers expect a contract registry. An empty registry with honest "Not deployed yet" rows shows exactly what will appear and where to verify it. | Build a registry table from one data module with columns: Contract · What it does · Address (CopyButton + Arbiscan) · Source verified · Audit coverage · Upgrade path (Facet Registry / DAO) · Last change (tx). Before launch, rows read "Not deployed yet" and never show placeholder addresses. The live $BLOKC token row stays. **Don't copy** Euler's "60+ engagements" aggregate or its auditor-logo row. | M | P2 |
| INS-05 | `/security` "Who can change what" (ControlMap) | The section is five prose cards, so answering "can anyone but me move my funds?" means reading all of them. The home mock's "✓ Allowed / ✗ Never" rows show a better format, but only for one actor. | `security_1280.jpg` (control cards); `home_1280.jpg` (HowItWorks mock); `src/components/security/ControlMap.tsx`. Ref: docs.morpho.org/learn/concepts/vault/ (each role: what it can do and its constraint or timelock; "no single role can unilaterally harm users") | A scannable matrix is the fastest trust answer for DeFi users, and it backs up "Your assets never leave your wallet" directly. | Make an actor × action matrix. Rows: You · Index rebalancer · Gardener (2027) · DAO vote · Security council · BLOK Capital team. Columns: Move funds out · Rebalance · Install/upgrade facets · Pause new Gardens · Change fees. Cells read Yes / No / Only after a DAO vote, and each links to the contract line that enforces it. **State delays or timelocks only if the contracts have them** (verify first; if there are none, say so). On mobile, use one card per actor. **Don't copy** Morpho's role names or docs layout. | M | P2 |
| INS-06 | `/governance` DecisionPipeline (#process) | Propose / Discuss / Vote / Execute have no durations, quorum or pass rules. The proposals show 1-day windows and one executed "early execution" proposal, but the rules behind them aren't stated. | `governance_1280.jpg`; no quorum, threshold or duration text in `src/components/governance/*` or `src/app/governance/page.tsx` (grep). Ref: lido.fi/governance ("Regular process": a duration per stage, pass thresholds, vote start time) | DAO members and future token holders judge governance by its parameters, and leaving them out can look like hiding them. | Under each stage, add one mono line with the duration and the rule (minimum support, minimum participation, minimum duration, early execution on/off), **read from the Aragon plugin settings or linked to them**. Reuse the "Synced from chain" stamp from the proposal list. **Don't copy** Lido's extra tracks (Easy Track, Dual Governance, committees), and never hard-code values that haven't been verified on-chain. | M | P2 |
| INS-07 | `/protocol`, `/indices`, `/security`, home | Long pages have no "on this page" contents: home is 16,164 px at 1280 and 24,411 px at 375; `/indices` is 7,177 and `/protocol` 7,159. Every page also ends at the Discord CtaBand with no next step along the F2 path (protocol → indices → security). Only the legal pages have a TOC. | BASELINE §5 (page heights); `src/components/legal/PolicyTOC.tsx` (the only TOC); `protocol_1280.jpg`, `indices_1280.jpg`. Refs: gov.uk/universal-credit (numbered "Contents", "Next: Eligibility" link, printable version); lido.fi/governance (on-page TOC) | Desktop researchers and mobile visitors arriving from X or Discord want to jump to their question. A guided "next" keeps them on the trust path before they reach the CTA. | (1) Add a compact numbered "On this page" list under PageHero, using the existing section ids and reusing PolicyTOC's scroll-spy. (2) Add a one-line "Next: Indices, how the baskets are built →" link above CtaBand on each core page. Agent A decides the order. **Don't copy** GOV.UK's typography or header. | M | P2 |
| INS-08 | `/indices`, `/indices/[id]` (DataAvailability, factsheet) | Provenance is spread out. No block per figure gives source, update rule, last read and expected next update. There's no machine-readable export of the component, token and feed addresses. The factsheet leaves out "Governed by" and the rebalance rule. | `indices_1280.jpg` (DataAvailability); `indices_blokc5_1280.jpg` (factsheet: Components, Weighting, Prices, Network, Index value); no data files in `public/`. Refs: ourworldindata.org/grapher/share-electricity-renewables ("About this data": Source, Last updated, Next expected update, Unit; "Download displayed data"; CSV and JSON URLs); reserve.org (each index card shows Chain, Governed by and Inception, plus its weighting and rebalance rule as text) | Verifiers want to check addresses against Arbiscan in their own tools. An "Expected" date turns "No data yet" into a commitment. | Add an "Expected" column to DataAvailability, filled only where the owner commits to a date. At build time, generate a static `/indices/<id>.json` from `src/lib/data/indices` (components, token and Chainlink feed addresses, method, guardrails) and link it as "Download data (JSON)". Add "Governed by: BLOK DAO (Aragon)" and "Rebalance: past 2% drift, at most daily, ≤ 0.5% value loss" to the factsheet. **Don't copy** OWID's citation or licence text, or Reserve's weights and "Buy" buttons (weights aren't published yet). | M | P2 |
| INS-09 | Global nav (`src/lib/nav.ts`, DesktopNav, MobileMenu) | Security, the page that answers the main barrier, is the third item in the "Protocol" dropdown. It's never one click away. | `src/lib/nav.ts:28`; `home_1280.jpg` (nav: Protocol / Governance / Company / Docs). Ref: safe.global ("Trust" is its own top-level menu beside Products, Pricing and Resources) | One click to the trust evidence from any page, and the nav itself signals that security is a priority. | Make Security a top-level link, or a small "Trust" group (Security · Audits · Contracts · Report a vulnerability). Agent A owns the IA call. **Don't copy** Safe's menu set or labels. | S | P2 |
| INS-10 | Home "Where things stand" / `/about#roadmap` | The site shows plans (roadmap) and votes (HappeningNow) but no dated record of what has shipped: releases, audits, deployments, new facets. Before launch, a shipping record is the clearest proof of momentum. | `home_1280.jpg` (Now / Next / Later shows quarters only); `src/lib/data/milestones.ts`. Refs: linear.app (homepage preview of 4 dated changelog entries + "View all"); l2beat.com (timestamped update log) | Returning visitors see something new, and Discord gets a concrete reason ("discuss the release"). | Add a "Recently shipped" list of the 3–4 latest **real** entries, each with a date, one line and a proof link (GitHub release or tag, tx, or Aragon proposal). Generate it at build from GitHub releases or a data module, and link the full changelog. Use it to replace the low-signal "Later" column rather than adding page length. If there are too few entries, show fewer; never pad. **Don't copy** Linear's screenshot cards. | M | P2 |
| INS-11 | Home hero secondary row, or the nav promo panel | Three audiences (investors, builders and would-be Gardeners, token holders and voters) share one 16k-px story, and nothing early routes each to the right place. | `home_1280.jpg` (Hero → AtAGlance → Problem → HowItWorks …); SITE_MAP §1 audiences. Refs: safe.global ("Built for the teams crypto runs on": three audience cards); morpho.org (separate Institutions / Fintechs / Users sections) | Builders and voters reach their proof sooner instead of scrolling past investor content. | Add three text links: "Follow an index → /indices" · "Build or manage strategies → /protocol#builders" · "Hold or vote $BLOKC → /governance". Put them in the hero's secondary row or the NavFeature panel, replacing something rather than adding a section. **Don't copy** their illustrated cards or partner logos. | S | P3 |
| INS-12 | Explainers: ProtocolExplorer (LayerStack), RulesDemo | Both autoplay on a timer. Each has its own pause and respects reduced motion, but there's no site-wide motion control, so a reader studying a trace can lose it to the timer. | `src/components/explore/ProtocolExplorer.tsx:26,40`; `src/components/guard/RulesDemo.tsx:11,184`; `home_1280.jpg` ("Pause autoplay"). Ref: ciechanow.ski/mechanical-watch/ (reader-driven sliders and time scrubbing, one concept per demo, one global pause/unpause for all animations) | The trace is where trust gets built, so it should move at the reader's pace. A global control also helps motion-sensitive readers who haven't set the OS preference. | Open each explainer on step 1, paused, and advance on reader input (keep Prev/Next), or autoplay only once per visit. Add one footer toggle, "Pause animations", that sets `html[data-motion="paused"]` (stored in localStorage, wrapped in try/catch) and is honoured by CSS keyframes and the client islands. Route to C and D. **Don't copy** 3D/WebGL rendering: it breaks the CSS-first rule and adds to home's 942 ms TBT. | M | P3 |
| INS-13 | Ends of `/security`, `/indices`, `/token` | There's no easy way to report a wrong figure or a stale fact. Discord, the only channel, is pitched as "hear first", not "tell us if something's wrong". | `security_1280.jpg`, `indices_1280.jpg` (pages end at CtaBand). Ref: gov.uk ("Is this page useful?" / "Report a problem with this page") | Inviting corrections is a strong trust signal on a data-heavy, pre-launch site, and it's an honest extra reason to join the Discord. | Above CtaBand on data pages, add one line: "Spotted something wrong or out of date? Tell us in the Discord →", with its own analytics event (Agent I). No form, since the static export has no backend. **Don't copy** GOV.UK's form or survey banner. | S | P3 |

**Count:** P0 0 · P1 3 · P2 7 · P3 3.

## Reference library

All pages were fetched on 2026-10-11, and every pattern below is drawn only from the fetched text. "Don't copy" always includes: their layout, copy, illustrations, colours, logos and brand assets. BLOK keeps the Day garden default, Night garden components, Inter / Newsreader / JetBrains Mono, and CSS-first motion with reduced-motion support.

### Same industry

#### 1. L2BEAT: Arbitrum One project page
**URL:** https://l2beat.com/scaling/projects/arbitrum · **What:** an independent risk and maturity analysis of L2 networks. ✅ Fetched; the page is long, and I read the first 100k of 235k characters.
- **Pattern A: a requirements checklist with explicit "Met" / "Issue" lines and a count** ("4 requirements met"), plus a disclaimer that this is "an opinionated assessment of project maturity", not a security rating.
  - *Why it fits BLOK:* pre-launch, trust is the barrier, and readers want to know what's left. A checklist turns BLOK's scattered "in progress" notes into one honest view.
  - *Maps to:* INS-03, `/security`.
  - *Don't copy:* the Stage 0/1/2 framework or names, the risk rosette, sentiment colours, or any implied third-party rating.
- **Pattern B: timestamped change history.** "Ossification & Updates" lists dated changelog entries in UTC; "Past upgrades" shows a count, time since the last upgrade and an average interval; a top notice flags possibly outdated information.
  - *Why it fits BLOK:* it shows recency honestly.
  - *Maps to:* roadmap slip markers (INS-02), "Recently shipped" (INS-10), and the "Last change" column in the contracts registry (INS-04).
  - *Don't copy:* the dense data-dump layout or the severity tags.
- **Pattern C: each contract name links to its explorer source**, with "(diff)" links for implementation changes.
  - *Maps to:* INS-04.
  - *Don't copy:* L2BEAT's internal diff tool or wording.

#### 2. Euler: Security page
**URL:** https://www.euler.finance/security · **What:** the security overview of a DeFi lending protocol. ✅ Fetched.
- **Pattern A: "Deployment checks".** Bytecode is matched to source commits, and a per-network table counts the "bytecode-proven contracts", with a link to the deployment reports.
  - *Why it fits BLOK:* it moves the claim from "trust our addresses" to "check them yourself", which is BLOK's own "Check the work, not our word" promise.
  - *Maps to:* INS-04 (a Source verified / commit column).
  - *Don't copy:* the "60+" engagements headline, the auditor-logo row, or the bounty-size headline (BLOK has no bounty yet).
- **Pattern B: post-deploy monitoring and formal verification named as separate items**, each with its own link ("View verification records", "Explore monitoring and response").
  - *Maps to:* checklist rows in INS-03. BLOK's RulesDemo already does the "show the actual rule" part (see Keep).
  - *Don't copy:* claims BLOK can't back yet. Monitoring and formal verification appear only as "Planned" unless they're real.

#### 3. Lido: Governance overview
**URL:** https://lido.fi/governance · **What:** the governance explainer of a liquid-staking DAO. ✅ Fetched.
- **Pattern A: a process flow where every stage has a duration and a pass rule.** Research forum 7 days, off-chain 7 days, on-chain 5 days, plus a delay; votes start Wednesdays at 14:00 UTC; Snapshot passes with ≥ 5% of supply and a simple majority.
  - *Why it fits BLOK:* DAO members judge governance by its parameters.
  - *Maps to:* the DecisionPipeline (INS-06).
  - *Don't copy:* the extra tracks (Easy Track, Dual Governance, committees) or Lido's numbers. BLOK shows only what its Aragon plugin actually enforces.
- **Pattern B: an on-page table of contents** on a long governance page.
  - *Maps to:* INS-07.
- **Pattern C: a path for small holders**: requests can go to DAO Ops if a holder is below the proposal threshold.
  - *Why it fits BLOK:* while only core members vote, "how can I take part now?" has a real answer: discuss in Discord.
  - *Maps to:* the `/governance` "Current phase" card, with a Discord link that supports the primary CTA.

#### 4. Safe: Homepage
**URL:** https://safe.global/ · **What:** smart-account and multisig infrastructure. ✅ Fetched.
- **Pattern A: "Trust" is a top-level navigation menu**, beside Products, Pricing and Resources.
  - *Why it fits BLOK:* security is the barrier, so it should be one click away.
  - *Maps to:* INS-09.
  - *Don't copy:* the menu contents or labels.
- **Pattern B: a security block that names each auditor and links straight to the audit reports, security docs, bug bounty and status.**
  - *Why it fits BLOK:* BLOK already links the CredShields report; the same treatment should reach the scan tools' actual outputs, if they are public.
  - *Maps to:* `/security` audits (Agent H).
  - *Don't copy:* "Trusted by" logo walls, celebrity testimonials, or the unsourced "$60B+" figure. All three break BLOK's honest-data rule.
- **Pattern C: audience cards** ("Teams managing capital / operating protocols / building products", plus "Also serving … individuals").
  - *Maps to:* INS-11.
  - *Don't copy:* the "Cypherprise" naming, illustrations or card styling.

#### 5. Morpho: Homepage + vault concepts docs
**URLs:** https://morpho.org/ and https://docs.morpho.org/learn/concepts/vault/ · **What:** a lending network, plus its docs on vault roles. ✅ Both fetched.
- **Pattern A: a role list.** Each role (Owner, Curator, Allocator, Sentinel) gets one line on what it can do, then its constraint. Risk-increasing actions are timelocked; risk-reducing ones are immediate; "no single role can unilaterally harm users".
  - *Why it fits BLOK:* it answers "who can touch my money?" in the shape crypto users already know, and it previews the Gardener model coming in 2027.
  - *Maps to:* the permission matrix (INS-05).
  - *Don't copy:* the role names, or any asymmetric-timelock claim unless BLOK's contracts actually work that way.
- **Pattern B: "Open by default"** links each protocol to its GitHub source, and a footer group ("More from Morpho") exposes llms.txt, the sitemap and the developer docs.
  - *Maps to:* BLOK already does source links (Keep). A footer link to `/llms.txt` goes to Agent F.
  - *Don't copy:* the "$16B+ in deposits" headline or the partner logo rows.
- **Pattern C: one section per audience** (Institutions / Fintechs / Users).
  - *Maps to:* INS-11.

#### 6. Reserve: Homepage
**URL:** https://reserve.org/ · **What:** on-chain index tokens ("DTFs"). ✅ Fetched.
- **Pattern A: index cards share one spec line** (Chain · Governed by · Inception), followed by ranked holdings and the rule as text (e.g. market-cap weighting with a 20% cap, rebalanced quarterly).
  - *Why it fits BLOK:* the same fields across BLOKC2, BLOKC5 and BLOKC10 make the comparison instant.
  - *Maps to:* the factsheet rows in INS-08 (BLOK already has most of them).
  - *Don't copy:* the "Buy" buttons, published weights (BLOK hasn't published any), the performance tab, or the distribution-partner list.
- **Pattern B: a disclaimer placed next to the figures** saying prices are snapshots and not advice.
  - *Maps to:* BLOK's LiveStatus and "Example" badges already do this (Keep).

### Best-in-class from other fields

#### 7. Wealthfront: Homepage (fintech / investing)
**URL:** https://www.wealthfront.com/ · ✅ Fetched.
- **Pattern A: numbered footnote markers (1–6) on individual claims, and a disclosure paragraph placed right under the performance graphic**, with a link to the full disclosures.
  - *Why it fits BLOK:* it qualifies a claim where the claim is made, which keeps the hero honest without losing its punch.
  - *Maps to:* INS-01. It could later apply to any hero-level claim.
  - *Don't copy:* APY or return headlines, award badges, client counts, app-store ratings, testimonials or the dense legal small print. None of these fits a pre-launch protocol with no track record.

#### 8. Linear: Homepage (developer tool)
**URL:** https://linear.app/ · ✅ Fetched. I could not see its motion, so none is described.
- **Pattern A: a homepage preview of the 4 latest dated changelog entries**, with "View all".
  - *Why it fits BLOK:* a dated record of shipped work is proof of momentum for a team asking people to wait for launch.
  - *Maps to:* INS-10.
  - *Don't copy:* the product-screenshot cards, "Fig 0.x" labels, customer counts or the overall aesthetic.
- **Pattern B: each feature section pairs one claim with one UI image and a "Learn more" deep link.**
  - BLOK already does this with its own mocks (Keep).

#### 9. Bartosz Ciechanowski: "Mechanical Watch" (interactive long-form)
**URL:** https://ciechanow.ski/mechanical-watch/ · ✅ Fetched.
- **Pattern A: each demo isolates one concept and is driven by the reader** (sliders, "scrub back and forth in time", buttons).
  - *Why it fits BLOK:* the trust moments (the rule trace, the rebalance band) land when readers control them.
  - *Maps to:* INS-12. A time-scrub of a "drift → band → one pooled trade" sequence would also suit RebalanceLab, labelled as an example.
- **Pattern B: one global pause/unpause for all animations.**
  - *Maps to:* the site-wide "Pause animations" toggle in INS-12.
- **Pattern C: show the naive or failing version first to motivate the mechanism.**
  - BLOK's "Watch a Garden say no" already does this (Keep).
- *Don't copy:* 3D/WebGL rendering or the illustration style. BLOK's motion stays CSS-first.

#### 10. Our World in Data: chart page (editorial / data)
**URL:** https://ourworldindata.org/grapher/share-electricity-renewables · ✅ Fetched.
- **Pattern A: an "About this data" block** with Source · Last updated · Next expected update · Date range · Unit, plus per-source "Retrieved on / from".
  - *Why it fits BLOK:* it formalises the provenance BLOK already cares about, and "Next expected update" is an honest way to describe data that doesn't exist yet.
  - *Maps to:* INS-08.
- **Pattern B: "Download displayed data", with CSV and JSON URLs.**
  - *Why it fits BLOK:* verifiers can check addresses with their own tools.
  - *Maps to:* a static per-index JSON (INS-08).
- *Don't copy:* the citation and licence boilerplate (that's the owner's decision) or the chart UI.

#### 11. GOV.UK: multi-part guide (editorial scannability)
**URL:** https://www.gov.uk/universal-credit · ✅ Fetched.
- **Pattern A: a numbered "Contents" list at the top of a long guide, a "Next: Eligibility" link at the end of each part, and a printable version.**
  - *Why it fits BLOK:* long, dense pages read better with jump links and a set reading path.
  - *Maps to:* INS-07.
- **Pattern B: "Is this page useful?" and "Report a problem with this page".**
  - *Maps to:* the Discord correction line (INS-13).
  - *Don't copy:* the form. BLOK is a static export, so the line links to Discord instead.
- **Pattern C: summary-first, plain sentences** ("Universal Credit is a payment to help with your living costs.").
  - BLOK's copy already leans this way (Agent I).
- *Don't copy:* GOV.UK's typeface, black header or visual system.

### Reviewed and set aside
- **enzyme.finance**: the homepage now targets institutions, never explains custody, and leans on partner logos and aggregate stats.
- **indexcoop.com**: the hero uses large live counters; the "Testimonials" and "Dive deeper" headings have no visible content; per-product methodology isn't on the homepage. Used only to inform "Patterns to avoid".
- **argent.xyz**: 301-redirects to ready.co, which is now a payments and rewards app with no smart-wallet explainer.
- **ethena.fi/transparency**: returned 404. Search says the dashboard is at app.ethena.fi/dashboards/transparency, but I didn't fetch it, so I don't describe it.
- **lido.fi** homepage: its stats carry footnote markers, but the sources weren't visible in the fetched text.

## Patterns to avoid

These are common on crypto sites, and each would damage BLOK's trust, accessibility or honest-data rules:

1. **Unsourced live tickers and running counters**, such as big totals with no source, timestamp or stale state. BLOK's rule stays: every live figure shows its source, the time it was read and a fallback state, as LiveStatus already does.
2. **Unverifiable TVL, "assets secured", user or volume numbers**, and aggregate audit counts ("30+ audits") without a link to each report. Before launch, BLOK has no such numbers and must not imply any.
3. **"Trusted by / Backed by" logo walls and celebrity or anonymous testimonials.** They imply endorsement that may not exist. BLOK's ecosystem tiles state what each integration *does* and link to the code, so keep that framing.
4. **Countdown timers and FOMO pressure**, e.g. an IDO countdown or "spots left". These are especially tempting around the Q2 '27 IDO and conflict with "not investment advice".
5. **APY, return or backtest headlines.** BLOK already refuses to show backtests as history; keep that rule for every future index page.
6. **Autoplay video, above all with sound, and heavy WebGL or particle heroes.** They cost CPU on mid-range phones (home TBT is already 942 ms) and distract from the claims.
7. **Scroll-jacking**: hijacking the wheel or touch for pinned sequences. Sticky sections are fine only if native scrolling and keyboard navigation still work.
8. **Neon on near-black and thin, tiny mono text.** Low contrast fails WCAG and reads as "degen". Night garden components must still pass AA, especially the 11px uppercase mono labels.
9. **"Connect wallet" as a marketing-page CTA, or any signature request before launch.** It trains users into the exact behaviour phishers exploit. BLOK should keep Discord and Docs as the CTAs.
10. **Facts that live only in Discord.** Gating key information behind a community join harms trust and SEO. The site must stay the record, and Discord the conversation.
11. **Risk text hidden in the footer.** Keep risks next to the claims they qualify, as `/protocol` "Fees & risks" already does.
12. **Empty placeholder sections** ("Testimonials", "In the media" with no content). Leave a section out until it has real content.

## Keep

- **DataAvailability ("What's live, and what isn't yet")**, including "We won't show backtests as if they were history." This is BLOK's strongest trust pattern.
- **AtAGlance**: only sourced figures, each linked to its source (`src/components/home/AtAGlance.tsx`).
- **LiveStatus** on prices and the token contract: source + updated time + retry. Also the "Oracle last updated" hint explaining heartbeats.
- **"Illustrative" / "Example · numbers from the docs" badges** and the line "The checks are real; the figures and addresses are examples." (RulesDemo).
- **"Don't trust us. Check." pillars**, each with a "See the proof" link; the CredShields severity bar; "How a change reaches production".
- **The custodian / on your own / Garden comparison table** on home.
- **Ecosystem tiles that link to the integrating code**, and the "Also in the codebase, not live on Arbitrum" disclosure.
- **The governance "Synced from chain … UTC" stamp** and proposals that link to Aragon.
- **`/protocol` "What it costs, what can go wrong."** with risks next to fees.
- **RebalanceLab**: direct manipulation with an example badge, already Ciechanowski-like.
- **The BLOKC5 factsheet**, including "Index value: Not published yet".

## Cross-agent notes

- **Orchestrator / Phase 4 capture:** `home_1280.jpg` and `indices_blokc5_1280.jpg` repeat the hero and nav about 3× at the top. `home_1280.jpg` also never shows the At-a-glance band or the "Why BLOK Capital" Problem section, which render correctly live on :4173. This is likely a full-page capture artifact and will skew visual comparisons. (Seen in the sliced strips; root cause unverified.)
- **B/K:** SITE_MAP §1 lists the footer as dark (Night garden), but `src/components/footer/Footer.tsx:55` uses `bg-canvas` (light) and every screenshot shows a light footer. Either the doc or the implementation needs updating.
- **I/H:** the audit date is inconsistent. `src/lib/data/audits.ts` and AtAGlance say "Dec 2024"; the `/security` copy (`page.tsx:74,132,161`) says November 2024 and "retested 28 Nov 2024".
- **I:** "professionally curated basket" (`src/components/home/Products.tsx:24`, `src/lib/data/faqs.ts:14`) conflicts with "Nobody picks the weights by hand" (`/indices` hero), since the weights are rule-based.
- **K/I:** roadmap and token-timeline quarters are stale (see INS-02); the owner must supply the new quarters.
- **H:** SolidityScan and Octane cards link to the vendors' homepages ("About SolidityScan"), not to scan results. Link the outputs if they're public, or say they're private.
- **F:** `/llms.txt` exists but isn't linked from the footer; Morpho links its llms.txt from its footer.
- **C/D:** ProtocolExplorer and RulesDemo autoplay. Per-component pause exists, so WCAG 2.2.2 looks satisfied, but consider the global motion toggle in INS-12.
