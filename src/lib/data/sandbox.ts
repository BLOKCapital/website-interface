/**
 * Mock data for the Dashboard Preview sandbox. Three preset Gardens.
 * Allocations are normalized to 100.
 */
export type GardenPreset = {
  id: "conservative" | "balanced" | "aggressive";
  label: string;
  blurb: string;
  expectedApy: string;
  riskBand: "Low" | "Medium" | "High";
  allocations: { symbol: string; pct: number; color: string }[];
  txHistory: { action: string; value: string; hash: string }[];
};

export const presets: GardenPreset[] = [
  {
    id: "conservative",
    label: "Conservative",
    blurb: "Capital-preservation index. Stables-heavy with small ETH exposure.",
    expectedApy: "5–8%",
    riskBand: "Low",
    allocations: [
      { symbol: "USDC", pct: 55, color: "rgb(var(--sage))" },
      { symbol: "ETH", pct: 22, color: "rgb(var(--moss))" },
      { symbol: "ARB", pct: 13, color: "rgb(var(--moss))" },
      { symbol: "BLOKC", pct: 10, color: "rgb(var(--clay))" },
    ],
    txHistory: [
      { action: "Compound USDC yield", value: "+$184.21", hash: "0x8a…f4c2" },
      { action: "Rebalance", value: "+0.04 ETH", hash: "0x21…91be" },
    ],
  },
  {
    id: "balanced",
    label: "Balanced",
    blurb: "The default Garden. Diversified across majors with productive yield.",
    expectedApy: "9–14%",
    riskBand: "Medium",
    allocations: [
      { symbol: "ETH", pct: 42, color: "rgb(var(--moss))" },
      { symbol: "ARB", pct: 28, color: "rgb(var(--moss))" },
      { symbol: "BLOKC", pct: 20, color: "rgb(var(--clay))" },
      { symbol: "USDC", pct: 10, color: "rgb(var(--sage))" },
    ],
    txHistory: [
      { action: "Rebalance", value: "+0.34 ETH", hash: "0x8a…f4c2" },
      { action: "Hire Gardener", value: "Strategy 17", hash: "0x21…91be" },
      { action: "Claim yield", value: "+184 BLOKC", hash: "0x9c…4e0a" },
    ],
  },
  {
    id: "aggressive",
    label: "Aggressive",
    blurb: "Long-tail exposure. Higher beta, deeper drawdowns, larger upside.",
    expectedApy: "18–34%",
    riskBand: "High",
    allocations: [
      { symbol: "BLOKC", pct: 38, color: "rgb(var(--clay))" },
      { symbol: "ARB", pct: 30, color: "rgb(var(--moss))" },
      { symbol: "ETH", pct: 22, color: "rgb(var(--moss))" },
      { symbol: "USDC", pct: 10, color: "rgb(var(--sage))" },
    ],
    txHistory: [
      { action: "Open position", value: "+12,400 BLOKC", hash: "0xfe…22aa" },
      { action: "Hire Gardener", value: "Cinder", hash: "0x4a…bd33" },
    ],
  },
];
