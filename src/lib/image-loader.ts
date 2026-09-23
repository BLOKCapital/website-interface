/**
 * next/image loader for the statically exported site on Cloudflare Pages.
 *
 * `output: "export"` removes Next's built-in image optimizer, so the resizing
 * and re-encoding is handed to Cloudflare Image Transformations through the
 * /cdn-cgi/image/ prefix. This matters here: the Garden renders are 3.6-4.5MB
 * source PNGs and must not reach a browser untouched.
 *
 * Gated behind NEXT_PUBLIC_CF_IMAGES because /cdn-cgi/image/ only exists on a
 * zone with Image Transformations enabled — it 404s in `next dev` and on
 * *.pages.dev preview URLs. With the flag unset, Garden renders use the
 * pre-built width variants below and everything else is served as-is. Turn
 * it on once Transformations is enabled for blokcapital.io.
 */
type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * Pre-built widths of each Garden render (public/gardens/garden-NN-<w>.webp,
 * generated from the 1440px masters with sharp). When Cloudflare
 * transformations are off, the loader maps each requested width to the
 * smallest pre-built file that covers it, so a phone no longer downloads the
 * 1440px master. Regenerate the variants if a master changes.
 */
const GARDEN = /^\/gardens\/garden-(\d{2})\.webp$/;
const GARDEN_WIDTHS = [480, 720, 960];

export default function cloudflareLoader({ src, width, quality }: LoaderArgs) {
  // Remote art (cdn.blokcapital.io, Cloudinary) is transformed at its origin.
  if (/^https?:\/\//.test(src)) return src;

  if (process.env.NEXT_PUBLIC_CF_IMAGES !== "1") {
    const garden = GARDEN.exec(src);
    if (!garden) return src;
    const w = GARDEN_WIDTHS.find((v) => v >= width);
    return w ? `/gardens/garden-${garden[1]}-${w}.webp` : src;
  }

  const params = [`width=${width}`, `quality=${quality ?? 75}`, "format=auto"];
  return `/cdn-cgi/image/${params.join(",")}${src}`;
}
