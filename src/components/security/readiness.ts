import { audits } from "@/lib/data/audits";
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

const credshields = audits.find((a) => a.kind === "report")!;
/** "26 findings", as the report's own card states it. */
const findings = credshields.scope.match(/\d+ findings/)?.[0];

export const readiness: ReadinessItem[] = [
  {
    id: "garden-audit",
    criterion: "Garden contracts audited",
    detail: findings ? `By ${credshields.partner}. ${findings}, all fixed and retested.` : `By ${credshields.partner}.`,
    status: "done",
    date: credshields.auditedOn ? `Audited ${credshields.auditedOn}` : undefined,
    proof: { label: "Read the report", href: credshields.url!, cta: "security_readiness_audit_report" },
  },
  {
    // /security#audits: "One published audit so far. More before launch."
    id: "index-audit",
    criterion: "Index and rebalancer contracts audited",
    detail: "Newer than the Garden audit. They get a published review before anyone's money depends on them.",
    status: "planned",
    proof: { label: "Audit scope", href: "#audits" },
  },
  {
    // /security#contracts: "Mainnet deployment is in progress."
    id: "addresses",
    criterion: "Mainnet contract addresses published and verified",
    detail: "Mainnet deployment is in progress. Verified addresses will be published in the docs and the audits repository.",
    status: "progress",
    proof: { label: "Contract registry", href: "#contracts" },
  },
  {
    // The security docs, as /security#disclosure quotes them: "No dates set yet."
    id: "bounty",
    criterion: "Public bug bounty",
    detail: "A public programme on Immunefi. No dates set yet.",
    status: "planned",
    proof: { label: "Security docs", href: links.docsSecurity, cta: "security_readiness_docs" },
  },
  {
    id: "contests",
    criterion: "Open audit contests",
    detail: "On Cantina and Code4rena. No dates set yet.",
    status: "planned",
    proof: { label: "Security docs", href: links.docsSecurity, cta: "security_readiness_docs" },
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
