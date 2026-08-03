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
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default config;
