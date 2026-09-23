import { CORE_REPO_URL } from "./indices";
import { links } from "./socials";

/**
 * The ecosystem, grouped by the job each project does inside BLOK Capital.
 * Every entry points at its evidence: the contract folder that integrates
 * it, or the docs page that names it. Nothing is listed for decoration.
 */
const facet = (name: string) => `${CORE_REPO_URL}/tree/main/src/garden/facets/utilityFacets/arbitrumOne/${name}`;

export type EcoItem = {
  name: string;
  /** Logo in /public, if we have one; otherwise a text tile. */
  logo?: string;
  scale?: number;
  /** What it does for a Garden, in a few words. */
  use: string;
  /** Where that's visible. */
  evidence: { label: string; href: string };
};

export type EcoGroup = { id: string; label: string; intro: string; items: EcoItem[] };

export const ecosystem: EcoGroup[] = [
  {
    id: "network",
    label: "Network and data",
    intro: "Where Gardens live, and where their numbers come from.",
    items: [
      { name: "Arbitrum One", use: "The Ethereum L2 every Garden and index runs on", evidence: { label: "Architecture docs", href: links.docsArchitecture } },
      { name: "Chainlink", logo: "/Socialtrust/chainlink-logo.svg", use: "USD price feeds for every index component", evidence: { label: "IndexComponentRegistry.sol", href: `${CORE_REPO_URL}/blob/main/src/indices/IndexComponentRegistry.sol` } },
      { name: "The Graph", use: "Indexes the DAO's governance events", evidence: { label: "blokc-graph", href: "https://github.com/BLOKCapital/blokc-graph" } },
    ],
  },
  {
    id: "trading",
    label: "Where rebalances trade",
    intro: "The pooled rebalancer quotes these pools and takes the best price.",
    items: [
      { name: "Uniswap", logo: "/Socialtrust/uniswap-logo.svg.png", use: "V2 and V3 pools", evidence: { label: "uniswapV3 facet", href: facet("uniswapV3") } },
      { name: "Camelot", use: "V2 and V3 pools, Arbitrum-native", evidence: { label: "camelotV3 facet", href: facet("camelotV3") } },
    ],
  },
  {
    id: "yield",
    label: "What a Yield Garden can use",
    intro: "Each venue is a facet: a module the DAO approves before any Garden can install it.",
    items: [
      { name: "Aave", logo: "/Socialtrust/Aave-logo.png", use: "Lend and borrow (V3)", evidence: { label: "aaveV3 facet", href: facet("aaveV3") } },
      { name: "GMX", logo: "/Socialtrust/gmx-logo.png", use: "Perpetuals (V2)", evidence: { label: "gmxV2 facet", href: facet("gmxV2") } },
      { name: "Pendle", use: "Fixed yield (V2)", evidence: { label: "pendleV2 facet", href: facet("pendleV2") } },
      { name: "Circle CCTP", use: "Native USDC across chains", evidence: { label: "cctp facet", href: facet("cctp") } },
    ],
  },
  {
    id: "wallet",
    label: "Wallet and governance",
    intro: "How you sign in without a seed phrase, and how the protocol decides.",
    items: [
      { name: "Web3Auth", logo: "/Socialtrust/web3auth-logo.svg", use: "Google sign-in with MPC keys", evidence: { label: "Architecture docs", href: links.docsArchitecture } },
      { name: "ZeroDev", logo: "/Socialtrust/zerodev-logo.svg", use: "Smart-account (ERC-4337) tooling", evidence: { label: "Docs", href: links.docs } },
      { name: "Aragon", use: "On-chain voting for the DAO (OSx)", evidence: { label: "BLOK Capital DAO", href: links.aragon } },
    ],
  },
];

/** Also in the codebase, not on Arbitrum: facets for other chains. */
export const otherChains = [
  { chain: "Ethereum", venues: "Balancer V3, Morpho Blue, SushiSwap V3, Uniswap V2 and V3", href: `${CORE_REPO_URL}/tree/main/src/garden/facets/utilityFacets/ethereum` },
  { chain: "Avalanche", venues: "Trader Joe V2", href: `${CORE_REPO_URL}/tree/main/src/garden/facets/utilityFacets/avalanche` },
];
