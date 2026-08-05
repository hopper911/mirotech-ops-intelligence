"use client";

import { InvestigationCanvas } from "@/components/app/InvestigationCanvas";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import { formatUsd } from "@/lib/format";
import Link from "next/link";

export default function InvestigationsIndexPage() {
  const { workspace, hydrated } = useWorkspace();
  if (!hydrated) return <p className="text-sm text-muted">Loading…</p>;

  const list = workspace.investigations?.length
    ? workspace.investigations
    : [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Investigations</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Anomaly workflows</h1>
          <p className="mt-2 text-sm text-muted">
            Signature investigation: spike → cause → recommendation → approval → tracking.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      {list.length === 0 ? (
        <p className="text-sm text-muted">No investigations in workspace.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((inv) => (
            <li key={inv.id}>
              <Link
                href={`/app/investigations/${inv.id}`}
                className="glass-app glass-lift block rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                    {inv.severity} · {inv.status}
                  </span>
                  {inv.id === FEATURED_INVESTIGATION_ID ? (
                    <span className="text-[10px] uppercase tracking-[0.12em] text-green">
                      Featured
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 font-semibold text-white">{inv.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{inv.summary}</p>
                <p className="mt-3 text-sm text-green">
                  {formatUsd(inv.impactMonthly)}/mo potential
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
