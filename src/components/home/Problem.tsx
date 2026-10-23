import { Section } from "@/components/ui/Section";
import { ScrollInk } from "@/components/motion/ScrollInk";

// "(at launch)": Gardens aren't open yet, so the third column describes them
// as they will be (CRO-13).
const columns = ["A custodian", "Crypto on your own", "A BLOK Garden (at launch)"] as const;

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
 * The problem, stated once in large type that inks in as you scroll (every
 * word readable from the start), then as a comparison: the two existing
 * answers vs. a Garden. A real table on desktop; below that each question is
 * a card (two per row on tablets) and every cell prints its column name.
 * The table is data being read, so it isn't hidden behind a scroll reveal.
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
    >
      <ScrollInk className="display mb-14 max-w-4xl text-display-sm leading-[1.28] text-fg sm:mb-16">
        Custodians hold your assets for you. Doing it yourself leaves you holding everything.{" "}
        A Garden is the third option.
      </ScrollInk>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">How a BLOK Garden compares with a custodian and with managing crypto on your own</caption>
        <thead className="hidden lg:table-header-group">
          <tr>
            <th scope="col" className="w-[22%] pb-5">
              <span className="sr-only">Question</span>
            </th>
            {columns.map((c, i) => (
              <th
                scope="col"
                key={c}
                className={
                  i === 2
                    ? "rounded-t-card border-x border-t border-leaf/25 bg-leaf/6 px-6 pb-5 pt-5 text-caption font-semibold uppercase tracking-caps text-leaf"
                    : "px-6 pb-5 text-caption font-semibold uppercase tracking-caps text-fg-subtle"
                }
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="md:grid md:grid-cols-2 md:gap-4 lg:table-row-group">
          {rows.map((r, ri) => (
            <tr
              key={r.q}
              className="mb-4 block rounded-card md:mb-0 border border-subtle bg-card p-5 lg:mb-0 lg:table-row lg:rounded-none lg:border-0 lg:border-t lg:border-subtle lg:bg-transparent lg:p-0"
            >
              <th scope="row" className="display block pb-3 text-h4 font-normal text-fg lg:table-cell lg:py-6 lg:pr-6 lg:align-top">
                {r.q}
              </th>
              {r.cells.map((cell, i) => (
                <td
                  key={columns[i]}
                  data-label={columns[i]}
                  className={[
                    "block py-2 text-ui leading-relaxed lg:table-cell lg:px-6 lg:py-6 lg:align-top",
                    "before:mb-1 before:block before:text-label before:font-semibold before:uppercase before:tracking-caps before:text-fg-subtle before:content-[attr(data-label)] lg:before:hidden",
                    i === 2
                      ? `text-fg lg:border-x lg:border-leaf/25 lg:bg-leaf/6 ${ri === rows.length - 1 ? "lg:rounded-b-card lg:border-b" : ""}`
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
    </Section>
  );
}
