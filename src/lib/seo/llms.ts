import { siteConfig, BASE } from "./site";
import { brandFacts } from "./facts";
import { pillars } from "@/lib/data/pillars";
import { audits } from "@/lib/data/audits";
import { faqs } from "@/lib/data/faqs";
import { milestones } from "@/lib/data/milestones";

/**
 * Builders for /llms.txt and /llms-full.txt — the emerging convention
 * (llmstxt.org) that gives AI agents a clean, curated, link-rich map of the
 * site instead of forcing them to scrape rendered HTML. The short file is a
 * navigation index; the full file inlines the actual facts so an agent can
 * answer questions from a single fetch.
 */

const PAGES: { title: string; path: string; desc: string }[] = [
  { title: "Home", path: "/", desc: "What BLOK Capital is and how non-custodial Gardens work." },
  { title: "Protocol", path: "/protocol", desc: "Gardens, Index and Yield Gardens, Gardeners, the Diamond architecture, fees and risks." },
  { title: "Security", path: "/security", desc: "Who can change the contracts, audits and scanning, and how to report a vulnerability." },
  { title: "Token", path: "/token", desc: "$BLOKC utility, allocation of the 10B supply, and launch timing." },
  { title: "Governance", path: "/governance", desc: "How the DAO decides, the current phase, and on-chain proposals." },
  { title: "About", path: "/about", desc: "Story, principles, team, roadmap and press kit." },
  { title: "Contact", path: "/contact", desc: "Community channels, security reports, and FAQs." },
];

/** Short index file: H1, summary blockquote, then curated link sections. */
export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${brandFacts.oneLiner}`);
  lines.push("");
  lines.push(`Category: ${brandFacts.category}. Chain: ${brandFacts.chain}. Token: ${brandFacts.token}.`);
  lines.push("");

  lines.push("## Pages");
  for (const p of PAGES) {
    lines.push(`- [${p.title}](${BASE}${p.path}): ${p.desc}`);
  }
  lines.push("");

  lines.push("## Key facts");
  for (const f of brandFacts.keyFacts) lines.push(`- ${f}`);
  lines.push("");

  lines.push("## Glossary");
  for (const g of brandFacts.glossary) lines.push(`- **${g.term}**: ${g.definition}`);
  lines.push("");

  lines.push("## Resources");
  for (const r of brandFacts.resources) lines.push(`- [${r.label}](${r.url})`);
  lines.push(`- [Full machine-readable summary](${BASE}/llms-full.txt)`);
  lines.push("");

  return lines.join("\n");
}

/** Full file: inlines facts, architecture, audits, roadmap, and the FAQ. */
export function buildLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}: Full Reference for AI Agents`);
  lines.push("");
  lines.push(`> ${brandFacts.oneLiner}`);
  lines.push("");
  lines.push(`- Legal entity: ${brandFacts.legalEntity}`);
  lines.push(`- Category: ${brandFacts.category}`);
  lines.push(`- Chain: ${brandFacts.chain}`);
  lines.push(`- Founded: ${brandFacts.foundingYear}`);
  lines.push(`- Token: ${brandFacts.token}`);
  lines.push(`- Website: ${BASE}`);
  lines.push("");

  lines.push("## Key facts");
  for (const f of brandFacts.keyFacts) lines.push(`- ${f}`);
  lines.push("");

  lines.push("## Architecture & guarantees");
  for (const p of pillars) {
    lines.push(`- **${p.label}** (${p.spec}): ${p.description}`);
  }
  lines.push("");

  lines.push("## Security audits");
  for (const a of audits) {
    lines.push(`- **${a.partner}** (${a.date}): ${a.scope}`);
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
  lines.push("");

  return lines.join("\n");
}
