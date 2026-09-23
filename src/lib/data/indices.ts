/**
 * BLOKC2, BLOKC5 and BLOKC10 — everything here is sourced, and each source is
 * linked from the page that shows it:
 *
 *  - Components: confirmed by the BLOK Capital team (Sept 2026). BLOKC5
 *    and BLOKC10 differ from the older `script/deploy/DeployIndex.s.sol`;
 *    the team's lists are authoritative. Weights are deliberately not shown.
 *  - Methodology and guardrails: `MarketCapWeighted.sol`, `IndexMath.sol`,
 *    `Index.sol`, `IndexComponentRegistry.sol`, `Rebalancer.sol`,
 *    `IndexStorage.sol`, and the docs' Index Garden page.
 *  - Chainlink feeds: the addresses the protocol's component registry uses;
 *    each was checked on-chain (description() returns the pair shown).
 *
 * Deliberately absent until they're published: index contract addresses,
 * live weights, index value (NAV), performance and per-index risk ratings.
 * The docs state V1 isn't deployed and that only the docs and the audits repo
 * publish official addresses. When they are, fill `deployment` and the pages
 * start reading weights on-chain; nothing else needs to change.
 */

export const CORE_REPO_URL = "https://github.com/BLOKCapital/blokc-v1-core";
const src = (path: string) => `${CORE_REPO_URL}/blob/main/${path}`;

export const sources = {
  deployScript: src("script/deploy/DeployIndex.s.sol"),
  marketCapWeighted: src("src/indices/indexCalculations/MarketCapWeighted.sol"),
  indexMath: src("src/indices/libraries/IndexMath.sol"),
  index: src("src/indices/Index.sol"),
  componentRegistry: src("src/indices/IndexComponentRegistry.sol"),
  indexFactory: src("src/indices/IndexFactory.sol"),
  rebalancer: src("src/rebalancer/Rebalancer.sol"),
  gardenIndexStorage: src("src/garden/facets/indexFacets/IndexStorage.sol"),
  keeper: "https://github.com/BLOKCapital/worker-solver",
  docsIndexGarden: "https://docs.blokcapital.io/en/concepts/index-garden/index-garden",
  docsGardenIndex: "https://docs.blokcapital.io/en/resources/garden-index",
  docsRebalancer: "https://docs.blokcapital.io/en/concepts/protocol-concepts/rebalancer-network",
  docsIndicesLayer: "https://docs.blokcapital.io/en/smart-contracts/indices-layer",
} as const;

export type ComponentSymbol =
  | "BTC" | "ETH" | "LINK" | "UNI" | "ARB" | "AAVE" | "GMX" | "PENDLE" | "GRT" | "CRV" | "ZRO" | "DAI";

export type Component = {
  symbol: ComponentSymbol;
  name: string;
  /** What the asset is, in plain words. */
  role: string;
  /** Token held on Arbitrum One. */
  token: { symbol: string; address: `0x${string}` };
  /** Chainlink USD feed on Arbitrum One (verified on-chain). */
  feed: `0x${string}`;
  color: string;
  /** Round 128px logo in /public/tokens (official artwork via CoinGecko). */
  logo: string;
};

export const components: Record<ComponentSymbol, Component> = {
  BTC: { symbol: "BTC", name: "Bitcoin", role: "The largest crypto asset, held on Arbitrum as wrapped BTC.", token: { symbol: "WBTC", address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" }, feed: "0x6ce185860a4963106506C203335A2910413708e9", color: "#E6B872", logo: "/tokens/btc.webp" },
  ETH: { symbol: "ETH", name: "Ether", role: "Ethereum's native asset, and the gas token Arbitrum settles in. Held as WETH.", token: { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" }, feed: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", color: "#9DB2FF", logo: "/tokens/eth.webp" },
  LINK: { symbol: "LINK", name: "Chainlink", role: "Token of the oracle network whose feeds price every component here.", token: { symbol: "LINK", address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4" }, feed: "0x86E53CF1B870786351Da77A57575e79CB55812CB", color: "#6F9BFF", logo: "/tokens/link.webp" },
  UNI: { symbol: "UNI", name: "Uniswap", role: "Governance token of Uniswap, one of the DEXs the rebalancer routes through.", token: { symbol: "UNI", address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0" }, feed: "0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720", color: "#F0A3C8", logo: "/tokens/uni.webp" },
  ARB: { symbol: "ARB", name: "Arbitrum", role: "Governance token of Arbitrum, the network BLOK Capital runs on.", token: { symbol: "ARB", address: "0x912CE59144191C1204E64559FE8253a0e49E6548" }, feed: "0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6", color: "#7FC8F8", logo: "/tokens/arb.webp" },
  AAVE: { symbol: "AAVE", name: "Aave", role: "Governance token of Aave, the lending market Gardens compose with.", token: { symbol: "AAVE", address: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196" }, feed: "0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034", color: "#C7A6F5", logo: "/tokens/aave.webp" },
  GMX: { symbol: "GMX", name: "GMX", role: "Token of GMX, the perpetuals exchange native to Arbitrum.", token: { symbol: "GMX", address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" }, feed: "0xDB98056FecFff59D032aB628337A4887110df3dB", color: "#8FD6A8", logo: "/tokens/gmx.webp" },
  PENDLE: { symbol: "PENDLE", name: "Pendle", role: "Token of Pendle, the fixed-yield protocol Gardens compose with.", token: { symbol: "PENDLE", address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8" }, feed: "0x66853E19d73c0F9301fe099c324A1E9726953433", color: "#7ED6C9", logo: "/tokens/pendle.webp" },
  GRT: { symbol: "GRT", name: "The Graph", role: "Token of The Graph, the indexing network behind on-chain data APIs.", token: { symbol: "GRT", address: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7" }, feed: "0x0F38D86FceF4955B705F35c9e41d1A16e0637c73", color: "#A99CF0", logo: "/tokens/grt.webp" },
  CRV: { symbol: "CRV", name: "Curve", role: "Governance token of Curve, a stablecoin-focused exchange.", token: { symbol: "CRV", address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978" }, feed: "0xaebDA2c976cfd1eE1977Eac079B4382acb849325", color: "#F2917F", logo: "/tokens/crv.webp" },
  ZRO: { symbol: "ZRO", name: "LayerZero", role: "Token of LayerZero, a cross-chain messaging protocol.", token: { symbol: "ZRO", address: "0x6985884C4392D348587B19cb9eAAf157F13271cd" }, feed: "0x1940fEd49cDBC397941f2D336eb4994D599e568B", color: "#D9DED9", logo: "/tokens/zro.webp" },
  DAI: { symbol: "DAI", name: "Dai", role: "A USD stablecoin. Its price is designed to stay near $1.", token: { symbol: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" }, feed: "0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB", color: "#E3C07A", logo: "/tokens/dai.webp" },
};

export type IndexId = "blokc2" | "blokc5" | "blokc10";

export type IndexDef = {
  id: IndexId;
  name: string;
  /** Short line for selectors and cards. */
  tagline: string;
  /** Who it's for, in one human sentence. */
  forWho: string;
  /** What it tracks and why it's shaped this way. */
  summary: string;
  /** Plain-language notes that follow from the method (not predictions). */
  notes: string[];
  components: ComponentSymbol[];
  status: string;
  /** Official deployment — null until published in the docs. */
  deployment: null | { address: `0x${string}`; indexId: number };
};

export const indices: IndexDef[] = [
  {
    id: "blokc2",
    name: "BLOKC2",
    tagline: "Bitcoin and Ether",
    forWho: "For someone who wants crypto exposure and nothing exotic.",
    summary:
      "The two largest crypto assets, weighted by their market capitalisation. If Bitcoin is worth four times what Ether is, the index holds four times as much of it, in value.",
    notes: [
      "Two assets means very little to rebalance: weights move only when BTC and ETH move relative to each other.",
      "Market-cap weighting follows the market; it doesn't try to beat it.",
    ],
    components: ["BTC", "ETH"],
    status: "In private testing",
    deployment: null,
  },
  {
    id: "blokc5",
    name: "BLOKC5",
    tagline: "Five DeFi blue chips",
    forWho: "For someone who wants the protocols DeFi leans on, without picking between them.",
    summary:
      "Chainlink's oracles, Uniswap's exchange, Aave's lending market, Arbitrum itself and Pendle's fixed yield: five protocols much of on-chain finance runs through, weighted by market cap.",
    notes: [
      "No BTC or ETH: BLOKC5 holds the application layer, not the base assets.",
      "Uniswap, Aave and Pendle are also venues a Garden composes with, so you hold the protocols your Garden uses.",
      "Every component is in BLOKC10 too; BLOKC10 adds five more.",
    ],
    components: ["LINK", "UNI", "AAVE", "ARB", "PENDLE"],
    status: "In private testing",
    deployment: null,
  },
  {
    id: "blokc10",
    name: "BLOKC10",
    tagline: "The wider DeFi stack",
    forWho: "For someone who wants broad exposure to DeFi infrastructure rather than to BTC and ETH.",
    summary:
      "Everything in BLOKC5, plus Curve, LayerZero, The Graph, GMX and DAI: exchanges, lending, derivatives, indexing and cross-chain messaging, with a USD stablecoin alongside. It holds no BTC or ETH.",
    notes: [
      "Contains all five BLOKC5 components, plus CRV, ZRO, GRT, GMX and DAI.",
      "DAI is a component, so part of the index is a USD stablecoin, weighted by its market cap like everything else.",
      "No BTC or ETH: this index is about the application layer, not the base assets.",
    ],
    components: ["LINK", "DAI", "UNI", "AAVE", "ARB", "CRV", "ZRO", "PENDLE", "GRT", "GMX"],
    status: "In private testing",
    deployment: null,
  },
];

export const indexById = (id: string) => indices.find((i) => i.id === id);

/**
 * Methodology and guardrails, read from the contracts. "Where" is the file
 * the value lives in, so a reader can check it.
 */
export const methodology = {
  formula: "weight(i) = cap(i) ÷ Σ cap   ·   cap = circulating supply × Chainlink price",
  steps: [
    { title: "Price", body: "Each component's USD price is read from its Chainlink feed on Arbitrum." },
    { title: "Size", body: "Price × circulating supply gives each market cap. Supply is the one input that isn't an oracle: an authorised account posts it on-chain." },
    { title: "Weigh", body: "Each weight is that market cap's share of the total. Nobody sets a weight by hand." },
    { title: "Floor", body: "Any weight under 0.01% is raised to 0.01% so no component drops out, then all weights are rescaled to sum to 100%." },
  ],
  guardrails: [
    { k: "Minimum weight", v: "0.01%", why: "Keeps every component in the index, however small its market cap.", where: sources.marketCapWeighted },
    { k: "Weight recompute", v: "At most hourly", why: "Anyone can call rebalance() on the index; it refuses more than once an hour.", where: sources.index },
    { k: "Drift tolerance", v: "2% per asset", why: "Only assets more than 2% above or below their target value get traded. Small wobbles cost nothing.", where: sources.rebalancer },
    { k: "Max value loss", v: "0.5%", why: "A rebalance that would lose more than 0.5% of the Garden's value to slippage reverts.", where: sources.rebalancer },
    { k: "Pooled rebalance", v: "Once per 24h", why: "All Gardens following an index are rebalanced together in one batch, at most daily.", where: sources.rebalancer },
    { k: "Oracle freshness", v: "30 min – 26 h", why: "Each feed is registered with a heartbeat in this range. A price older than its heartbeat is never used.", where: sources.componentRegistry },
    { k: "Price sanity", v: "±10% vs average", why: "A new price more than 10% from its moving average isn't trusted; the last good price is used instead, and if that's stale too, pricing stops.", where: sources.componentRegistry },
    { k: "Max components", v: "250", why: "The factory's hard cap on any single index.", where: sources.indexFactory },
  ],
} as const;
