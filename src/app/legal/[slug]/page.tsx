import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPolicies, getPolicy, policySlugs } from "@/lib/data/policies";
import { PolicyTOC, type TocItem } from "@/components/legal/PolicyTOC";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return policySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) {
    return { title: "Legal" };
  }
  return {
    title: policy.title,
    description: `${policy.title}, BLOK Capital DAO LLC.`,
    alternates: { canonical: `/legal/${slug}` },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Extract `<h2 id="...">Label</h2>` anchors from authored HTML. */
function extractHeadings(html: string): TocItem[] {
  const regex = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  const out: TocItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    out.push({
      id: m[1],
      text: m[2].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return out;
}

/** Rough reading time in minutes, 200 wpm. */
function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const headings = extractHeadings(policy.html);
  const minutes = readingTime(policy.html);
  const allPolicies = getAllPolicies();
  const otherPolicies = allPolicies.filter((p) => p.slug !== slug);

  return (
    <section className="paper relative isolate">
      <JsonLd
        data={[
          articleSchema({
            title: policy.title,
            description: `${policy.title}, BLOK Capital DAO LLC.`,
            path: `/legal/${slug}`,
            datePublished: policy.date,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: policy.title, path: `/legal/${slug}` },
          ]),
        ]}
      />
      {/* Warm corner washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgb(var(--clay) / 0.06), transparent 65%), radial-gradient(40% 30% at 90% 8%, rgb(var(--moss) / 0.05), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        {/* Header */}
        <header className="max-w-3xl">
          <p className="eyebrow text-moss">Legal · {policy.category}</p>
          <h1 className="display mt-3 text-[36px] leading-[1.04] text-ink sm:text-[48px] lg:text-[56px]">
            {policy.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[13px] text-ink-subtle">
            <span className="inline-flex items-baseline gap-1.5">
              <span className="script text-[18px] leading-none text-clay">
                Last updated
              </span>
              <span className="text-ink-muted">{formatDate(policy.date)}</span>
            </span>
            <span aria-hidden className="text-ink/20">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ClockGlyph />
              <span className="text-ink-muted">
                {minutes} min{minutes !== 1 ? "s" : ""} read
              </span>
            </span>
            <span aria-hidden className="text-ink/20">·</span>
            <span className="font-mono uppercase tracking-wider text-ink-subtle">
              v{policy.date.slice(0, 7).replace("-", ".")}
            </span>
          </div>
        </header>

        <div aria-hidden className="rule-hand my-10" />

        {/* Two-column layout on lg: sticky TOC + content */}
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
              <PolicyTOC headings={headings} />
            </div>
          </aside>

          {/* Body, policy.html is static, DAO-authored content from
              lib/data/policies.ts (no user input), so it's safe to inject. */}
          {/* react-doctor-disable-next-line react-doctor/no-danger */}
          <article
            className="policy-prose max-w-[68ch]"
            dangerouslySetInnerHTML={{ __html: policy.html }}
          />
        </div>

        <div aria-hidden className="rule-hand mt-14" />

        {/* Other policies */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <p className="eyebrow text-moss">Other policies</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {otherPolicies.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/legal/${p.slug}`}
                  className="group/p flex h-full items-center justify-between gap-3 rounded-xl border border-ink/10 bg-paper-warm px-4 py-3 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-moss/30 hover:bg-moss/[0.05]"
                >
                  <span>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                      Read next
                    </span>
                    <span className="block text-[14.5px] font-medium text-ink">
                      {p.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="inline-block translate-x-0 text-clay transition-transform duration-200 group-hover/p:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Letter-style attribution */}
        <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-ink-subtle">
          <span className="script mr-1 text-[18px] leading-none text-clay">
            ✻
          </span>
          BLOK Capital DAO LLC · Marshall Islands · Reg.&nbsp;no. 10050-23 ·
          Have a question?{" "}
          <a
            href="https://discord.com/invite/blokc"
            target="_blank"
            rel="noreferrer"
            className="group/d inline-flex items-baseline gap-0.5 font-medium text-ink transition-colors hover:text-clay-deep"
          >
            <span className="underline decoration-clay/55 decoration-[1.5px] underline-offset-[4px] transition-colors group-hover/d:decoration-clay">
              Drop into our Discord
            </span>
            <span
              aria-hidden
              className="inline-block translate-x-0.5 transition-transform duration-300 ease-in-soft group-hover/d:translate-x-1.5"
            >
              →
            </span>
          </a>
        </p>
      </div>
    </section>
  );
}

function ClockGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
      <circle
        cx="8"
        cy="8"
        r="6.2"
        fill="none"
        stroke="rgb(var(--moss-deep) / 0.7)"
        strokeWidth="1.1"
      />
      <path
        d="M8 4.5 V 8 L 10.5 9.5"
        stroke="rgb(var(--moss-deep))"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
