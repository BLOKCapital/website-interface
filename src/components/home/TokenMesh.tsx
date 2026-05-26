import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * BLOKC token visual — a static front render of the coin.
 *
 * Not animated: shows only the front face (no rotating GIF) so it stays calm
 * and doesn't crowd the surrounding card copy.
 */
export function TokenMesh({ className }: { className?: string }) {
  return (
    <div className={cn("relative size-[180px]", className)}>
      {/* Warm halo behind the coin — clay glow on cream paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgb(var(--clay) / 0.30), transparent 70%), radial-gradient(55% 55% at 50% 55%, rgb(var(--moss) / 0.16), transparent 70%)",
        }}
      />

      <Image
        src="/brand/token-front.png"
        alt="BLOKC token"
        fill
        sizes="180px"
        className="pointer-events-none select-none object-contain"
        draggable={false}
      />
    </div>
  );
}
