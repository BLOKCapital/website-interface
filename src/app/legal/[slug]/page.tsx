import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPolicies, getPolicy, policySlugs } from "@/lib/data/policies";
import { PolicyTOC, type TocItem } from "@/components/legal/PolicyTOC";
import { ContentsSheet } from "@/components/legal/ContentsSheet";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CookieSettingsButton } from "@/components/system/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return policySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Legal" };
  const updated = new Date(policy.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return pageMetadata({
    title: policy.title,
    description: `${policy.title} for blokcapital.io and the BLOK Capital interface, from BLOK Capital DAO LLC (Marshall Islands). Last updated ${updated}.`,
    path: `/legal/${slug}`,
  });
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };

/**
 * HTML entities in heading text, decoded: the TOC renders it as text, so
 * "Governing Law &amp; Jurisdiction" would otherwise show the "&amp;".
 */
const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, e: string) => {
    if (e[0] !== "#") return ENTITIES[e] ?? whole;
    const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });

/** `<h2 id="…">Label</h2>` anchors from the authored HTML, for the TOC. */
function headingsOf(html: string): TocItem[] {
  return [...html.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => ({
    id: m[1],
    text: decodeEntities(m[2].replace(/<[^>]+>/g, "")).trim(),
  }));
}

// The shared Icon's "external" glyph, as markup (UX-11).
const EXTERNAL_ICON =
  '<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ml-0.5 inline align-[-0.15em]"><path d="M6.5 13.5l7-7M8 6.5h5.5V12"/></svg>';

/**
 * Off-site links in the policy HTML open in a new tab and say so, like every
 * other external link on the site: a visible arrow and "(opens in a new
 * tab)" for screen readers (UX-11). Applied at render time; the policy
 * source text is unchanged. Only plain `<a href="https://…">` tags are
 * touched.
 */
const withExternalLinks = (html: string) =>
  html.replace(
    /<a href="(https?:\/\/[^"]+)">([\s\S]*?)<\/a>/g,
    (_, href: string, text: string) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}${EXTERNAL_ICON}<span class="sr-only"> (opens in a new tab)</span></a>`,
  );

const readingMinutes = (html: string) => Math.max(1, Math.ceil(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const headings = headingsOf(policy.html);
  const updated = new Date(policy.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const others = getAllPolicies().filter((p) => p.slug !== slug);

  return (
    <article className="mx-auto w-full max-w-page px-gutter pb-24 pt-32 sm:pt-40">
      <JsonLd
        data={[
          articleSchema({ title: policy.title, description: `${policy.title}, BLOK Capital DAO LLC.`, path: `/legal/${slug}`, datePublished: policy.date }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: policy.title, path: `/legal/${slug}` }]),
        ]}
      />
      {/* Home / Policy, matching the breadcrumbSchema above (UX-18, SEO-20):
          there's no /legal page for a "Legal" crumb to point at. */}
      <Breadcrumb items={[{ label: policy.title }]} />
      <header className="mt-8 max-w-3xl border-b border-subtle pb-10">
        <h1 className="display text-h1 text-fg">{policy.title}</h1>
        <p className="mt-5 text-small text-fg-subtle">
          Last updated {updated} · {readingMinutes(policy.html)} min read
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        {/* A div, not an aside: a complementary landmark nested in the
            article only adds noise, and the list is already a "Contents"
            nav (A11Y-25). */}
        <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto">
          {/* Phones: collapsed so the text isn't pushed below a long list. */}
          <details id="policy-contents" className="rounded-control border border-subtle bg-card p-4 lg:hidden">
            <summary className="cursor-pointer text-small text-fg">Contents</summary>
            <div className="mt-4">
              {/* The summary already says "Contents". */}
              <PolicyTOC headings={headings} label={false} />
            </div>
          </details>
          <div className="hidden lg:block">
            <PolicyTOC headings={headings} />
          </div>
        </div>

        <div className="min-w-0">
          {/* Static, DAO-authored HTML from lib/data/policies.ts (no user input). */}
          {/* react-doctor-disable-next-line react-doctor/no-danger */}
          <div className="prose-legal max-w-prose" dangerouslySetInnerHTML={{ __html: withExternalLinks(policy.html) }} />

          {slug === "cookie-policy" && (
            <div className="mt-12 flex max-w-prose flex-col gap-4 rounded-card border border-subtle bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-fg-muted">Review, change or withdraw your consent at any time.</p>
              <CookieSettingsButton className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line/15 px-5 text-small text-fg" />
            </div>
          )}

          <div className="mt-14 max-w-prose border-t border-subtle pt-8">
            <h2 className="text-caption font-semibold uppercase tracking-caps text-fg-subtle">Other policies</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/legal/${p.slug}`}
                    className="block rounded-control border border-subtle bg-card px-4 py-3 text-ui text-fg transition-colors hover:border-leaf/30"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Phones: once the list above has scrolled away, a sticky
              Contents button reopens it as a sheet (UX-24). Last in this
              column, so it rests at the column's end. */}
          <ContentsSheet headings={headings} watch="policy-contents" />
        </div>
      </div>
    </article>
  );
}
