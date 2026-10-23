/**
 * The CredShields findings, from the report's summary table (audits repo).
 * All fixed and retested (audits.ts: retestedOn). Shared by the findings
 * grid on /security#audits and the hero readout.
 */
export type Severity = "Critical" | "High" | "Medium" | "Low" | "Informational" | "Gas";

export const findings: { k: Severity; n: number; c: string }[] = [
  { k: "Critical", n: 0, c: "bg-negative" },
  { k: "High", n: 2, c: "bg-negative/80" },
  { k: "Medium", n: 12, c: "bg-caution" },
  { k: "Low", n: 5, c: "bg-sand/70" },
  { k: "Informational", n: 2, c: "bg-cobalt/70" },
  { k: "Gas", n: 5, c: "bg-fg-subtle/60" },
];

export const findingsTotal = findings.reduce((n, f) => n + f.n, 0);
