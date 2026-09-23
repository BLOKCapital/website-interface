import { rpcBatch } from "./rpc";

export type NetworkReading = {
  blockNumber: number;
  /** Block timestamp from the chain (ms since epoch). */
  blockTime: number;
  /** Current base fee in gwei. */
  baseFeeGwei: number;
};

/** Latest Arbitrum One block and base fee, in one round trip. */
export async function readNetwork(): Promise<NetworkReading> {
  const [block] = await rpcBatch<[{ number: string; timestamp: string; baseFeePerGas?: string }]>([
    { method: "eth_getBlockByNumber", params: ["latest", false] },
  ]);
  return {
    blockNumber: Number(BigInt(block.number)),
    blockTime: Number(BigInt(block.timestamp)) * 1000,
    baseFeeGwei: block.baseFeePerGas ? Number(BigInt(block.baseFeePerGas)) / 1e9 : 0,
  };
}
