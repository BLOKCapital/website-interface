export type Manager = {
  id: string;
  name: string;
  handle: string;
  address: `0x${string}`;
  reputation: number; // 0–100, soulbound rep score
  trades: number;
  aum: number;
  roi24h: number;
  quote?: string;
  spark: number[];
  badges: ("verified" | "early" | "top-perf")[];
};

export const managers: Manager[] = [
  {
    id: "mango-grove",
    name: "Mango Grove",
    handle: "mango.eth",
    address: "0x9F7c4b2a98e5cE4d3aB123EeF8d09Ab23c000Be21",
    reputation: 94,
    trades: 1284,
    aum: 4_220_000,
    roi24h: 1.84,
    quote:
      "I publish every position on-chain. Clients see what I see, in real time. That's the unlock.",
    spark: [4, 6, 5, 7, 6, 8, 7, 9, 8, 10, 11, 12, 11, 13],
    badges: ["verified", "top-perf"],
  },
  {
    id: "lattice-grove",
    name: "Lattice",
    handle: "lattice.eth",
    address: "0x21c8aBFf8B4D62E3a1b0Cf5d0E2A91be0001bC22",
    reputation: 88,
    trades: 902,
    aum: 1_810_000,
    roi24h: 0.62,
    quote:
      "Onboarded 40 clients in a weekend. No paperwork, no custody questions, no escrow.",
    spark: [3, 4, 4, 5, 4, 6, 7, 6, 8, 7, 9, 8, 10, 9],
    badges: ["verified", "early"],
  },
  {
    id: "cinder",
    name: "Cinder",
    handle: "cinder.lens",
    address: "0x4A0Ee7c00ce3A6F02bA51F8e0c9a4e0a9876bD33",
    reputation: 81,
    trades: 612,
    aum: 940_000,
    roi24h: 2.14,
    quote:
      "My reputation moves with me, my soulbound badge says more than any pitch deck.",
    spark: [2, 3, 5, 4, 6, 7, 6, 8, 9, 8, 10, 11, 13, 14],
    badges: ["top-perf"],
  },
];
