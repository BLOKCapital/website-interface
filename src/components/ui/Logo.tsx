import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOK Capital wordmark, 340×67 WebP (2× its 32–34px display height; the
 * 520px masters are in git history). Dark lettering on the light theme;
 * inside a `.theme-dark` scope (the dark footer, or the header over a dark
 * band) CSS swaps in the light-lettered version, so no JS decides which one
 * shows.
 */
export function Logo({ className }: { className?: string }) {
  const size = "h-8 w-auto select-none sm:h-[34px]";
  return (
    <>
      <Image
        src="/brand/logo-wordmark-340.webp"
        alt="BLOK Capital"
        width={340}
        height={67}
        priority
        unoptimized
        className={cn(size, "[.theme-dark_&]:hidden", className)}
        draggable={false}
      />
      <Image
        src="/brand/logo-wordmark-light-340.webp"
        alt="BLOK Capital"
        width={340}
        height={67}
        unoptimized
        className={cn(size, "hidden [.theme-dark_&]:block", className)}
        draggable={false}
      />
    </>
  );
}
