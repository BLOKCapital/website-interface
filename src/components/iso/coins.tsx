import type { CSSProperties } from "react";
import type { ComponentSymbol } from "@/lib/data/indices";
import { CoinFace, Cyl } from "./machine";

/**
 * Coins for the index figures: each token in its own colour (its brand
 * colour, faded to paper), with its logo on the top coin, so a stack says
 * which token it is and a coin that changes hands reads as a trade.
 */

/** Each token's colour, for its coins. */
export const TINT: Record<ComponentSymbol, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  LINK: "#2A5ADA",
  UNI: "#FF007A",
  AAVE: "#2EBAC6",
  ARB: "#28A0F0",
  PENDLE: "#71717A",
  DAI: "#F5AC37",
  CRV: "#3A6BC8",
  ZRO: "#4A4A4A",
  GRT: "#6747ED",
  GMX: "#4B6BFF",
};

export const coinTint = (symbol: ComponentSymbol) => ({ top: `${TINT[symbol]}40`, side: `${TINT[symbol]}b3` });

/** One coin of `symbol` at height z, with its logo on top if `face`. */
export function Coin({
  cx,
  cy,
  z,
  r,
  h,
  symbol,
  face,
  className,
  style,
}: {
  cx: number;
  cy: number;
  z: number;
  r: number;
  h: number;
  symbol: ComponentSymbol;
  face?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <g className={className} style={style}>
      <Cyl cx={cx} cy={cy} z={z} r={r} h={h} {...coinTint(symbol)} />
      {face && <CoinFace cx={cx} cy={cy} z={z + h} r={r} symbol={symbol} />}
    </g>
  );
}

/** A stack of `n` coins from height z, the logo on its top coin. */
export function Coins({ cx, cy, z, n, r, h, symbol }: { cx: number; cy: number; z: number; n: number; r: number; h: number; symbol: ComponentSymbol }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Coin key={i} cx={cx} cy={cy} z={z + i * h} r={r} h={h} symbol={symbol} face={i === n - 1} />
      ))}
    </g>
  );
}
