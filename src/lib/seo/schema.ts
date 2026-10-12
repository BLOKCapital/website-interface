import { siteConfig, BASE } from "./site";
import { brandFacts, feeText } from "./facts";
import { protocolStatus } from "@/lib/data/status";
import { BLOKC_TOKEN } from "@/lib/data/token";
import { links } from "@/lib/data/socials";

/**
 * JSON-LD builders. Each returns a plain object that gets serialized into a
 * <script type="application/ld+json"> by the <JsonLd> component. Keeping them
 * pure (no JSX) makes them trivial to unit-test and reuse across routes.
 *
 * The fields here are also what AI agents read to understand the entity:
 * `knowsAbout` declares topical authority, `sameAs` proves identity across
 * platforms, and the Service schema names the actual offering. Every string
 * must agree with the visible site: no ratings, reviews, prices or dates
 * that the site doesn't state.
 */

/** Organization: brand identity, logo, topical authority and social profiles. */
export function organizationSchema() {
  const { legal } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    legalName: siteConfig.legalName,
    url: BASE,
    // A square mark with its real size (SEO-08).
    logo: {
      "@type": "ImageObject",
      "@id": `${BASE}/#logo`,
      url: siteConfig.logo.url,
      contentUrl: siteConfig.logo.url,
      width: siteConfig.logo.width,
      height: siteConfig.logo.height,
      caption: siteConfig.name,
    },
    description: siteConfig.description,
    // Who this is, in facts the site states (footer, /token), so answer
    // engines don't merge it with other "BLOK"/"BLOKC" entities (SEO-13).
    disambiguatingDescription: `${siteConfig.legalName}, registered in the ${legal.jurisdiction} (reg. ${legal.registration}), operates ${BASE.replace(/^https:\/\//, "")} and the non-custodial BLOK Capital protocol on Arbitrum. Its governance token is $BLOKC on Arbitrum One, contract ${BLOKC_TOKEN}.`,
    slogan: "It's crypto, but different.",
    foundingDate: brandFacts.foundingYear,
    areaServed: "Worldwide",
    knowsAbout: brandFacts.knowsAbout,
    // The registered address exactly as the policies publish it.
    address: {
      "@type": "PostalAddress",
      ...legal.address,
      addressCountry: legal.addressCountry,
    },
    identifier: {
      "@type": "PropertyValue",
      name: "Marshall Islands company registration",
      value: legal.registration,
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
 * WebApplication: the product *as software*, for "is there an app" and "what
 * does it cost" questions. It says what the site says: in private testing,
 * limited availability, and the FAQ's own fee answer (SEO-03). No
 * AggregateRating/Review or price: there's no verifiable rating, and fees
 * after launch are set by DAO vote. `isAccessibleForFree` returns at the
 * public launch.
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
    description: `${protocolStatus.label}. A non-custodial wealth-management app on Arbitrum: follow market-cap-weighted on-chain indices from a smart-contract wallet at your own address.`,
    browserRequirements: "A modern web browser. Sign in with Google (Web3Auth MPC, no seed phrase) or your own wallet.",
    offers: {
      "@type": "Offer",
      // The FAQ's "What does it cost?" answer, verbatim.
      description: feeText,
      availability: "https://schema.org/LimitedAvailability",
    },
    featureList: [
      `${protocolStatus.label}: market-cap-weighted on-chain indices (BLOKC2, BLOKC5, BLOKC10) that rebalance automatically`,
      `Planned for ${protocolStatus.gardeners}: on-chain managers (Gardeners) with a verifiable soulbound track record`,
      "Non-custodial smart-contract wallet: assets stay at your own address",
      "Buy USDC by card or bank through an on-ramp such as Transak, which runs its own KYC",
      "On-chain DAO governance through Aragon OSx; core members vote until the $BLOKC token launches",
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
    serviceType: "Decentralised wealth management",
    description: brandFacts.oneLiner,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: "Worldwide",
    url: BASE,
  };
}

/** WebSite: the site name Google shows, its alternates and its language. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: siteConfig.name,
    alternateName: [...siteConfig.alternateNames, BASE.replace(/^https:\/\//, "")],
    url: BASE,
    description: siteConfig.description,
    inLanguage: "en-GB",
    publisher: { "@id": `${BASE}/#organization` },
  };
}

/**
 * FAQPage: the Q&As exactly as shown on the page. Google limits FAQ rich
 * results to authoritative government and health sites (since 2023), so
 * this is for answer engines, not a SERP feature.
 */
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
 * VideoObject for the /about introduction, which plays behind a click-to-play
 * facade, so crawlers can't see the embed. Upload date and duration are the
 * YouTube watch page's own (uploadDate 2024-03-13T10:47:23-07:00, PT4M23S;
 * read 2026-10-12). The thumbnail is the self-hosted poster.
 */
export function videoObjectSchema() {
  const id = links.video.split("/").pop();
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${BASE}/about#video`,
    name: "BLOK Capital DAO",
    description: "BLOK Capital in a few minutes: an introduction to the non-custodial wealth-management protocol on Arbitrum.",
    thumbnailUrl: `${BASE}/brand/video-poster.webp`,
    uploadDate: "2024-03-13T10:47:23-07:00",
    duration: "PT4M23S",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    url: links.video,
    inLanguage: "en",
    publisher: { "@id": `${BASE}/#organization` },
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
    inLanguage: "en-GB",
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
