> **DRAFT for legal review. Not published.**
> Prepared from the site's code (branch `p3/consent`) and the audit log in `docs/audit/findings/H-security-trust.md` §3.3, to replace the Cookie Policy in `src/lib/data/policies.ts` (dated 2025-02-18) once counsel approves it (D-01, SEC-02). It states only what the code does today. `[COUNSEL]` marks a legal judgement; `[OWNER]` marks a fact only the owner can supply. Nothing here has been checked by a lawyer.

# Cookie Policy

**Version:** `[OWNER: version number]` · **Last updated:** `[OWNER: publication date]`

> When this is published, set `CONSENT_POLICY` in `src/lib/consent.ts` to the new date, and bump `CONSENT_VERSION` if counsel wants everyone asked again.

## 1. Who this policy is from

This website, **blokcapital.io**, is operated by **BLOK Capital DAO LLC**, a non-profit limited liability company incorporated in the Republic of the Marshall Islands with registration number **10050-23**, registered address PO Box 852, Long Island Rd, Majuro, Marshall Islands MH 96960 ("we", "us").

`[OWNER: does this policy also cover private.blokcapital.io (the app)? The current policy says it does. If yes, list what the app stores; nothing about the app is described below.]`

## 2. What cookies and similar technologies are

A cookie is a small text file a website stores in your browser. "Local storage" is a similar store in your browser that only this website can read. This policy covers both, and any content from other companies that this site loads.

## 3. Your choice

When you first visit, a banner asks whether you allow **Analytics**. Nothing in that category runs, and nothing is sent to Google Analytics, until you choose **Accept all** or switch Analytics on under **Manage**. **Reject all** is one click and has the same weight as Accept all. Closing the preferences dialog without choosing is not consent.

- **Change or withdraw your choice at any time** with **Cookie settings** in the footer of every page (also on this page). Withdrawing stops Google Analytics straight away, including on the page you are on, and deletes the `_ga` cookies.
- **Global Privacy Control (GPC):** if your browser sends a GPC signal and you haven't made a choice, we treat it as **Reject all** and don't show the banner.
- We ask again after **six months (182 days)**, or sooner if this policy's categories change.
- You can also block or delete cookies in your browser settings. Strictly necessary storage only remembers your choices, so blocking it means we ask again on every visit.

`[COUNSEL: the old sentence "by accessing and continuing to use them, you agree to this policy" has been removed on purpose (implied consent). Confirm.]`

## 4. What we use

### 4.1 Strictly necessary (always on)

These only remember choices you made on this site. They are first-party, never shared, and need no consent `[COUNSEL: confirm the ePrivacy Art. 5(3) / PECR reg. 6 exemption applies to each]`.

| Name | Type | Purpose | Duration |
|---|---|---|---|
| `blok_consent` | First-party cookie | Remembers your cookie choice: whether Analytics is allowed, when you chose, how (banner, preferences or GPC), and which version of this policy was in force | 182 days |
| `blok:consent` | Local storage | The same record, so the choice survives if cookies are cleared | Until you clear it; ignored after 182 days |
| `blok:bar-dismissed` | Local storage | Remembers that you closed the announcement bar, so it stays closed | Until you clear it |
| `blok:motion` | Local storage | Remembers that you switched animations off ("Pause motion") | Until you clear it, or switch motion back on |

### 4.2 Analytics (only with your consent)

| Name | Provider | Purpose | Duration |
|---|---|---|---|
| `_ga` | Google Analytics 4 (Google) | Distinguishes browsers so visits can be counted in aggregate | Up to 2 years |
| `_ga_D3Q5JCYWJR` | Google Analytics 4 (Google) | Keeps the state of a visit (session) for the same property | Up to 2 years |

What Google Analytics records with your consent: pages viewed, the page you came from, and which buttons, links and sections get used (for example a click on a Discord link, opening a FAQ, a section scrolled into view, or an error on the page). It never receives wallet addresses, email addresses, text you type, or identifiers from us. Google processes your IP address to estimate your country.

How we have set it up: Google's Consent Mode starts with everything denied and only analytics storage is ever granted; advertising storage, ad user data and ad personalisation are **always denied**; Google signals and ad personalisation are switched off in the tag. We run no advertising or marketing tags.

`[OWNER: confirm in the GA4 admin that Google signals and ads personalisation are off, and state the data-retention setting (2 or 14 months).]`

### 4.3 Content from other companies

**Introduction video (/about).** The video is shown as a still image hosted by us. Nothing is loaded from YouTube until you press Play. Pressing Play loads the player from **youtube-nocookie.com** (YouTube's privacy-enhanced mode, operated by Google), which may set its own cookies or local storage and receive your IP address. A note under the video says so before you press Play. `[OWNER/COUNSEL: list what YouTube's privacy-enhanced mode actually stores after Play; the audit measured VISITOR_INFO1_LIVE, YSC, __Secure-YNID and __Secure-ROLLOUT_TOKEN on the old youtube.com embed. Decide whether Play should require Analytics-style consent, or whether the click plus the notice is enough.]`

**Live on-chain data.** Some pages (the home page's indices section, `/indices`, each index page and `/token`) read prices and token data straight from the public Arbitrum One network endpoint (`arb1.arbitrum.io`, operated by Offchain Labs). That request carries your IP address like any web request, but sets no cookies. More in the Privacy Policy.

**Links to other sites.** Links to Discord, X, Telegram, Farcaster, GitHub, YouTube, our docs, the whitepaper (DocSend), Aragon and Arbiscan open those sites, which have their own cookie policies. Nothing from them loads on our pages until you follow the link.

**Fonts** are served from our own domain; no request goes to Google Fonts.

## 5. Changes to this policy

When the categories above change, we update this page, change its version and date, and ask you again. Each consent record stores the version of this policy it was given under.

## 6. Contact

`[OWNER: a contact other than Discord for privacy and cookie questions, e.g. privacy@blokcapital.io. The current policy's "how to contact us" section names no contact.]` You can also reach us in our Discord: https://discord.com/invite/blokc.

See also the Privacy Policy `[OWNER: link once published]`.
