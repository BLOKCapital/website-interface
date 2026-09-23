import Image from "next/image";
import { components, type ComponentSymbol } from "@/lib/data/indices";
import { cn } from "@/lib/utils";

/** A token's round logo. Decorative: the symbol is always printed beside it. */
export function TokenLogo({ symbol, size = 24, className }: { symbol: ComponentSymbol; size?: number; className?: string }) {
  return (
    <Image
      src={components[symbol].logo}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 rounded-full bg-white", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Overlapping logos for a whole index, e.g. in cards and lists. */
export function TokenStack({ symbols, size = 22, max = 10, className }: { symbols: ComponentSymbol[]; size?: number; max?: number; className?: string }) {
  return (
    <span className={cn("flex items-center", className)}>
      {symbols.slice(0, max).map((s, i) => (
        <TokenLogo key={s} symbol={s} size={size} className={cn("ring-2 ring-card", i > 0 && "-ml-1.5")} />
      ))}
    </span>
  );
}
