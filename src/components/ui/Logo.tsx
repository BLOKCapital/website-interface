import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOK Capital wordmark, light lettering for the dark theme. 520×102 WebP
 * (3× its 34px display height), recoloured from the master logo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-wordmark-light.webp"
      alt="BLOK Capital"
      width={520}
      height={102}
      priority
      unoptimized
      className={cn("h-8 w-auto select-none sm:h-[34px]", className)}
      draggable={false}
    />
  );
}
