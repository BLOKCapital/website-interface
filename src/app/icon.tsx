import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Generated 512×512 PWA / maskable icon. Android's install prompt and the web
// app manifest expect a large square icon; this gives the manifest a real one
// (the bare favicon.ico isn't enough) from the same brand mark as apple-icon.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const mark = readFileSync(join(process.cwd(), "public/brand/mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Generous padding keeps the mark inside the maskable safe zone so
          // launchers that crop to a circle don't clip it.
          background: "#FAF7F0",
        }}
      >
        <img src={markSrc} alt="" width={320} height={318} />
      </div>
    ),
    { ...size },
  );
}
