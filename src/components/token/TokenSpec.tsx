import Image from "next/image";
import type { ReactNode } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { TokenContract } from "@/components/live/TokenContract";

const specs: { k: string; v: ReactNode; note?: string }[] = [
  { k: "Symbol", v: "$BLOKC", note: "ERC-20" },
  { k: "Total supply", v: <CountUp value={10} suffix="B" />, note: "10,000,000,000 BLOKC" },
  { k: "Network", v: "Arbitrum One", note: "Ethereum L2" },
  { k: "Decimals", v: <CountUp value={18} />, note: "Standard ERC-20 precision" },
];

/**
 * The token's spec sheet, on one sheet of ruled paper: the coin as a cut-out
 * sticker in a dashed orbit, the four facts as pinned note cards in heavy
 * type (the brand posts' "brokers 24"), and the live contract (address and
 * supply read from Arbitrum) underneath. Figures count up to their real
 * values as they come into view.
 */
export function TokenSpec() {
  return (
    <div className="paper-ruled relative overflow-hidden rounded-panel border border-subtle bg-card shadow-soft">
      <div className="relative grid lg:grid-cols-12">
        <div className="relative flex items-center justify-center px-8 py-12 lg:col-span-4">
          <div aria-hidden className="glow-leaf absolute size-72 opacity-60" />
          <div aria-hidden className="art-spin absolute size-56 rounded-full border border-dashed border-cobalt/30" />
          <Image src="/brand/token-front.webp" alt="The $BLOKC token" width={180} height={180} className="sticker relative size-40 animate-float object-contain sm:size-44" />
        </div>
        <dl className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:col-span-8 lg:pl-0">
          {specs.map((s) => (
            <div key={s.k} className="note-card flex flex-col justify-between gap-6 p-5 sm:p-6">
              <dt className="font-mono text-label lowercase text-fg-subtle">{s.k}</dt>
              <dd>
                <span className="display block text-display-md leading-none text-fg tabular">{s.v}</span>
                {s.note && <span className="mt-2 block font-mono text-label text-fg-subtle">{s.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative p-4 pt-0 sm:p-6 sm:pt-0">
        <TokenContract />
      </div>
    </div>
  );
}
