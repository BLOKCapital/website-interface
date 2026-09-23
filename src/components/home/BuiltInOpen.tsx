import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ExternalIcon } from "@/components/ui/icons";
import { team } from "@/lib/data/team";
import { ORG, CORE_REPO, type GithubSnapshot } from "@/lib/data/github";

/** What each public repo is for, in words a newcomer can follow. */
const purpose: Record<string, string> = {
  "blokc-v1-core": "Gardens, facets, indices and the rebalancer",
  "worker-solver": "The keeper that finds routes and triggers rebalances",
  "blokc-v1-rewards": "$BLOKC reward locks for contributors",
  "blokc-v1-vesting": "$BLOKC vesting contracts",
  "blokc-graph": "Subgraph for DAO governance events",
  docs: "The documentation site",
  audits: "Published audit reports",
  "website-interface": "This website",
};

const langColor: Record<string, string> = { Solidity: "#C7A6F5", TypeScript: "#7DB4FF", MDX: "#E3C07A" };

/**
 * Who builds BLOK Capital and where: the public repositories (fetched at
 * build time from GitHub), the people, and the community channels.
 */
export function BuiltInOpen({ github }: { github: GithubSnapshot }) {
  const order = Object.keys(purpose);
  const repos = (github?.repos ?? [])
    .filter((r) => purpose[r.name])
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
    .slice(0, 6);
  const core = github?.repos.find((r) => r.name === CORE_REPO);
  return (
    <Section
      id="builders"
      eyebrow="Who's building it"
      title={
        <>
          A small team, <em className="text-sand">working in public.</em>
        </>
      }
      description="The contracts, the rebalancing keeper, the docs and this website are all on GitHub. Read the code, and ask the people who wrote it in the Discord."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="h-full overflow-hidden rounded-3xl border border-line/[0.08] bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/[0.07] px-5 py-4">
              <p className="text-small font-medium text-fg">github.com/{ORG}</p>
              <p className="text-caption text-fg-subtle">
                {github ? `Snapshot from ${github.builtLabel}` : "GitHub couldn't be reached when this page was built"}
              </p>
            </div>
            {github && (
              <dl className="grid grid-cols-3 border-b border-line/[0.07]">
                {[
                  { k: "Public repos", v: String(github.repos.length) },
                  {
                    k: "Core commits, 90 days",
                    v: github.coreCommits90d === null ? "—" : github.coreCommits90d >= 100 ? "100+" : String(github.coreCommits90d),
                  },
                  { k: "Core last pushed", v: core?.pushedLabel ?? "—" },
                ].map((s, i) => (
                  <div key={s.k} className={`px-5 py-4 ${i ? "border-l border-line/[0.07]" : ""}`}>
                    <dd className="display text-[22px] leading-none text-fg tabular sm:text-[26px]">{s.v}</dd>
                    <dt className="mt-2 text-caption text-fg-subtle">{s.k}</dt>
                  </div>
                ))}
              </dl>
            )}
            <ul className="divide-y divide-line/[0.06]">
              {repos.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/r flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-raised/60"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-mono text-[13px] text-fg group-hover/r:text-leaf">
                        {r.name} <ExternalIcon size={10} />
                      </span>
                      <span className="block truncate text-caption text-fg-muted">{purpose[r.name]}</span>
                    </span>
                    <span className="hidden items-center gap-1.5 text-caption text-fg-subtle sm:flex">
                      {r.language && (
                        <>
                          <span aria-hidden className="size-2 rounded-full" style={{ background: langColor[r.language] ?? "rgb(var(--fg-subtle))" }} />
                          {r.language}
                        </>
                      )}
                    </span>
                    <span className="w-24 text-right font-mono text-[11.5px] text-fg-subtle tabular">{r.pushedLabel}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <Reveal delay={0.06} className="rounded-3xl border border-line/[0.08] bg-card p-6">
            <p className="text-small font-medium text-fg">The people</p>
            <Stagger as="ul" step={0.04} className="mt-4 flex flex-wrap gap-2">
              {team.map((m) => (
                <RevealItem as="li" key={m.name}>
                  {m.image ? (
                    <Image src={m.image} alt={m.name} title={m.name} width={44} height={44} className="size-11 rounded-full border border-line/10 object-cover" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-full bg-raised text-caption text-fg-muted" title={m.name}>
                      {m.initials}
                    </span>
                  )}
                </RevealItem>
              ))}
            </Stagger>
            <ArrowLink href="/about#team" className="mt-5">
              Meet the team and read the story
            </ArrowLink>
          </Reveal>
          <Reveal delay={0.12} className="flex-1 rounded-3xl border border-line/[0.08] bg-card p-6">
            <p className="text-small font-medium text-fg">The community</p>
            <p className="mt-2 text-small text-fg-muted">
              The Discord is where testing feedback, support and security reports go. Everything else is announced on X first.
            </p>
            <SocialLinks className="mt-5" />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
