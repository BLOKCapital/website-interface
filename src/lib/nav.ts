import { links } from "@/lib/data/socials";
import { audits } from "@/lib/data/audits";

/** The one published audit report, for the Trust menu's hint. */
const report = audits.find((a) => a.kind === "report");

export type NavLink = {
  href: string;
  label: string;
  /** One line under the label in menus. */
  hint?: string;
  external?: boolean;
};

export type NavGroup = {
  id: "protocol" | "governance" | "company" | "trust";
  label: string;
  links: NavLink[];
};

/**
 * Primary navigation: four groups that open a menu, then Docs as a plain
 * top-level link. Shared by the desktop menus and the mobile sheet. The
 * group names (Protocol, Governance, Company, Trust) are what the menu
 * triggers say; tests find the triggers by those names.
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
  {
    // Every way to check us, one step from anywhere (D-13): the security
    // page's sections, the proof first (audits, then the contracts
    // themselves), then the controls, the official list and how to report.
    id: "trust",
    label: "Trust",
    links: [
      { href: "/security", label: "Security overview", hint: "What's done, and what isn't yet" },
      {
        href: "/security#audits",
        label: "Audits",
        hint: report ? [report.partner, report.coverage?.covered, report.auditedOn].filter(Boolean).join(" · ") : "Who reviewed which code, and when",
      },
      { href: "/security#contracts", label: "Contracts and addresses", hint: "Every contract, and where to check it" },
      { href: "/security#controls", label: "Who can change what", hint: "Every actor against every action" },
      { href: "/security#official", label: "Official links", hint: "Check a link or address before you use it" },
      { href: "/security#disclosure", label: "Report a vulnerability", hint: "Privately, in a Discord ticket" },
    ],
  },
];

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
