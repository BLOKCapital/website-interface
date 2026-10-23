/**
 * The protocol's public status, in one place. Every page that mentions
 * availability reads from here, so the site can't contradict itself again.
 * Update when the launch state changes.
 */
export const protocolStatus = {
  /** Who can use it, in one sentence: the FAQ, the CTA band, the announcement bar and llms.txt. */
  access: "Gardens open to everyone at the public launch.",
  /** When Gardeners (on-chain managers) open. */
  gardeners: "2027",
  /** Token generation / IDO. */
  token: "Q2 2027",
} as const;
