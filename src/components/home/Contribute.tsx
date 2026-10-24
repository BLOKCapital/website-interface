import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import { XIcon } from "@/components/ui/icons";
import { links } from "@/lib/data/socials";

/**
 * The Contributor Program (contribute.blokc.app), on home: two ways to earn
 * $BLOKC, posts on X and quests, and how to join. A dark band, so it stands
 * out between the safety pillars and the FAQ.
 *
 * Every line is one the program's own app and terms state (the
 * contributor-interface repo: the landing page, the quest list and the
 * terms). Left out on purpose, until the team settles them, are the points
 * its sources disagree on: how many posts a day earn, how often posts are
 * scored, any engagement adjustment, and which network rewards settle on.
 * The quest kinds are the app's three; no quest is named, since quests
 * change.
 */

const steps = [
  { title: "Sign in with Google", body: "A smart wallet is set up for you. No seed phrase, no gas fees." },
  { title: "Connect Discord and X", body: "To check you can join. It only reads your public profiles." },
  { title: "Post, or take a quest", body: "An original post about BLOK Capital, or one action before a quest's deadline." },
  { title: "Earn $BLOKC", body: "Into your own on-chain vault, transferable from 1 May 2027." },
];

const quests = [
  { kind: "DAO vote", title: "Vote on a proposal", body: "Any choice counts: yes, no or abstain. Only that you voted is checked, never how." },
  { kind: "Repost", title: "Repost an announcement", body: "A specific post on X. Leave it up until the quest closes." },
  { kind: "Task", title: "Do a one-off task", body: "Set by the team, with the instruction written on the quest itself." },
];

export function Contribute() {
  return (
    <Section
      id="contribute"
      tone="dark"
      eyebrow="Contributor Program"
      title={
        <>
          Grow the mission, <em>earn $BLOKC.</em>
        </>
      }
      description="Share what BLOK Capital is building, or complete quests, and earn $BLOKC into a wallet that's yours alone. Free to join."
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* How to join, and the way in. */}
        <div className="flex flex-col lg:col-span-5">
          <ol className="space-y-5">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-3">
                <span className="font-mono text-label text-cobalt">0{i + 1}</span>
                <div>
                  <p className="text-ui font-bold tracking-tight text-fg">{s.title}</p>
                  <p className="mt-1 text-small text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={links.contribute} size="lg" data-cta="contribute_join" data-placement="contribute">
              Join the Contributor Program
            </Button>
            <Button href={links.contributeTerms} size="lg" variant="ghost" data-placement="contribute">
              Program terms
            </Button>
          </div>
          <p className="mt-6 text-caption text-fg-subtle">
            To join, you&apos;ll need to be in the BLOK Capital Discord and have an X account with 250+ followers, both created
            before 2026. Rewards are at the program&apos;s discretion, and $BLOKC&apos;s value may be zero.
          </p>
        </div>

        {/* Two ways to earn, as a board of pinned cards. */}
        <div className="paper-ruled relative rounded-panel border border-subtle bg-card p-5 shadow-soft sm:p-7 lg:col-span-7">
          <Image
            src="/brand/token-front.webp"
            alt=""
            width={72}
            height={72}
            className="sticker absolute -right-3 -top-5 size-14 rotate-12 sm:-right-4 sm:-top-6 sm:size-[72px]"
          />
          <p className="eyebrow">Two ways to earn</p>

          {/* 1: posts on X. */}
          <div className="note-card mt-5 flex gap-4 p-4 sm:p-5">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-fg text-canvas">
              <XIcon size={16} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-label uppercase tracking-caps text-cobalt">Post on X</p>
              <p className="mt-1.5 text-ui font-bold tracking-tight text-fg">Explain what BLOK Capital is building</p>
              <p className="mt-1 text-small text-fg-muted">
                Original posts that mention $BLOKC or @blok_cap, scored for accuracy, substance, originality and quality against
                the docs. Replies and reposts don&apos;t count.
              </p>
            </div>
          </div>

          {/* 2: quests, the app's three kinds. */}
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-label uppercase tracking-caps text-cobalt">Quests · one action, one reward</p>
            <p className="note text-[1.15rem]">nothing to submit</p>
          </div>
          <Stagger as="ul" className="mt-3 grid gap-3 sm:grid-cols-3">
            {quests.map((q, i) => (
              <RevealItem as="li" key={q.kind} className={i === 1 ? "sm:rotate-1" : i === 2 ? "sm:-rotate-1" : undefined}>
                <div className="note-card h-full p-4">
                  <span className="inline-flex rounded-tag border border-cobalt/30 px-1.5 py-0.5 font-mono text-label uppercase tracking-wide text-cobalt">
                    {q.kind}
                  </span>
                  <p className="mt-2.5 text-small font-bold tracking-tight text-fg">{q.title}</p>
                  <p className="mt-1 text-caption text-fg-muted">{q.body}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
          <p className="strip mt-5 text-fg-muted">Each quest has a deadline, and pays a fixed amount each, or a share of one pool.</p>
        </div>
      </div>
    </Section>
  );
}
