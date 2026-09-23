"use client";

import Image from "next/image";
import { useState } from "react";

const VIDEO_ID = "O2xUopTuFWs";

/**
 * Click-to-play YouTube facade: a poster first, the iframe only after a click,
 * so the page doesn't load YouTube's player up front.
 */
export function ProductVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line/[0.08] bg-card">
      {playing ? (
        // Standard YouTube embed sandbox: allow-same-origin scopes to youtube.com.
        // react-doctor-disable-next-line react-doctor/iframe-missing-sandbox
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
          title="BLOK Capital introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Play the BLOK Capital introduction video"
          className="group absolute inset-0 block"
        >
          <Image
            src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            unoptimized
            className="object-cover opacity-80 transition-opacity group-hover:opacity-95"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-canvas/10 to-transparent" />
          <span className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-leaf text-canvas shadow-[0_20px_50px_-15px_rgb(0_0_0/0.7)] transition-transform group-hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 22 22" aria-hidden className="ml-1">
              <polygon points="6,3 19,11 6,19" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
