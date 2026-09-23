import { cn } from "@/lib/utils";

/** A labelled figure. Values are real or sourced; never placeholders. */
export function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <dt className="order-2 mt-2 text-caption text-fg-subtle">{label}</dt>
      <dd className="display order-1 text-[clamp(26px,2vw+14px,36px)] leading-none text-fg tabular">{value}</dd>
      {hint && <dd className="order-3 mt-1 text-caption text-fg-subtle">{hint}</dd>}
    </div>
  );
}
