import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { components, type ComponentSymbol } from "@/lib/data/indices";
import { siteConfig } from "./site";

/**
 * The shared social card (SEO-02, MISS-04), in the site's paper-and-ink
 * kit, so a shared link looks like the page it opens: ruled notebook paper,
 * a heavy Inter headline with its payoff handwritten in ink blue over a
 * green underline, ink-blue mono labels, the status as a stamp, the
 * domain on a lime tag, and an index's tokens as typed strips with their
 * logos. Every `opengraph-image.tsx` renders through `ogCard()`, at build
 * time (the export is static).
 *
 * Satori (behind ImageResponse) takes inline styles only and needs
 * TTF/OTF/WOFF fonts (not WOFF2), hence the files in src/app/fonts (SIL
 * OFL, see OFL.txt there), and PNG rather than WebP images: token logos are
 * converted with sharp (Next's own image dependency) when it's installed,
 * and the strips go without logos when it isn't.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Day garden tokens (globals.css primitives), as hex for Satori. */
const C = {
  canvas: "#F7F8F4",
  card: "#FFFFFF",
  ink: "#111A15",
  inkMuted: "#435049",
  inkSubtle: "#5C6962",
  cobalt: "#2563C4",
  bloom: "#A3325A",
  lime: "#9BE05A",
  limeLine: "#84C341",
  rule: "rgba(37, 99, 196, 0.08)",
  line: "rgba(17, 26, 21, 0.14)",
};

const root = process.cwd();
const asset = (...p: string[]) => readFile(path.join(root, ...p));

async function assets() {
  const [heavy, regular, script, mono, mark] = await Promise.all([
    asset("src/app/fonts/Inter-ExtraBold.woff"),
    asset("src/app/fonts/Inter-Regular.woff"),
    asset("src/app/fonts/DancingScript-SemiBold.woff"),
    asset("src/app/fonts/JetBrainsMono-Regular.woff"),
    // The raster mark (222×220), embedded so the card needs no network.
    asset("public/brand/mark.png"),
  ]);
  return { heavy, regular, script, mono, mark: `data:image/png;base64,${mark.toString("base64")}` };
}

/** Each token's logo as a PNG data URI, or nothing if sharp isn't there to convert the WebP. */
async function tokenLogos(symbols: ComponentSymbol[]): Promise<Partial<Record<ComponentSymbol, string>>> {
  try {
    const sharp = (await import("sharp")).default;
    const pairs = await Promise.all(
      symbols.map(async (s) => {
        const png = await sharp(await asset("public", components[s].logo.replace(/\.webp$/, "-64.webp")))
          .png()
          .toBuffer();
        return [s, `data:image/png;base64,${png.toString("base64")}`] as const;
      }),
    );
    return Object.fromEntries(pairs);
  } catch {
    return {};
  }
}

export type OgCardProps = {
  /** Mono caps line above the title, e.g. "Security". */
  eyebrow: string;
  /** The headline; `italic` is its payoff, handwritten after it, as the site's headings do. */
  title: string;
  italic?: string;
  /** An index's components, typed on strips with their logos. */
  chips?: ComponentSymbol[];
  /** A status, stamped top right (e.g. "Planned · 2027"). */
  badge?: string;
  /** Mono line at the bottom left. */
  footer: string;
  /** Title size; long lines step down. */
  titleSize?: number;
};

export async function ogCard({ eyebrow, title, italic, chips, badge, footer, titleSize = 88 }: OgCardProps) {
  const [{ heavy, regular, script, mono, mark }, logos] = await Promise.all([assets(), tokenLogos(chips ?? [])]);
  const monoText = { fontFamily: "JetBrains Mono", letterSpacing: "0.12em", textTransform: "uppercase" as const };

  /** A typed strip of paper, a little off true. */
  const strip = (children: ReactNode, turn: number) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        background: C.card,
        boxShadow: "0 0 0 1px rgba(17, 26, 21, 0.08), 0 10px 18px -12px rgba(17, 26, 21, 0.35)",
        transform: `rotate(${turn}deg)`,
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: C.ink,
      }}
    >
      {children}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 76px 56px",
          background: C.canvas,
          // A soft leaf glow, the garden's light, low and to the right.
          backgroundImage:
            "radial-gradient(circle at 92% 108%, rgba(120, 200, 150, 0.26) 0%, rgba(120, 200, 150, 0.08) 32%, rgba(247, 248, 244, 0) 58%)",
          color: C.ink,
          fontFamily: "Inter",
        }}
      >
        {/* Notebook paper: a faint ink-blue rule every 42px. */}
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 30 + i * 42, height: 1.5, background: C.rule }} />
        ))}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Satori renders plain <img> only; next/image doesn't apply here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={56} height={55} alt="" />
            <div style={{ display: "flex", fontSize: 38, letterSpacing: "-0.02em", color: C.ink }}>
              <span style={{ fontWeight: 800 }}>BLOK</span>
              <span style={{ fontWeight: 400, marginLeft: 10 }}>Capital</span>
            </div>
          </div>
          {badge ? (
            // A rubber stamp: two rings, turned.
            <div style={{ display: "flex", padding: 4, border: `2.5px solid ${C.bloom}`, borderRadius: 6, transform: "rotate(-4deg)" }}>
              <div style={{ display: "flex", padding: "8px 16px", border: `1.5px solid ${C.bloom}`, borderRadius: 3, ...monoText, fontSize: 22, color: C.bloom }}>
                {badge}
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ ...monoText, fontSize: 24, letterSpacing: "0.14em", color: C.cobalt }}>{eyebrow}</span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              // A gap, not a margin, so a wrapped payoff starts flush left.
              columnGap: titleSize * 0.24,
              marginTop: 16,
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            <span style={{ color: C.ink }}>{title}</span>
            {italic ? (
              // The payoff, by hand, over a hand-drawn green underline.
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: "Dancing Script", fontWeight: 600, fontSize: titleSize * 1.06, letterSpacing: 0, color: C.cobalt, lineHeight: 1.1 }}>
                  {italic}
                </span>
                <div style={{ height: 7, marginTop: 2, borderRadius: 4, background: C.limeLine, transform: "rotate(-0.6deg)" }} />
              </div>
            ) : null}
          </div>
          {chips?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
              {chips.map((c, i) => (
                <div key={c} style={{ display: "flex" }}>
                  {strip(
                    <>
                      {logos[c] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logos[c]} width={30} height={30} alt="" style={{ borderRadius: 999, background: C.card }} />
                      ) : null}
                      <span>{c}</span>
                    </>,
                    i % 2 ? 1 : -1,
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            borderTop: `1.5px dashed ${C.line}`,
            paddingTop: 24,
          }}
        >
          <span style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: C.inkSubtle }}>{footer}</span>
          {/* The address, on the posts' lime tag. */}
          <div
            style={{
              display: "flex",
              padding: "6px 14px",
              background: C.lime,
              border: "1.5px dashed rgba(16, 24, 15, 0.55)",
              transform: "rotate(-2deg)",
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              color: "#10180F",
            }}
          >
            {siteConfig.url.replace(/^https:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Inter", data: regular, style: "normal", weight: 400 },
        { name: "Inter", data: heavy, style: "normal", weight: 800 },
        { name: "Dancing Script", data: script, style: "normal", weight: 600 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
