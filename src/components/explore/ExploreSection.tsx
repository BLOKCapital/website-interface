import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProtocolExplorer, type ExploreStep } from "./ProtocolExplorer";
import { NetworkPulse } from "@/components/live/NetworkPulse";
import { links } from "@/lib/data/socials";
import { sources } from "@/lib/data/indices";

/**
 * The protocol as layers you can walk through, top to bottom. Every claim
 * here restates the docs or the contracts; links go to the source.
 */
const steps: ExploreStep[] = [
  {
    id: "you",
    label: "You",
    title: "You sign in and own a Garden.",
    body: "Sign in with Google (no seed phrase) or your own wallet. A Garden is created at your address, and it's yours: ownership is an NFT in your wallet.",
    behind: "The Garden Factory deploys a new Diamond contract for you with CREATE2, up to 10 per user. Only you can move funds out of it.",
    facts: [
      { k: "Account", v: "ERC-4337 smart account" },
      { k: "Ownership", v: "ERC-721 token" },
      { k: "Per user", v: "Up to 10 Gardens" },
    ],
    link: { label: "User journey in the docs", href: links.docsOverview },
  },
  {
    id: "garden",
    label: "Garden",
    title: "Your Garden is a modular smart wallet.",
    body: "Capabilities are facets you install: follow an index, lend on Aave, trade perps on GMX. Remove one and nothing else changes.",
    behind: "Gardens use the EIP-2535 Diamond pattern. The usual diamondCut is blocked; upgrades go through an Upgrade facet that checks the new code's hash against the DAO's Facet Registry.",
    facts: [
      { k: "Pattern", v: "EIP-2535 Diamond" },
      { k: "Base facets", v: "4, immutable" },
      { k: "Upgrades", v: "DAO-approved only" },
    ],
    link: { label: "Facets in the docs", href: links.docsContracts },
  },
  {
    id: "index",
    label: "Index",
    title: "An index says what to hold.",
    body: "Connect your Garden to BLOKC2, BLOKC5 or BLOKC10. The index defines the components and their target weights; your Garden holds the actual tokens.",
    behind: "Each Index contract stores its components and weights. Its rebalance() recomputes weights at most once an hour, and anyone may call it: there is no privileged operator.",
    facts: [
      { k: "Indices", v: "BLOKC2 · 5 · 10" },
      { k: "Weighting", v: "Market cap" },
      { k: "Max components", v: "250 per index" },
    ],
    link: { label: "Explore the indices", href: "/indices" },
  },
  {
    id: "data",
    label: "Data",
    title: "Chainlink prices every component.",
    body: "Weights come from market caps, and market caps come from prices. Every price is a Chainlink feed on Arbitrum, read on-chain.",
    behind: "The component registry rejects a feed older than its heartbeat, and distrusts a price more than 10% from its moving average, falling back to the last good one.",
    facts: [
      { k: "Oracle", v: "Chainlink, on-chain" },
      { k: "Heartbeat", v: "30 min – 26 h" },
      { k: "Sanity band", v: "±10% vs average" },
    ],
    link: { label: "IndexComponentRegistry.sol", href: sources.componentRegistry },
    extra: <NetworkPulse />,
  },
  {
    id: "rebalance",
    label: "Rebalance",
    title: "One pooled trade keeps everyone on target.",
    body: "When your holdings drift from the index, a rebalancer brings them back. All Gardens on the same index are rebalanced together, so everyone gets the same execution.",
    behind: "The Rebalancer nets drift across every Garden on an index, trades only assets more than 2% off target, takes the best quote across Uniswap and Camelot pools, and reverts if value loss would exceed 0.5%. Anyone can trigger it once a day.",
    facts: [
      { k: "Drift trigger", v: "2% per asset" },
      { k: "Slippage cap", v: "0.5%" },
      { k: "Cadence", v: "At most daily" },
    ],
    link: { label: "Rebalancer network docs", href: sources.docsRebalancer },
  },
  {
    id: "dao",
    label: "DAO",
    title: "Changes need a vote.",
    body: "New indices, new facets and protocol upgrades are approved on-chain through Aragon. Until $BLOKC launches, core DAO members vote; then token holders do.",
    behind: "Index facets are deployed through the Index Factory and need DAO approval before use. A security council, tracked through ENS, can pause new Garden deployments.",
    facts: [
      { k: "Voting", v: "Aragon OSx" },
      { k: "Network", v: "Arbitrum One" },
      { k: "Token", v: "$BLOKC, 10B supply" },
    ],
    link: { label: "How governance works", href: "/governance" },
  },
];

export function ExploreSection() {
  return (
    <Section
      id="explore"
      tone="surface"
      eyebrow="Explore the protocol"
      title={
        <>
          From your signature <em className="text-sand">to the DAO.</em>
        </>
      }
      description="Six layers, top to bottom. Each one tells you what it does and what actually happens on-chain, with a link to the source."
    >
      <Reveal>
        <ProtocolExplorer steps={steps} />
      </Reveal>
    </Section>
  );
}
