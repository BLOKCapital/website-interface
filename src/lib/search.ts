import { indices, components, sources, CORE_REPO_URL } from "@/lib/data/indices";
import { links, socials } from "@/lib/data/socials";
import { BLOKC_TOKEN } from "@/lib/data/token";
import { audits } from "@/lib/data/audits";

export type SearchItem = { label: string; hint: string; href: string; group: string; keywords?: string; logo?: string };

/** Everything the quick-jump menu can reach. Static, so it ships with the page. */
export const searchItems: SearchItem[] = [
  { group: "Pages", label: "Home", hint: "What BLOK Capital is", href: "/" },
  { group: "Pages", label: "Protocol", hint: "Gardens, products, architecture, fees and risks", href: "/protocol" },
  { group: "Pages", label: "Indices", hint: "Explorer, comparison, methodology", href: "/indices" },
  { group: "Pages", label: "Security", hint: "Controls, audit, disclosure", href: "/security", keywords: "audit credshields bug bounty vulnerability" },
  { group: "Pages", label: "Token", hint: "$BLOKC contract, utility, allocation", href: "/token", keywords: "blokc tokenomics supply ido" },
  { group: "Pages", label: "Governance", hint: "How the DAO decides, proposals", href: "/governance", keywords: "dao aragon vote proposal" },
  { group: "Pages", label: "About", hint: "Story, team, roadmap, press", href: "/about", keywords: "team roadmap press" },
  { group: "Pages", label: "Contact", hint: "Channels and FAQ", href: "/contact", keywords: "faq support help" },
  ...indices.map((i) => ({
    group: "Indices",
    label: i.name,
    hint: `${i.tagline} · ${i.components.join(", ")}`,
    href: `/indices/${i.id}`,
  })),
  { group: "Indices", label: "Methodology", hint: "How market-cap weights are computed", href: "/indices#methodology", keywords: "weights formula chainlink" },
  { group: "Indices", label: "Rebalancing", hint: "Drift, pooled trades, slippage cap", href: "/indices#rebalancing", keywords: "rebalance keeper drift" },
  ...Object.values(components).map((c) => ({
    group: "Components",
    label: `${c.symbol} · ${c.name}`,
    hint: `In ${indices.filter((i) => i.components.includes(c.symbol)).map((i) => i.name).join(", ")}`,
    href: `/indices/${indices.find((i) => i.components.includes(c.symbol))!.id}#composition`,
    keywords: c.token.symbol,
    logo: c.logo,
  })),
  { group: "Contracts", label: "$BLOKC token contract", hint: BLOKC_TOKEN, href: `https://arbiscan.io/token/${BLOKC_TOKEN}` },
  { group: "Contracts", label: "Core contracts on GitHub", hint: "blokc-v1-core", href: CORE_REPO_URL, keywords: "solidity diamond facets" },
  { group: "Contracts", label: "MarketCapWeighted.sol", hint: "The index weighting strategy", href: sources.marketCapWeighted },
  { group: "Contracts", label: "Rebalancer.sol", hint: "Pooled rebalancing", href: sources.rebalancer },
  { group: "Contracts", label: "CredShields audit report", hint: "PDF, audits repository", href: audits[0].url ?? links.auditsRepo },
  { group: "Resources", label: "Documentation", hint: "docs.blokcapital.io", href: links.docs },
  { group: "Resources", label: "BLOK Capital DAO on Aragon", hint: "Proposals and members", href: links.aragon },
  { group: "Resources", label: "Whitepaper", hint: "DocSend", href: links.whitepaper },
  ...socials.map((s) => ({ group: "Community", label: s.label, hint: s.desc, href: s.href })),
];
