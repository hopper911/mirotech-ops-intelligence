"use client";

import { ImageUploadButton, VideoUploadControls } from "@/components/sales/MediaUpload";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { useSalesMedia } from "@/hooks/useSalesMedia";
import { isDisplayableMediaUrl } from "@/lib/sales/media";
import Link from "next/link";
import { useState } from "react";

type Tab = "video" | "deck" | "ads" | "carousel";

export function MediaStudioClient() {
  const { media, hydrated, update, reset, error, clearError } = useSalesMedia({
    allowEdit: true,
  });
  const [tab, setTab] = useState<Tab>("video");
  const [slideIndex, setSlideIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  function flash(msg: string) {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 2500);
  }

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading media…</p>;
  }

  const slide = media.slides[slideIndex];
  const frame = media.carousel[carouselIndex];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Media Studio</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Sales & site media</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Admin only. Upload hero video, deck images, LinkedIn ads, and carousel frames. Public
            pages show the media — never these controls.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      {error ? (
        <div className="rounded-2xl border border-cyan/40 bg-cyan/10 px-4 py-3 text-sm text-cyan">
          {error}{" "}
          <button type="button" className="underline" onClick={clearError}>
            Dismiss
          </button>
        </div>
      ) : null}

      {message ? <p className="text-sm text-green">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["video", "Hero video"],
            ["deck", "Deck slides"],
            ["ads", "LinkedIn ads"],
            ["carousel", "Carousel"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              tab === id ? "bg-blue/30 text-white" : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "video" ? (
        <section className="glass-app rounded-2xl p-5">
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Homepage hero video</h2>
          <p className="mt-2 text-sm text-muted">
            Plays behind the public homepage hero. Prefer a hosted URL for larger files.
          </p>
          <div className="mt-4">
            <VideoUploadControls
              value={media.backgroundVideoUrl}
              onChange={async (url) => {
                try {
                  const nextUrl = url.trim();
                  if (nextUrl && !isDisplayableMediaUrl(nextUrl)) {
                    throw new Error("Use an https://, /path, or uploaded video URL.");
                  }
                  await update((prev) => ({ ...prev, backgroundVideoUrl: nextUrl }));
                  flash("Hero video updated.");
                } catch (err) {
                  flash(err instanceof Error ? err.message : "Video update failed.");
                }
              }}
            />
          </div>
          {media.backgroundVideoUrl && isDisplayableMediaUrl(media.backgroundVideoUrl) ? (
            <video
              key={media.backgroundVideoUrl.slice(0, 64)}
              className="mt-4 max-h-48 w-full rounded-xl object-cover"
              src={media.backgroundVideoUrl}
              muted
              controls
              playsInline
            />
          ) : null}
          <Link href="/" className="mt-4 inline-block text-sm text-cyan hover:underline">
            Preview homepage →
          </Link>
        </section>
      ) : null}

      {tab === "deck" ? (
        <section className="glass-app rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
              Deck slide {slideIndex + 1} / {media.slides.length}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={slideIndex === 0}
                onClick={() => setSlideIndex((x) => Math.max(0, x - 1))}
                className="btn-ghost-glass rounded-full px-3 py-1 text-xs disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={slideIndex === media.slides.length - 1}
                onClick={() => setSlideIndex((x) => Math.min(media.slides.length - 1, x + 1))}
                className="btn-ghost-glass rounded-full px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
          <p className="mt-3 font-semibold text-white">{slide.title}</p>
          <p className="mt-1 text-sm text-muted">{slide.body}</p>
          <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-border bg-navy/50">
            {isDisplayableMediaUrl(slide.imageDataUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.imageDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No image
              </div>
            )}
          </div>
          <div className="mt-3">
            <ImageUploadButton
              label="Upload slide image"
              hasImage={isDisplayableMediaUrl(slide.imageDataUrl)}
              onUploaded={async (url) => {
                try {
                  await update((prev) => {
                    const next = [...prev.slides];
                    next[slideIndex] = { ...next[slideIndex], imageDataUrl: url };
                    return { ...prev, slides: next };
                  });
                  flash("Slide image saved — preview on /sales/deck.");
                } catch {
                  /* error shown via hook */
                }
              }}
              onClear={async () => {
                try {
                  await update((prev) => {
                    const next = [...prev.slides];
                    next[slideIndex] = { ...next[slideIndex], imageDataUrl: undefined };
                    return { ...prev, slides: next };
                  });
                  flash("Slide image removed.");
                } catch {
                  /* error shown via hook */
                }
              }}
            />
          </div>
          <Link href="/sales/deck" className="mt-4 inline-block text-sm text-cyan hover:underline">
            Preview deck →
          </Link>
        </section>
      ) : null}

      {tab === "ads" ? (
        <section className="space-y-4">
          {media.linkedInAds.map((ad, idx) => (
            <article key={ad.id} className="glass-app rounded-2xl p-5">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">Ad {idx + 1}</div>
              <p className="mt-2 font-semibold text-white">{ad.headline}</p>
              <p className="mt-1 text-sm text-muted">{ad.body}</p>
              <div className="relative mt-4 aspect-[1.91/1] overflow-hidden rounded-xl border border-border bg-navy/50">
                {isDisplayableMediaUrl(ad.imageDataUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ad.imageDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No image · 1.91:1
                  </div>
                )}
              </div>
              <div className="mt-3">
                <ImageUploadButton
                  label="Upload ad image"
                  hasImage={isDisplayableMediaUrl(ad.imageDataUrl)}
                  onUploaded={async (url) => {
                    try {
                      await update((prev) => ({
                        ...prev,
                        linkedInAds: prev.linkedInAds.map((a) =>
                          a.id === ad.id ? { ...a, imageDataUrl: url } : a,
                        ),
                      }));
                      flash(`Ad ${idx + 1} image saved.`);
                    } catch {
                      /* hook error */
                    }
                  }}
                  onClear={async () => {
                    try {
                      await update((prev) => ({
                        ...prev,
                        linkedInAds: prev.linkedInAds.map((a) =>
                          a.id === ad.id ? { ...a, imageDataUrl: undefined } : a,
                        ),
                      }));
                      flash(`Ad ${idx + 1} image removed.`);
                    } catch {
                      /* hook error */
                    }
                  }}
                />
              </div>
            </article>
          ))}
          <Link href="/sales/ads" className="inline-block text-sm text-cyan hover:underline">
            Preview LinkedIn ads →
          </Link>
        </section>
      ) : null}

      {tab === "carousel" ? (
        <section className="glass-app rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
              Carousel side {carouselIndex + 1} / {media.carousel.length}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={carouselIndex === 0}
                onClick={() => setCarouselIndex((x) => Math.max(0, x - 1))}
                className="btn-ghost-glass rounded-full px-3 py-1 text-xs disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={carouselIndex === media.carousel.length - 1}
                onClick={() =>
                  setCarouselIndex((x) => Math.min(media.carousel.length - 1, x + 1))
                }
                className="btn-ghost-glass rounded-full px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
          <p className="mt-3 font-semibold text-white">{frame.line}</p>
          <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-border bg-navy/50">
            {isDisplayableMediaUrl(frame.imageDataUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={frame.imageDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No image
              </div>
            )}
          </div>
          <div className="mt-3">
            <ImageUploadButton
              label="Upload carousel image"
              hasImage={isDisplayableMediaUrl(frame.imageDataUrl)}
              onUploaded={async (url) => {
                try {
                  await update((prev) => ({
                    ...prev,
                    carousel: prev.carousel.map((c, idx) =>
                      idx === carouselIndex ? { ...c, imageDataUrl: url } : c,
                    ),
                  }));
                  flash("Carousel image saved.");
                } catch {
                  /* hook error */
                }
              }}
              onClear={async () => {
                try {
                  await update((prev) => ({
                    ...prev,
                    carousel: prev.carousel.map((c, idx) =>
                      idx === carouselIndex ? { ...c, imageDataUrl: undefined } : c,
                    ),
                  }));
                  flash("Carousel image removed.");
                } catch {
                  /* hook error */
                }
              }}
            />
          </div>
          <Link href="/sales/ads" className="mt-4 inline-block text-sm text-cyan hover:underline">
            Preview carousel →
          </Link>
        </section>
      ) : null}

      <button
        type="button"
        onClick={async () => {
          if (confirm("Reset all sales media (video, slides, ads, carousel)?")) {
            await reset();
            flash("Sales media reset to defaults.");
          }
        }}
        className="btn-ghost-glass self-start rounded-full px-4 py-2 text-sm text-white"
      >
        Reset sales media defaults
      </button>
    </div>
  );
}
