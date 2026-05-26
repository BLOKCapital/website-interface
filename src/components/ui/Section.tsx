import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  /** Tracked-caps eyebrow above the title. */
  eyebrow?: string;
  /** Quiet page mark in the margin — e.g. "p. 03". Prefer plain numbers. */
  number?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  /** Thin sketched rule at the top between sections. */
  vine?: boolean;
};

/**
 * Garden Journal section frame.
 *
 * Plain warm-paper layout. A hairline ink rule + small botanical sprig replace
 * the previous outlined "BUILT/TALK" watermarks and the mono "Nº" numbering.
 * Title uses the Newsreader serif display; description uses Inter body.
 */
export function Section({
  id,
  eyebrow,
  number,
  title,
  description,
  children,
  className,
  align = "left",
  vine = true,
}: Props) {
  return (
    <section id={id} className={cn("paper relative isolate", className)}>
      {vine && (
        <span
          aria-hidden
          className="absolute left-1/2 top-0 z-0 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-ink/15"
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
        {(eyebrow || title || description || number) && (
          <header
            className={cn(
              "mb-10 max-w-3xl sm:mb-14",
              align === "center" && "mx-auto text-center",
            )}
          >
            {(eyebrow || number) && (
              <div
                className={cn(
                  "flex items-center gap-3",
                  align === "center" && "justify-center",
                )}
              >
                {number && (
                  <span className="script text-[18px] leading-none text-clay">
                    p. {number}
                  </span>
                )}
                {number && eyebrow && (
                  <span
                    aria-hidden
                    className="inline-block h-px w-8 bg-ink/20"
                  />
                )}
                {eyebrow && <p className="eyebrow text-moss">{eyebrow}</p>}
              </div>
            )}
            {title && (
              <h2 className="display mt-5 text-[28px] leading-[1.06] text-ink sm:text-[40px] lg:text-[56px] lg:leading-[1.04]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
