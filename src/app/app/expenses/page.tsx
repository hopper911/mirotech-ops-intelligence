"use client";

import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { Sparkline } from "@/components/app/Sparkline";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import { Fragment, useState } from "react";

export default function ExpensesPage() {
  const { workspace, hydrated } = useWorkspace();
  const [selected, setSelected] = useState<{
    vendorId: string;
    index: number;
  } | null>(null);

  if (!hydrated) return <p className="text-sm text-muted">Loading workspace…</p>;

  const vendors = workspace.vendors;
  const monthlyTotal = vendors.reduce((s, v) => s + v.monthly, 0);
  const budgetTotal = vendors.reduce((s, v) => s + v.budget, 0);
  const variance = monthlyTotal - budgetTotal;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Cloud + software</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Expenses</h1>
          <p className="mt-2 text-sm text-muted">
            Cost trends, vendors, teams, and budget variance. Click a trend point for detail.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Monthly total</div>
          <div className="mt-1 text-2xl font-semibold text-white">{formatUsd(monthlyTotal)}</div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Budget</div>
          <div className="mt-1 text-2xl font-semibold text-white">{formatUsd(budgetTotal)}</div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Variance</div>
          <div className={`mt-1 text-2xl font-semibold ${variance > 0 ? "text-cyan" : "text-green"}`}>
            {variance > 0 ? "+" : ""}
            {formatUsd(variance)}
          </div>
        </div>
      </div>

      <div className="glass-app overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Monthly</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => {
              const isOpen = selected?.vendorId === v.id;
              const point =
                isOpen && selected ? v.trend[selected.index] : null;
              const pointUsd = point ? point.value * 1000 : null;
              const vsBudget =
                pointUsd != null ? pointUsd - v.budget : null;

              return (
                <Fragment key={v.id}>
                  <tr className="border-t border-border/80">
                    <td className="px-4 py-3 font-medium text-white">{v.vendor}</td>
                    <td className="px-4 py-3 text-muted">{v.category}</td>
                    <td className="px-4 py-3 text-muted">{v.team}</td>
                    <td className="px-4 py-3">{formatUsd(v.monthly)}</td>
                    <td className="px-4 py-3 text-muted">{formatUsd(v.budget)}</td>
                    <td className="w-40 px-4 py-3">
                      <Sparkline
                        series={v.trend}
                        className="h-10 w-32"
                        compact
                        seriesLabel={v.vendor}
                        unitSuffix="k"
                        activeIndex={isOpen ? selected.index : undefined}
                        onPointClick={(_p, index) =>
                          setSelected((prev) =>
                            prev?.vendorId === v.id && prev.index === index
                              ? null
                              : { vendorId: v.id, index },
                          )
                        }
                        ariaLabel={`${v.vendor} spend trend. Click a month for detail.`}
                      />
                    </td>
                  </tr>
                  {isOpen && point ? (
                    <tr className="border-t border-cyan/20 bg-cyan/5">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <p className="text-muted">
                            <span className="text-white">{v.vendor}</span>
                            {" · "}
                            <span className="text-cyan">{point.label}</span>
                            {" · "}
                            <span className="tabular-nums text-white">
                              {formatUsd(point.value * 1000)}
                            </span>
                            {" sample run-rate"}
                            {vsBudget != null ? (
                              <>
                                {" · "}
                                <span className={vsBudget > 0 ? "text-cyan" : "text-green"}>
                                  {vsBudget > 0 ? "+" : ""}
                                  {formatUsd(vsBudget)} vs monthly budget
                                </span>
                              </>
                            ) : null}
                          </p>
                          <button
                            type="button"
                            className="text-xs text-cyan hover:underline"
                            onClick={() => setSelected(null)}
                          >
                            Clear
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
