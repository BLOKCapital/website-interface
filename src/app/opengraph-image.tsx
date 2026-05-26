import { ImageResponse } from "next/og";

// Site-wide social card. App Router auto-wires this into OpenGraph + Twitter
// metadata for every route that doesn't define its own. Runs on the default
// (Node) runtime so the PNG is prerendered at build time rather than on demand.
// Next.js metadata-route convention requires these named exports alongside the
// default component, so the "only export components" fast-refresh rule doesn't apply here.
export const alt = "BLOK Capital, decentralized wealth management on Arbitrum";
// react-doctor-disable-next-line react-doctor/only-export-components
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      // Satori (ImageResponse) only supports inline styles — Tailwind/CSS classes
      // don't apply during OG image generation, so inline styles are required here.
      // react-doctor-disable-next-line react-doctor/no-inline-exhaustive-style
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 90% at 80% 85%, #E3EAD9, #FAF7F0 55%)",
          color: "#1F1A14",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "#4F6F4F",
            }}
          />
          <span
            style={{
              fontSize: 30,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#473C30",
            }}
          >
            BLOK Capital
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 34, color: "#C67B5C" }}>
            It&apos;s crypto, but different.
          </span>
          <span
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              marginTop: 18,
              maxWidth: 920,
            }}
          >
            Grow your crypto. Never hand over the keys.
          </span>
        </div>

        <span style={{ fontSize: 26, color: "#7A6C5A" }}>
          Non-custodial · On-chain · Arbitrum
        </span>
      </div>
    ),
    { ...size },
  );
}
