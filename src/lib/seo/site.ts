import { socials } from "@/lib/data/socials";

/**
 * Single source of truth for site-wide SEO constants. robots.ts, sitemap.ts,
 * manifest.ts and the JSON-LD builders all read from here so the canonical
 * host and brand strings never drift apart.
 */
export const siteConfig = {
  name: "BLOK Capital",
  legalName: "BLOK Capital DAO LLC",
  url: "https://blokcapital.io",
  /** X / Twitter handle (with @) — used for the twitter:site card tag. */
  twitterHandle: "@blok_cap",
  description:
    "Decentralized wealth management on Arbitrum. Follow pro-curated indices or hire an on-chain manager. Your assets stay in your wallet. Always.",
  locale: "en_US",
  /** Brand wordmark used as the Organization logo in structured data. */
  logo: "https://blokcapital.io/brand/wordmark.png",
  /** Support inbox surfaced as the Organization contactPoint. */
  email: "support@blokcapital.io",
  /** Real-time support channel agents/users are pointed to first. */
  supportUrl: "https://discord.com/invite/blokc",
  /** Incorporation details — strengthen E-E-A-T and entity disambiguation. */
  legal: {
    /** ISO 3166-1 alpha-2 for the Marshall Islands. */
    addressCountry: "MH",
    registration: "10050-23",
  },
  /** Verified social/profile URLs that prove brand identity to search engines. */
  sameAs: socials.map((s) => s.href),
} as const;

export const BASE = siteConfig.url;
