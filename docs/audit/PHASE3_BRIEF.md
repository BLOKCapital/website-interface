# Phase 3 brief: implementation rules (every implementation agent reads this first)

**Owner approval, 2026-10-11:** "start to implement above all, but don't change the roadmap right now."
That approves the **recommended answer** for every decision in `IMPROVEMENT_PLAN.md` §5, **except** the items listed under "Not approved / skipped" below.

## Decision ledger

### Approved (use the recommended answer from §5)
- D-05: phone header Discord icon; bar hidden below 640 px; compact landscape header
- D-06: hero CTAs
- D-07: nav labels
- D-08: home restructure items a, b, c, d, e and g
- D-12: Pause-motion toggle, and no autoplay on touch or below `lg`
- D-13: Security as a top-level nav link
- D-14 / D-14b: Marketing category removed and `CONSENT_VERSION` bumped; consent code may be edited
- D-15: Reject and Accept styled identically
- D-16: event taxonomy, consent-gated
- D-19: no waitlist; add "Not on Discord? Follow us on X"
- D-20: en-GB
- D-21: footer stays light
- D-22: sand `#836122`
- D-24: unused assets are **moved** to `design/archive/`, not deleted
- D-26: `youtube-nocookie` plus a self-hosted poster
- D-27: `_headers`
- D-28: `_redirects`
- D-29: `src/lib/live/*`
- D-30: Playwright, axe and CI
- D-31: light-only
- D-32: hero rise-only
- D-33: loops settle within 5 s (the X-11 storytelling sequences are deferred)
- D-34: no count-ups on small or spec values

### Deferred by owner on 2026-10-12 ("finish quickly")
- F-08 token codemod and its ESLint guard; full Phase 4 re-audit (replaced by one final verification). See `docs/RESULTS.md`.

### Not approved / skipped (do NOT implement)
- **The roadmap is frozen.** Do not edit:
  - `src/lib/data/milestones.ts`, `src/components/roadmap/*` or `src/components/token/TokenTimeline.tsx`;
  - the roadmap sections on home (`#roadmap`) and `/about#roadmap`;
  - the roadmap content in `llms*.txt`.

  Add no roadmap staleness checks. **D-08(f) is not approved:** don't merge Builders with Roadmap. CRO-03, INS-02 and MISS-01 (roadmap parts) and SEO-04(c) are skipped.
- **Facts only the owner can supply.** Skip these, and never guess or invent:
  - launch date (D-02): a status line may say "in private testing" but **no date or quarter**;
  - true audit date (D-04): change it only if verified from the report PDF in `github.com/BLOKCapital/audits`;
  - Discord vs X "first" channel (D-09): leave that copy as is;
  - new FAQ facts (D-10): add an FAQ only if its answer is already stated on the site;
  - team roles and story signature (D-11);
  - press email (D-17);
  - `security@` mailbox (D-18);
  - vector logo (D-23): icon work is limited to manifest metadata and raster derivatives of existing files;
  - Aragon parameters and timelocks (D-25): state none.
- **Legal text** (D-01, D-03): never edit the policy text in `src/lib/data/policies.ts`.
  - Drafts for counsel go in `docs/legal-drafts/*.md`.
  - The risk line may use the CRO-07 draft, with a code comment `// Pending counsel review (SEC-13, D-03)`.
- `next dev -H 127.0.0.1` (part of T-03) is **not** applied; the owner may test on a phone over the LAN.

## Rules
1. **Worktree only.** Work only inside your own git worktree. Never `cd` into or edit the main checkout at `/Users/chintanlimbachiya/Documents/BLOK Capital/Projects/website-interface`, because the owner's dev server shares its `.next`. You may **read** files there.
2. **File ownership.** Edit only the files your task lists as yours, plus new files you create. If a fix needs a file you don't own, don't touch it; list it under "needs" in your report.
3. **Setup.**
   - **Base.** Agent worktrees start on `main`, which is old. First run `git merge --ff-only <base sha given in your task>`, so your branch starts at the current `redesign` tip. (`git reset --hard` is blocked.) Check with `git log --oneline -3`.
   - **node_modules.** Use a **symlink**, not a copy, because thousands of copied files overload Spotlight on this Mac:
     `ln -s "/Users/chintanlimbachiya/Documents/BLOK Capital/Projects/website-interface/node_modules" node_modules`.
     Do **not** add or upgrade dependencies, and **never run `npm ci`/`npm install` while `node_modules` is a symlink**, because that would rewrite the main checkout's packages. If you truly need a dependency, stop and list it under "needs".
   - Build output (`.next/`, `out/`) stays inside your worktree. That's fine.
4. **Verify before you finish.** Run `npm run typecheck`, `npm run lint` (no new warnings) and `npm run build` in your worktree. Run `npm test` if a test suite exists. For visual checks, serve `out/` on a free port in 4300–4399 (`npx serve out -l 43xx`) and use Playwright with `channel: "chrome"`. Stop every server you start. Never run `npm run dev`.
5. **Commits.**
   - Keep commits small, one concern each, and commit only on your worktree branch.
   - Message: `<area>: <imperative summary>`, then a body naming the finding IDs (e.g. `Fixes A11Y-01, MOB-16.`), then a blank line and `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
   - Never push, rebase others' work or amend. Leave the worktree clean.
   - Rename your branch to `p3/<area>` (`git branch -m p3/<area>`).
6. **Brand and honesty.** These are fixed (SITE_MAP §1):
   - Day garden is the default; Night garden `.theme-dark` islands stay. Fonts are Inter / Newsreader / JetBrains Mono, and the garden metaphor stays.
   - No invented figures, dates, partners, quotes or claims. Illustrative content gets the "Example" badge.
   - Use British spelling.
7. **Motion.** CSS-first with no motion libraries, following plan §3.4 (R1–R5, the "when not to animate" list and the reduced-motion contract). Once Foundation lands, use its tokens and the `motion-off:` and `can-hover:` variants, plus `useMotionAllowed()` from `src/lib/motion.ts`.
8. **Ties.** Accessibility and performance win ties. Every interactive element needs hover (pointer only), focus-visible, active, and disabled/loading/error states where they apply. Keep targets at least 24 px (44 px on key flows).
9. **Preserve behaviour.** Every route, link, anchor id, consent-gated GA4 behaviour and live on-chain read must keep working.
   - Moved content keeps its anchor working on the old page through an alias id or a link.
   - Remove nothing that the plan item doesn't say to move or merge.
10. **Tests.** When your change fixes something covered by a `test.fixme` or a known-violation allow-list entry tagged with your finding ID, remove the fixme or entry and make the test pass.
11. **Report** (≤ 300 words):
    - branch name and worktree path;
    - `git log --oneline <base>..HEAD`;
    - done items by ID;
    - skipped items, with the reason;
    - verification output (typecheck, lint, build, tests);
    - needs (files you didn't own).

## References
- `docs/audit/IMPROVEMENT_PLAN.md`: backlog IDs T/F/G/P/S/X, conflicts in §2, design spec in §3.
- `docs/audit/findings/*.md`: the evidence and the exact fix for each finding ID.
- `findings/B-visual-system.md` §3: tokens and the migration map.
- `findings/C-motion.md` §4: the motion system.
- `findings/H-security-trust.md` §3: headers and CSP.
- `findings/I-content-conversion.md` §3: the event taxonomy and copy.
- `findings/F-seo.md` §3–4: the metadata helper, titles and descriptions.
- Agent scratch scripts you may reuse are in `/private/tmp/claude-501/-Users-chintanlimbachiya-Documents-BLOK-Capital-Projects-website-interface/175cdb17-fa39-4a79-89f7-a3688d1e8db2/scratchpad/tools/agent-*/`, for example `agent-B/deadclasses.mjs`, `agent-K/links.mjs`, `agent-D/tabwalk.mjs` and `agent-H/csp-test.mjs`.
