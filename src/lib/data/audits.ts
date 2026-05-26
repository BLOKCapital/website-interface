export type Audit = {
  partner: string;
  scope: string;
  date: string;
  url?: string; // PDF or report, placeholder until live
};

export const audits: Audit[] = [
  {
    partner: "CredShields",
    scope: "BLOKC v1.0 full protocol audit. 2 High, 12 Major, 5 Minor, 2 Informational issues, all fixed.",
    date: "Dec 2024",
    url: "https://github.com/BLOKCapital/audits/blob/main/audits/Blok%20Capital%20Final%20Report.pdf",
  },
  {
    partner: "SolidityScan",
    scope: "Automated security scan across the Diamond controller and core facets, re-run on every release.",
    date: "Ongoing",
    url: "https://solidityscan.com",
  },
  {
    partner: "Octane",
    scope: "AI-assisted contract review covering the indices and rebalance logic.",
    date: "Ongoing",
    url: "https://www.octane.security",
  },
];
