export type Social = {
  id: string;
  title: string;
  desc: string;
  href: string;
  /** Brand tint used for the glyph chip background — soft, not saturated. */
  tint: string;
};

export const contributeCard = {
  title: "How to contribute",
  desc: "Find out all the different ways you can roll up your sleeves and help tend BLOK Capital, code, design, writing, governance, the lot.",
  href: "https://docs.blokcapital.io/resources/create-video",
  cta: "Read the contributor guide",
};

export const socials: Social[] = [
  {
    id: "github",
    title: "GitHub",
    desc: "Contribute to code, design, articles, issues and PRs welcome.",
    href: "https://github.com/BLOKCapital",
    tint: "rgb(31 26 20)",
  },
  {
    id: "telegram",
    title: "Telegram",
    desc: "Chat with us, instant support from mods and a global community.",
    href: "https://t.me/blok_capital",
    tint: "rgb(40 134 200)",
  },
  {
    id: "x",
    title: "X",
    desc: "Updates, announcements, and important news in real time.",
    href: "https://x.com/blok_cap",
    tint: "rgb(31 26 20)",
  },
  {
    id: "farcaster",
    title: "Farcaster",
    desc: "Join us in the decentralized social future.",
    href: "https://warpcast.com/blokc",
    tint: "rgb(132 84 196)",
  },
  {
    id: "youtube",
    title: "YouTube",
    desc: "Watch the latest walkthroughs, talks, and tutorials.",
    href: "https://www.youtube.com/@blokcapital",
    tint: "rgb(196 60 50)",
  },
  {
    id: "discord",
    title: "Discord",
    desc: "Discuss, contribute, and get help. The whole team hangs out here.",
    href: "https://discord.com/invite/blokc",
    tint: "rgb(88 101 196)",
  },
];
