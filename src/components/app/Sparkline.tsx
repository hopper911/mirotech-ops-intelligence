import type { SeriesPoint } from "@/lib/ops";

export function Sparkline({
  series,
  className = "h-16 w-full",
  stroke = "#22D3EE",
  fill = false,
}: {
  series: SeriesPoint[];
  className?: string;
  stroke?: string;
  fill?: boolean;
}) {
  if (series.length === 0) return null;
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 120;
  const h = 40;
  const coords = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return { x, y };
  });
  const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      {fill ? <polygon points={area} fill={stroke} opacity="0.12" /> : null}
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

export function DualSeriesChart({
  current,
  optimized,
  className = "h-40 w-full",
}: {
  current: SeriesPoint[];
  optimized: SeriesPoint[];
  className?: string;
}) {
  const values = [...current, ...optimized].map((p) => p.value);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.02;
  const span = max - min || 1;
  const w = 240;
  const h = 80;

  const toPoints = (series: SeriesPoint[]) =>
    series
      .map((p, i) => {
        const x = (i / (series.length - 1 || 1)) * w;
        const y = h - ((p.value - min) / span) * (h - 8) - 4;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <polyline fill="none" stroke="#8fa0b8" strokeWidth="2" strokeDasharray="4 3" points={toPoints(current)} />
      <polyline fill="none" stroke="#7DDC65" strokeWidth="2.5" points={toPoints(optimized)} />
    </svg>
  );
}
