import type { ReactNode } from "react";
import Image from "next/image";
import type { ComponentSymbol } from "@/lib/data/indices";
import s from "./GardenScreen.module.css";

/*
 * The BLOKC app's Index Garden screen, rebuilt in HTML for the home "The app"
 * section: the app shell (sidebar, top bar) and one Garden following BLOKC5,
 * on its Index tab (target vs actual weights, the drift table, the automatic
 * rebalance note). Laid out from the app's own components (interface repo:
 * components/gardens/GardenList.tsx detail view, gardens/index/IndexDrift.tsx,
 * components/shell/*) and styled with its tokens (GardenScreen.module.css).
 *
 * Every number is example data, and the page says so. They're consistent with
 * the method, though: the largest drift is 1.4 points, inside the 2% band, so
 * the rebalance note truthfully says there's nothing to do.
 *
 * A picture, not a UI: role="img" with a description, everything inside
 * aria-hidden, and no focusable elements.
 */

type Row = { sym: ComponentSymbol; color: string; target: number; actual: number };

// Token colours: the app's (components/gardens/index/IndexDrift.tsx); PENDLE takes its fallback grey.
const ROWS: Row[] = [
  { sym: "LINK", color: "#2A5ADA", target: 24, actual: 25.4 },
  { sym: "UNI", color: "#FF007A", target: 22, actual: 21.2 },
  { sym: "AAVE", color: "#2EBAC6", target: 20, actual: 19.6 },
  { sym: "ARB", color: "#28A0F0", target: 18, actual: 18.4 },
  { sym: "PENDLE", color: "#71717A", target: 16, actual: 15.4 },
];
/**
 * Label colour on a token's segment. The app writes white on every segment;
 * here light segments (UNI, AAVE, ARB) get the app's ink instead, so the
 * labels pass AA contrast (white on them is 2.3–3.8:1). A deliberate
 * difference from the app.
 */
const onColor = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return l > 0.2 ? { color: "#1F1A14", textShadow: "none" } : undefined;
};
const largest = Math.max(...ROWS.map((r) => Math.abs(r.actual - r.target)));
const pts = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)} pts`;

// A gently rising week, for the sparkline.
const SERIES = [40, 42, 41, 44, 43, 46, 45, 47, 49, 48, 50, 52, 51, 53, 55, 54, 56, 58];
const spark = (() => {
  const [w, h] = [140, 36];
  const [lo, hi] = [Math.min(...SERIES), Math.max(...SERIES)];
  const xy = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * w, h - 3 - ((v - lo) / (hi - lo)) * (h - 8)]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w} ${h} L0 ${h} Z` };
})();

/** Small line icons in the app's sidebar style (16px, 1.5 stroke). */
const I = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const NAV: { label: string; icon: ReactNode; on?: boolean; group?: string }[] = [
  { label: "Home", icon: <I d={<path d="M2.5 7.5 8 3l5.5 4.5V13H9.5V9.5h-3V13h-4z" />} /> },
  { label: "Portfolio", icon: <I d={<path d="M2.5 12.5 6 8.5l2.5 2.5 5-6" />} /> },
  { label: "Yield Gardens", icon: <I d={<path d="M3 3h4v4H3zM9 3h4v4H9zM6 9h4v4H6z" />} /> },
  { label: "Index Gardens", on: true, icon: <I d={<path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" />} /> },
  { label: "Indices", icon: <I d={<><circle cx="8" cy="8" r="5.5" /><path d="M8 2.5V8l4 3.5" /></>} /> },
  { label: "Dashboard", group: "Governance", icon: <I d={<path d="M2.5 2.5h11v11h-11zM2.5 6.5h11M6.5 6.5v7" />} /> },
  { label: "Proposals", icon: <I d={<path d="M4 2.5h6l2.5 2.5v8.5H4zM6 7h4.5M6 9.5h4.5" />} /> },
  { label: "Members", icon: <I d={<><circle cx="6" cy="6" r="2.2" /><path d="M2.5 13c.6-2.2 2-3.2 3.5-3.2s2.9 1 3.5 3.2M10.5 4.2a2 2 0 0 1 0 3.6M11.5 10c1 .4 1.7 1.3 2 3" /></>} /> },
  { label: "Gardeners", group: "Network", icon: <I d={<path d="M8 13.5V8M8 8c0-2.5-2-4-4.5-4C3.5 6.5 5.5 8 8 8zm0 0c0-2 1.6-3.5 4.5-3.5C12.5 6.5 10.5 8 8 8z" />} /> },
];

export function GardenScreen({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="The BLOKC app, Index Gardens: a Garden following the BLOKC5 index, with example data. It shows the Garden's net worth, its target and actual weight for each of LINK, UNI, AAVE, ARB and PENDLE, a largest drift of 1.4 points, and a note that BLOKC5 rebalances every connected Garden together once a day, so there is nothing to do."
      className={className}
    >
      <div aria-hidden className={`${s.frame} ${s.app}`}>
        <aside className={s.side}>
          <div className={s.brand}>
            {/* Always the dark wordmark: this sits in a dark band, but the app's sidebar is paper. */}
            <Image src="/brand/logo-wordmark-340.webp" alt="" width={340} height={67} unoptimized className="h-6 w-auto" />
          </div>
          <nav className={s.nav}>
            {NAV.map((n) => (
              <div key={n.label}>
                {n.group && <div className={s.group}>{n.group}</div>}
                <div className={`${s.item} ${n.on ? s.active : ""}`}>
                  {n.icon}
                  {n.label}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className={s.main}>
          <div className={s.top}>
            <div className={s.crumbs}>
              Index Gardens <span>›</span> <b>Garden 12</b>
            </div>
            <div className={s.tools}>
              <div className={s.search}>
                Search gardens, proposals, addresses… <span className={`${s.kbd} ${s.mono}`}>⌘K</span>
              </div>
              <div className={`${s.chip} ${s.mono}`}>EN</div>
              <div className={s.avatar} />
            </div>
          </div>

          <div className={s.content}>
            <div className={s.back}>← Index Gardens</div>

            {/* The Garden. */}
            <div className={`${s.card} ${s.hero}`}>
              <div>
                <div className={s.pills}>
                  <span className={s.pill}>Index Garden</span>
                  <span className={`${s.pill} ${s.accent}`}>Arbitrum</span>
                  <span className={`${s.pill} ${s.ok}`}>
                    <span className={s.dot} />
                    Funded
                  </span>
                </div>
                <div className={s.title}>Garden 12</div>
                <div className={s.meta}>
                  <span className={s.mono}>0x7a3c…f1c2</span>
                  <span>·</span>
                  <span>5 assets</span>
                  <span>·</span>
                  <span className={`${s.tag} ${s.tagOk}`}>✓ Verified</span>
                  <span className={`${s.tag} ${s.refresh}`}>⟳ Refresh</span>
                </div>
              </div>
              <div className={s.worth}>
                <div className={s.label}>Net worth</div>
                <div className={`${s.big} ${s.mono}`}>$12,480.32</div>
                <div className={s.up}>▲ +1.84%</div>
                <svg className={s.spark} viewBox="0 0 140 36" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gs-spark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F6F4F" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4F6F4F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={spark.area} fill="url(#gs-spark)" />
                  <path d={spark.line} fill="none" stroke="#4F6F4F" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Its tabs, on Index. */}
            <div className={s.card}>
              <div className={s.tabs}>
                {["Holdings", "Index", "P&L", "History"].map((t) => (
                  <div key={t} className={`${s.tab} ${t === "Index" ? s.tabOn : ""}`}>
                    {t}
                  </div>
                ))}
              </div>
              <div className={s.panel}>
                <div className={s.box}>
                  <div className={s.strip}>
                    <div>
                      <span className={s.connected}>⚡ Connected to index</span>
                      <div className={s.title} style={{ marginTop: 8 }}>
                        BLOKC5
                      </div>
                      <span className={`${s.addr} ${s.mono}`}>0x9e41…5a1b</span>
                    </div>
                    <span className={s.danger}>Disconnect</span>
                  </div>

                  <div className={s.body}>
                    <div className={`${s.caption} ${s.usdc}`}>
                      USDC available <b className={s.mono}>$0.00</b> · Created Oct 1, 2026
                    </div>

                    <div>
                      <div className={s.row}>
                        <span className={s.label}>Target vs actual</span>
                        <span className={s.caption}>
                          Largest drift <b className={s.mono}>{largest.toFixed(1)} pts</b>
                        </span>
                      </div>
                      <div className={s.bars}>
                        {(["target", "actual"] as const).map((k) => (
                          <div key={k} style={{ display: "contents" }}>
                            <span className={s.caption}>{k === "target" ? "Target" : "Actual"}</span>
                            <div className={s.bar}>
                              {ROWS.map((r) => (
                                <span
                                  key={r.sym}
                                  className={`${s.seg} ${s.mono} ${k === "target" ? s.target : ""}`}
                                  style={{ width: `${r[k]}%`, backgroundColor: r.color, ...onColor(r.color) }}
                                >
                                  {r.sym}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={s.box}>
                      <table className={s.table}>
                        <thead>
                          <tr>
                            <th>Token</th>
                            <th>Target</th>
                            <th>Actual</th>
                            <th>Drift</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ROWS.map((r) => (
                            <tr key={r.sym}>
                              <td className={s.mono} style={{ fontWeight: 500 }}>
                                <span className={s.swatch} style={{ backgroundColor: r.color }} />
                                {r.sym}
                              </td>
                              <td className={s.mono}>{r.target.toFixed(1)}%</td>
                              <td className={s.mono}>{r.actual.toFixed(1)}%</td>
                              <td className={s.mono}>{pts(r.actual - r.target)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <div className={s.label}>Rebalance</div>
                      <div className={s.caption} style={{ margin: "2px 0 8px" }}>
                        Handled automatically for this index
                      </div>
                      <div className={s.note}>
                        <span style={{ color: "#2F6B3B" }}>⟳</span>
                        <span>BLOKC5 rebalances every connected garden together, once a day. There is nothing to do here.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
