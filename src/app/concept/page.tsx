import { SignalDots } from "@/components/brand/SignalDots";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default function ConceptPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-12">
        <div className="mb-8 flex justify-center">
          <SignalDots variant="orbit" className="h-40 w-40" />
        </div>

        <Reveal>
          <p className="brand-sub text-[11px] text-cyan">Case study · credibility</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Self-initiated product concept
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Mirotech Ops Intelligence is a portfolio flagship: a realistic B2B SaaS brand and product
            experience designed to show end-to-end craft — strategy, product UX, web design, technical
            communication, marketing, and sales enablement.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <GlassCard variant="strong" className="space-y-6 p-6 text-sm leading-relaxed text-muted">
            <div>
              <h2 className="text-base font-semibold text-white">Core business problem</h2>
              <p className="mt-2">
                Growing businesses use dozens of technology services but lack one clear view of cost,
                utilization, automation health, and optimization opportunities.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Approach</h2>
              <p className="mt-2">
                Brand system first (logo, palette, type, viz), then an interactive product shell with
                eight flagship screens, onboarding, anomaly alerts, and a sales kit. All figures use
                the fictional company <strong className="text-white">Northline Commerce</strong> and
                are labeled as sample data.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Outcome</h2>
              <p className="mt-2">
                One complete B2B SaaS project that hiring managers can click through — not slideware
                alone. Explore the{" "}
                <Link href="/login" className="text-cyan hover:underline">
                  live demo
                </Link>
                ,{" "}
                <Link href="/sales" className="text-cyan hover:underline">
                  sales kit
                </Link>
                , and{" "}
                <Link href="/brand" className="text-cyan hover:underline">
                  brand guidelines
                </Link>
                .
              </p>
            </div>
          </GlassCard>
        </Reveal>
      </main>
    </MarketingShell>
  );
}
