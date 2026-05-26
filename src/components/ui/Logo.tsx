import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOK Capital wordmark. Uses `/brand/blokc-black.svg` (382×75 native) and
 * renders at ~26px tall in nav / footer contexts.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/blokc-black.svg"
        alt="BLOK Capital"
        width={382}
        height={75}
        priority
        unoptimized
        className="h-[26px] w-auto select-none"
        draggable={false}
      />
    </span>
  );
}
