import type { Metadata, Viewport } from "next";
import { Inter, Dancing_Script, JetBrains_Mono } from "next/font/google";
import { Fragment } from "react";
import "./globals.css";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { EasterEggs } from "@/components/easter/EasterEggs";
import { CookieConsent } from "@/components/system/CookieConsent";
import { Analytics } from "@/components/system/Analytics";
import { RevealScript } from "@/components/system/RevealScript";
import { NavProgress } from "@/components/system/NavProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/site";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });

// The handwritten accent: the <em> payoff in every headline (globals.css,
// `.display em`) and the notes on figures (`.note`). One weight, preloaded,
// since the payoff is in the first-screen h1 on every page. Headlines
// themselves are Inter at 800, so no display serif is loaded.
const script = Dancing_Script({ subsets: ["latin"], weight: ["600"], display: "swap", variable: "--font-script" });

// Mono for labels, addresses and figures. Not preloaded (it is small and
// requested at first layout anyway), and it falls back to a system mono
// rather than a size-adjusted Arial, so the swap is mono to mono with no
// change of letterforms or width.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
  variable: "--font-mono",
});

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
  // Site-wide defaults only. No canonical, og:url, title or description
  // here: every page sets its own through pageMetadata() (SEO-01, SEO-05),
  // so a page that forgot one would have none, not the homepage's.
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
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
  themeColor: "#F7F8F4",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      // Next keeps route changes jumping to the top instantly (not scrolling
      // through the old page) while in-page anchors still glide.
      data-scroll-behavior="smooth"
      // RevealScript adds the `js` class before hydration.
      suppressHydrationWarning
      className={`${inter.variable} ${script.variable} ${mono.variable}`}
    >
      <head>
        {/* Print rules, loaded off the critical path (see public/print.css).
            A bundled CSS import would be render-blocking; media="print" isn't. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/print.css" media="print" />
      </head>
      {/* suppressHydrationWarning also tolerates attributes that browser
          extensions inject onto <body> before React hydrates. */}
      <body className="min-h-screen bg-canvas text-fg antialiased" suppressHydrationWarning>
        <RevealScript />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:rounded-full focus:bg-leaf focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-canvas"
        >
          Skip to content
        </a>
        {/* Early in the DOM so the consent choice is the first Tab stop after
            the skip link; it still sits visually fixed at the bottom. */}
        <CookieConsent />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <NavProgress />
        <Nav />
        {/* Focusable by script only (A11Y-12, A11Y-22), so the skip link
            and a client-side navigation can move focus, not just the scroll
            position, into the content. It's a landmark, not a control, so
            it draws no ring round the whole page when it takes focus. */}
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {/* Keyed Fragment = hydration fix; keep it. If the page element is
              still waiting for a chunk (error.tsx) when hydration reaches
              <main>, React 19.2 replays <main> itself, claims it twice and
              throws #418 (facebook/react#35494). Replaying the Fragment
              claims no DOM node. Remove once Next ships a React with the
              upstream fix. tests/hydration.spec.ts (STRESS=1) covers it. */}
          <Fragment key="page">{children}</Fragment>
        </main>
        <Footer />
        <EasterEggs />
        <Analytics />
      </body>
    </html>
  );
}
