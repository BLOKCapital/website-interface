/**
 * Canonical, plain-language facts about BLOK Capital, written for machine
 * readers (LLM agents, answer engines). Everything here is reused by the
 * llms.txt builders and the JSON-LD schema (and the /protocol glossary), so
 * an agent that crawls the page, reads the structured data, or fetches
 * /llms.txt gets one consistent story.
 *
 * Keep statements factual and self-contained — agents quote these verbatim.
 * Dates, status and addresses come from the data modules, never retyped, so
 * these can't drift from the pages that show them (SEO-04).
 */
import { faqs } from "@/lib/data/faqs";
import { auditStatus } from "@/lib/data/audits";
import { protocolStatus } from "@/lib/data/status";
import { BLOKC_TOKEN } from "@/lib/data/token";
import { CORE_REPO_URL } from "@/lib/data/indices";
import { links } from "@/lib/data/socials";

/** A visible FAQ answer, verbatim; the build fails if the question is renamed. */
function faqAnswer(question: string) {
  const faq = faqs.find((f) => f.question === question);
  if (!faq) throw new Error(`facts.ts: no FAQ "${question}" in lib/data/faqs.ts`);
  return faq.answer;
}

/** The fee answer, exactly as the FAQ gives it (JSON-LD Offer, llms-full Fees). */
export const feeText = faqAnswer("What does it cost?");


/** The DAO's address, read from the Aragon link itself (as /security#official does). */
export const DAO_ADDRESS = links.aragon.match(/0x[0-9a-fA-F]{40}/)![0];

/** $BLOKC, as /token states it. */
export const tokenFacts = {
  name: "$BLOKC",
  standard: "ERC-20",
  network: "Arbitrum One (chain ID 42161)",
  contract: BLOKC_TOKEN,
  decimals: 18,
  supply: "10,000,000,000 $BLOKC (10B)",
  launch: `IDO planned for ${protocolStatus.token}`,
} as const;

/** Governance as /governance states it today. */
export const governanceFacts = {
  platform: "Aragon OSx, on Arbitrum One",
  currentPhase: `Core members vote until the token launches. Before the public token launch, only the core DAO members listed on Aragon can vote. Public $BLOKC voting follows the IDO, planned for ${protocolStatus.token}. Every member is verifiable on-chain.`,
  decides: ["Protocol upgrades and new facets", "New indices and index facets", "Fee parameters", "Treasury allocations"],
  process: "Propose, discuss in public, vote on-chain via Aragon OSx, then execute through Aragon OSx. No admin override.",
} as const;

export const brandFacts = {
  oneLiner: `BLOK Capital is a non-custodial, decentralised wealth-management protocol on Arbitrum where users follow curated on-chain indices and yield strategies while their assets stay in their own smart-contract wallet. Manager-run Gardens are planned for ${protocolStatus.gardeners}.`,

  category: "Decentralised (non-custodial) wealth-management protocol (DeFi)",
  chain: "Arbitrum (Ethereum Layer 2)",
  foundingYear: "2023",
  token:
    "$BLOKC, the governance token (ERC-20 on Arbitrum One). The indices BLOKC2, BLOKC5 and BLOKC10 are separate: baskets a Garden follows, holding the component tokens itself.",
  legalEntity: "BLOK Capital DAO LLC",

  /** Topics the entity is authoritative on — maps to schema.org knowsAbout. */
  knowsAbout: [
    "Decentralized wealth management",
    "Non-custodial crypto investing",
    "On-chain asset management",
    "DeFi index funds",
    "Account abstraction (ERC-4337)",
    "Diamond proxy contracts (EIP-2535)",
    "Soulbound token reputation (ERC-5484)",
    "DAO governance",
    "Arbitrum",
  ],

  /**
   * Short, quotable facts. Each is a complete claim an agent can cite without
   * needing surrounding context.
   */
  keyFacts: [
    "Assets stay in the user's own smart-contract wallet at all times. BLOK Capital never takes custody and holds no admin key over user funds.",
    "Gardens are ERC-4337 smart accounts. Signing in with Google uses Web3Auth MPC, so there is no seed phrase; users who bring their own wallet keep that wallet's seed phrase. BLOK Capital can't restore an account, so users add recovery guardians.",
    "Contracts use the EIP-2535 Diamond pattern, so strategies and integrations can be upgraded without forcing users to migrate to new contracts.",
    `Planned for ${protocolStatus.gardeners}: manager (Gardener) track records will be written to non-transferable ERC-5484 soulbound badges, verifiable from any dapp.`,
    `The protocol is not yet open to the public. ${protocolStatus.access}`,
    `Audits: ${auditStatus.detail}`,
    `Governance runs on-chain through Aragon OSx. Until the $BLOKC token launches, only the core DAO members listed on Aragon vote; public $BLOKC voting follows the IDO, planned for ${protocolStatus.token}.`,
    `${tokenFacts.name} is the governance token, an ${tokenFacts.standard} on Arbitrum One at ${tokenFacts.contract}. The BLOKC2, BLOKC5 and BLOKC10 indices are not tokens: a Garden following one holds the component tokens itself.`,
    `Contracts are public on GitHub (${CORE_REPO_URL.replace(/^https:\/\//, "")}) and protocol state lives on Arbitrum, readable by anyone.`,
    "BLOK Capital indices (BLOKC2, BLOKC5, BLOKC10) are market-cap weighted: each weight is a component's share of total market cap, priced by Chainlink feeds on Arbitrum.",
    "Users can buy USDC by card or bank through an on-ramp such as Transak, which runs its own KYC, or send crypto they already hold.",
  ],

  /** Product-specific vocabulary, so agents interpret site copy correctly. */
  glossary: [
    {
      term: "Garden",
      definition:
        "A user's on-chain investment portfolio, held in their own smart-contract wallet at their own address.",
    },
    {
      term: "Gardener",
      definition: `A planned on-chain investment-manager role (targeted for ${protocolStatus.gardeners}) whose performance and reputation will be recorded to a soulbound badge.`,
    },
    {
      term: "Curated index",
      definition:
        "A fixed basket of crypto assets (BLOKC2, BLOKC5 or BLOKC10) that a Garden can follow non-custodially. The team chooses the components and the DAO approves them; weights are set on-chain by market cap, and the basket is rebalanced on-chain.",
    },
  ],

  /** Authoritative external resources agents should prefer for deep detail. */
  resources: [
    { label: "Documentation", url: links.docs },
    { label: "GitHub (open-source code)", url: "https://github.com/BLOKCapital" },
  ],
} as const;
