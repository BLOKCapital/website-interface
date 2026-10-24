> **DRAFT for legal review. Not published.**
> Prepared from the site's code (branch `p3/consent`) and the audit log in `docs/audit/findings/H-security-trust.md` (SEC-01, §3.3). The User Agreement already "incorporates by reference" a Privacy Policy that doesn't exist yet; this is a starting point for counsel (D-01). It states only what the marketing site at blokcapital.io does today. `[COUNSEL]` marks a legal judgement; `[OWNER]` marks a fact only the owner can supply. Nothing here has been checked by a lawyer, and no lawful basis below is settled until counsel confirms it.

# Privacy Policy

**Version:** `[OWNER: version number]` · **Last updated:** `[OWNER: publication date]`

## 1. Who we are

The website **blokcapital.io** is operated by **BLOK Capital DAO LLC**, a non-profit limited liability company incorporated in the Republic of the Marshall Islands with registration number **10050-23**, registered address PO Box 852, Long Island Rd, Majuro, Marshall Islands MH 96960 ("we", "us"). We decide why and how the personal data described here is used.

`[COUNSEL: confirm BLOK Capital DAO LLC is the controller for this site. Because Google Analytics monitors visitors from the EU and UK, decide whether an EU and/or UK representative is needed (GDPR / UK GDPR Art. 27) and, if so, name them here.]`

`[OWNER: does this policy also cover private.blokcapital.io (the app) and docs.blokcapital.io? Everything below describes blokcapital.io only.]`

## 2. The short version

- You don't need an account, a wallet or an email address to use this website, and it has no forms.
- Google Analytics runs only if you allow it in the cookie banner. It's for counting visits in aggregate, never for advertising.
- Like every website, our host (Cloudflare) sees your IP address when you load a page.
- Pages with live prices ask the public Arbitrum network directly from your browser.
- The video on /about loads from YouTube only when you press Play.
- If you write to us on Discord, Discord's own policy applies to that conversation.

## 3. What we process, why, and on what basis

| What | Personal data involved | Why | Lawful basis `[COUNSEL]` | How long |
|---|---|---|---|---|
| **Serving the website** (Cloudflare Pages) | IP address, browser and device details, the page requested, time, referrer, in Cloudflare's request logs | To deliver the site and keep it secure | Legitimate interests (running a secure website) | `[OWNER: Cloudflare log retention for this account]` |
| **Remembering your choices** (`blok_consent` cookie; `blok:consent`, `blok:bar-dismissed`, `blok:motion` in local storage) | Your cookie choice, when and how you made it, and the policy version; whether you closed the announcement bar or paused animations. Stored in your browser only; it is never sent to us. | To respect your choices | Strictly necessary for the service you asked for `[COUNSEL]` | Cookie choice: 182 days. Others: until you clear them |
| **Analytics** (Google Analytics 4, property `G-D3Q5JCYWJR`) | A pseudonymous browser identifier (`_ga` cookies), IP address (used by Google to estimate country), browser and device details, pages viewed, referrer, and which buttons, links and sections are used, including errors on the page | To understand, in aggregate, which pages and features help people, and to find broken pages | **Consent**, given in the cookie banner and withdrawable at any time | Cookies up to 2 years; reports `[OWNER: GA4 data-retention setting, 2 or 14 months]` |
| **Live on-chain data** (public Arbitrum One endpoint `arb1.arbitrum.io`, operated by Offchain Labs) | IP address and browser details of the request. The request reads public price feeds and the token contract; it contains nothing about you | To show live prices and token data on the home page's indices section, `/indices`, each index page and `/token` | Legitimate interests (showing live, verifiable data) `[COUNSEL]` | Set by Offchain Labs `[COUNSEL: check their terms]` |
| **The /about video** (YouTube privacy-enhanced mode, `youtube-nocookie.com`, Google) | After you press Play only: IP address, browser details, and whatever YouTube stores (see the Cookie Policy) | To play the introduction video you asked for | `[COUNSEL: consent via the click and the notice under the video, or legitimate interests?]` | Set by Google |
| **Talking to us on Discord** | Your Discord username and whatever you write, including private security reports in tickets | To answer you | Legitimate interests (support), or steps you asked us to take `[COUNSEL]` | `[OWNER: how long tickets and messages are kept]` |

What we never collect on this website: wallet addresses linked to you, seed phrases or private keys, email addresses (there are no forms), payment details, or anything you type. Our analytics events are built so they can't carry addresses, emails or free text.

`[COUNSEL: the on-chain activity of a wallet is public on Arbitrum. This website doesn't connect wallets; the app's own policy must cover wallet data if private.blokcapital.io is in scope.]`

## 4. Who receives it

- **Cloudflare, Inc.** hosts the website (Cloudflare Pages). `[COUNSEL: processor; DPA in place?]`
- **Google LLC / Google Ireland Ltd** provides Google Analytics (only with your consent) and YouTube (only after Play). For Analytics we keep every advertising signal off: Consent Mode never grants ad storage, ad user data or ad personalisation, and Google signals and ad personalisation are switched off in the tag. `[OWNER: confirm Google signals and ads personalisation are off in the GA4 admin.] [COUNSEL: Google as processor for GA4 vs independent controller for YouTube.]`
- **Offchain Labs, Inc.** operates the public Arbitrum One endpoint your browser calls for live data. `[COUNSEL: role.]`
- **Discord Inc.** if you contact us there.

We don't sell personal data and don't share it for advertising.

`[COUNSEL: CCPA/CPRA wording on "sale" and "sharing", given that Global Privacy Control is honoured.]`

## 5. International transfers

These providers may process data outside your country, including in the United States. `[COUNSEL: transfer mechanism for each provider (e.g. EU-US Data Privacy Framework certification, Standard Contractual Clauses, UK IDTA/Addendum).]`

## 6. Your choices and rights

- **Cookie settings**, in the footer of every page, lets you allow or withdraw Analytics at any time. Withdrawing stops Google Analytics immediately and deletes its cookies.
- **Global Privacy Control:** if your browser sends GPC and you haven't chosen yet, we treat it as Reject all.
- Depending on where you live, you may have the right to access, correct, delete or port your personal data, to object to or restrict processing based on legitimate interests, and to complain to your data-protection authority. `[COUNSEL: list the rights that apply and the relevant authorities.]`
- Most of what we handle can't be linked to you by us: Google Analytics data is pseudonymous, and we don't hold your IP address ourselves. `[COUNSEL: how to handle requests for Analytics data, e.g. via the `_ga` client ID.]`

To exercise a right, contact us at `[OWNER: a non-Discord contact, e.g. privacy@blokcapital.io. Discord alone is not enough for rights requests.]`. We'll reply within `[COUNSEL: one month / applicable deadline]`.

## 7. Children

This website is not aimed at children. The User Agreement requires users to be at least 18 or of legal age to contract. `[COUNSEL: wording.]`

## 8. Security

The site is static: there are no accounts, forms or databases on blokcapital.io. It is served only over HTTPS. `[OWNER/COUNSEL: anything further to state, e.g. access controls on the Google Analytics and Cloudflare accounts.]`

## 9. Changes

We'll update this page, its version and its date when our processing changes, and ask for your consent again where the change needs it.

## 10. Contact

BLOK Capital DAO LLC, PO Box 852, Long Island Rd, Majuro, Marshall Islands MH 96960 · `[OWNER: privacy email]` · Discord: https://discord.com/invite/blokc

See also the Cookie Policy (/legal/cookie-policy), the User Agreement (/legal/user-agreement) and the Acceptable Use Policy (/legal/acceptable-use).
