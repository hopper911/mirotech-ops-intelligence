"use client";

import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import { formatUsd } from "@/lib/format";
import Link from "next/link";

export default function AiUsagePage() {
  const { workspace, hydrated } = useWorkspace();
  if (!hydrated) return <p className="text-sm text-muted">Loading workspace…</p>;

  const models = workspace.models;
  const anomalies = models.filter((m) => m.anomaly).map((m) => `${m.model}: ${m.anomaly}`);
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
          {anomalies.length ? anomalies.map((a) => <li key={a}>• {a}</li>) : <li>• None</li>}
        </ul>
        <Link
          href={`/app/investigations/${FEATURED_INVESTIGATION_ID}`}
          className="mt-3 inline-block text-sm text-green hover:underline"
        >
          Open GPT-4o investigation workflow →
        </Link>
      </div>

      <div className="text-sm text-muted">
        Total AI spend this month:{" "}
        <span className="font-semibold text-white">{formatUsd(total)}</span>
      </div>

      <div className="glass-app overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">AI model usage by team</caption>
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">
                Model
              </th>
              <th scope="col" className="px-4 py-3">
                Provider
              </th>
              <th scope="col" className="px-4 py-3">
                Team
              </th>
              <th scope="col" className="px-4 py-3">
                Tokens (M)
              </th>
              <th scope="col" className="px-4 py-3">
                Cost
              </th>
              <th scope="col" className="px-4 py-3">
                Signal
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-t border-border/80">
                <th scope="row" className="px-4 py-3 font-medium text-white">
                  {m.model}
                </th>
                <td className="px-4 py-3 text-muted">{m.provider}</td>
                <td className="px-4 py-3 text-muted">{m.team}</td>
                <td className="px-4 py-3">{m.tokensM}</td>
                <td className="px-4 py-3">{formatUsd(m.cost)}</td>
                <td className="px-4 py-3 text-cyan">
                  {m.anomaly ? (
                    m.team === "Support" ? (
                      <Link
                        href={`/app/investigations/${FEATURED_INVESTIGATION_ID}`}
                        className="hover:underline"
                      >
                        {m.anomaly}
                      </Link>
                    ) : (
                      m.anomaly
                    )
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
