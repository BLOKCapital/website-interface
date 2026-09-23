/**
 * The protocol's public status, in one place. Every page that mentions
 * availability reads from here, so the site can't contradict itself again.
 * Update when the launch state changes.
 */
export const protocolStatus = {
  /** Short label for badges. */
  label: "In private testing",
  /** One sentence for heroes and callouts. */
  detail:
    "Gardens and curated indices are being tested privately on Arbitrum ahead of the public launch.",
  /** When Gardeners (on-chain managers) open. */
  gardeners: "2027",
  /** Token generation / IDO. */
  token: "Q2 2027",
} as const;
