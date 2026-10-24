/**
 * Where the protocol's audits stand, in one place. The earlier audit is out
 * of date and is no longer shown, and the site links to no audit page or
 * report (owner, 2026-10-23): new independent audits are under way, and
 * their reports will be published in the docs. Every page that mentions
 * audits reads from here.
 *
 * When a report is out, say only what it says, here, and the pages follow.
 * Never name an auditor, a date or a finding count before the report does.
 */
export const auditStatus = {
  /** The state, for readouts and stamps. */
  label: "In progress",
  /** One sentence, for cards, answers and llms.txt. */
  detail: "New independent audits are under way. The reports will be published in the BLOK Capital docs once they're final.",
} as const;
