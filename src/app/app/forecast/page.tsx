"use client";

import { DualSeriesChart } from "@/components/app/Sparkline";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForecastPage() {
  const { workspace, hydrated } = useWorkspace();
  const router = useRouter();
  if (!hydrated) return <p className="text-sm text-muted">Loading workspace…</p>;

  const forecast = workspace.forecast;
  const recs = workspace.recommendations;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <Reveal>
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="brand-sub text-[10px] text-cyan">Savings forecast</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Current vs optimized
            </h1>
            <p className="mt-2 text-sm text-muted">{forecast.confidenceNote}</p>
          </div>
          <SampleDataBadge />
        </header>
      </Reveal>

      <RevealStagger className="grid gap-3 sm:grid-cols-3" stagger={0.07}>
        <RevealItem>
          <div className="glass-app h-full rounded-2xl p-4">
            <div className="text-xs text-muted">{forecast.current.label}</div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {formatUsd(forecast.current.monthlySpend)}/mo
            </div>
          </div>
        </RevealItem>
        <RevealItem>
          <div className="glass-app h-full rounded-2xl p-4">
            <div className="text-xs text-muted">{forecast.optimized.label}</div>
            <div className="mt-1 text-2xl font-semibold text-green">
              {formatUsd(forecast.optimized.monthlySpend)}/mo
            </div>
          </div>
        </RevealItem>
        <RevealItem>
          <div className="glass-app h-full rounded-2xl p-4">
            <div className="text-xs text-muted">Annual savings (sample)</div>
            <div className="mt-1 text-2xl font-semibold text-green">
              {formatUsd(forecast.annualSavings)}
            </div>
          </div>
        </RevealItem>
      </RevealStagger>

      <Reveal delay={0.08}>
        <div className="glass-app glass-lift rounded-2xl p-5">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted">
              Hover for monthly gap · click to approve open optimizations
            </p>
            <Link href="/app#needs-decision" className="text-xs text-green hover:underline">
              Decision queue →
            </Link>
          </div>
          <DualSeriesChart
            current={forecast.current.series}
            optimized={forecast.optimized.series}
            className="mt-2 h-52 w-full"
            currentLabel="Current"
            optimizedLabel="Optimized"
            unitSuffix="k"
            valueFormat={(n) => n.toFixed(1)}
            onPointClick={() => router.push("/app#needs-decision")}
            ariaLabel="Current versus optimized spend forecast. Click to open the decision queue."
          />
        </div>
      </Reveal>

      <Reveal delay={0.1} className="grid gap-4 lg:grid-cols-2">
        <div className="glass-app rounded-2xl p-5">
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Assumptions</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {forecast.assumptions.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </div>
        <div className="glass-app rounded-2xl p-5">
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
            Driving recommendations
          </h2>
          <ul className="mt-4 space-y-3">
            {recs.map((r) => (
              <li key={r.id}>
                <Link
                  href={
                    r.id === "rec-ai-routing"
                      ? "/app/investigations/inv-ai-gpt4o-spike"
                      : `/app/recommendations/${r.id}`
                  }
                  className="text-sm text-white hover:text-cyan"
                >
                  {r.title}
                  <span className="ml-2 text-green">
                    {formatUsd(r.savingsMonthly)}/mo
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
