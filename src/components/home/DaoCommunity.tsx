import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProposalFeed } from "@/components/home/ProposalFeed";
import { Reveal, Stagger, RevealItem } from "@/components/ui/Reveal";
import { getProposals } from "@/lib/data/proposals";

/**
 * DaoCommunity — the public square.
 *
 * Two editorial spots in the square: the Voting Board (live on-chain proposals)
 * and the Square (links into every community channel). Cards stagger-fade on
 * viewport entry; a closing P.S. invites the reader into the conversation.
 */
export async function DaoCommunity() {
  const proposals = await getProposals();

  return (
    <Section
      id="dao"
      eyebrow="DAO & Community"
      title={
        <>
          The protocol is{" "}
          <em className="font-serif italic text-moss">a public square.</em>
        </>
      }
      description="A preview of governance, and the rest of the conversation."
    >
      <Stagger
        staggerChildren={0.12}
        delayChildren={0.05}
        className="grid gap-5 lg:grid-cols-2"
      >
        {/* I. The Voting Board, sample proposals (DAO not yet live) */}
        <RevealItem variant="fade-up">
          <GlassCard className="flex h-full flex-col">
            <CardHeader roman="I" title="The Voting Board" />
            <ProposalFeed proposals={proposals} />
            <p className="mt-auto pt-6 text-[12px] leading-relaxed text-ink-subtle">
              Synced from the DAO on-chain (Aragon OSx).
            </p>
          </GlassCard>
        </RevealItem>

        {/* II. The Square, community stats (illustrative) */}
        <RevealItem variant="fade-up">
          <GlassCard className="flex h-full flex-col">
            <CardHeader roman="II" title="The Square" />
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
              Where the rest of the conversation happens.
            </p>
            <ul className="mt-5 space-y-2">
              <CommunityRow label="Telegram" href="https://t.me/BLOKCapital" />
              <CommunityRow label="X" href="https://x.com/blok_cap" />
              <CommunityRow label="Discord" href="https://discord.com/invite/blokc" />
              <CommunityRow label="Farcaster" href="https://warpcast.com/blokc" />
            </ul>
            <p className="mt-auto pt-6 text-[12px] leading-relaxed text-ink-subtle">
              Every channel is open. Come say hello.
            </p>
          </GlassCard>
        </RevealItem>
      </Stagger>

      {/* Closing P.S., invitation to participate */}
      <Reveal variant="fade-up" amount={0.4}>
        <p className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]">
          <span className="script text-[22px] leading-none text-clay">
            P.S.
          </span>
          <span>
            The real conversation happens on Discord.{" "}
            <Link
              href="https://discord.com/invite/blokc"
              target="_blank"
              rel="noreferrer"
              className="group/t relative font-medium text-ink transition-colors hover:text-clay-deep"
            >
              <span className="underline decoration-clay decoration-[1.5px] underline-offset-[6px]">
                Drop in
              </span>
              <span
                aria-hidden
                className="inline-block translate-x-1 transition-transform duration-300 ease-in-soft group-hover/t:translate-x-2"
              >
                {" "}
                →
              </span>
            </Link>, we read everything.
          </span>
        </p>
      </Reveal>
    </Section>
  );
}

/* ---------- card header ---------------------------------------------------- */

function CardHeader({
  roman,
  title,
  live = false,
}: {
  roman: string;
  title: string;
  live?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-baseline gap-2.5">
        <span className="display text-[20px] leading-none text-clay/55">
          {roman}
        </span>
        <p className="display text-[19px] leading-tight text-ink">{title}</p>
      </div>
      {live && (
        <span
          aria-hidden
          className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-clay-deep"
        >
          <span className="relative inline-flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-clay/45" />
            <span className="relative inline-block size-1.5 rounded-full bg-clay" />
          </span>
          Live
        </span>
      )}
    </div>
  );
}

/* ---------- community row with hover affordance ---------------------------- */

function CommunityRow({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group/r -mx-2 flex items-center justify-between rounded-md px-2 py-1.5 transition-colors duration-200 hover:bg-paper-deep"
      >
        <span className="text-[13.5px] text-ink-muted transition-colors duration-200 group-hover/r:text-ink">
          {label}
        </span>
        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-clay transition-colors duration-200 group-hover/r:text-clay-deep">
          Follow
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-in-soft group-hover/r:translate-x-1"
          >
            →
          </span>
        </span>
      </a>
    </li>
  );
}
