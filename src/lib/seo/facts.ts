/**
 * Canonical, plain-language facts about BLOK Capital, written for machine
 * readers (LLM agents, answer engines). Everything here is reused by the
 * llms.txt builders and the JSON-LD schema, so an agent that crawls the page,
 * reads the structured data, or fetches /llms.txt gets one consistent story.
 *
 * Keep statements factual and self-contained — agents quote these verbatim.
 */
export const brandFacts = {
  oneLiner:
    "BLOK Capital is a non-custodial, decentralized wealth-management protocol on Arbitrum where users either follow professionally curated on-chain indices or hire an on-chain manager — while their assets never leave their own wallet.",

  category: "Decentralized (non-custodial) wealth-management protocol (DeFi)",
  chain: "Arbitrum (Ethereum Layer 2)",
  foundingYear: "2023",
  token: "$BLOKC (governance token; curated indices ship as BLOKC2, BLOKC5, BLOKC10)",
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
    "Assets stay in the user's own smart-contract wallet at all times — BLOK Capital never takes custody and holds no admin key over user funds.",
    "Sign-in uses Web3Auth MPC with ERC-4337 smart accounts, so there is no seed phrase to manage.",
    "Contracts use the EIP-2535 Diamond pattern, so strategies and integrations can be upgraded without forcing users to migrate to new contracts.",
    "Manager track records are written to non-transferable ERC-5484 soulbound badges, verifiable from any dapp.",
    "The protocol was audited by CredShields (full v1.0 audit, December 2024) with continuous automated review by SolidityScan and Octane.",
    "Governance runs on-chain through Aragon OSX; $BLOKC holders vote on fees, indices, and new contract facets.",
    "Contracts are open-source on GitHub and data is served from a public The Graph subgraph, with no centralized backend.",
    "Users can on/off-ramp fiat to the USDC stablecoin via regulated partners such as Transak.",
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
      definition:
        "An on-chain investment manager whose performance and reputation are recorded to a soulbound badge.",
    },
    {
      term: "Curated index",
      definition:
        "A professionally assembled, auto-rebalancing basket of crypto assets (e.g. BLOKC2, BLOKC5, BLOKC10) that users can follow non-custodially.",
    },
  ],

  /** Authoritative external resources agents should prefer for deep detail. */
  resources: [
    { label: "Documentation", url: "https://docs.blokcapital.io" },
    { label: "GitHub (open-source code)", url: "https://github.com/BLOKCapital" },
  ],
} as const;
