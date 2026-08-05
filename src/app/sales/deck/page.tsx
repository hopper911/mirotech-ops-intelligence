"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useSalesMedia } from "@/hooks/useSalesMedia";
import { useState } from "react";

export default function DeckPage() {
  const { media, hydrated } = useSalesMedia();
  const [i, setI] = useState(0);
  const slides = media.slides;
  const slide = slides[i] ?? slides[0];

  return (
    <MarketingShell>
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="brand-sub text-[11px] text-cyan">Sales deck</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">10-slide presentation</h1>
          </div>
          <p className="text-sm text-muted">
            {i + 1} / {slides.length}
          </p>
        </div>

        {!hydrated ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <div className="glass-strong grid min-h-[22rem] overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <h2 className="text-3xl font-semibold text-white">{slide.title}</h2>
              <p className="mt-4 max-w-xl text-lg text-muted">{slide.body}</p>
            </div>
            <div className="relative min-h-[14rem] border-t border-white/10 bg-navy/40 lg:border-l lg:border-t-0">
              {slide.imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.imageDataUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[14rem] items-center justify-center p-6 text-center text-xs text-muted">
                  Slide visual
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setI((x) => Math.max(0, x - 1))}
            className="btn-ghost-glass rounded-full px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={i === slides.length - 1}
            onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
            className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </MarketingShell>
  );
}
