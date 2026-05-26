import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** Adds the hover-lift treatment (small lift + warm border). */
  interactive?: boolean;
  /** Use the deeper paper tone for nested cards. */
  deep?: boolean;
};

/**
 * Paper card — warm cream surface with a soft natural shadow. Replaces the
 * earlier glassmorphism. Name kept as `GlassCard` to avoid a sweeping rename
 * across 30+ call sites; semantics are now "paper sheet, not glass".
 */
export function GlassCard({
  className,
  interactive,
  deep,
  children,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "paper-card relative overflow-hidden p-6",
        deep && "paper-card-deep",
        interactive &&
          "transition-[transform,border-color,box-shadow] duration-150 ease-in-soft hover:-translate-y-0.5 hover:border-ink/20 active:translate-y-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
