"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useSalesMedia } from "@/hooks/useSalesMedia";
import { useState } from "react";

export default function AdsPage() {
  const { media, hydrated } = useSalesMedia();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const frame = media.carousel[carouselIndex] ?? media.carousel[0];

  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">LinkedIn ads</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Ad mocks</h1>
        <p className="mt-2 text-sm text-muted">
          Three LinkedIn ads + a four-frame carousel. Portfolio frames only.
        </p>

        {!hydrated ? (
          <p className="mt-10 text-sm text-muted">Loading…</p>
        ) : (
          <>
            <section className="mt-10">
              <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
                Three LinkedIn ads
              </h2>
              <div className="mt-4 grid gap-6 lg:grid-cols-3">
                {media.linkedInAds.map((ad, idx) => (
                  <article key={ad.id} className="glass glass-lift rounded-2xl p-4">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                      Ad {idx + 1}
                    </div>
                    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-navy">
                      <div className="relative aspect-[1.91/1] bg-navy/80">
                        {ad.imageDataUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ad.imageDataUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-muted">
                            Image · 1.91:1
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="brand-display text-sm text-white">Mirotech</div>
                        <p className="mt-2 text-sm font-semibold text-white">{ad.headline}</p>
                        <p className="mt-2 text-xs text-muted">{ad.body}</p>
                        <div className="mt-4 inline-flex rounded-full bg-green px-3 py-1 text-xs font-semibold text-navy">
                          {ad.cta}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
                    Four-side carousel
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Frame {carouselIndex + 1} of {media.carousel.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={carouselIndex === 0}
                    onClick={() => setCarouselIndex((x) => Math.max(0, x - 1))}
                    className="btn-ghost-glass rounded-full px-3 py-1.5 text-xs disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={carouselIndex === media.carousel.length - 1}
                    onClick={() =>
                      setCarouselIndex((x) => Math.min(media.carousel.length - 1, x + 1))
                    }
                    className="btn-specular rounded-full bg-green px-3 py-1.5 text-xs font-semibold text-navy disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="glass-strong mt-4 overflow-hidden rounded-3xl">
                <div className="relative aspect-[4/5] max-h-[28rem] w-full bg-navy sm:aspect-[16/9]">
                  {frame.imageDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={frame.imageDataUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-navy to-navy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-cyan">
                      Carousel · Side {carouselIndex + 1}
                    </div>
                    <p className="mt-2 max-w-lg text-xl font-semibold text-white sm:text-2xl">
                      {frame.line}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-white/10 p-3">
                  {media.carousel.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 flex-1 rounded-full transition ${
                        idx === carouselIndex ? "bg-green" : "bg-white/15 hover:bg-white/30"
                      }`}
                      aria-label={`Go to frame ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {media.carousel.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    className={`rounded-xl border p-3 text-left transition ${
                      idx === carouselIndex
                        ? "border-cyan/50 bg-cyan/10"
                        : "border-border bg-navy/40 hover:border-white/20"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-[0.12em] text-cyan">
                      Side {idx + 1}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-white">{c.line}</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </MarketingShell>
  );
}
