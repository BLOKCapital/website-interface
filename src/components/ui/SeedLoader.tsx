import { cn } from "@/lib/utils";

/**
 * SeedLoader — a tiny botanical loading state.
 *
 * Loop story (≈2.8s):
 *   1.  Seed appears in the soil, pulses
 *   2.  Stem grows up
 *   3.  Two leaves unfurl (left first, then right)
 *   4.  Five clay petals + an ochre centre bloom at the top
 *   5.  Full bloom holds, then loops
 *
 * Honours prefers-reduced-motion via the global rule in globals.css —
 * animations are reduced to a single frame, so the loader paints its final
 * bloomed state instantly.
 */
export function SeedLoader({
  label = "planting…",
  size = 160,
  className,
}: {
  label?: string;
  /** Pixel size of the SVG. Default 160. */
  size?: number;
  className?: string;
}) {
  // Label scales gently with size so a bigger loader still feels balanced.
  const labelSize = Math.round(size / 7); // 96 → 14, 160 → ~23
  return (
    <div
      className={cn("flex flex-col items-center gap-5", className)}
      style={{ gap: Math.max(16, Math.round(size / 8)) }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Warm halo behind the loader */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-25%] -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 55%, rgb(var(--clay) / 0.22), transparent 70%), radial-gradient(60% 60% at 50% 70%, rgb(var(--moss) / 0.18), transparent 70%)",
          }}
        />

        <svg
          viewBox="0 0 96 96"
          width={size}
          height={size}
          role="status"
          aria-label={label}
        >
          {/* Soft soil shadow */}
          <ellipse cx="48" cy="84" rx="34" ry="3" fill="rgb(var(--clay-deep))" opacity="0.18" />

          {/* Soil bed */}
          <rect x="14" y="72" width="68" height="10" rx="4" fill="rgb(var(--clay-deep))" />
          {/* Soil grain, a few scattered specks */}
          <circle cx="22" cy="77" r="0.9" fill="rgb(var(--ochre) / 0.6)" />
          <circle cx="32" cy="79" r="0.7" fill="rgb(var(--ochre) / 0.5)" />
          <circle cx="58" cy="76" r="0.8" fill="rgb(var(--ochre) / 0.6)" />
          <circle cx="68" cy="79" r="0.9" fill="rgb(var(--ochre) / 0.55)" />
          <circle cx="42" cy="78" r="0.6" fill="rgb(var(--ochre) / 0.5)" />
          {/* Soil top edge, moss-tinted */}
          <rect x="18" y="70" width="60" height="2" rx="1" fill="rgb(var(--moss-deep) / 0.45)" />

          {/* Seed, pulses, then shrinks away as the stem appears */}
          <g
            style={{
              transformOrigin: "48px 75px",
              // react-doctor-disable-next-line react-doctor/no-long-transition-duration
              animation: "seedPulse 2.8s ease-in-out infinite",
            }}
          >
            <ellipse cx="48" cy="75" rx="3.6" ry="2.4" fill="rgb(var(--clay-deep))" />
            <ellipse cx="48.5" cy="74.2" rx="1.6" ry="0.9" fill="rgb(var(--clay) / 0.7)" />
          </g>

          {/* Stem, grows upward */}
          <g
            style={{
              transformOrigin: "48px 72px",
              // react-doctor-disable-next-line react-doctor/no-long-transition-duration
              animation: "stemGrow 2.8s ease-in-out infinite",
            }}
          >
            <path
              d="M48 72 Q 46.5 52 48 28"
              stroke="rgb(var(--moss))"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Left leaf, unfurls first */}
          <g
            style={{
              transformOrigin: "48px 52px",
              // react-doctor-disable-next-line react-doctor/no-long-transition-duration
              animation: "leafLeft 2.8s ease-in-out infinite",
            }}
          >
            <path
              d="M48 54 C 38 52 36 48 41 44 C 47 46 49 50 48 54 Z"
              fill="rgb(var(--moss))"
            />
            <path
              d="M48 54 C 44 50 43 47 44 45"
              stroke="rgb(var(--paper))"
              strokeWidth="0.7"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* Right leaf, unfurls slightly later */}
          <g
            style={{
              transformOrigin: "48px 42px",
              // react-doctor-disable-next-line react-doctor/no-long-transition-duration
              animation: "leafRight 2.8s ease-in-out infinite",
            }}
          >
            <path
              d="M48 42 C 58 40 60 36 55 32 C 49 34 47 38 48 42 Z"
              fill="rgb(var(--moss-soft))"
            />
            <path
              d="M48 42 C 52 38 53 35 52 33"
              stroke="rgb(var(--paper))"
              strokeWidth="0.7"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          {/* Flower, 5 clay petals + ochre centre */}
          <g
            style={{
              transformOrigin: "48px 22px",
              // react-doctor-disable-next-line react-doctor/no-long-transition-duration
              animation: "bloomIn 2.8s ease-in-out infinite",
            }}
          >
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="48"
                cy="14"
                rx="4"
                ry="6.5"
                transform={`rotate(${angle} 48 22)`}
                fill="rgb(var(--clay))"
                opacity="0.88"
              />
            ))}
            <circle cx="48" cy="22" r="3" fill="rgb(var(--ochre))" />
            <circle cx="48" cy="22" r="1.4" fill="rgb(var(--clay-deep))" opacity="0.6" />
          </g>

          <style>{`
            @keyframes seedPulse {
              0%   { transform: scale(0); opacity: 0; }
              8%   { transform: scale(1); opacity: 1; }
              18%  { transform: scale(1.15); opacity: 1; }
              26%  { transform: scale(0.5); opacity: 0; }
              100% { transform: scale(0.5); opacity: 0; }
            }
            @keyframes stemGrow {
              0%, 18%   { transform: scaleY(0); opacity: 0; }
              22%       { opacity: 1; }
              42%, 100% { transform: scaleY(1); opacity: 1; }
            }
            @keyframes leafLeft {
              0%, 40%   { transform: scale(0); opacity: 0; }
              55%       { transform: scale(1.08); opacity: 1; }
              62%, 100% { transform: scale(1); opacity: 1; }
            }
            @keyframes leafRight {
              0%, 48%   { transform: scale(0); opacity: 0; }
              63%       { transform: scale(1.08); opacity: 1; }
              70%, 100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bloomIn {
              0%, 62%   { transform: scale(0) rotate(-12deg); opacity: 0; }
              78%       { transform: scale(1.08) rotate(4deg); opacity: 1; }
              86%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
          `}</style>
        </svg>
      </div>

      <p
        className="script leading-none text-clay"
        style={{ fontSize: labelSize }}
      >
        {label}
      </p>
    </div>
  );
}
