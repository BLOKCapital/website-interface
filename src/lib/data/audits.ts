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
    scope: "Full protocol audit of BLOKC v1.0 — all findings reviewed and resolved.",
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
