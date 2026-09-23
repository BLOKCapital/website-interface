import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPolicies, getPolicy, policySlugs } from "@/lib/data/policies";
import { PolicyTOC, type TocItem } from "@/components/legal/PolicyTOC";
import { CookieSettingsButton } from "@/components/system/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return policySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: "Legal" };
  return {
    title: policy.title,
    description: `${policy.title}, BLOK Capital DAO LLC.`,
    alternates: { canonical: `/legal/${slug}` },
  };
}

/** `<h2 id="…">Label</h2>` anchors from the authored HTML, for the TOC. */
function headingsOf(html: string): TocItem[] {
  return [...html.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => ({
    id: m[1],
    text: m[2].replace(/<[^>]+>/g, "").trim(),
  }));
}

const readingMinutes = (html: string) => Math.max(1, Math.ceil(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const headings = headingsOf(policy.html);
  const updated = new Date(policy.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const others = getAllPolicies().filter((p) => p.slug !== slug);

  return (
    <article className="mx-auto w-full max-w-page px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <JsonLd
        data={[
          articleSchema({ title: policy.title, description: `${policy.title}, BLOK Capital DAO LLC.`, path: `/legal/${slug}`, datePublished: policy.date }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: policy.title, path: `/legal/${slug}` }]),
        ]}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-caption text-fg-subtle">
          <li>
            <Link href="/" className="hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>Legal</li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-fg-muted">
            {policy.title}
          </li>
        </ol>
      </nav>
      <header className="mt-8 max-w-3xl border-b border-line/[0.08] pb-10">
        <h1 className="display text-h1 text-fg">{policy.title}</h1>
        <p className="mt-5 text-small text-fg-subtle">
          Last updated {updated} · {readingMinutes(policy.html)} min read
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto">
          {/* Phones: collapsed so the text isn't pushed below a long list. */}
          <details className="rounded-xl border border-line/[0.08] bg-card p-4 lg:hidden">
            <summary className="cursor-pointer text-small text-fg">Contents</summary>
            <div className="mt-4">
              <PolicyTOC headings={headings} />
            </div>
          </details>
          <div className="hidden lg:block">
            <PolicyTOC headings={headings} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Static, DAO-authored HTML from lib/data/policies.ts (no user input). */}
          {/* react-doctor-disable-next-line react-doctor/no-danger */}
          <div className="prose-legal max-w-prose" dangerouslySetInnerHTML={{ __html: policy.html }} />

          {slug === "cookie-policy" && (
            <div className="mt-12 flex max-w-prose flex-col gap-4 rounded-2xl border border-line/[0.08] bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-small text-fg-muted">Review, change or withdraw your consent at any time.</p>
              <CookieSettingsButton className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line/15 px-5 text-small text-fg" />
            </div>
          )}

          <div className="mt-14 max-w-prose border-t border-line/[0.08] pt-8">
            <h2 className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">Other policies</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/legal/${p.slug}`}
                    className="block rounded-xl border border-line/[0.08] bg-card px-4 py-3 text-[15px] text-fg transition-colors hover:border-leaf/30"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
