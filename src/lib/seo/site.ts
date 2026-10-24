import { socials } from "@/lib/data/socials";

/**
 * Single source of truth for site-wide SEO constants. robots.ts, sitemap.ts,
 * manifest.ts and the JSON-LD builders all read from here so the canonical
 * host and brand strings never drift apart.
 */
export const siteConfig = {
  name: "BLOK Capital",
  /** Other names the entity goes by, for answer engines and Google site names (SEO-13). */
  alternateNames: ["BLOK", "BLOK Capital DAO"],
  legalName: "BLOK Capital DAO LLC",
  url: "https://blokcapital.io",
  /** X / Twitter handle (with @) — used for the twitter:site card tag. */
  twitterHandle: "@blok_cap",
  description:
    "Non-custodial, on-chain wealth management on Arbitrum. Curated indices and yield strategies that run from your own smart-contract wallet.",
  locale: "en_GB",
  /**
   * Organization logo in structured data: the square app icon (the BLOK mark
   * on Day garden paper), which reads on the white Google shows logos on. The
   * 250×50 white wordmark was too small and vanished on white (SEO-08).
   */
  logo: { url: "https://blokcapital.io/icon.png", width: 512, height: 512 },
  /** Discord is the single support channel — no email inbox is published. */
  supportUrl: "https://discord.com/invite/blokc",
  /** Incorporation details — strengthen E-E-A-T and entity disambiguation. */
  legal: {
    /** ISO 3166-1 alpha-2 for the Marshall Islands. */
    addressCountry: "MH",
    jurisdiction: "Republic of the Marshall Islands",
    registration: "10050-23",
    /** The registered address exactly as the Acceptable Use Policy publishes it. */
    addressText: "PO Box 852, Long Island Rd, Majuro, Marshall Islands MH 96960",
    /** The same address, in schema.org PostalAddress fields. */
    address: {
      postOfficeBoxNumber: "852",
      streetAddress: "Long Island Rd",
      addressLocality: "Majuro",
      postalCode: "MH 96960",
    },
  },
  /** Verified social/profile URLs that prove brand identity to search engines. */
  sameAs: socials.map((s) => s.href),
} as const;

export const BASE = siteConfig.url;
