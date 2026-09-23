import { ImageResponse } from "next/og";

// Site-wide social card. App Router auto-wires this into OpenGraph + Twitter
// metadata for every route that doesn't define its own. Runs on the default
// (Node) runtime so the PNG is prerendered at build time rather than on demand.
// Next.js metadata-route convention requires these named exports alongside the
// default component, so the "only export components" fast-refresh rule doesn't apply here.
// Required by `output: "export"` — metadata routes must opt in to being
// rendered once at build time rather than per request.
export const dynamic = "force-static";
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
            "radial-gradient(90% 90% at 85% 90%, #1E3A2A, #090D0B 60%)",
          color: "#ECF1ED",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "#8FD6A8",
            }}
          />
          <span
            style={{
              fontSize: 30,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#AAB6AF",
            }}
          >
            BLOK Capital
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 30, color: "#8FD6A8" }}>
            Non-custodial wealth management
          </span>
          <span
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              marginTop: 18,
              maxWidth: 920,
            }}
          >
            Grow your crypto. Keep the keys.
          </span>
        </div>

        <span style={{ fontSize: 26, color: "#8A988F" }}>
          Non-custodial · On-chain · Arbitrum
        </span>
      </div>
    ),
    { ...size },
  );
}
