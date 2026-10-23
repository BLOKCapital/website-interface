import type { ReactNode } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { arbiscanCode, arbiscanToken, registry, type RegistryRow } from "./contracts";
import { cn } from "@/lib/utils";

/** A small external link with the visible ↗ and the spoken new-tab cue. */
function Ext({ href, children, cta, className }: { href: string; children: ReactNode; cta?: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta={cta}
      className={cn(
        "inline-flex min-h-6 items-center gap-0.5 rounded-xs font-medium text-leaf underline decoration-leaf/40 underline-offset-[3px] transition-colors duration-fast can-hover:hover:decoration-leaf",
        className,
      )}
    >
      {children}
      <Icon name="external" size="sm" className="-mr-0.5" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Nothing stated, or nothing to check yet. */
function Empty({ why }: { why: string }) {
  return (
    <span className="text-fg-subtle">
      <span aria-hidden>—</span>
      <span className="sr-only">{why}</span>
    </span>
  );
}

/** The contract's source on GitHub, where the site already links it. */
function Code({ row }: { row: RegistryRow }) {
  if (!row.code) return null;
  return (
    <span className="mt-1 block text-caption">
      <Ext href={row.code.href} cta="security_registry_github" className="font-mono font-normal">
        {row.code.label}
      </Ext>
    </span>
  );
}

/** The address with copy and Arbiscan, or an honest "Not deployed yet". */
function Address({ row, idSuffix }: { row: RegistryRow; idSuffix: string }) {
  if (!row.address) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-dashed border-line/25 px-2.5 py-1 text-label text-fg-muted">
        Not deployed yet
      </span>
    );
  }
  const id = `registry-${row.id}-${idSuffix}`;
  return (
    <div className="min-w-0">
      <code id={id} className="block break-all font-mono text-[0.8125rem] leading-snug text-fg">
        {row.address}
      </code>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption">
        <CopyButton value={row.address} label="Copy address" selectTarget={id} />
        <Ext href={arbiscanToken(row.address)} cta="security_registry_arbiscan">
          Arbiscan
        </Ext>
        {row.publishedAt && (
          <Ext href={row.publishedAt.href} cta="security_registry_docs">
            {row.publishedAt.label}
          </Ext>
        )}
      </div>
    </div>
  );
}

/** Never "Yes": a deployed contract links to Arbiscan's code tab for the reader to check. */
function Verified({ row }: { row: RegistryRow }) {
  if (!row.address) return <Empty why="Nothing to verify until it's deployed" />;
  return (
    <Ext href={arbiscanCode(row.address)} cta="security_registry_arbiscan">
      Check the code tab
    </Ext>
  );
}

function Audit({ row }: { row: RegistryRow }) {
  if (!row.audit) return <Empty why="Not stated on this site yet" />;
  const text = <span className={row.audit.covered ? "text-fg" : "text-fg-muted"}>{row.audit.text}</span>;
  if (!row.audit.href) return text;
  return (
    <Ext href={row.audit.href} cta="security_registry_audit_report" className="font-normal">
      {row.audit.text}
    </Ext>
  );
}

const cols = ["Contract", "What it does", "Address", "Source verified", "Audit coverage"] as const;

/**
 * The contract registry (INS-04): a table from lg, one card per contract
 * below it. Data and rules: contracts.ts. Undeployed rows read "Not
 * deployed yet"; there is never a placeholder address.
 */
export function ContractRegistry() {
  return (
    <Reveal>
      {/* lg and up: a real table. */}
      <div className="hidden overflow-hidden rounded-panel border border-subtle bg-card lg:block">
        <table className="w-full table-fixed border-collapse text-left text-small">
          <caption className="sr-only">BLOK Capital contracts: what each does, its address, source verification and audit coverage</caption>
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[27%]" />
            <col className="w-[24%]" />
            <col className="w-[14%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-subtle">
              {cols.map((c) => (
                <th key={c} scope="col" className="label-caps px-5 py-3.5 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {registry.map((row) => (
              <tr key={row.id} className="align-top">
                <th scope="row" className="px-5 py-4 font-normal">
                  <span className="font-medium text-fg">{row.name}</span>
                  <Code row={row} />
                </th>
                <td className="px-5 py-4 text-fg-muted">{row.what}</td>
                <td className="px-5 py-4">
                  <Address row={row} idSuffix="table" />
                </td>
                <td className="px-5 py-4">
                  <Verified row={row} />
                </td>
                <td className="px-5 py-4">
                  <Audit row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Below lg: one card per contract. */}
      <ul className="grid gap-4 md:grid-cols-2 lg:hidden">
        {registry.map((row) => (
          <li key={row.id} className="rounded-card border border-subtle bg-card p-5">
            <h3 className="text-ui font-medium text-fg">{row.name}</h3>
            <Code row={row} />
            <p className="mt-2 text-small text-fg-muted">{row.what}</p>
            <dl className="mt-4 space-y-3 border-t border-subtle pt-4 text-small">
              <div>
                <dt className="label-caps">Address</dt>
                <dd className="mt-1.5">
                  <Address row={row} idSuffix="card" />
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="label-caps">Source verified</dt>
                <dd>
                  <Verified row={row} />
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="label-caps">Audit coverage</dt>
                <dd className="text-right">
                  <Audit row={row} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-caption text-fg-subtle">
        <span aria-hidden>—</span> means the site doesn&apos;t state it yet, or there&apos;s nothing to check until the
        contract is deployed. Rows read &ldquo;Not deployed yet&rdquo; until verified addresses are published; this list
        never shows a placeholder address.
      </p>
    </Reveal>
  );
}
