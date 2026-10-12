import type { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * Per-page metadata (SEO-01, -02, -05). Every route builds its metadata here,
 * so each page carries its own title, description, canonical, og:url and a
 * share image, and none can inherit the homepage's by accident.
 *
 * Why the full objects: Next merges metadata one key deep, so a page that
 * sets `openGraph` replaces the layout's whole object (siteName, locale,
 * images and all). The helper always returns complete `openGraph` and
 * `twitter` objects. Twitter's title, description and image are filled from
 * `openGraph` by Next when they're left out.
 */

/** The site-wide card, `src/app/opengraph-image.tsx`, exported as /opengraph-image. */
export const OG_DEFAULT = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "BLOK Capital, non-custodial wealth management on Arbitrum",
  type: "image/png",
};

const SUFFIX = ` · ${siteConfig.name}`;

export type PageMetadataInput = {
  /** A label that gets " · BLOK Capital" from the layout's template, or `{ absolute }` when the brand leads. */
  title: string | { absolute: string };
  /** At most 155 characters; every claim must be on the page itself. */
  description: string;
  /** Canonical path, e.g. "/security". `null` for pages with no canonical URL (the 404). */
  path: string | null;
  /** Share-card wording, when it should differ from the title and description. */
  social?: { title?: string; description?: string };
  /**
   * The route's own folder has an `opengraph-image.tsx`. Next adds that file's
   * image after this metadata, so the default card must be left out here.
   */
  ownImage?: boolean;
  robots?: Metadata["robots"];
};

/** The title as rendered in `<title>`, with the template applied. */
export const fullTitle = (title: PageMetadataInput["title"]) =>
  typeof title === "string" ? `${title}${SUFFIX}` : title.absolute;

export function pageMetadata(p: PageMetadataInput): Metadata {
  const socialTitle = p.social?.title ?? fullTitle(p.title);
  const socialDescription = p.social?.description ?? p.description;
  const images = p.ownImage ? {} : { images: [OG_DEFAULT] };
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(p.path !== null && { url: p.path }),
      title: socialTitle,
      description: socialDescription,
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: socialTitle,
      description: socialDescription,
    },
    ...(p.robots && { robots: p.robots }),
  };
}
