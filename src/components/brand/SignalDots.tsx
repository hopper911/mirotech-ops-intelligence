"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

const COLORS = ["#2563EB", "#22D3EE", "#7DDC65"] as const;

type Variant = "field" | "spine" | "orbit" | "trail" | "corner";

/**
 * Pulsing signal-node motifs — same design language as the homepage network,
 * different compositions so pages don't share one layout.
 */
export function SignalDots({
  variant = "field",
  className = "",
  interactive = true,
}: {
  variant?: Variant;
  className?: string;
  interactive?: boolean;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);

  const nodes = nodesFor(variant);

  return (
    <div
      className={`relative ${interactive ? "" : "pointer-events-none"} ${className}`}
      aria-hidden={!interactive}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {variant === "spine" || variant === "trail"
          ? nodes.slice(0, -1).map((n, i) => {
              const next = nodes[i + 1];
              return (
                <motion.line
                  key={`l-${i}`}
                  x1={n.x}
                  y1={n.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth="1.25"
                  strokeOpacity="0.45"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                />
              );
            })
          : null}

        {variant === "orbit"
          ? (
              <motion.circle
                cx="100"
                cy="100"
                r="62"
                fill="none"
                stroke="#22D3EE"
                strokeOpacity="0.25"
                strokeWidth="1"
                strokeDasharray="4 6"
                animate={reduce ? undefined : { rotate: 360 }}
                style={{ transformOrigin: "100px 100px" }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
            )
          : null}

        {nodes.map((n, i) => {
          const color = COLORS[i % COLORS.length];
          const isHot = active === i;
          return (
            <g key={`${n.x}-${n.y}-${i}`}>
              {!reduce ? (
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.45 }}
                  animate={{
                    scale: isHot ? [1, 3.2, 1] : [1, 2.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: isHot ? 1.1 : 2.6 + (i % 3) * 0.35,
                    repeat: Infinity,
                    delay: n.delay,
                    ease: "easeOut",
                  }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              ) : null}
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={color}
                filter={`url(#glow-${uid})`}
                className={interactive ? "cursor-pointer" : undefined}
                whileHover={interactive && !reduce ? { scale: 1.45 } : undefined}
                whileTap={interactive && !reduce ? { scale: 0.9 } : undefined}
                onClick={
                  interactive
                    ? () => setActive((cur) => (cur === i ? null : i))
                    : undefined
                }
                onMouseEnter={interactive ? () => setActive(i) : undefined}
                onMouseLeave={interactive ? () => setActive(null) : undefined}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function nodesFor(variant: Variant): { x: number; y: number; r: number; delay: number }[] {
  switch (variant) {
    case "spine":
      return [
        { x: 100, y: 18, r: 4, delay: 0 },
        { x: 100, y: 52, r: 5, delay: 0.15 },
        { x: 100, y: 92, r: 6, delay: 0.3 },
        { x: 100, y: 132, r: 5, delay: 0.45 },
        { x: 100, y: 172, r: 4, delay: 0.6 },
      ];
    case "orbit":
      return Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return {
          x: 100 + Math.cos(a) * 62,
          y: 100 + Math.sin(a) * 62,
          r: i % 3 === 0 ? 5.5 : 4,
          delay: i * 0.12,
        };
      });
    case "trail":
      return [
        { x: 24, y: 160, r: 4, delay: 0 },
        { x: 52, y: 128, r: 5, delay: 0.1 },
        { x: 88, y: 108, r: 6, delay: 0.2 },
        { x: 124, y: 78, r: 5, delay: 0.3 },
        { x: 158, y: 52, r: 5, delay: 0.4 },
        { x: 180, y: 28, r: 4, delay: 0.5 },
      ];
    case "corner":
      return [
        { x: 28, y: 28, r: 5, delay: 0 },
        { x: 58, y: 28, r: 4, delay: 0.1 },
        { x: 28, y: 58, r: 4, delay: 0.15 },
        { x: 88, y: 40, r: 5, delay: 0.25 },
        { x: 40, y: 88, r: 5, delay: 0.3 },
        { x: 70, y: 70, r: 6, delay: 0.4 },
      ];
    case "field":
    default:
      return [
        { x: 30, y: 40, r: 4, delay: 0 },
        { x: 70, y: 28, r: 5, delay: 0.2 },
        { x: 120, y: 48, r: 4, delay: 0.35 },
        { x: 160, y: 32, r: 5, delay: 0.1 },
        { x: 45, y: 95, r: 5, delay: 0.45 },
        { x: 95, y: 110, r: 6, delay: 0.25 },
        { x: 145, y: 90, r: 4, delay: 0.55 },
        { x: 175, y: 130, r: 5, delay: 0.4 },
        { x: 60, y: 160, r: 4, delay: 0.6 },
        { x: 110, y: 155, r: 5, delay: 0.5 },
        { x: 155, y: 170, r: 4, delay: 0.7 },
      ];
  }
}
