import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { EasterEggs } from "@/components/easter/EasterEggs";
import { MotionProvider } from "@/components/system/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-script",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "BLOK Capital · Decentralized Wealth Management on Arbitrum",
    template: "%s · BLOK Capital",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "decentralized wealth management",
    "non-custodial crypto investing",
    "on-chain asset management",
    "DeFi index funds",
    "crypto portfolio manager",
    "Arbitrum DeFi",
    "BLOK Capital",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    title: "BLOK Capital · Decentralized Wealth Management on Arbitrum",
    description:
      "Decentralized wealth management on Arbitrum. Non-custodial. On-chain. Always yours.",
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: "BLOK Capital · Decentralized Wealth Management on Arbitrum",
    description:
      "Decentralized wealth management on Arbitrum. Non-custodial. On-chain. Always yours.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in the environment to emit the
  // Search Console verification <meta> tag without a code change.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#FAF7F0",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${caveat.variable} ${jetbrains.variable} bg-paper text-ink`}
    >
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla
          adds `cz-shortcut-listen`) inject attributes onto <body> before React
          hydrates. This scopes the tolerance to <body> only, it does not
          silence hydration warnings in the rest of the tree. */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper-deep focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <EasterEggs />
        </MotionProvider>
      </body>
    </html>
  );
}
