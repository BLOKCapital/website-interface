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
 * *.pages.dev preview URLs. With the flag unset the original file is served
 * as-is: heavier, but correct everywhere. Turn it on once Transformations is
 * enabled for blokcapital.io.
 */
type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudflareLoader({ src, width, quality }: LoaderArgs) {
  // Remote art (cdn.blokcapital.io, Cloudinary) is transformed at its origin.
  if (/^https?:\/\//.test(src)) return src;

  if (process.env.NEXT_PUBLIC_CF_IMAGES !== "1") return src;

  const params = [`width=${width}`, `quality=${quality ?? 75}`, "format=auto"];
  return `/cdn-cgi/image/${params.join(",")}${src}`;
}
