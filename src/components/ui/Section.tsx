import { cn } from "@/lib/utils";

/**
 * Page section: full-bleed band (`tone`) around a centred container, with an
 * optional header. Headings are h2; pass `headingLevel` 1 only for heroes.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  tone = "canvas",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Links/buttons shown beside (desktop) or below (mobile) the header. */
  actions?: React.ReactNode;
  align?: "left" | "center";
  tone?: "canvas" | "surface";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24 lg:py-28",
        tone === "surface" && "border-y border-line/[0.07] bg-surface",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-page px-5 sm:px-8">
        {(eyebrow || title || description) && (
          <header
            className={cn(
              "mb-12 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between",
              align === "center" && "items-center text-center lg:flex-col lg:items-center",
            )}
          >
            <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2 className="display mt-4 text-h2 text-balance text-fg">{title}</h2>}
              {description && <p className="mt-5 max-w-2xl text-lead text-fg-muted">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
