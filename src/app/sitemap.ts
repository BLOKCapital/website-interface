import type { MetadataRoute } from "next";
import { getAllPolicies } from "@/lib/data/policies";
import { ROADMAP_UPDATED } from "@/lib/data/milestones";
import { getGovernance, type ProposalView } from "@/lib/data/proposals";
import { BASE } from "@/lib/seo/site";

// Required by `output: "export"` — metadata routes must opt in to being
// rendered once at build time rather than per request.
export const dynamic = "force-static";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "1 Sept 2026" (the proposal labels' en-GB format) → UTC ms, or NaN. */
function parseLabel(label: string) {
  const m = label.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  const month = m ? MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()) : -1;
  return m && month >= 0 ? Date.UTC(Number(m[3]), month, Number(m[1])) : NaN;
}

/**
 * The newest date the DAO's record changed: a proposal opening, or a vote
 * closing, whichever is latest and already past. Undefined if there's none
 * (or the build couldn't sync the proposals).
 */
function latestProposalDate(proposals: ProposalView[], now: number) {
  const dates = proposals
    .flatMap((p) => [p.endTs, parseLabel(p.startLabel)])
    .filter((t) => Number.isFinite(t) && t > 0 && t <= now);
  return dates.length ? new Date(Math.max(...dates)) : undefined;
}

const newest = (...dates: (Date | undefined)[]) => {
  const ts = dates.filter((d): d is Date => !!d).map((d) => d.getTime());
  return ts.length ? new Date(Math.max(...ts)) : undefined;
};

/**
 * Static marketing routes plus the legal pages generated from policy data.
 * Keep this in sync with the App Router segments under src/app.
 *
 * `lastmod` comes only from authored dates (SEO-07): the roadmap's own
 * "last updated" date, the newest DAO proposal, and each policy's date.
 * A page with no such date gets none, rather than the build time, which
 * would change on every deploy and teach crawlers to ignore it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { proposals } = await getGovernance();
  const roadmap = new Date(`${ROADMAP_UPDATED}T00:00:00Z`);
  const governance = latestProposalDate(proposals, Date.now());
  const at = (date: Date | undefined) => (date ? { lastModified: date } : {});

  const staticRoutes: MetadataRoute.Sitemap = [
    // Home shows the roadmap's Now/Next and the latest proposals.
    { url: `${BASE}/`, priority: 1, changeFrequency: "weekly", ...at(newest(roadmap, governance)) },
    // About carries the full roadmap.
    { url: `${BASE}/about`, priority: 0.8, changeFrequency: "monthly", ...at(roadmap) },
    { url: `${BASE}/protocol`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/indices`, priority: 0.9, changeFrequency: "weekly" },
    ...["blokc2", "blokc5", "blokc10"].map((id) => ({
      url: `${BASE}/indices/${id}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    { url: `${BASE}/security`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/token`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/governance`, priority: 0.7, changeFrequency: "weekly", ...at(governance) },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "monthly" },
  ];

  // Use each policy's authored `date` so crawlers see real revision times
  // instead of the build timestamp.
  const legalRoutes: MetadataRoute.Sitemap = getAllPolicies().map((policy) => ({
    url: `${BASE}/legal/${policy.slug}`,
    lastModified: new Date(policy.date),
    priority: 0.3,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...legalRoutes];
}
