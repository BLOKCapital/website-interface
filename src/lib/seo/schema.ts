import { siteConfig, BASE } from "./site";
import { brandFacts } from "./facts";

/**
 * JSON-LD builders. Each returns a plain object that gets serialized into a
 * <script type="application/ld+json"> by the <JsonLd> component. Keeping them
 * pure (no JSX) makes them trivial to unit-test and reuse across routes.
 *
 * The fields here are also what AI agents read to understand the entity:
 * `knowsAbout` declares topical authority, `sameAs` proves identity across
 * platforms, and the Service schema names the actual offering.
 */

/** Organization: brand identity, logo, topical authority and social profiles. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: BASE,
    logo: siteConfig.logo,
    description: siteConfig.description,
    slogan: "It's crypto, but different.",
    foundingDate: brandFacts.foundingYear,
    areaServed: "Worldwide",
    knowsAbout: brandFacts.knowsAbout,
    // Marshall Islands incorporation — disambiguates the entity and feeds the
    // "who operates this" question answer engines ask before citing.
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.legal.addressCountry,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Marshall Islands company registration",
      value: siteConfig.legal.registration,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: siteConfig.supportUrl,
        availableLanguage: "English",
      },
    ],
    sameAs: siteConfig.sameAs,
  };
}

/**
 * WebApplication: declares the product *as software* so answer engines can field
 * "is there an app", "what does it cost", and capability queries. No
 * AggregateRating/Review is emitted — we have no verifiable rating data and
 * fabricating one risks a manual action and erodes trust.
 */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${BASE}/#app`,
    name: siteConfig.name,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web (any modern browser); runs on Arbitrum (EVM)",
    url: BASE,
    description: brandFacts.oneLiner,
    browserRequirements:
      "Sign in with a social login (Web3Auth MPC) or a Web3 wallet. No seed phrase or install required.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description:
        "No subscription and no minimum deposit. On-chain gas and protocol fees apply per transaction.",
    },
    featureList: [
      "Follow professionally curated, auto-rebalancing on-chain indices (BLOKC2, BLOKC5, BLOKC10)",
      "Hire an on-chain manager with a verifiable soulbound track record",
      "Non-custodial smart-contract wallet: assets never leave your address",
      "Fiat on/off-ramp to USDC via regulated partners",
      "On-chain DAO governance via $BLOKC",
    ],
    provider: { "@id": `${BASE}/#organization` },
  };
}

/** Service: names the actual offering so agents can answer "what does X do". */
export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/#service`,
    name: "BLOK Capital: Non-custodial wealth management",
    serviceType: "Decentralized wealth management",
    description: brandFacts.oneLiner,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: "Worldwide",
    url: BASE,
  };
}

/** WebSite: enables brand recognition and the sitelinks search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: siteConfig.name,
    url: BASE,
    description: siteConfig.description,
    publisher: { "@id": `${BASE}/#organization` },
  };
}

/** FAQPage: eligible for expandable FAQ rich results in search. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Article: gives legal/policy documents an authored, dated identity so search
 * engines surface "last updated" in the snippet and attribute the content to
 * the DAO entity (E-E-A-T). Dates are the document's own revision dates, not
 * the build time.
 */
export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${BASE}${input.path}`,
    mainEntityOfPage: `${BASE}${input.path}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    inLanguage: "en",
    author: { "@id": `${BASE}/#organization` },
    publisher: { "@id": `${BASE}/#organization` },
  };
}

/** BreadcrumbList: shows the page's position in the site hierarchy in SERPs. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  };
}
