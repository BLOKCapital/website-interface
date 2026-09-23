import { rpcBatch, word } from "./rpc";

/**
 * BLOK Capital DAO on Aragon OSx (Arbitrum One). Addresses are the ones the
 * site already links to on app.aragon.org.
 */
export const DAO_ADDRESS = "0x003a7E96B48Ee318DE5200Fcc9504480643237f3";
export const VOTING_PLUGIN = "0xbe40B1D2f9f64163Ab6F0030819E89d07045d3D1";
/** First block with a DAO event; logs are read from here, not from genesis. */
const FROM_BLOCK = 171065270;

/**
 * Event topics = keccak256 of the Aragon OSx event signatures (computed, then
 * matched against the logs these contracts actually emit).
 */
const TOPICS = {
  "0xa6c1f8f4276dc3f243459e13b557c84e8f4e90b2e09070bad5f6909cee687c92": "proposal",
  "0xb83d25c6a5d258561330739951487acb4bd09ba5190b5d32c4f261817d906792": "vote",
  "0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f": "passed",
  "0xd4e57c2049f004fb297ef78591cd409503ceb6b2c722d7ffed032fc99e5f3b58": "executed",
  "0xa8a18d06ddd19f24a872740e3d364c86f62be25f7154525dda18ef07fda46f3e": "settings",
  "0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b": "upgraded",
  "0x0f579ad49235a8c1fd9041427e7067b1eb10926bbed380bf6fabc73e0e807644": "granted",
  "0x3ca48185ec3f6e47e24db18b13f1c65b1ce05da1659f9c1c4fe717dda5f67524": "revoked",
  "0xbb39ebb37e60fb5d606ffdb749d2336e56b88e6c88c4bd6513b308f643186eed": "metadata",
} as const;

export type ActivityKind = (typeof TOPICS)[keyof typeof TOPICS];

export type ActivityEvent = {
  key: string;
  kind: ActivityKind;
  /** Block timestamp (ms). */
  at: number;
  block: number;
  tx: string;
  /** Decimal proposal index, when the event concerns a proposal. */
  proposal?: string;
  /** Voter or creator address. */
  actor?: string;
  /** Aragon VoteOption: 1 abstain, 2 yes, 3 no. */
  option?: number;
  /** Voting power in whole $BLOKC. */
  power?: number;
};

type Log = { topics: string[]; data: string; blockNumber: string; transactionHash: string; logIndex: string };

const addr = (topic: string) => `0x${topic.slice(26)}`;

/**
 * The latest DAO events straight from chain logs, newest first, with the
 * real block time of each. `limit` bounds the timestamp lookups.
 */
export async function readActivity(limit = 8): Promise<ActivityEvent[]> {
  const [logs] = await rpcBatch<[Log[]]>([
    {
      method: "eth_getLogs",
      params: [{ address: [VOTING_PLUGIN, DAO_ADDRESS], fromBlock: `0x${FROM_BLOCK.toString(16)}`, toBlock: "latest" }],
    },
  ]);
  const events = logs
    .filter((l) => l.topics[0] in TOPICS)
    .sort((a, b) => Number(BigInt(b.blockNumber) - BigInt(a.blockNumber)) || Number(BigInt(b.logIndex) - BigInt(a.logIndex)))
    .slice(0, limit);
  const blocks = [...new Set(events.map((l) => l.blockNumber))];
  const heads = blocks.length
    ? await rpcBatch<{ timestamp: string }[]>(blocks.map((b) => ({ method: "eth_getBlockByNumber", params: [b, false] })))
    : [];
  const time = new Map(blocks.map((b, i) => [b, Number(BigInt(heads[i].timestamp)) * 1000]));

  return events.map((l) => {
    const kind = TOPICS[l.topics[0] as keyof typeof TOPICS];
    const e: ActivityEvent = {
      key: `${l.transactionHash}-${l.logIndex}`,
      kind,
      at: time.get(l.blockNumber) ?? 0,
      block: Number(BigInt(l.blockNumber)),
      tx: l.transactionHash,
    };
    if (kind === "proposal" || kind === "vote" || kind === "passed") e.proposal = BigInt(l.topics[1]).toString();
    if (kind === "proposal" || kind === "vote") e.actor = addr(l.topics[2]);
    if (kind === "vote") {
      e.option = Number(word(l.data, 0));
      e.power = Number(word(l.data, 1) / 10n ** 18n);
    }
    return e;
  });
}
