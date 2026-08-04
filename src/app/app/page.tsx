import { InsightCard } from "@/components/app/InsightCard";
import { KPIStrip } from "@/components/app/KPIStrip";
import { Sparkline } from "@/components/app/Sparkline";
import { ModuleIcon } from "@/components/icons/ModuleIcon";
import { opsSource } from "@/lib/ops";
import Link from "next/link";

export default async function AppOverviewPage() {
  const dashboard = await opsSource.getDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header>
        <p className="brand-sub text-[10px] text-cyan">Operator overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          What your operations are saying
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Live mock telemetry for the five Ops Intelligence modules. Swap{" "}
          <code className="text-cyan">opsSource</code> when real connectors land.
        </p>
      </header>

      <KPIStrip kpis={dashboard.kpis} />

      <section>
        <h2 className="mb-3 text-sm uppercase tracking-[0.16em] text-muted">
          Priority insights
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {dashboard.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm uppercase tracking-[0.16em] text-muted">
          Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/app/${mod.id}`}
              className="group rounded-2xl border border-border bg-card/80 p-5 transition hover:border-cyan/40"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-cyan">
                  <ModuleIcon id={mod.id} />
                  <span className="font-semibold text-white">{mod.title}</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  {mod.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">{mod.description}</p>
              <div className="mt-4">
                <Sparkline series={mod.series} className="h-12 w-full opacity-90" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
