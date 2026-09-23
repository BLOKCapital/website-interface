/**
 * Official community channels — the single source for the header, footer,
 * contact page and structured data (sameAs). Only verified BLOK Capital URLs.
 */
export type SocialId = "discord" | "x" | "telegram" | "farcaster" | "github" | "youtube";

export type Social = {
  id: SocialId;
  label: string;
  href: string;
  /** What the channel is for, in a few words. */
  desc: string;
};

export const socials: Social[] = [
  { id: "discord", label: "Discord", href: "https://discord.com/invite/blokc", desc: "Community, support and private security reports" },
  { id: "x", label: "X", href: "https://x.com/blok_cap", desc: "Announcements and updates" },
  { id: "telegram", label: "Telegram", href: "https://t.me/BLOKCapital", desc: "Community chat" },
  { id: "farcaster", label: "Farcaster", href: "https://warpcast.com/blokc", desc: "Decentralised social" },
  { id: "github", label: "GitHub", href: "https://github.com/BLOKCapital", desc: "Contracts, front-end and audits" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@blokcapital", desc: "Walkthroughs and talks" },
];

export const social = (id: SocialId) => socials.find((s) => s.id === id)!;

/** Other official destinations used across the site. */
export const links = {
  docs: "https://docs.blokcapital.io",
  docsOverview: "https://docs.blokcapital.io/concepts/blok-c-overview",
  docsArchitecture: "https://docs.blokcapital.io/builders/blok-capital-v1",
  docsContracts: "https://docs.blokcapital.io/smart-contracts/introduction",
  docsAddresses: "https://docs.blokcapital.io/resources/smart-contract-address",
  docsSecurity: "https://docs.blokcapital.io/resources/audits-and-security/audits",
  docsContribute: "https://docs.blokcapital.io/resources/create-video",
  whitepaper: "https://docsend.com/view/4j6qvvrudyr6izyb",
  auditsRepo: "https://github.com/BLOKCapital/audits",
  aragon:
    "https://app.aragon.org/dao/arbitrum-mainnet/0x003a7E96B48Ee318DE5200Fcc9504480643237f3/dashboard?members=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting&proposals=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting",
  aragonMembers:
    "https://app.aragon.org/dao/arbitrum-mainnet/0x003a7E96B48Ee318DE5200Fcc9504480643237f3/members?members=0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1-tokenvoting&memberPanel=delegate",
  brandKit: "https://www.figma.com/slides/zTWeuy4nwdrmNp6K409cja",
  video: "https://youtu.be/O2xUopTuFWs",
} as const;
