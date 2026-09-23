import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOK Capital wordmark. Renders 34px tall in nav / footer contexts, so the
 * source is a 520×102 WebP (3× that height, 11KB). The old
 * `/brand/blokc-black.svg` was a 1122px PNG wrapped in SVG (28KB).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/logo-wordmark.webp"
        alt="BLOK Capital"
        width={382}
        height={75}
        priority
        unoptimized
        className="h-[34px] w-auto select-none"
        draggable={false}
      />
    </span>
  );
}
