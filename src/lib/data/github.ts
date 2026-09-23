/**
 * Public GitHub activity for the BLOKCapital organisation, fetched at build
 * time (unauthenticated, 2 requests). Nothing is hard-coded: if GitHub is
 * unreachable or rate-limits the build, the section says so instead of
 * showing stale numbers.
 */

export type RepoView = {
  name: string;
  description: string;
  language: string | null;
  url: string;
  pushedAt: string;
  pushedLabel: string;
};

export type GithubSnapshot = {
  repos: RepoView[];
  /** Commits to the core contracts repo in the 90 days before the build. */
  coreCommits90d: number | null;
  builtLabel: string;
} | null;

export const ORG = "BLOKCapital";
export const CORE_REPO = "blokc-v1-core";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const BUILD_KEY = Date.now();
const headers = { accept: "application/vnd.github+json", "user-agent": "blokcapital.io-build" };

type RawRepo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
};

export async function getGithub(): Promise<GithubSnapshot> {
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100&sort=pushed&build=${BUILD_KEY}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = (await res.json()) as RawRepo[];
    const repos = raw
      .filter((r) => !r.archived && !r.fork && !r.private)
      .map((r) => ({
        name: r.name,
        description: r.description ?? "",
        language: r.language,
        url: r.html_url,
        pushedAt: r.pushed_at,
        pushedLabel: fmt.format(Date.parse(r.pushed_at)),
      }));

    let coreCommits90d: number | null = null;
    try {
      const since = new Date(BUILD_KEY - 90 * 864e5).toISOString();
      const c = await fetch(`https://api.github.com/repos/${ORG}/${CORE_REPO}/commits?per_page=100&since=${since}&build=${BUILD_KEY}`, { headers });
      if (c.ok) coreCommits90d = ((await c.json()) as unknown[]).length;
    } catch {
      /* optional */
    }
    return { repos, coreCommits90d, builtLabel: fmt.format(BUILD_KEY) };
  } catch (err) {
    console.warn(`[github] repos fetch failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}
