import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { videoObjectSchema } from "@/lib/seo/schema";

/**
 * /about's structured data beyond the page's own breadcrumb: the
 * introduction video sits behind a click-to-play facade, so crawlers only
 * learn it exists from this VideoObject (SEO-21). A segment layout keeps the
 * schema out of the page's markup; it renders nothing else.
 */
export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={videoObjectSchema()} />
      {children}
    </>
  );
}
