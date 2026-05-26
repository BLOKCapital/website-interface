import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Allowed next/image quality values. 75 is the implicit default; 94/95 are
    // used by the garden art. Next.js 16 requires every value to be declared.
    qualities: [75, 94, 95],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.blokcapital.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default config;
