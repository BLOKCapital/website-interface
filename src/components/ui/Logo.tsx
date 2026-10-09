import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOK Capital wordmark, 520×102 WebP (3× its 34px display height). Dark
 * lettering on the light theme; inside a `.theme-dark` scope (the dark
 * footer, or the header over a dark band) CSS swaps in the light-lettered
 * version, so no JS decides which one shows.
 */
export function Logo({ className }: { className?: string }) {
  const size = "h-8 w-auto select-none sm:h-[34px]";
  return (
    <>
      <Image
        src="/brand/logo-wordmark.webp"
        alt="BLOK Capital"
        width={520}
        height={102}
        priority
        unoptimized
        className={cn(size, "[.theme-dark_&]:hidden", className)}
        draggable={false}
      />
      <Image
        src="/brand/logo-wordmark-light.webp"
        alt="BLOK Capital"
        width={520}
        height={102}
        unoptimized
        className={cn(size, "hidden [.theme-dark_&]:block", className)}
        draggable={false}
      />
    </>
  );
}
