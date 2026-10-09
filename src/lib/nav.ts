import { links } from "@/lib/data/socials";

export type NavLink = {
  href: string;
  label: string;
  /** One line under the label in menus. */
  hint?: string;
  external?: boolean;
};

export type NavGroup = {
  id: "protocol" | "governance" | "company";
  label: string;
  links: NavLink[];
};

/**
 * Primary navigation: three groups that open a menu, and Docs as a plain
 * link. Shared by the desktop menus and the mobile sheet.
 */
export const navGroups: NavGroup[] = [
  {
    id: "protocol",
    label: "Protocol",
    links: [
      { href: "/protocol", label: "How it works", hint: "Gardens, strategies and the architecture" },
      { href: "/indices", label: "Indices", hint: "BLOKC2, BLOKC5 and BLOKC10, priced live" },
      { href: "/security", label: "Security", hint: "Contracts, controls and audits" },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    links: [
      { href: "/governance", label: "Governance", hint: "How the DAO decides, and its proposals" },
      { href: "/token", label: "$BLOKC token", hint: "Supply, utility and allocation" },
      { href: links.aragon, label: "Vote on Aragon", hint: "The DAO's on-chain home", external: true },
    ],
  },
  {
    id: "company",
    label: "Company",
    links: [
      { href: "/about", label: "About", hint: "Why we built it, and who builds it" },
      { href: "/about#roadmap", label: "Roadmap", hint: "Every milestone since 2023" },
      { href: "/contact", label: "Contact", hint: "Channels and common questions" },
    ],
  },
];

export const docsLink: NavLink = { href: links.docs, label: "Docs", external: true };

const pathOf = (href: string) => href.split("#")[0];

/** Whether `href` is the current page (or a section of it). */
export const isCurrent = (href: string, path: string | null) => {
  const p = pathOf(href);
  return !!path && !/^https?:/.test(href) && (path === p || path.startsWith(`${p}/`));
};
