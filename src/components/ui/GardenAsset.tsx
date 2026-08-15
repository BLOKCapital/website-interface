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
  /**
   * Black-background composite mode. The PNGs are on pure black; we drop the
   * black so the subject sits cleanly on bg-paper.
   *  - "none" (default): the assets ship as RGBA with alpha — no blend needed
   *    on cream paper. Use this everywhere.
   *  - "lighten" / "screen": legacy modes for renders that have a black
   *    background. Only useful on dark surfaces; will produce black blobs on
   *    cream so prefer "none".
   */
  blend?: "lighten" | "screen" | "none";
  /** Subtle hover lift / parallax wrap container. Default false. */
  interactive?: boolean;
};

/**
 * Brand Garden render — drops in any of the 12 photorealistic floating-island
 * assets. Lives inside a relative-positioned container; pass dimensions via
 * the wrapper class.
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
  blend = "none",
  interactive = false,
}: Props) {
  const meta = getGarden(((n - 1) % GARDENS_TOTAL + GARDENS_TOTAL) % GARDENS_TOTAL + 1);
  const blendClass =
    blend === "lighten"
      ? "[mix-blend-mode:lighten]"
      : blend === "screen"
        ? "[mix-blend-mode:screen]"
        : "";

  return (
    <div
      className={cn(
        "relative size-full",
        interactive && "transition-transform duration-700 ease-in-soft hover:-translate-y-1",
        className,
      )}
    >
      <Image
        src={meta.src}
        alt={meta.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn(
          "pointer-events-none select-none object-contain",
          blendClass,
        )}
        draggable={false}
      />
    </div>
  );
}
