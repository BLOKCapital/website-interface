export type Partner = {
  image: string;
  name: string;
  /** Optional external link to the partner site. */
  href?: string;
  /**
   * Visual scale to compensate for logos with built-in padding inside their
   * source file. Tiles all render at the same height; some sources just have
   * more whitespace baked in. Default 1.
   */
  scale?: number;
};

export type PartnerGroup = {
  /** Section title displayed above the grid. */
  label: string;
  /** One-line caption underneath the label. */
  intro: string;
  partners: Partner[];
};

/**
 * Ecosystem partners — the real logos live in /public/Socialtrust/.
 * Grouped into two editorial sections:
 *   1. "Built on" — the smart-wallet + onboarding infrastructure behind every
 *      Garden (account abstraction, social login, fiat ramps).
 *   2. "Composes with" — on-chain venues, oracles and governance that
 *      Gardens route through.
 */
export const partnerGroups: PartnerGroup[] = [
  {
    label: "Built on",
    intro: "Smart-wallet infrastructure that lets the keys stay with you.",
    partners: [
      { image: "/Socialtrust/web3auth-logo.svg", name: "Web3Auth", href: "https://web3auth.io" },
      { image: "/Socialtrust/zerodev-logo.svg",  name: "ZeroDev",  href: "https://zerodev.app" },
      { image: "/Socialtrust/pimlico-logo.svg",  name: "Pimlico",  href: "https://pimlico.io" },
      { image: "/Socialtrust/transak-logo.svg",  name: "Transak",  href: "https://transak.com" },
    ],
  },
  {
    label: "Composes with",
    intro: "On-chain venues, oracles, governance and security every Garden routes through.",
    partners: [
      { image: "/Socialtrust/Aave-logo.png",      name: "Aave",       href: "https://aave.com" },
      { image: "/Socialtrust/gmx-logo.jpeg",      name: "GMX",        href: "https://gmx.io" },
      { image: "/Socialtrust/quick-logo.png",     name: "QuickSwap",  href: "https://quickswap.exchange", scale: 1.3 },
      { image: "/Socialtrust/chainlink-logo.svg", name: "Chainlink",  href: "https://chain.link" },
      { image: "/Socialtrust/aragon-logo.svg",    name: "Aragon",     href: "https://aragon.org",         scale: 1.8 },
      { image: "/Socialtrust/chainforce.png",     name: "Chainforce", href: "https://chainforce.tech" },
    ],
  },
];
