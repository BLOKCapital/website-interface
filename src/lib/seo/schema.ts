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
    sameAs: siteConfig.sameAs,
  };
}

/** Service: names the actual offering so agents can answer "what does X do". */
export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/#service`,
    name: "BLOK Capital — Non-custodial wealth management",
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
