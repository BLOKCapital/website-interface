export type Audit = {
  partner: string;
  scope: string;
  date: string;
  url?: string;
  /** "report" links to the audit itself; "tool" to the scanner's own site. */
  kind: "report" | "tool";
};

export const audits: Audit[] = [
  {
    partner: "CredShields",
    scope: "Garden smart contracts. 26 findings (0 critical, 2 high, 12 medium, 5 low, 2 informational, 5 gas), all fixed and retested. The index and rebalancer code came later and isn't in this report's scope.",
    date: "Dec 2024",
    url: "https://github.com/BLOKCapital/audits/blob/main/audits/Blok%20Capital%20Final%20Report.pdf",
    kind: "report",
  },
  {
    partner: "SolidityScan",
    scope: "Automated security scan across the Diamond controller and core facets, re-run on every release.",
    date: "Ongoing",
    url: "https://solidityscan.com",
    kind: "tool",
  },
  {
    partner: "Octane",
    scope: "AI-assisted contract review covering the indices and rebalance logic.",
    date: "Ongoing",
    url: "https://www.octane.security",
    kind: "tool",
  },
];
