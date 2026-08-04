import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { formatUsd } from "@/lib/format";
import { opsSource } from "@/lib/ops";

export default async function AiUsagePage() {
  const { models, anomalies } = await opsSource.getAiUsage();
  const total = models.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">AI API usage</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Models & anomalies</h1>
          <p className="mt-2 text-sm text-muted">
            Usage, model costs, teams, and anomaly signals.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-4">
        <div className="text-xs uppercase tracking-[0.14em] text-cyan">Anomalies</div>
        <ul className="mt-2 space-y-1 text-sm text-foreground/90">
          {anomalies.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-muted">
        Total AI spend this month:{" "}
        <span className="font-semibold text-white">{formatUsd(total)}</span>
      </div>

      <div className="overflow-x-auto glass-app rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Tokens (M)</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Signal</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-t border-border/80">
                <td className="px-4 py-3 font-medium text-white">{m.model}</td>
                <td className="px-4 py-3 text-muted">{m.provider}</td>
                <td className="px-4 py-3 text-muted">{m.team}</td>
                <td className="px-4 py-3">{m.tokensM}</td>
                <td className="px-4 py-3">{formatUsd(m.cost)}</td>
                <td className="px-4 py-3 text-cyan">{m.anomaly ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
