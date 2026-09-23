import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { EasterEggs } from "@/components/easter/EasterEggs";
import { CookieConsent } from "@/components/system/CookieConsent";
import { RevealScript } from "@/components/system/RevealScript";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });

// Display serif: regular + italic only (headlines are set at 400).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

// Mono for addresses and figures; not needed for first paint.
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false, variable: "--font-mono" });

const tagline = "Non-custodial wealth management on Arbitrum. Follow curated on-chain indices; your assets never leave your own wallet.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "BLOK Capital · Non-custodial wealth management on Arbitrum",
    template: "%s · BLOK Capital",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "decentralized wealth management",
    "non-custodial crypto investing",
    "on-chain asset management",
    "DeFi index funds",
    "Arbitrum DeFi",
    "BLOK Capital",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    title: "BLOK Capital · Non-custodial wealth management",
    description: tagline,
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: "BLOK Capital · Non-custodial wealth management",
    description: tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#090D0B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // RevealScript adds the `js` class before hydration.
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${mono.variable}`}
    >
      {/* suppressHydrationWarning also tolerates attributes that browser
          extensions inject onto <body> before React hydrates. */}
      <body className="min-h-screen bg-canvas text-fg antialiased" suppressHydrationWarning>
        <RevealScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-leaf focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-canvas"
        >
          Skip to content
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <EasterEggs />
        <CookieConsent />
      </body>
    </html>
  );
}
