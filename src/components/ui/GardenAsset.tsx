import Image from "next/image";
import { cn } from "@/lib/utils";
import { getGarden, GARDENS_TOTAL } from "@/lib/data/gardens";

type Props = {
  /** 1..12. Out-of-range values wrap. */
  n: number;
  /** Tailwind sizes string for next/image responsive loader. */
  sizes?: string;
  className?: string;
  /** Mark as priority for above-the-fold use (LCP). */
  priority?: boolean;
  /**
   * next/image quality (1-100). Defaults to 92 so the photorealistic
   * garden renders stay crisp on retina displays. Bump or trim per
   * call-site if you need to optimize bandwidth.
   */
  quality?: number;
  /** Alt text. Renders are decorative by default (empty alt). */
  alt?: string;
};

/**
 * Brand Garden render — one of the photorealistic floating-island assets.
 * Lives inside a relative-positioned container; pass dimensions via the
 * wrapper class.
 *
 * Only the renders in use ship in public/gardens: 4 (CtaBand) and 7 (404),
 * plus garden-06-480 for the easter egg. Any other render must be added to
 * public/gardens (its master and -480/-720/-960 widths) before passing its
 * `n`; the unused ones were removed and are in git history.
 *
 * Performance:
 *   - The sources are pre-compressed 1440×1440 WebP (~210-320KB), which is 2×
 *     the largest call-site render. This is what the browser gets: `output:
 *     "export"` means there is no Next optimizer, and the Cloudflare loader is
 *     off unless NEXT_PUBLIC_CF_IMAGES=1 (see src/lib/image-loader.ts).
 *   - `sizes` should be set per-callsite for accurate responsive bandwidth
 *   - `quality` only takes effect when the Cloudflare loader is enabled. The
 *     high values here date from the 2000² PNG masters; re-encoding an
 *     already-compressed WebP at 92-95 mostly just adds bytes, so revisit
 *     these if Image Transformations is ever turned on.
 *   - Below-the-fold uses get loading="lazy" automatically; pass priority for above-the-fold
 */
export function GardenAsset({
  n,
  sizes = "(max-width: 768px) 90vw, 720px",
  className,
  priority = false,
  quality = 92,
  alt = "",
}: Props) {
  const meta = getGarden(((n - 1) % GARDENS_TOTAL + GARDENS_TOTAL) % GARDENS_TOTAL + 1);

  return (
    <div className={cn("relative size-full", className)}>
      <Image
        src={meta.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className="pointer-events-none select-none object-contain"
        draggable={false}
      />
    </div>
  );
}
