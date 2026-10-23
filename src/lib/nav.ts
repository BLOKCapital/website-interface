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
 * Primary navigation: three groups that open a menu, then Security and Docs
 * as plain top-level links. Shared by the desktop menus and the mobile sheet.
 * The group names (Protocol, Governance, Company) are what the menu triggers
 * say; tests find the triggers by those names.
 */
export const navGroups: NavGroup[] = [
  {
    id: "protocol",
    label: "Protocol",
    links: [
      { href: "/protocol", label: "Protocol overview", hint: "How a Garden works, layer by layer" },
      { href: "/indices", label: "Indices", hint: "BLOKC2, BLOKC5 and BLOKC10, priced live" },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    links: [
      { href: "/governance", label: "How the DAO decides", hint: "The process, and its proposals" },
      { href: "/token", label: "$BLOKC token", hint: "Supply, utility and allocation" },
      // Not "Vote on Aragon": only core members vote until the token launches (CRO-17).
      { href: links.aragon, label: "The DAO on Aragon", hint: "Proposals, votes and members", external: true },
    ],
  },
  {
    id: "company",
    label: "Company",
    links: [
      { href: "/about", label: "About", hint: "Why we built it, and who builds it" },
      { href: "/about#roadmap", label: "Roadmap", hint: "Every milestone since 2023" },
      { href: "/contact", label: "Contact", hint: "Channels and common questions" },
      { href: links.whitepaper, label: "Whitepaper", hint: "The full paper, hosted on DocSend", external: true },
    ],
  },
];

/** A top-level link beside Docs (D-13), so the trust page is one step from anywhere. */
export const securityLink: NavLink = { href: "/security", label: "Security", hint: "Contracts, controls and audits" };

export const docsLink: NavLink = { href: links.docs, label: "Docs", hint: "Guides, contracts and addresses", external: true };

/** The one label for every Discord button (CRO-10). Discord is the community's home. */
export const DISCORD_LABEL = "Join the Discord";

/** The app (in private testing): the header's and mobile menu's primary action. */
export const appLink: NavLink = { href: links.app, label: "Launch App", external: true };

const pathOf = (href: string) => href.split("#")[0];

/** Whether `href` is the current page (or a section of it). */
export const isCurrent = (href: string, path: string | null) => {
  const p = pathOf(href);
  return !!path && !/^https?:/.test(href) && (path === p || path.startsWith(`${p}/`));
};
