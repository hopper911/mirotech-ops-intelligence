"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  /** Futuristic: blur + slight scale from a “signal lock” feel */
  variant?: "fade" | "signal";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
  variant = "signal",
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    variant === "signal"
      ? { opacity: 0, y: y + 8, filter: "blur(10px)", scale: 0.97 }
      : { opacity: 0, y };

  const animate =
    variant === "signal"
      ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
      : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount: 0.18 }}
      transition={{
        duration: variant === "signal" ? 0.7 : 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
          filter: "blur(8px)",
          scale: 0.96,
        },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
