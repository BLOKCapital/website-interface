"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const VIDEO_ID = "O2xUopTuFWs";

/**
 * Privacy-enhanced embed (D-26, SEC-04): youtube-nocookie.com, captions on
 * in English by default (A11Y-09). Owner: upload reviewed English captions
 * and supply the transcript.
 */
const EMBED = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=en`;

/**
 * Click-to-play YouTube facade. Nothing loads from Google until Play: the
 * poster is self-hosted (public/brand/video-poster.webp, the video's own
 * thumbnail with the letterbox cropped), and a line under the frame says
 * where the video plays from before anyone presses it. Once it plays, focus
 * moves into the player so keyboard users can pause it or change captions
 * straight away (A11Y-23).
 */
export function ProductVideo() {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const noteId = useId();

  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line/[0.08] bg-card">
        {playing ? (
          // Standard YouTube embed sandbox: allow-same-origin scopes to youtube-nocookie.com.
          // react-doctor-disable-next-line react-doctor/iframe-missing-sandbox
          <iframe
            ref={frameRef}
            src={EMBED}
            title="BLOK Capital introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            // YouTube refuses embeds that arrive without a referrer.
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
              track("video_start", { video_provider: "youtube", video_title: "blok_capital_introduction" });
            }}
            aria-label="Play the BLOK Capital introduction video"
            aria-describedby={noteId}
            className="group absolute inset-0 block"
          >
            <Image
              src="/brand/video-poster.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover opacity-80 transition-opacity duration-fast can-hover:group-hover:opacity-95"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-canvas/10 to-transparent" />
            <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-leaf text-canvas shadow-[0_20px_50px_-15px_rgb(var(--shadow))] transition-transform duration-fast can-hover:group-hover:scale-105 sm:size-20">
              <svg width="24" height="24" viewBox="0 0 22 22" aria-hidden className="ml-1">
                <polygon points="6,3 19,11 6,19" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p id={noteId} className="mt-3 text-caption text-fg-muted">
        Plays from YouTube (Google), which may set its own cookies.{" "}
        <Link href="/legal/cookie-policy" className="whitespace-nowrap text-leaf underline underline-offset-2">
          Cookie Policy
        </Link>
      </p>
    </div>
  );
}
