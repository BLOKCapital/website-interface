import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { ComponentSymbol } from "@/lib/data/indices";
import s from "./GardenScreen.module.css";

/*
 * The BLOKC app's Index Garden screen, rebuilt in HTML for the home "The app"
 * section: the app shell (sidebar with the account at its foot, top bar) and
 * one Garden following BLOKC5, on its Index tab, in the app's current design.
 * Laid out from the app's own components (interface repo: the garden detail
 * in components/gardens/GardenList.tsx, the shared balance card
 * components/ui/BalanceHero.tsx, gardens/index/IndexDrift.tsx,
 * components/shell/*) and styled with its tokens (GardenScreen.module.css).
 *
 * Every number is example data, and the page says so. They're consistent with
 * the method, though: the largest drift is 1.4 points, inside the 2% band, so
 * the rebalance note truthfully says there's nothing to do.
 *
 * A picture, not a UI: role="img" with a description, everything inside
 * aria-hidden, and no focusable elements.
 *
 * The home tour (AppTour) can point at one part of it: `focus` rings that
 * part and softens the rest of the page with a light veil, and `run` (a new value per step) replays its motion:
 * the sparkline drawing in, the actual weights drifting off their targets,
 * the rebalance mark turning. With `height` the screen is a fixed window
 * that tall, like the real app: the sidebar and top bar stay put and only
 * the page under them scrolls, by `scroll`. The layout never changes; only
 * opacity, a ring and those small moves do (GardenScreen.module.css, "Tour").
 */

export type ScreenFocus = "garden" | "drift" | "rebalance";

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
  return l > 0.2 ? { color: "#111A15", textShadow: "none" } : undefined;
};
const largest = Math.max(...ROWS.map((r) => Math.abs(r.actual - r.target)));
const pts = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)} pts`;

// A gently rising month, for the sparkline under the net worth.
const SERIES = [40, 42, 41, 44, 43, 46, 45, 47, 49, 48, 50, 52, 51, 53, 55, 54, 56, 58];
const spark = (() => {
  const [w, h] = [180, 36];
  const [lo, hi] = [Math.min(...SERIES), Math.max(...SERIES)];
  const xy = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * w, h - 3 - ((v - lo) / (hi - lo)) * (h - 8)]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { line, area: `${line} L${w} ${h} L0 ${h} Z` };
})();

/** Line icons in the app's style (lucide-like, 1.75 stroke). */
const I = ({ d, size = 18 }: { d: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const icons = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  boxes: <path d="M12 3 7 5.5v5L12 13l5-2.5v-5zM7 13l-5 2.5v5L7 23l5-2.5v-5zM17 13l-5 2.5v5l5 2.5 5-2.5v-5z" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  pie: <path d="M21 12A9 9 0 1 1 12 3v9zM15 3.5A9 9 0 0 1 20.5 9H15z" />,
  sprout: <path d="M12 21v-9M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6zm0 0c0-3 2.2-5.5 6.5-5.5 0 3-2.2 5.5-6.5 5.5z" />,
  landmark: <path d="M3 21h18M5 21v-9M9.5 21v-9M14.5 21v-9M19 21v-9M2 10l10-6 10 6z" />,
  clipboard: <path d="M8 3h8v3H8zM6 5h12v16H6zM9 11h6M9 15h6" />,
  users: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.8-3 3.3-4.5 6.5-4.5s5.7 1.5 6.5 4.5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 15c1.8.6 3 2 3.5 4.5" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2.2.2-1.4-1.4L16.6 4.5l-3-1-1 2h-1.2l-1-2-3 1 .2 2.3-1.4 1.4L4 8l-1 3 2 1v1.2l-2 1 1 3 2.2-.2 1.4 1.4-.2 2.3 3 1 1-2h1.2l1 2 3-1-.2-2.3 1.4-1.4 2.2.2 1-3-2-1z" />,
  panel: <path d="M4 4h16v16H4zM9 4v16" />,
  updown: <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5" />,
  sun: <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />,
  copy: <path d="M9 9h12v12H9zM5 15V5a2 2 0 0 1 2-2h10" />,
  ext: <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
  refresh: <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12A9 9 0 0 1 18.5 5.8L21 8M21 3v5h-5M3 21v-5h5" />,
  arrowIn: <path d="M17 7 7 17M17 17H7V7" />,
  arrowOut: <path d="M7 17 17 7M7 7h10v10" />,
  swap: <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />,
  lock: <path d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" />,
  info: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16v-4M12 8h.01" />,
  plug: <path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5" />,
};

const NAV: { label: string; icon: ReactNode; on?: boolean; group?: string }[] = [
  { label: "Home", icon: <I d={icons.home} /> },
  { label: "Portfolio", icon: <I d={icons.chart} /> },
  { label: "Yield Gardens", icon: <I d={icons.boxes} /> },
  { label: "Index Gardens", on: true, icon: <I d={icons.grid} /> },
  { label: "Indices", icon: <I d={icons.pie} /> },
  { label: "Gardeners", icon: <I d={icons.sprout} /> },
  { label: "Dashboard", group: "Governance", icon: <I d={icons.landmark} /> },
  { label: "Proposals", icon: <I d={icons.clipboard} /> },
  { label: "Members", icon: <I d={icons.users} /> },
];

/** The app's action pill: a round icon and its label (components/ui/WalletAction.tsx). */
const Pill = ({ icon, label, primary, off }: { icon: ReactNode; label: string; primary?: boolean; off?: boolean }) => (
  // A paused action is a disabled control, faded as the app fades it (WCAG
  // exempts disabled controls from the contrast minimum; aria-disabled says so).
  <span aria-disabled={off || undefined} className={`${s.action} ${primary ? s.actionPrimary : ""} ${off ? s.actionOff : ""}`}>
    <span className={s.actionDisc}>{icon}</span>
    {label}
  </span>
);

const STATS = [
  { label: "In tokens", value: "$12,480.32", hint: "ready to swap or send" },
  { label: "Index", value: "Connected", hint: "rebalances to its index" },
  { label: "Assets", value: "5", hint: "tokens held" },
];

export function GardenScreen({
  className,
  focus,
  run,
  height,
  scroll = 0,
}: {
  className?: string;
  focus?: ScreenFocus | null;
  run?: string;
  /** The window's height, in the screen's own units: fixes the sidebar and top bar. */
  height?: number;
  /** How far the page under the top bar is scrolled, in the same units. */
  scroll?: number;
}) {
  /** A part the tour can point at. `ring` rings it (and veils the rest) when it's the focus. */
  const zone = (z: ScreenFocus, ring = false) =>
    `${s.zone} ${focus === z ? `${s.zoneOn} ${ring ? s.zoneRing : ""}` : ""}`;
  return (
    <div
      role="img"
      aria-label="The BLOKC app, Index Gardens: a Garden following the BLOKC5 index, with example data. It shows the Garden's net worth of $12,480.32, its target and actual weight for each of LINK, UNI, AAVE, ARB and PENDLE, a largest drift of 1.4 points, and a note that BLOKC5 rebalances every connected Garden together once a day, so there is nothing to do."
      className={className}
    >
      <div
        aria-hidden
        data-app=""
        className={`${s.frame} ${s.app} ${height ? s.window : ""}`}
        style={height ? { height } : undefined}
      >
        <aside className={s.side}>
          <div className={s.brand}>
            {/* Always the dark wordmark: the app's sidebar is paper in light mode. */}
            <Image src="/brand/logo-wordmark-340.webp" alt="" width={340} height={67} unoptimized className="h-7 w-auto" />
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
          {/* Settings and collapse, then the account at the foot. */}
          <div className={s.utility}>
            <div className={s.item} style={{ flex: 1 }}>
              <I d={icons.settings} />
              Settings
            </div>
            <span className={s.collapse}>
              <I d={icons.panel} size={16} />
            </span>
          </div>
          <div className={s.sideFoot}>
            <div className={s.accountRow}>
              <span className={s.accountAvatar}>AL</span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span className={s.accountName}>Alex</span>
                <span className={`${s.accountAddr} ${s.mono}`}>0x5b12…c9e0</span>
              </span>
              <span className={s.subtle}>
                <I d={icons.updown} size={14} />
              </span>
            </div>
          </div>
        </aside>

        <div className={s.main}>
          <div className={s.top}>
            <div className={s.crumbs}>
              Index Gardens <span>/</span> <b>Balanced Five</b>
            </div>
            <div className={s.tools}>
              <div className={s.search}>
                <span className={s.searchLeft}>
                  <I d={icons.search} size={13} />
                  Search gardens, proposals, addresses…
                </span>
                <span className={`${s.kbd} ${s.mono}`}>⌘K</span>
              </div>
              {/* Theme and language in one button, as in the app. */}
              <div className={s.chip}>
                <I d={icons.sun} size={14} />
                <span className={s.mono}>EN</span>
              </div>
            </div>
          </div>

          {/* The page under the top bar: clipped to the window, scrolled by the tour. */}
          <div className={s.viewport}>
          <div data-app-scroll="" className={`${s.content} ${s.scroller}`} style={scroll ? { transform: `translateY(${-scroll}px)` } : undefined}>
            <div className={s.back}>← Index Gardens</div>

            {/* The page header: name and live status left, the facts right. */}
            <div className={`${s.head} ${zone("garden")}`}>
              <div className={s.identity}>
                <span className={s.thumb} />
                <div className={s.title}>Balanced Five</div>
                <span className={`${s.pill} ${s.ok}`}>
                  <span className={`${s.dot} ${s.live}`} />
                  Funded
                </span>
              </div>
              <div className={s.meta}>
                <span>Index Garden</span>
                <span className={s.sep}>·</span>
                <span className={`${s.addrChip} ${s.mono}`}>
                  0x7a3c…f1c2 <I d={icons.copy} size={12} />
                </span>
                <I d={icons.ext} size={12} />
                <span className={s.sep}>·</span>
                <span className={s.verified}>✓ Verified</span>
                <I d={icons.refresh} size={12} />
              </div>
            </div>

            {/* The balance card, the same component as Home's. */}
            <div data-zone="garden" className={`${s.card} ${zone("garden", true)}`}>
              <div className={s.hero}>
                <div>
                  <div className={s.label}>
                    Net worth <I d={icons.info} size={13} />
                  </div>
                  <div className={`${s.big} ${s.num}`}>
                    $12,480.32<span key={`up-${run}`} className={`${s.up} ${focus === "garden" ? s.popIn : ""}`}>
                      ▲ +1.84%
                    </span>
                  </div>
                  <div className={s.caption} style={{ marginTop: 6 }}>
                    <b className={s.num} style={{ color: "#217046" }}>+$225.41</b> in the last 24 hours
                  </div>
                </div>
                <div className={s.actionsCol}>
                  <svg key={`spark-${run}`} className={`${s.spark} ${focus === "garden" ? s.sparkDraw : ""}`} viewBox="0 0 180 36" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gs-spark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#217046" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#217046" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path className={s.sparkArea} d={spark.area} fill="url(#gs-spark)" />
                    <path className={s.sparkLine} d={spark.line} pathLength={1} fill="none" stroke="#217046" strokeWidth="2" />
                  </svg>
                  <div className={s.actionRow}>
                    <Pill primary icon={<I d={icons.arrowIn} size={16} />} label="Add USDC" />
                    <Pill off icon={<I d={icons.swap} size={16} />} label="Swap" />
                  </div>
                  <div className={s.lockNote}>
                    <I d={icons.lock} size={12} />
                    Swap, transfer &amp; lend are paused · <b>Manage index →</b>
                  </div>
                </div>
              </div>
              <div className={s.stats}>
                {STATS.map((st) => (
                  <div key={st.label} className={s.stat}>
                    <div className={s.statLabel}>
                      {st.label} <I d={icons.info} size={12} />
                    </div>
                    <div className={`${s.statValue} ${s.num}`}>{st.value}</div>
                    <div className={s.caption}>{st.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Its tabs, on Index. */}
            <div className={s.card}>
              <div className={`${s.tabs} ${zone("drift")}`}>
                {["Holdings", "Index", "P&L", "History"].map((t) => (
                  <div key={t} className={`${s.tab} ${t === "Index" ? s.tabOn : ""}`}>
                    {t}
                  </div>
                ))}
              </div>
              <div className={s.panel}>
                <div className={`${s.strip} ${zone("drift")}`}>
                  <div>
                    <span className={`${s.pill} ${s.ok}`}>
                      <I d={icons.plug} size={11} />
                      Connected
                    </span>
                    <div className={s.indexName}>BLOKC5</div>
                    <span className={`${s.addr} ${s.mono}`}>0x9e41…5a1b</span>
                  </div>
                  <span className={s.danger}>Disconnect</span>
                </div>

                <div className={`${s.caption} ${s.usdc} ${zone("drift")}`}>
                  USDC available <b className={s.num}>0.00 USDC</b> · Created Oct 1, 2026
                </div>

                <div data-zone="drift" className={zone("drift", true)}>
                  <div className={s.row}>
                    <span className={s.h}>Target vs actual</span>
                    <span className={s.caption}>
                      Largest drift <b className={s.num}>{largest.toFixed(1)} pts</b>
                    </span>
                  </div>
                  <div className={s.bars}>
                    {(["target", "actual"] as const).map((k) => (
                      <div key={k} style={{ display: "contents" }}>
                        <span className={s.caption}>{k === "target" ? "Target" : "Actual"}</span>
                        {/* On the drift step the actual weights slide off their targets to where they are. */}
                        <div key={`${k}-${run}`} className={`${s.bar} ${k === "actual" && focus === "drift" ? s.drifting : ""}`}>
                          {ROWS.map((r, i) => (
                            <span
                              key={r.sym}
                              className={`${s.seg} ${k === "target" ? s.target : ""}`}
                              style={
                                {
                                  width: `${r[k]}%`,
                                  backgroundColor: r.color,
                                  ...onColor(r.color),
                                  "--from": `${r.target}%`,
                                  "--i": i,
                                } as CSSProperties
                              }
                            >
                              {r.sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={s.tableWrap}>
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
                            <td style={{ fontWeight: 500 }}>
                              {/* The token's mark in a ring of its allocation colour, as in the app. */}
                              <span className={s.ring} style={{ backgroundColor: r.color }}>
                                <span className={s.mark} style={{ backgroundColor: r.color }}>
                                  {r.sym[0]}
                                </span>
                              </span>
                              {r.sym}
                            </td>
                            <td className={s.num}>{r.target.toFixed(1)}%</td>
                            <td className={s.num}>{r.actual.toFixed(1)}%</td>
                            <td key={`d-${run}`} className={`${s.num} ${focus === "drift" ? s.flash : ""}`}>
                              {pts(r.actual - r.target)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div data-zone="rebalance" className={zone("rebalance", true)}>
                  <div className={s.h}>Rebalance</div>
                  <div className={s.caption} style={{ marginTop: 2 }}>
                    Handled automatically for this index
                  </div>
                  <div className={s.note}>
                    <span key={`r-${run}`} className={focus === "rebalance" ? s.turn : undefined} style={{ color: "#5C6962", display: "inline-block" }}>
                      ⟳
                    </span>
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
  );
}
