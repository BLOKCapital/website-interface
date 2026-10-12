export type Audit = {
  partner: string;
  scope: string;
  /**
   * Badge date. Kept for backward compatibility: for a report it's the
   * report's own date, which isn't when the audit ran. Prefer `auditedOn`
   * and `reportDate`, labelled, wherever both fit.
   */
  date: string;
  /** When the review itself ran (a report only), e.g. "Nov 2024". */
  auditedOn?: string;
  /** The date printed on the report (a report only), e.g. "Dec 2024". */
  reportDate?: string;
  /** When the fixes were retested (a report only), e.g. "28 Nov 2024". */
  retestedOn?: string;
  /**
   * What the review covers, in words already on the site: `covered` is short
   * enough for a caption ("Garden contracts"); `notCovered` is the caveat
   * /security and the FAQ already state.
   */
  coverage?: { covered: string; notCovered?: string };
  url?: string;
  /** "report" links to the audit itself; "tool" to the scanner's own site. */
  kind: "report" | "tool";
};

export const audits: Audit[] = [
  {
    partner: "CredShields",
    scope: "Garden smart contracts. 26 findings (0 critical, 2 high, 12 medium, 5 low, 2 informational, 5 gas), all fixed and retested. The index and rebalancer code came later and isn't in this report's scope.",
    date: "Dec 2024",
    // Dates as printed in the linked report ("Blok Capital Final Report.pdf", 51 pages):
    // - PDF p. 1 (cover): "CredShields Smart Contract Audit December 1st, 2024".
    // - PDF pp. 1, 4 (§1 Executive Summary) and 6 (§2.1): audit window
    //   "November 15th, 2024, to November 20th, 2024".
    // - PDF pp. 1, 4 and 16 (§4 Remediation Status): "A retest was performed on
    //   November 28th, 2024"; every finding reads "Fixed [Nov 28th, 2024]".
    auditedOn: "Nov 2024",
    reportDate: "Dec 2024",
    retestedOn: "28 Nov 2024",
    // PDF p. 4: the only asset in scope is "Gardens Smart Contracts".
    coverage: {
      covered: "Garden contracts",
      notCovered: "The index and rebalancer code came later and isn't in this report's scope.",
    },
    url: "https://github.com/BLOKCapital/audits/blob/main/audits/Blok%20Capital%20Final%20Report.pdf",
    kind: "report",
  },
  // No public SolidityScan or Octane report exists in any official channel
  // (checked 2026-10-11): the audits repo holds only the CredShields PDF, the
  // docs security page names neither, and no public BLOKCapital repo links a
  // report. If one is published, link it in `url` and set kind: "report".
  {
    partner: "SolidityScan",
    scope: "Internal tooling · no public report. Automated security scan across the Diamond controller and core facets, re-run on every release.",
    date: "Ongoing",
    url: "https://solidityscan.com",
    kind: "tool",
  },
  {
    partner: "Octane",
    scope: "Internal tooling · no public report. AI-assisted contract review covering the indices and rebalance logic.",
    date: "Ongoing",
    url: "https://www.octane.security",
    kind: "tool",
  },
];
