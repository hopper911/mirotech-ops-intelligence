"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

/** Animated logo-inspired node network for hero depth. */
export function NetworkHero({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  const lines = [
    { d: "M40 220 L40 70", color: "#2563EB", delay: 0 },
    { d: "M40 70 L120 180", color: "#22D3EE", delay: 0.15 },
    { d: "M120 180 L190 95", color: "#22D3EE", delay: 0.28 },
    { d: "M190 95 L260 40", color: "#7DDC65", delay: 0.4 },
    { d: "M120 180 L200 220", color: "#2563EB", delay: 0.35 },
    { d: "M190 95 L280 140", color: "#22D3EE", delay: 0.48 },
    { d: "M280 140 L320 90", color: "#7DDC65", delay: 0.58 },
  ];

  const nodes = [
    { cx: 40, cy: 70, r: 7, fill: "#2563EB", delay: 0.2 },
    { cx: 40, cy: 220, r: 5, fill: "#2563EB", delay: 0.1 },
    { cx: 120, cy: 180, r: 7, fill: "#22D3EE", delay: 0.35 },
    { cx: 190, cy: 95, r: 7, fill: "#22D3EE", delay: 0.48 },
    { cx: 260, cy: 40, r: 8, fill: "#7DDC65", delay: 0.55 },
    { cx: 200, cy: 220, r: 5, fill: "#2563EB", delay: 0.5 },
    { cx: 280, cy: 140, r: 6, fill: "#22D3EE", delay: 0.62 },
    { cx: 320, cy: 90, r: 5, fill: "#7DDC65", delay: 0.7 },
  ];

  return (
    <div className={`pointer-events-none relative ${className}`} aria-hidden>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_65%)]" />
      <svg viewBox="0 0 360 260" className="h-full w-full">
        <defs>
          <filter id={`nodeGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`beam-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7DDC65" stopOpacity="0" />
          </linearGradient>
        </defs>

        {lines.map((line) => (
          <motion.path
            key={line.d}
            d={line.d}
            fill="none"
            stroke={line.color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{
              duration: reduce ? 0 : 1.1,
              delay: reduce ? 0 : line.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {/* traveling beam */}
        {!reduce ? (
          <motion.path
            d="M40 70 L120 180 L190 95 L260 40"
            fill="none"
            stroke={`url(#beam-${uid})`}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 0.35, 0],
              pathOffset: [0, 0.65, 1],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
        ) : null}

        {nodes.map((n) => (
          <motion.circle
            key={`${n.cx}-${n.cy}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill={n.fill}
            filter={`url(#nodeGlow-${uid})`}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: reduce ? 0 : n.delay,
            }}
          />
        ))}

        {!reduce
          ? nodes
              .filter((_, i) => i % 2 === 0)
              .map((n) => (
                <motion.circle
                  key={`pulse-${n.cx}-${n.cy}`}
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r}
                  fill="none"
                  stroke={n.fill}
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: n.delay + 0.8,
                    ease: "easeOut",
                  }}
                />
              ))
          : null}
      </svg>
    </div>
  );
}

/** Horizontal connector that draws between sections. */
export function SignalDivider({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  return (
    <div className={`relative my-10 flex items-center justify-center ${className}`} aria-hidden>
      <svg viewBox="0 0 400 24" className="h-6 w-full max-w-md">
        <defs>
          <linearGradient id={`divGrad-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#7DDC65" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M8 12 H392"
          fill="none"
          stroke={`url(#divGrad-${uid})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        {[40, 200, 360].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={12}
            r={3.5}
            fill={i === 2 ? "#7DDC65" : i === 1 ? "#22D3EE" : "#2563EB"}
            initial={reduce ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 + i * 0.12, type: "spring", stiffness: 300 }}
          />
        ))}
      </svg>
    </div>
  );
}
