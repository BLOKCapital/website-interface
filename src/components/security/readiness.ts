import { auditStatus } from "@/lib/data/audits";
import { links } from "@/lib/data/socials";

/**
 * Launch readiness (INS-03): what's done and what isn't yet, in one list.
 *
 * Every status restates what the site already says, and links to where it
 * says it. A date appears only where the site states one (D-02, D-04): no
 * launch dates, no target quarters. Don't mark a row Done here before the
 * page it links to says so.
 */

export type ReadinessStatus = "done" | "progress" | "planned";

export type ReadinessItem = {
  id: string;
  criterion: string;
  /** One line, in words already on the site. */
  detail: string;
  status: ReadinessStatus;
  /** Only when the site states it. */
  date?: string;
  proof: { label: string; href: string; cta?: string };
};

export const readiness: ReadinessItem[] = [
  {
    // lib/data/audits.ts: new independent audits, their reports in the docs.
    id: "audits",
    criterion: "Independent audits published",
    detail: auditStatus.detail,
    status: "progress",
    proof: { label: "Audit status", href: "#audits" },
  },
  {
    // /security#contracts: "Mainnet deployment is in progress."
    id: "addresses",
    criterion: "Mainnet contract addresses published and verified",
    detail: "Mainnet deployment is in progress. Verified addresses will be published in the docs.",
    status: "progress",
    proof: { label: "Addresses in the docs", href: links.docsAddresses, cta: "security_readiness_docs_addresses" },
  },
  {
    // The security docs, as /security#disclosure quotes them: "No dates set yet."
    id: "bounty",
    criterion: "Public bug bounty",
    detail: "A public programme on Immunefi. No dates set yet.",
    status: "planned",
    proof: { label: "How to report", href: "#disclosure" },
  },
  {
    id: "contests",
    criterion: "Open audit contests",
    detail: "On Cantina and Code4rena. No dates set yet.",
    status: "planned",
    proof: { label: "How to report", href: "#disclosure" },
  },
  {
    // /governance "Current phase": core members vote until the token launches.
    id: "voting",
    criterion: "Public $BLOKC voting",
    detail: "Until the token launches, only the core DAO members listed on Aragon vote. Public $BLOKC voting follows the IDO.",
    status: "planned",
    proof: { label: "Current phase", href: "/governance#process" },
  },
  // TODO(owner): post-deploy monitoring. Not stated anywhere on the site, so
  // no row yet (INS-03; Euler's "monitoring" item). Add it with its real status.
  // TODO(owner): formal verification, source verification on Arbiscan as a
  // separate row, and any dates for the rows above (D-02, D-04) wait on you.
];
