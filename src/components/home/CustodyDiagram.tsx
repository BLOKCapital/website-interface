import { cn } from "@/lib/utils";

/**
 * How a Garden works, drawn: you sign in to a smart wallet at your own
 * address; a strategy attaches to steer it; every move lands on-chain; funds
 * only leave with your signature. The diagram is a picture of the steps
 * listed beside it, so it's aria-hidden with a text caption.
 *
 * Motion (D-33, MOT-02, MOT-03): the live connectors are drawn dashed in
 * the SVG, and a solid copy of them sits in an HTML layer on top. That layer
 * pulses (opacity only, so the compositor runs it) five times, 4.5 s in all,
 * once the figure's Reveal has fired, then rests lit: active links solid, the
 * 2027 Gardener link still dashed. Hovering the figure replays it while the
 * pointer stays. `data-loop` pauses it off-screen; reduced motion and Pause
 * motion show the lit frame straight away. Outside a Reveal it simply shows
 * the lit frame. (Drawing the links in claim order is X-11, deferred.)
 */

const VIEW = "0 0 560 400";

/** The three live connectors: you → Garden, Garden → index, Garden → receipts. */
const live = [
  { d: "M150 200 H210", color: "--leaf" },
  { d: "M350 170 C 390 150, 400 110, 430 104", color: "--leaf" },
  { d: "M280 262 V318", color: "--cobalt" },
];

export function CustodyDiagram({ className }: { className?: string }) {
  const node = "fill-[rgb(var(--card))] stroke-[rgb(var(--line)/0.16)]";
  return (
    <figure data-loop className={cn("group/custody", className)}>
      <div className="relative">
        <svg viewBox={VIEW} className="h-auto w-full" aria-hidden>
          <defs>
            <radialGradient id="gardenGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.22" />
              <stop offset="100%" stopColor="rgb(var(--glow))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* connectors: dashed underneath the lit layer */}
          <g fill="none" strokeWidth="1.5" strokeLinecap="round">
            {live.map((c) => (
              <path key={c.d} d={c.d} stroke={`rgb(var(${c.color}) / 0.55)`} strokeDasharray="4 6" />
            ))}
            {/* Gardener, from 2027: not live, so never lit. */}
            <path d="M350 230 C 390 250, 400 290, 430 296" stroke="rgb(var(--line) / 0.3)" strokeDasharray="3 6" />
          </g>

          {/* you */}
          <g>
            <rect x="20" y="160" width="130" height="80" rx="16" className={node} />
            <text x="85" y="194" textAnchor="middle" className="fill-[rgb(var(--fg))] text-[15px] font-medium">You</text>
            <text x="85" y="216" textAnchor="middle" className="fill-[rgb(var(--fg-subtle))] text-[12px]">Google or wallet</text>
          </g>

          {/* garden */}
          <g>
            <circle cx="280" cy="200" r="120" fill="url(#gardenGlow)" />
            <rect x="210" y="138" width="140" height="124" rx="22" fill="rgb(var(--raised))" stroke="rgb(var(--leaf) / 0.55)" strokeWidth="1.5" />
            <text x="280" y="180" textAnchor="middle" className="fill-[rgb(var(--leaf))] text-[11px] font-semibold uppercase tracking-[0.14em]">Your Garden</text>
            <text x="280" y="204" textAnchor="middle" className="fill-[rgb(var(--fg))] text-[14px]">Smart wallet</text>
            <text x="280" y="224" textAnchor="middle" className="fill-[rgb(var(--fg-subtle))] text-[12px]">at your address</text>
            <g transform="translate(252 236)">
              {["--leaf", "--sand", "--cobalt", "--bloom"].map((c, i) => (
                <circle key={c} cx={i * 18 + 1} cy="4" r="4" fill={`rgb(var(${c}))`} />
              ))}
            </g>
          </g>

          {/* strategy */}
          <g>
            <rect x="430" y="70" width="120" height="68" rx="16" className={node} />
            <text x="490" y="98" textAnchor="middle" className="fill-[rgb(var(--fg))] text-[14px] font-medium">Index</text>
            <text x="490" y="118" textAnchor="middle" className="fill-[rgb(var(--fg-subtle))] text-[12px]">rebalances only</text>
          </g>
          <g>
            <rect x="430" y="262" width="120" height="68" rx="16" fill="none" stroke="rgb(var(--line) / 0.22)" strokeDasharray="4 4" />
            <text x="490" y="290" textAnchor="middle" className="fill-[rgb(var(--fg-muted))] text-[14px]">Gardener</text>
            <text x="490" y="310" textAnchor="middle" className="fill-[rgb(var(--fg-subtle))] text-[12px]">from 2027</text>
          </g>

          {/* receipts */}
          <g>
            <rect x="200" y="318" width="160" height="56" rx="14" className={node} />
            <text x="280" y="343" textAnchor="middle" className="fill-[rgb(var(--cobalt))] text-[12px] font-medium">On-chain receipts</text>
            <text x="280" y="361" textAnchor="middle" className="fill-[rgb(var(--fg-subtle))] font-mono text-[11px]">Arbiscan</text>
          </g>
        </svg>

        {/* The lit connectors: an HTML layer, so the pulse is opacity on a
            composited box rather than a repaint of the SVG. It starts when
            the enclosing Reveal fires; alternate × 5 ends on opacity 1. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [[data-revealed]_&]:[animation:fadeIn_900ms_var(--ease-inout)_5_alternate_both] can-hover:group-hover/custody:[animation-iteration-count:infinite]"
        >
          <svg viewBox={VIEW} className="h-auto w-full">
            <g fill="none" strokeWidth="1.5" strokeLinecap="round">
              {live.map((c) => (
                <path key={c.d} d={c.d} stroke={`rgb(var(${c.color}))`} />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-small text-fg-muted">
        Strategies can steer your Garden. <span className="text-fg">Only your signature moves funds out.</span>
      </figcaption>
    </figure>
  );
}
