import type { OpsKpi } from "@/lib/ops";

export function KPIStrip({ kpis }: { kpis: OpsKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur"
        >
          <div className="text-xs uppercase tracking-[0.14em] text-muted">
            {kpi.label}
          </div>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {kpi.value}
            </div>
            <div
              className={
                kpi.trend === "up"
                  ? "text-sm font-medium text-green"
                  : kpi.trend === "down"
                    ? "text-sm font-medium text-cyan"
                    : "text-sm font-medium text-muted"
              }
            >
              {kpi.delta}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
