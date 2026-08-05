import {
  IconConnectivity,
  IconInsights,
  IconOptimization,
  IconPerformance,
  IconSystems,
} from "@/components/brand/BrandIcons";
import { SignalDivider } from "@/components/brand/NetworkHero";
import { HomeHero } from "@/components/marketing/HomeHero";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import type { ComponentType } from "react";

const audiences: {
  title: string;
  body: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Founder or CFO",
    body: "Financial visibility and a defensible savings forecast across cloud, SaaS, and AI spend.",
    Icon: IconPerformance,
  },
  {
    title: "Operations manager",
    body: "Subscription ownership, renewals, unused licenses, and workflow health in one inventory.",
    Icon: IconSystems,
  },
  {
    title: "Technical lead",
    body: "API usage, anomalies, and actionable optimization recommendations with evidence.",
    Icon: IconInsights,
  },
];

const modules: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { label: "Executive dashboard", Icon: IconPerformance },
  { label: "Cloud + software expenses", Icon: IconOptimization },
  { label: "AI API usage", Icon: IconInsights },
  { label: "Subscription inventory", Icon: IconSystems },
  { label: "Automation health", Icon: IconConnectivity },
  { label: "Recommendations", Icon: IconOptimization },
  { label: "Savings forecast", Icon: IconPerformance },
  { label: "AI assistant", Icon: IconInsights },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-10 lg:pt-14">
        <div className="node-rail-pulse pointer-events-none absolute inset-x-6 top-24 h-40" aria-hidden />

        <HomeHero />

        <SignalDivider />

        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="icon-well">
              <IconConnectivity className="h-5 w-5" />
            </span>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Built for every seat</h2>
          </div>
        </Reveal>

        <RevealStagger className="grid gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <RevealItem key={a.title}>
              <GlassCard lift className="h-full p-5">
                <span className="icon-well">
                  <a.Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-sm font-semibold text-white">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealStagger>

        <SignalDivider />

        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="icon-well">
              <IconSystems className="h-5 w-5" />
            </span>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Flagship screens</h2>
          </div>
          <RevealStagger className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {modules.map((m) => (
              <RevealItem key={m.label}>
                <GlassCard lift className="flex items-center gap-3 px-4 py-3 text-sm text-white">
                  <span className="icon-well !h-9 !w-9 shrink-0">
                    <m.Icon className="h-4 w-4" />
                  </span>
                  {m.label}
                </GlassCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </Reveal>

        <Reveal className="mt-16">
          <GlassCard variant="strong" className="relative overflow-hidden rounded-3xl p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(125,220,101,0.25),transparent_70%)]"
              aria-hidden
            />
            <div className="relative flex flex-wrap items-start gap-4">
              <span className="icon-well">
                <IconInsights className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">Portfolio case study ready</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  This site demonstrates brand strategy, product UX, marketing pages, and sales
                  enablement for a self-initiated B2B SaaS concept.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/concept" className="text-sm text-green hover:underline">
                    Read the concept →
                  </Link>
                  <Link href="/sales" className="text-sm text-cyan hover:underline">
                    Open sales kit →
                  </Link>
                  <Link href="/pricing" className="text-sm text-cyan hover:underline">
                    View pricing →
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </main>
    </MarketingShell>
  );
}
