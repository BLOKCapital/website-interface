import { cn } from "@/lib/utils";

type Props = {
  initials: string;
  size?: number;
  ringColor?: string;
  className?: string;
};

// Earth-toned gradients — moss, clay, sage, ochre. Tuned with enough depth
// that white initials read against the avatar on cream paper.
const palette = [
  "linear-gradient(135deg, #5C7E5C, #2A4030)", // moss → deep moss
  "linear-gradient(135deg, #B47453, #8A4A2E)", // clay → deep clay
  "linear-gradient(135deg, #8FA088, #4F5E4F)", // sage → deep sage
  "linear-gradient(135deg, #C49A47, #7A5C26)", // ochre → deep ochre
];

function pickGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function Avatar({ initials, size = 44, ringColor, className }: Props) {
  return (
    <span
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      {ringColor && (
        <span
          aria-hidden
          className="absolute inset-[-3px] rounded-full"
          style={{ boxShadow: `0 0 0 1.5px ${ringColor}` }}
        />
      )}
      <span
        className="flex size-full select-none items-center justify-center rounded-full text-[12px] font-semibold text-paper"
        style={{ background: pickGradient(initials) }}
      >
        {initials}
      </span>
    </span>
  );
}
