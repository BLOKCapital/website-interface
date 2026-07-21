import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOKC token visual — the front render of the coin, gently alive.
 *
 * Still no rotating GIF (that read as noisy next to card copy); instead the
 * coin drifts on a slow 12s float and its halo breathes, so the centerpiece
 * feels present without crowding the surrounding text. Both loops are CSS
 * keyframes, frozen by the global reduced-motion rules.
 */
export function TokenMesh({ className }: { className?: string }) {
  return (
    <div className={cn("relative size-[180px]", className)}>
      {/* Warm halo behind the coin — clay glow on cream paper, breathing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] -z-10 animate-breathe blur-2xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.30), transparent 70%), radial-gradient(55% 55% at 50% 55%, rgb(var(--moss) / 0.16), transparent 70%)",
        }}
      />

      <div className="absolute inset-0 animate-drift">
        <Image
          src="/brand/token-front.png"
          alt="BLOKC token"
          fill
          sizes="180px"
          className="pointer-events-none select-none object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
