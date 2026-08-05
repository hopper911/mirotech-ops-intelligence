"use client";

import { isDisplayableMediaUrl, type CarouselFrame } from "@/lib/sales/media";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const INTERVAL_MS = 4500;

export function InteractiveCarousel({ frames }: { frames: CarouselFrame[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = frames.length;
  const frame = frames[index] ?? frames[0];

  const go = useCallback(
    (next: number) => {
      if (!count) return;
      setIndex(((next % count) + count) % count);
      setProgress(0);
    },
    [count],
  );

  useEffect(() => {
    if (reduce || paused || count < 2) return;
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const pct = Math.min(1, elapsed / INTERVAL_MS);
      setProgress(pct);
      if (pct >= 1) {
        setIndex((i) => (i + 1) % count);
        setProgress(0);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, reduce, count]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (!frame) return null;

  return (
    <div
      className="glass-strong overflow-hidden rounded-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        setPaused(false);
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 40) return;
        go(delta < 0 ? index + 1 : index - 1);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="LinkedIn carousel mock"
    >
      <div className="relative aspect-[4/5] max-h-[28rem] w-full bg-navy sm:aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={frame.id}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {isDisplayableMediaUrl(frame.imageDataUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={frame.imageDataUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue/25 via-navy to-navy" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-cyan">
              Carousel · Side {index + 1} / {count}
              {paused ? " · paused" : " · looping"}
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted hover:text-white"
            >
              {paused || reduce ? "Play" : "Pause"}
            </button>
          </div>
          <p className="mt-2 max-w-lg text-xl font-semibold text-white sm:text-2xl">{frame.line}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="btn-ghost-glass rounded-full px-3 py-1.5 text-xs"
          aria-label="Previous frame"
        >
          Prev
        </button>
        <div className="flex flex-1 items-center justify-center gap-2">
          {frames.map((c, idx) => {
            const selected = idx === index;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => go(idx)}
                className="relative flex h-8 w-8 items-center justify-center"
                aria-label={`Go to frame ${idx + 1}`}
                aria-current={selected ? "true" : undefined}
              >
                {selected && !reduce ? (
                  <svg className="absolute inset-0 h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="#7DDC65"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 12}`}
                      strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}
                <span
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    selected ? "bg-green shadow-[0_0_10px_rgba(125,220,101,0.7)]" : "bg-white/25 hover:bg-white/50"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="btn-specular rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-navy"
          aria-label="Next frame"
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3 sm:grid-cols-4">
        {frames.map((c, idx) => (
          <button
            key={c.id}
            type="button"
            onClick={() => go(idx)}
            className={`rounded-xl border p-3 text-left transition ${
              idx === index
                ? "border-cyan/50 bg-cyan/10"
                : "border-border bg-navy/40 hover:border-white/20"
            }`}
          >
            <div className="text-[10px] uppercase tracking-[0.12em] text-cyan">Side {idx + 1}</div>
            <p className="mt-1 line-clamp-2 text-xs text-white">{c.line}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
