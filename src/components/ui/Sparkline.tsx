import { cn } from "@/lib/utils";

type Props = {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  fillColor?: string;
  /** Renders a soft fill below the line. Default true. */
  fill?: boolean;
};

export function Sparkline({
  values,
  width = 120,
  height = 36,
  className,
  // Default uses Jungle Green (mid-tone) — Turf is too dark to read at 1.6px on dark surfaces.
  strokeColor = "rgb(var(--moss))",
  fillColor = "rgba(87,167,115,0.18)",
  fill = true,
}: Props) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const fillPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn(className)}
      aria-hidden
    >
      {fill && <path d={fillPath} fill={fillColor} />}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
