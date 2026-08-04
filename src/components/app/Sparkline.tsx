import type { OpsSeriesPoint } from "@/lib/ops";

export function Sparkline({
  series,
  className = "h-16 w-full",
  stroke = "#22D3EE",
}: {
  series: OpsSeriesPoint[];
  className?: string;
  stroke?: string;
}) {
  if (series.length === 0) return null;
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 120;
  const h = 40;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * w;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
