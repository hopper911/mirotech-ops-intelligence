"use client";

import { NetworkHero } from "@/components/brand/NetworkHero";
import { VideoUploadControls } from "@/components/sales/MediaUpload";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSalesMedia } from "@/hooks/useSalesMedia";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

export function HomeHero() {
  const { media, isAdmin, update, reset } = useSalesMedia();
  const videoUrl = media.backgroundVideoUrl?.trim();

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {videoUrl ? (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <video
            key={videoUrl.slice(0, 64)}
            className="h-full w-full object-cover opacity-35"
            autoPlay
            muted
            loop
            playsInline
            src={videoUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/70" />
        </div>
      ) : null}

      <div className="relative grid items-center gap-10 px-1 py-2 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <Reveal delay={0.05}>
            <p className="brand-sub text-[11px] text-cyan">B2B SaaS · Ops Intelligence</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="brand-display mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-signal">Mirotech</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              {BRAND.taglineParts.before}
              <span className="font-semibold text-green">{BRAND.taglineParts.emphasis}</span>
              {BRAND.taglineParts.after}
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Growing companies run dozens of technology services but lack one clear view of cost,
              utilization, automation health, and optimization opportunities. Mirotech unifies
              cloud, software subscriptions, AI API usage, and automation performance in a single
              workspace.
            </p>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="btn-specular rounded-full bg-green px-6 py-3 text-sm font-semibold text-navy"
              >
                Enter the demo
              </Link>
              <Link
                href="/product"
                className="btn-ghost-glass rounded-full px-6 py-3 text-sm text-white"
              >
                Explore product
              </Link>
            </div>
            <p className="mt-4 text-xs text-cyan">
              Sample concept · Northline Commerce workspace · not live billing data
            </p>
          </Reveal>

          {isAdmin ? (
            <div className="glass mt-8 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-[0.14em] text-green">
                Admin · hero background video
              </div>
              <div className="mt-3">
                <VideoUploadControls
                  value={media.backgroundVideoUrl}
                  onChange={(url) => update((prev) => ({ ...prev, backgroundVideoUrl: url }))}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset all sales media (slides, ads, carousel, video)?")) reset();
                }}
                className="mt-3 text-xs text-muted hover:text-white"
              >
                Reset sales media defaults
              </button>
            </div>
          ) : null}
        </div>

        <Reveal delay={0.25} className="relative hidden min-h-[280px] lg:block">
          <GlassCard variant="strong" className="relative overflow-hidden rounded-3xl p-4">
            <NetworkHero className="h-[280px] w-full" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>Signal graph</span>
              <span className="text-cyan">Live motif · brand system</span>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
