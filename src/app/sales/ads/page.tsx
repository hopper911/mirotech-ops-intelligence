"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { InteractiveCarousel } from "@/components/sales/InteractiveCarousel";
import { CroppedMediaImage } from "@/components/sales/ImageCropControls";
import { SignalDots } from "@/components/brand/SignalDots";
import { useSalesMedia } from "@/hooks/useSalesMedia";
import { isDisplayableMediaUrl } from "@/lib/sales/media";

export default function AdsPage() {
  const { media, hydrated } = useSalesMedia();

  return (
    <MarketingShell>
      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <SignalDots
          variant="trail"
          className="pointer-events-none absolute -right-4 top-8 h-44 w-44 opacity-70 md:pointer-events-auto"
        />

        <p className="brand-sub text-[11px] text-cyan">LinkedIn ads</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Ad mocks</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Three LinkedIn ads + a looping four-frame carousel. Portfolio frames only.
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
                        {isDisplayableMediaUrl(ad.imageDataUrl) ? (
                          <CroppedMediaImage src={ad.imageDataUrl!} crop={ad.imageCrop} />
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
              <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
                Four-side carousel
              </h2>
              <p className="mt-1 text-xs text-muted">
                Auto-loops · pause on hover · swipe or arrow keys · click dots or cards
              </p>
              <div className="mt-4">
                <InteractiveCarousel frames={media.carousel} />
              </div>
            </section>
          </>
        )}
      </main>
    </MarketingShell>
  );
}
