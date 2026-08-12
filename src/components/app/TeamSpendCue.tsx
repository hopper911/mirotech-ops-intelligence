"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import { useMemo } from "react";

type TeamRollup = {
  team: string;
  spend: number;
  budget: number;
  variance: number;
};

function buildTeamRollups(
  vendors: { team: string; monthly: number; budget: number }[],
): TeamRollup[] {
  const map = new Map<string, { spend: number; budget: number }>();
  for (const v of vendors) {
    const cur = map.get(v.team) ?? { spend: 0, budget: 0 };
    cur.spend += v.monthly;
    cur.budget += v.budget;
    map.set(v.team, cur);
  }
  return [...map.entries()]
    .map(([team, { spend, budget }]) => ({
      team,
      spend,
      budget,
      variance: spend - budget,
    }))
    .sort((a, b) => b.variance - a.variance);
}

export function TeamSpendCue() {
  const { workspace } = useWorkspace();

  const { teams, openCount, openSavings, overBudget } = useMemo(() => {
    const rollups = buildTeamRollups(workspace.vendors);
    const top = rollups.slice(0, 4);
    const openRecs = workspace.recommendations.filter((r) => r.status === "open");
    const openInvs = (workspace.investigations ?? []).filter((i) => i.status === "open");
    const linked = new Set(openInvs.map((i) => i.recommendationId));
    const uniqueOpen =
      openInvs.length + openRecs.filter((r) => !linked.has(r.id)).length;
    const savings =
      openInvs.reduce((s, i) => s + i.impactMonthly, 0) +
      openRecs.filter((r) => !linked.has(r.id)).reduce((s, r) => s + r.savingsMonthly, 0);
    return {
      teams: top,
      openCount: uniqueOpen,
      openSavings: savings,
      overBudget: rollups.filter((t) => t.variance > 0),
    };
  }, [workspace.vendors, workspace.recommendations, workspace.investigations]);

  const leadOver = overBudget[0];

  return (
    <section aria-labelledby="team-spend-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="team-spend-heading"
            className="text-sm uppercase tracking-[0.16em] text-muted"
          >
            Team spend
          </h2>
          <p className="mt-1 text-sm text-muted">
            Spend vs budget by team · sample rollup
          </p>
        </div>
        {openCount > 0 ? (
          <a
            href="#needs-decision"
            className="text-sm text-green hover:underline"
          >
            {openCount} open optimization{openCount === 1 ? "" : "s"} ·{" "}
            {formatUsd(openSavings)}/mo →
          </a>
        ) : null}
      </div>

      <div className="glass-app rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => {
            const over = t.variance > 0;
            const pct = t.budget > 0 ? Math.min(100, Math.round((t.spend / t.budget) * 100)) : 0;
            return (
              <div key={t.team} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-white">{t.team}</span>
                  <span className={`text-xs ${over ? "text-cyan" : "text-muted"}`}>
                    {over ? `+${formatUsd(t.variance)}` : "On plan"}
                  </span>
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {formatUsd(t.spend)}
                </div>
                <div className="mt-1 text-xs text-muted">
                  of {formatUsd(t.budget)} budget · {pct}%
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${over ? "bg-cyan" : "bg-green"}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {leadOver && openCount > 0 ? (
          <p className="mt-4 text-sm text-muted">
            <span className="text-white">{leadOver.team}</span> is over budget by{" "}
            {formatUsd(leadOver.variance)}.{" "}
            <a href="#needs-decision" className="text-cyan hover:underline">
              Decide on open optimizations
            </a>
            {leadOver.team === "Platform" ? (
              <>
                {" "}
                ·{" "}
                <a href="#decision-rightsizing" className="text-green hover:underline">
                  AWS rightsizing
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
