import { cn, shortAddress } from "@/lib/utils";

type Props = {
  address: `0x${string}` | string;
  className?: string;
  /** Override the truncation. */
  display?: string;
};

const ARBISCAN = "https://arbiscan.io/address/";

export function AddressLink({ address, className, display }: Props) {
  return (
    <a
      href={`${ARBISCAN}${address}`}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "mono group inline-flex items-center gap-1 text-[12px] text-ink-muted transition-colors hover:text-ink",
        className,
      )}
      aria-label={`View ${address} on Arbiscan`}
    >
      {display ?? shortAddress(address)}
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className="opacity-60">
        <path d="M2 8 L8 2 M3.5 2 L8 2 L8 6.5" stroke="currentColor" strokeWidth="1.1" fill="none" />
      </svg>
    </a>
  );
}
