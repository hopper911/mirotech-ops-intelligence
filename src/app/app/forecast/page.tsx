import { DualSeriesChart } from "@/components/app/Sparkline";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { formatUsd } from "@/lib/format";
import { opsSource } from "@/lib/ops";
import Link from "next/link";

export default async function ForecastPage() {
  const forecast = await opsSource.getForecast();
  const recs = await opsSource.getRecommendations();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
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

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">{forecast.current.label}</div>
          <div className="mt-1 text-2xl font-semibold text-white">
            {formatUsd(forecast.current.monthlySpend)}/mo
          </div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">{forecast.optimized.label}</div>
          <div className="mt-1 text-2xl font-semibold text-green">
            {formatUsd(forecast.optimized.monthlySpend)}/mo
          </div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Annual savings (sample)</div>
          <div className="mt-1 text-2xl font-semibold text-green">
            {formatUsd(forecast.annualSavings)}
          </div>
        </div>
      </div>

      <div className="glass-app rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 border-t-2 border-dashed border-muted" /> Current
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 bg-green" /> Optimized
          </span>
        </div>
        <DualSeriesChart
          current={forecast.current.series}
          optimized={forecast.optimized.series}
          className="mt-4 h-44 w-full"
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
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
                <Link href={`/app/recommendations/${r.id}`} className="text-sm text-cyan hover:underline">
                  {r.title} · {formatUsd(r.savingsMonthly)}/mo
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
