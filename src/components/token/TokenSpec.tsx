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
 * The token's spec sheet, set as one dark card: the coin turning slowly in a
 * dashed orbit, four facts in large type, and the live contract (address and
 * supply read from Arbitrum) underneath. Figures count up to their real
 * values as they come into view.
 */
export function TokenSpec() {
  return (
    <div className="theme-dark relative overflow-hidden rounded-[28px] border border-line/[0.08] bg-card">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_20%_40%,black,transparent_70%)]" />
      <div className="relative grid lg:grid-cols-12">
        <div className="relative flex items-center justify-center border-b border-line/[0.07] px-8 py-12 lg:col-span-4 lg:border-b-0 lg:border-r">
          <div aria-hidden className="glow-leaf absolute size-80 opacity-90" />
          <div aria-hidden className="art-spin absolute size-56 rounded-full border border-dashed border-leaf/30" />
          <div aria-hidden className="absolute size-72 rounded-full border border-line/[0.06]" />
          <Image src="/brand/token-front.webp" alt="The $BLOKC token" width={180} height={180} className="relative size-40 animate-float object-contain sm:size-44" />
        </div>
        <dl className="grid grid-cols-2 lg:col-span-8">
          {specs.map((s, i) => (
            <div
              key={s.k}
              className={`flex flex-col justify-between gap-6 p-6 sm:p-8 ${i % 2 ? "border-l border-line/[0.07]" : ""} ${i < 2 ? "border-b border-line/[0.07]" : ""}`}
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">{s.k}</dt>
              <dd>
                <span className="display block text-[clamp(28px,2.4vw+14px,46px)] leading-none text-fg tabular">{s.v}</span>
                {s.note && <span className="mt-2 block font-mono text-[11.5px] text-fg-subtle">{s.note}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative border-t border-line/[0.07] p-4 sm:p-5">
        <TokenContract />
      </div>
    </div>
  );
}
