import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const columns = ["A custodian", "Crypto on your own", "A BLOK Garden"] as const;

const rows: { q: string; cells: [string, string, string] }[] = [
  {
    q: "Who holds the keys?",
    cells: [
      "They do. You get a login and their word.",
      "You do, alone. Lose the seed phrase and it's gone.",
      "You do, in a smart wallet at your address. No seed phrase with Google sign-in.",
    ],
  },
  {
    q: "Can I see what's happening?",
    cells: [
      "A statement every quarter.",
      "Your wallet, yes. A manager's trades? Screenshots.",
      "Every position and move on-chain, readable in any block explorer.",
    ],
  },
  {
    q: "Can I actually use it?",
    cells: [
      "Minimum tickets and accreditation forms.",
      "Open to anyone, then thousands of uncurated tokens.",
      "Open access, with curated indices to start from.",
    ],
  },
  {
    q: "What does it cost?",
    cells: [
      "Management and performance fees, deep in the prospectus.",
      "Hidden in spreads, MEV and slippage.",
      "Gasless and fee-free at launch. Future fees set by DAO vote.",
    ],
  },
];

/**
 * The problem, as a comparison: the two existing answers vs. a Garden. A real
 * table on desktop; on phones each question stacks into a card and every cell
 * prints its column name.
 */
export function Problem() {
  return (
    <Section
      id="why"
      eyebrow="Why BLOK Capital"
      title={
        <>
          Wealth management used to mean <em className="text-sand">handing over the keys.</em>
        </>
      }
      description="Custodians hold your assets for you. Doing it yourself leaves you holding everything. A Garden is the third option."
    >
      <Reveal>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">How a BLOK Garden compares with a custodian and with managing crypto on your own</caption>
          <thead className="hidden md:table-header-group">
            <tr>
              <th scope="col" className="w-[22%] pb-5" />
              {columns.map((c, i) => (
                <th
                  scope="col"
                  key={c}
                  className={
                    i === 2
                      ? "rounded-t-2xl border-x border-t border-leaf/25 bg-leaf/[0.06] px-6 pb-5 pt-5 text-caption font-semibold uppercase tracking-[0.12em] text-leaf"
                      : "px-6 pb-5 text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle"
                  }
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr
                key={r.q}
                className="mb-4 block rounded-2xl border border-line/[0.08] bg-card p-5 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-t md:border-line/[0.08] md:bg-transparent md:p-0"
              >
                <th scope="row" className="display block pb-3 text-h4 font-normal text-fg md:table-cell md:py-6 md:pr-6 md:align-top">
                  {r.q}
                </th>
                {r.cells.map((cell, i) => (
                  <td
                    key={columns[i]}
                    data-label={columns[i]}
                    className={[
                      "block py-2 text-[15px] leading-relaxed md:table-cell md:px-6 md:py-6 md:align-top",
                      "before:mb-1 before:block before:text-[11px] before:font-semibold before:uppercase before:tracking-[0.12em] before:text-fg-subtle before:content-[attr(data-label)] md:before:hidden",
                      i === 2
                        ? `text-fg md:border-x md:border-leaf/25 md:bg-leaf/[0.06] ${ri === rows.length - 1 ? "md:rounded-b-2xl md:border-b" : ""}`
                        : "text-fg-muted",
                    ].join(" ")}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}
