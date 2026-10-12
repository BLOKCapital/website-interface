import { siteConfig, BASE } from "./site";
import { brandFacts, feeText, tokenFacts, governanceFacts, DAO_ADDRESS } from "./facts";
import { pillars } from "@/lib/data/pillars";
import { audits } from "@/lib/data/audits";
import { faqs } from "@/lib/data/faqs";
import { milestones } from "@/lib/data/milestones";
import { components, indices, methodology, CORE_REPO_URL } from "@/lib/data/indices";
import { protocolStatus } from "@/lib/data/status";
import { links, socials } from "@/lib/data/socials";
import { TOKEN_DOCS } from "@/lib/data/token";
import { getAllPolicies } from "@/lib/data/policies";
import { getGovernance } from "@/lib/data/proposals";

/**
 * Builders for /llms.txt and /llms-full.txt — the emerging convention
 * (llmstxt.org) that gives AI agents a clean, curated, link-rich map of the
 * site instead of forcing them to scrape rendered HTML. The short file is a
 * navigation index; the full file inlines the actual facts so an agent can
 * answer questions from a single fetch.
 *
 * Per the spec, the short file is an H1, a blockquote, then free text and
 * lists (no headings) before the H2 link sections. Everything is generated
 * from the data modules (SEO-14), so it can't contradict the pages.
 */

/** Build date (UTC), the files' "Last updated" line: they are regenerated from the data on every build. */
const BUILT = new Date().toISOString().slice(0, 10);

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

const PAGES: { title: string; path: string; desc: string }[] = [
  { title: "Home", path: "/", desc: "What BLOK Capital is and how non-custodial Gardens work." },
  { title: "Protocol", path: "/protocol", desc: "Gardens, Index and Yield Gardens, Gardeners, the Diamond architecture, fees and risks." },
  { title: "Indices", path: "/indices", desc: "BLOKC2, BLOKC5 and BLOKC10: components, market-cap methodology, guardrails and pooled rebalancing." },
  ...indices.map((i) => ({
    title: i.name,
    path: `/indices/${i.id}`,
    desc: `${i.tagline}: ${i.components.join(", ")}. Market-cap weighted. ${i.status}.`,
  })),
  { title: "Security", path: "/security", desc: "Who can change the contracts, audits and scanning, official links, and how to report a vulnerability." },
  { title: "Token", path: "/token", desc: "$BLOKC utility, allocation of the 10B supply, the official contract address and launch timing." },
  { title: "Governance", path: "/governance", desc: "How the DAO decides, the current phase, and on-chain proposals." },
  { title: "About", path: "/about", desc: "Story, principles, team, roadmap and press kit." },
  { title: "Contact", path: "/contact", desc: "Community channels, security reports, and FAQs." },
];

/** Who operates the site, and the links and addresses to check impersonators against. */
function identityLines(): string[] {
  const { legal } = siteConfig;
  return [
    `- Legal name: ${siteConfig.legalName}`,
    `- Jurisdiction: ${legal.jurisdiction}`,
    `- Registration number: ${legal.registration}`,
    `- Registered address: ${legal.addressText}`,
    `- Official domains: ${host(siteConfig.url)} (website), ${host(new URL(links.docs).origin)} (documentation)`,
    `- Official $BLOKC contract: ${tokenFacts.contract} on ${tokenFacts.network}`,
    `- DAO (Aragon OSx) on Arbitrum One: ${DAO_ADDRESS}`,
    `- Official channels: ${socials.map((s) => `${s.label} ${host(s.href)}`).join(", ")}`,
    `- The full list of official links is at ${BASE}/security#official. Anything else is not BLOK Capital.`,
  ];
}

/** Short index file: H1, summary blockquote, preamble, then curated link sections. */
export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${brandFacts.oneLiner}`);
  lines.push("");
  lines.push(`Last updated: ${BUILT}. Category: ${brandFacts.category}. Chain: ${brandFacts.chain}. Status: ${protocolStatus.label}.`);
  lines.push("");
  lines.push(`Token: ${brandFacts.token}`);
  lines.push("");

  lines.push("Identity:");
  lines.push(...identityLines());
  lines.push("");

  lines.push("Key facts:");
  for (const f of brandFacts.keyFacts) lines.push(`- ${f}`);
  lines.push("");

  lines.push("Glossary:");
  for (const g of brandFacts.glossary) lines.push(`- **${g.term}**: ${g.definition}`);
  lines.push("");

  lines.push("## Pages");
  for (const p of PAGES) lines.push(`- [${p.title}](${BASE}${p.path}): ${p.desc}`);
  lines.push("");

  lines.push("## Docs");
  lines.push("- [Docs llms.txt](https://docs.blokcapital.io/llms.txt): The documentation's own agent index.");
  lines.push(`- [Protocol overview](${links.docsOverview}): What BLOK Capital is and how Gardens work.`);
  lines.push(`- [Architecture](${links.docsArchitecture}): The V1 contract system.`);
  lines.push(`- [Smart contract addresses](${links.docsAddresses}): Deployed contract addresses, as the docs publish them.`);
  lines.push(`- [Audits and security](${links.docsSecurity}): Audit coverage and security practices.`);
  lines.push(`- [Audit reports](${links.auditsRepo}): The published reports on GitHub.`);
  lines.push(`- [Source code](${CORE_REPO_URL}): The core contracts and their tests.`);
  lines.push("");

  lines.push("## Legal");
  for (const p of getAllPolicies()) lines.push(`- [${p.title}](${BASE}/legal/${p.slug}): Last updated ${p.date}.`);
  lines.push("");

  lines.push("## Optional");
  lines.push(`- [Full machine-readable summary](${BASE}/llms-full.txt): Everything above inlined, plus indices, token, fees, governance, audits, roadmap and FAQ.`);
  lines.push(`- [$BLOKC token docs](${TOKEN_DOCS}): Tokenomics and the contract address.`);
  lines.push(`- [Whitepaper](${links.whitepaper}): On DocSend.`);
  lines.push(`- [DAO on Aragon](${links.aragon}): Members and proposals.`);
  lines.push(`- [Introduction video](${links.video}): BLOK Capital in a few minutes, on YouTube.`);
  lines.push("");

  return lines.join("\n");
}

/** Full file: inlines identity, facts, indices, token, fees, governance, architecture, audits, roadmap and the FAQ. */
export async function buildLlmsFullTxt(): Promise<string> {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}: Full Reference for AI Agents`);
  lines.push("");
  lines.push(`> ${brandFacts.oneLiner}`);
  lines.push("");
  lines.push(`Last updated: ${BUILT}.`);
  lines.push("");
  lines.push(`- Legal entity: ${brandFacts.legalEntity}`);
  lines.push(`- Category: ${brandFacts.category}`);
  lines.push(`- Chain: ${brandFacts.chain}`);
  lines.push(`- Founded: ${brandFacts.foundingYear}`);
  lines.push(`- Status: ${protocolStatus.label}. ${protocolStatus.detail}`);
  lines.push(`- Token: ${brandFacts.token}`);
  lines.push(`- Website: ${BASE}`);
  lines.push("");

  lines.push("## Identity");
  lines.push(...identityLines());
  lines.push("");

  lines.push("## Key facts");
  for (const f of brandFacts.keyFacts) lines.push(`- ${f}`);
  lines.push("");

  lines.push("## Indices");
  lines.push(
    `Three fixed baskets on Arbitrum, weighted by market cap, priced by Chainlink and rebalanced on-chain. Components are chosen by the team and approved by the DAO. Not published yet: index contract addresses, live weights, index value and performance (an index has no value until Gardens follow it publicly). Details: ${BASE}/indices`,
  );
  lines.push("");
  for (const i of indices) {
    lines.push(`### ${i.name}: ${i.tagline}`);
    lines.push(`Status: ${i.status}. ${i.forWho} ${i.summary}`);
    for (const n of i.notes) lines.push(`- ${n}`);
    lines.push(`Components (${i.components.length}):`);
    for (const s of i.components) {
      const c = components[s];
      lines.push(`- ${c.symbol} (${c.name}): ${c.role} Token on Arbitrum One: ${c.token.symbol} ${c.token.address}. Chainlink USD feed: ${c.feed}.`);
    }
    lines.push(`Page: ${BASE}/indices/${i.id}`);
    lines.push("");
  }
  lines.push("### Methodology");
  lines.push(`Formula: ${methodology.formula}`);
  for (const s of methodology.steps) lines.push(`- ${s.title}: ${s.body}`);
  lines.push("");
  lines.push("### Guardrails (enforced by the contracts)");
  for (const g of methodology.guardrails) lines.push(`- ${g.k}: ${g.v}. ${g.why} Source: ${g.where}`);
  lines.push("");

  lines.push("## Token");
  lines.push(`- Name: ${tokenFacts.name}, the governance token`);
  lines.push(`- Standard: ${tokenFacts.standard}`);
  lines.push(`- Network: ${tokenFacts.network}`);
  lines.push(`- Official contract: ${tokenFacts.contract}`);
  lines.push(`- Decimals: ${tokenFacts.decimals}`);
  lines.push(`- Total supply: ${tokenFacts.supply}`);
  lines.push(`- Launch: ${tokenFacts.launch}`);
  lines.push("- Utility today: the DAO already governs the protocol through its core members. Voting with $BLOKC, and every utility below, is planned; holders will vote after the IDO.");
  lines.push("- Planned utility: governance voting, loyalty rewards for active Garden owners, staking for a share of protocol fees once the DAO turns the fee switch on, and delegating to boost a Gardener.");
  lines.push(`- Allocation of the supply: ${BASE}/token#allocation`);
  lines.push(`- Token docs: ${TOKEN_DOCS}`);
  lines.push("");

  lines.push("## Fees");
  lines.push(feeText);
  lines.push("");

  lines.push("## Governance");
  lines.push(`- Platform: ${governanceFacts.platform}`);
  lines.push(`- DAO address: ${DAO_ADDRESS}`);
  lines.push(`- Current phase: ${governanceFacts.currentPhase}`);
  lines.push(`- The DAO decides: ${governanceFacts.decides.join("; ")}`);
  lines.push(`- Process: ${governanceFacts.process}`);
  lines.push(`- Proposals and members: ${links.aragon}`);
  const { proposals } = await getGovernance();
  if (proposals.length) {
    lines.push(`- Latest proposals (synced from chain at build time, newest first):`);
    for (const p of proposals.slice(0, 5)) {
      const end = p.endLabel ? `, voting ${p.active ? "ends" : "ended"} ${p.endLabel}` : "";
      lines.push(`  - ${p.title} [${p.statusLabel}${end}]`);
    }
  }
  lines.push(`- Page: ${BASE}/governance`);
  lines.push("");

  lines.push("## Architecture & guarantees");
  for (const p of pillars) {
    lines.push(`- **${p.label}** (${p.spec}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Security audits");
  for (const a of audits) {
    const when =
      a.auditedOn && a.reportDate && a.retestedOn
        ? `audited ${a.auditedOn}; report dated ${a.reportDate}; fixes retested ${a.retestedOn}`
        : a.date;
    lines.push(`- **${a.partner}** (${when}): ${a.scope}${a.kind === "report" && a.url ? ` Report: ${a.url}` : ""}`);
  }
  lines.push("");

  lines.push("## Roadmap");
  for (const m of milestones) {
    lines.push(`- ${m.quarter} · ${m.label} [${m.status}]: ${m.description}`);
  }
  lines.push("");

  lines.push("## Glossary");
  for (const g of brandFacts.glossary) lines.push(`- **${g.term}**: ${g.definition}`);
  lines.push("");

  lines.push("## Frequently asked questions");
  for (const q of faqs) {
    lines.push(`### ${q.question}`);
    lines.push(q.answer);
    lines.push("");
  }

  lines.push("## Authoritative resources");
  for (const r of brandFacts.resources) lines.push(`- ${r.label}: ${r.url}`);
  lines.push(`- Documentation for agents: https://docs.blokcapital.io/llms.txt`);
  lines.push(`- Audit reports: ${links.auditsRepo}`);
  lines.push("");

  return lines.join("\n");
}
