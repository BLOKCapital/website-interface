import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Hide the floating Next.js dev-tools badge — it sits bottom-left over the
  // footer wordmark. Dev-only UI either way; this never affected production.
  devIndicators: false,
  // Fully static output for Cloudflare Pages. Every route is prerendered
  // (no server actions, no middleware, both route handlers are force-static),
  // so there is no server to run. Emits to `out/`.
  output: "export",
  images: {
    // Static export removes Next's built-in optimizer, so `formats` and
    // `remotePatterns` no longer apply — resizing is delegated to Cloudflare
    // Image Transformations. See src/lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Allowed next/image quality values. 75 is the implicit default; 94/95 are
    // used by the garden art. Next.js 16 requires every value to be declared.
    qualities: [75, 94, 95],
    // The srcset widths. deviceSizes match the pre-built Garden files 1:1
    // (garden-NN-480/720/960.webp and the 1440px master), so every `w`
    // descriptor names the file the loader returns (PERF-05). imageSizes stop
    // below 384: a `vw` sizes like the hero's ((max-width: 640px) 80vw) asks
    // for every width >= 480 × 0.8, and a 384 there would point at the 480 file.
    deviceSizes: [480, 720, 960, 1440],
    imageSizes: [64, 128, 256],
  },
};

export default config;
