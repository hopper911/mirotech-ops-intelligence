"use client";

import type { SeriesPoint } from "@/lib/ops";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

function defaultFormat(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function mapCoords(
  values: number[],
  w: number,
  h: number,
  padY: number,
  min: number,
  span: number,
) {
  return values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w;
    const y = h - ((v - min) / span) * (h - padY * 2) - padY;
    return { x, y };
  });
}

function nearestIndex(clientX: number, rect: DOMRect, count: number) {
  if (count <= 1) return 0;
  const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return Math.round(t * (count - 1));
}

function ChartTooltip({
  children,
  xPct,
}: {
  children: ReactNode;
  xPct: number;
}) {
  const clamped = Math.min(88, Math.max(12, xPct));
  return (
    <div
      className="pointer-events-none absolute bottom-[calc(100%-0.25rem)] z-10 -translate-x-1/2 rounded-lg border border-white/15 bg-navy/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm"
      style={{ left: `${clamped}%` }}
      role="status"
    >
      {children}
    </div>
  );
}

export function Sparkline({
  series,
  className = "h-16 w-full",
  stroke = "var(--cyan)",
  fill = false,
  interactive = true,
  compact = false,
  valueFormat = defaultFormat,
  seriesLabel = "Value",
  unitSuffix = "",
  activeIndex: controlledIndex,
  onActiveChange,
  onPointClick,
  ariaLabel,
}: {
  series: SeriesPoint[];
  className?: string;
  stroke?: string;
  fill?: boolean;
  interactive?: boolean;
  /** Denser hit targets / smaller markers for table cells */
  compact?: boolean;
  valueFormat?: (n: number) => string;
  seriesLabel?: string;
  unitSuffix?: string;
  activeIndex?: number | null;
  onActiveChange?: (index: number | null) => void;
  onPointClick?: (point: SeriesPoint, index: number) => void;
  ariaLabel?: string;
}) {
  const gradId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState<number | null>(null);
  const active = controlledIndex !== undefined ? controlledIndex : internal;

  const setActive = useCallback(
    (i: number | null) => {
      if (controlledIndex === undefined) setInternal(i);
      onActiveChange?.(i);
    },
    [controlledIndex, onActiveChange],
  );

  const geometry = useMemo(() => {
    if (series.length === 0) return null;
    const values = series.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const w = 240;
    const h = 80;
    const padY = compact ? 6 : 10;
    const coords = mapCoords(values, w, h, padY, min, span);
    const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const area = `0,${h} ${points} ${w},${h}`;
    const gridYs = [0.25, 0.5, 0.75].map((t) => padY + t * (h - padY * 2));
    return { values, min, max, span, w, h, padY, coords, points, area, gridYs };
  }, [series, compact]);

  if (!geometry) return null;

  const { w, h, coords, points, area, gridYs } = geometry;
  const activePt = active != null ? series[active] : null;
  const activeCoord = active != null ? coords[active] : null;
  const prev = active != null && active > 0 ? series[active - 1] : null;
  const delta =
    activePt && prev ? activePt.value - prev.value : null;

  function onMove(clientX: number) {
    if (!interactive || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setActive(nearestIndex(clientX, rect, series.length));
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!interactive) return;
    const cur = active ?? series.length - 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(Math.max(0, cur - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(Math.min(series.length - 1, cur + 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const i = active ?? series.length - 1;
      onPointClick?.(series[i], i);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  }

  const label =
    ariaLabel ??
    `${seriesLabel} trend, ${series.length} points from ${series[0]?.label} to ${series[series.length - 1]?.label}`;

  return (
    <div
      ref={wrapRef}
      className={`relative ${interactive ? "cursor-crosshair" : ""} ${className}`}
      onPointerMove={(e) => onMove(e.clientX)}
      onPointerLeave={() => {
        if (controlledIndex === undefined) setActive(null);
      }}
      onClick={() => {
        if (!interactive || active == null) return;
        onPointClick?.(series[active], active);
      }}
      onKeyDown={onKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "img" : undefined}
      aria-label={interactive ? label : undefined}
      aria-hidden={interactive ? undefined : true}
    >
      {interactive && activePt && activeCoord ? (
        <ChartTooltip xPct={(activeCoord.x / w) * 100}>
          <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
            {activePt.label}
          </div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-white">
            {valueFormat(activePt.value)}
            {unitSuffix}
          </div>
          {delta != null ? (
            <div className={`text-[10px] tabular-nums ${delta >= 0 ? "text-cyan" : "text-green"}`}>
              {delta >= 0 ? "+" : ""}
              {valueFormat(delta)}
              {unitSuffix} vs prior
            </div>
          ) : null}
        </ChartTooltip>
      ) : null}

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridYs.map((y) => (
          <line
            key={y}
            x1={0}
            y1={y}
            x2={w}
            y2={y}
            stroke="var(--border)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            opacity={0.7}
          />
        ))}

        {fill ? <polygon points={area} fill={`url(#${gradId})`} /> : null}

        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth={compact ? 1.75 : 2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          vectorEffect="non-scaling-stroke"
        />

        {activeCoord ? (
          <>
            <line
              x1={activeCoord.x}
              y1={0}
              x2={activeCoord.x}
              y2={h}
              stroke="var(--cyan)"
              strokeWidth={1}
              strokeOpacity={0.45}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r={compact ? 3.5 : 5}
              fill="var(--navy)"
              stroke={stroke}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r={compact ? 1.5 : 2}
              fill={stroke}
            />
          </>
        ) : null}

        {/* Larger hit affordance markers (subtle idle dots on non-compact) */}
        {!compact
          ? coords.map((c, i) => (
              <circle
                key={series[i].label}
                cx={c.x}
                cy={c.y}
                r={active === i ? 0 : 1.75}
                fill={stroke}
                opacity={0.35}
              />
            ))
          : null}
      </svg>
    </div>
  );
}

export function DualSeriesChart({
  current,
  optimized,
  className = "h-40 w-full",
  currentLabel = "Current",
  optimizedLabel = "Optimized",
  valueFormat = defaultFormat,
  unitSuffix = "",
  interactive = true,
  onPointClick,
  ariaLabel,
}: {
  current: SeriesPoint[];
  optimized: SeriesPoint[];
  className?: string;
  currentLabel?: string;
  optimizedLabel?: string;
  valueFormat?: (n: number) => string;
  unitSuffix?: string;
  interactive?: boolean;
  onPointClick?: (index: number, point: { label: string; current: number; optimized: number }) => void;
  ariaLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [emphasis, setEmphasis] = useState<"current" | "optimized" | null>(null);

  const n = Math.max(current.length, optimized.length);
  const labels = current.map((p) => p.label);

  const geometry = useMemo(() => {
    const values = [...current, ...optimized].map((p) => p.value);
    if (values.length === 0) return null;
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.02;
    const span = max - min || 1;
    const w = 240;
    const h = 80;
    const padY = 10;
    const toCoords = (series: SeriesPoint[]) =>
      mapCoords(
        series.map((p) => p.value),
        w,
        h,
        padY,
        min,
        span,
      );
    const curCoords = toCoords(current);
    const optCoords = toCoords(optimized);
    const gridYs = [0.25, 0.5, 0.75].map((t) => padY + t * (h - padY * 2));
    return {
      w,
      h,
      curCoords,
      optCoords,
      curPoints: curCoords.map((c) => `${c.x},${c.y}`).join(" "),
      optPoints: optCoords.map((c) => `${c.x},${c.y}`).join(" "),
      gridYs,
    };
  }, [current, optimized]);

  if (!geometry || n === 0) return null;

  const { w, h, curCoords, optCoords, curPoints, optPoints, gridYs } = geometry;
  const i = active ?? null;
  const curVal = i != null ? current[i]?.value : null;
  const optVal = i != null ? optimized[i]?.value : null;
  const gap = curVal != null && optVal != null ? curVal - optVal : null;
  const xGuide = i != null ? curCoords[i]?.x ?? optCoords[i]?.x : null;

  function onMove(clientX: number) {
    if (!interactive || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setActive(nearestIndex(clientX, rect, n));
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!interactive) return;
    const cur = active ?? n - 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(Math.max(0, cur - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(Math.min(n - 1, cur + 1));
    } else if ((e.key === "Enter" || e.key === " ") && active != null) {
      e.preventDefault();
      const label = labels[active] ?? String(active);
      onPointClick?.(active, {
        label,
        current: current[active]?.value ?? 0,
        optimized: optimized[active]?.value ?? 0,
      });
    } else if (e.key === "Escape") {
      setActive(null);
    }
  }

  const label =
    ariaLabel ??
    `${currentLabel} vs ${optimizedLabel} chart, ${n} points`;

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <button
          type="button"
          className={`inline-flex items-center gap-2 transition-opacity ${
            emphasis === "optimized" ? "opacity-40" : "opacity-100"
          }`}
          onMouseEnter={() => setEmphasis("current")}
          onMouseLeave={() => setEmphasis(null)}
          onFocus={() => setEmphasis("current")}
          onBlur={() => setEmphasis(null)}
        >
          <span className="h-0.5 w-6 border-t-2 border-dashed border-muted" />
          {currentLabel}
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-2 transition-opacity ${
            emphasis === "current" ? "opacity-40" : "opacity-100"
          }`}
          onMouseEnter={() => setEmphasis("optimized")}
          onMouseLeave={() => setEmphasis(null)}
          onFocus={() => setEmphasis("optimized")}
          onBlur={() => setEmphasis(null)}
        >
          <span className="h-0.5 w-6 bg-green" />
          {optimizedLabel}
        </button>
      </div>

      <div
        ref={wrapRef}
        className={`relative ${interactive ? "cursor-crosshair" : ""} ${className}`}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerLeave={() => setActive(null)}
        onClick={() => {
          if (!interactive || active == null) return;
          onPointClick?.(active, {
            label: labels[active] ?? String(active),
            current: current[active]?.value ?? 0,
            optimized: optimized[active]?.value ?? 0,
          });
        }}
        onKeyDown={onKeyDown}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "img" : undefined}
        aria-label={interactive ? label : undefined}
      >
        {i != null && curVal != null && optVal != null && xGuide != null ? (
          <ChartTooltip xPct={(xGuide / w) * 100}>
            <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
              {labels[i]}
            </div>
            <div className="mt-1 space-y-0.5 text-xs tabular-nums">
              <div className="flex justify-between gap-4 text-muted">
                <span>{currentLabel}</span>
                <span className="text-white">
                  {valueFormat(curVal)}
                  {unitSuffix}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-muted">
                <span>{optimizedLabel}</span>
                <span className="text-green">
                  {valueFormat(optVal)}
                  {unitSuffix}
                </span>
              </div>
              {gap != null ? (
                <div className="flex justify-between gap-4 border-t border-white/10 pt-0.5 text-cyan">
                  <span>Gap</span>
                  <span>
                    {gap >= 0 ? "+" : ""}
                    {valueFormat(gap)}
                    {unitSuffix}
                  </span>
                </div>
              ) : null}
            </div>
          </ChartTooltip>
        ) : null}

        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {gridYs.map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={w}
              y2={y}
              stroke="var(--border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              opacity={0.7}
            />
          ))}

          <polyline
            fill="none"
            stroke="var(--muted)"
            strokeWidth={2}
            strokeDasharray="4 3"
            points={curPoints}
            opacity={emphasis === "optimized" ? 0.25 : 1}
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            fill="none"
            stroke="var(--green)"
            strokeWidth={2.5}
            points={optPoints}
            opacity={emphasis === "current" ? 0.25 : 1}
            vectorEffect="non-scaling-stroke"
          />

          {xGuide != null && i != null ? (
            <>
              <line
                x1={xGuide}
                y1={0}
                x2={xGuide}
                y2={h}
                stroke="var(--cyan)"
                strokeWidth={1}
                strokeOpacity={0.45}
                vectorEffect="non-scaling-stroke"
              />
              {curCoords[i] ? (
                <circle
                  cx={curCoords[i].x}
                  cy={curCoords[i].y}
                  r={4}
                  fill="var(--navy)"
                  stroke="var(--muted)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {optCoords[i] ? (
                <circle
                  cx={optCoords[i].x}
                  cy={optCoords[i].y}
                  r={4.5}
                  fill="var(--navy)"
                  stroke="var(--green)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
            </>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
