import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";

export default function BriefPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <Reveal>
          <p className="brand-sub text-[11px] text-cyan">Solution brief</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Mirotech Ops Intelligence</h1>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <GlassCard variant="strong" className="space-y-8 p-6 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="text-base font-semibold text-white">Situation</h2>
              <p className="mt-2">
                Mid-market companies assemble a sprawling stack — cloud, SaaS, AI gateways, and
                automations — without shared ownership or a trustworthy savings narrative for the
                board.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Approach</h2>
              <p className="mt-2">
                Ingest billing and usage signals, normalize ownership, detect anomalies, and propose
                recommendations with evidence, monthly savings, and risk. Leadership sees a forecast;
                operators act on inventory and workflows; engineers drill into API cost drivers.
              </p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-white">Outcomes (sample)</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>$15.9k identified monthly savings across four open recommendations</li>
                <li>Faster renewal hygiene with unused seat detection</li>
                <li>Earlier AI spend anomaly detection for support and batch jobs</li>
              </ul>
            </section>
            <p className="text-xs text-cyan">Sample concept brief · Northline Commerce demo data</p>
          </GlassCard>
        </Reveal>
      </main>
    </MarketingShell>
  );
}
