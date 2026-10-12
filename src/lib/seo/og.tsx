import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import { siteConfig } from "./site";

/**
 * The shared social card (SEO-02, MISS-04): the Day garden palette, the real
 * BLOK mark and Newsreader, so a shared link looks like the light site it
 * opens. Every `opengraph-image.tsx` renders through `ogCard()`, at build
 * time (the export is static).
 *
 * Satori (behind ImageResponse) takes inline styles only and needs TTF/OTF
 * fonts, hence the files in src/app/fonts (SIL OFL, see OFL.txt there).
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
  leaf: "#217046",
  sand: "#836122",
  bloom: "#A3325A",
  line: "rgba(17, 26, 21, 0.12)",
};

const root = process.cwd();
const asset = (...p: string[]) => readFile(path.join(root, ...p));

async function assets() {
  const [regular, italic, mark] = await Promise.all([
    asset("src/app/fonts/Newsreader-Regular.ttf"),
    asset("src/app/fonts/Newsreader-Italic.ttf"),
    // The raster mark (222×220), embedded so the card needs no network.
    asset("public/brand/mark.png"),
  ]);
  return { regular, italic, mark: `data:image/png;base64,${mark.toString("base64")}` };
}

export type OgCardProps = {
  /** Small caps line above the title, e.g. "Security". */
  eyebrow: string;
  /** The display line; `italic` is appended in bronze, as the site's headings do. */
  title: string;
  italic?: string;
  /** Pills under the title (index components). */
  chips?: string[];
  /** Status pill, top right (e.g. "In private testing"). */
  badge?: string;
  /** Muted line at the bottom left. */
  footer: string;
  /** Title size; long lines step down. */
  titleSize?: number;
};

export async function ogCard({ eyebrow, title, italic, chips, badge, footer, titleSize = 84 }: OgCardProps) {
  const { regular, italic: italicFont, mark } = await assets();

  const pill = (children: ReactNode, color: string, border: string, background: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 22px",
        borderRadius: 999,
        border: `1.5px solid ${border}`,
        background,
        color,
        fontSize: 26,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 76px 60px",
          background: C.canvas,
          // A soft leaf glow, the garden's light, low and to the right.
          backgroundImage:
            "radial-gradient(circle at 92% 108%, rgba(120, 200, 150, 0.30) 0%, rgba(120, 200, 150, 0.10) 32%, rgba(247, 248, 244, 0) 58%)",
          color: C.ink,
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Satori renders plain <img> only; next/image doesn't apply here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={56} height={55} alt="" />
            <span style={{ fontSize: 38, letterSpacing: "-0.01em", color: C.ink }}>{siteConfig.name}</span>
          </div>
          {badge ? pill(badge, C.bloom, "rgba(178, 58, 98, 0.35)", "rgba(178, 58, 98, 0.08)") : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 26,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.leaf,
            }}
          >
            {eyebrow}
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              // A gap, not a margin, so a wrapped italic line starts flush left.
              columnGap: titleSize * 0.26,
              marginTop: 18,
              fontSize: titleSize,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: C.ink }}>{title}</span>
            {italic ? <span style={{ color: C.sand, fontStyle: "italic" }}>{italic}</span> : null}
          </div>
          {chips?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
              {chips.map((c) => (
                <div key={c} style={{ display: "flex" }}>
                  {pill(c, C.ink, C.line, C.card)}
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
            borderTop: `1.5px solid ${C.line}`,
            paddingTop: 26,
            fontSize: 26,
            color: C.inkSubtle,
          }}
        >
          <span>{footer}</span>
          <span style={{ color: C.inkMuted }}>{siteConfig.url.replace(/^https:\/\//, "")}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: regular, style: "normal", weight: 400 },
        { name: "Newsreader", data: italicFont, style: "italic", weight: 400 },
      ],
    },
  );
}
