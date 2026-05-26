export type TeamMember = {
  name: string;
  /** Path under /public/ — falls back to initials avatar if the file is missing. */
  image?: string;
  /** Initials shown on the avatar fallback. */
  initials: string;
  /** Optional social link — clicking the card opens it in a new tab. */
  href?: string;
  /** Tinted ring on the avatar / corner accent on the card. */
  ringColor?: string;
  /** Optional role / title under the name. */
  role?: string;
  /** Legacy field kept for the existing DaoCommunity contributor wall. */
  isContributor?: boolean;
};

export const team: TeamMember[] = [
  {
    name: "0xSheetal",
    initials: "SH",
    image: "/teamgrid/Sheetal.jpg",
    href: "https://x.com/0xSheetal",
    ringColor: "rgb(var(--moss))",
  },
  {
    name: "0xChintan",
    initials: "CH",
    image: "/teamgrid/Chintan.jpg",
    href: "https://x.com/0xChintan",
    ringColor: "rgb(var(--clay))",
  },
  {
    name: "Elvis",
    initials: "EL",
    image: "/teamgrid/Elvis.jpg",
    href: "https://x.com/Elvis_Nelson0",
    ringColor: "rgb(var(--ochre))",
  },
  {
    name: "John Adebayo",
    initials: "JA",
    image: "/teamgrid/john.jpg",
    href: "https://www.linkedin.com/in/johnadebayo/",
    ringColor: "rgb(var(--sage))",
  },
  {
    name: "Mohammed Raihani",
    initials: "MR",
    image: "/teamgrid/riahni.png",
    href: "https://x.com/mo_x0105",
    ringColor: "rgb(var(--moss))",
  },
  {
    name: "Prof. Andy Wynn",
    initials: "AW",
    image: "/teamgrid/Andywynn.jpeg",
    href: "https://www.linkedin.com/in/andy-wynn/",
    ringColor: "rgb(var(--clay))",
  },
  {
    name: "Aditya Biradar",
    initials: "AB",
    image: "/teamgrid/aditya.png",
    href: "https://x.com/0xPutAmaterasu",
    ringColor: "rgb(var(--sage))",
  },
  {
    name: "Vansh Sahay",
    initials: "VS",
    image: "/teamgrid/vansh.png",
    href: "https://x.com/vansh_sahay",
    ringColor: "rgb(var(--moss))",
  },
  {
    name: "Devang Gandhi",
    initials: "DG",
    image: "/teamgrid/Devang.png",
    href: "https://x.com/Dev_9007",
    ringColor: "rgb(var(--clay))",
  },
  {
    name: "Rohit Purkait",
    initials: "RP",
    image: "/teamgrid/Rohit.png",
    href: "https://x.com/codeswithroh",
    ringColor: "rgb(var(--ochre))",
  },
];
