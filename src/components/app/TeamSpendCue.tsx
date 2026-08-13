"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import { useMemo, useState } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);

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

  function teamHref(team: string) {
    return team === "Platform" ? "#decision-rightsizing" : "#needs-decision";
  }

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
            Spend vs budget by team · click a team to decide
          </p>
        </div>
        {openCount > 0 ? (
          <a href="#needs-decision" className="text-sm text-green hover:underline">
            {openCount} open optimization{openCount === 1 ? "" : "s"} ·{" "}
            {formatUsd(openSavings)}/mo →
          </a>
        ) : null}
      </div>

      <div className="glass-app rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((t) => {
            const over = t.variance > 0;
            const pct = t.budget > 0 ? Math.round((t.spend / t.budget) * 100) : 0;
            const barPct = Math.min(100, pct);
            const isHover = hovered === t.team;

            return (
              <a
                key={t.team}
                href={teamHref(t.team)}
                className={`relative block rounded-xl border p-3 transition-colors ${
                  isHover
                    ? "border-cyan/50 bg-cyan/5"
                    : "border-border/60 hover:border-cyan/35"
                }`}
                onMouseEnter={() => setHovered(t.team)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(t.team)}
                onBlur={() => setHovered(null)}
              >
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
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="meter"
                  aria-label={`${t.team} spend versus budget`}
                  aria-valuemin={0}
                  aria-valuemax={t.budget}
                  aria-valuenow={t.spend}
                  aria-valuetext={`${formatUsd(t.spend)} of ${formatUsd(t.budget)} (${pct}%)`}
                >
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-cyan" : "bg-green"}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>

                {isHover ? (
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-[min(100%,14rem)] -translate-x-1/2 rounded-lg border border-white/15 bg-navy/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur-sm">
                    <div className="flex justify-between gap-3 text-muted">
                      <span>Spend</span>
                      <span className="tabular-nums text-white">{formatUsd(t.spend)}</span>
                    </div>
                    <div className="mt-0.5 flex justify-between gap-3 text-muted">
                      <span>Budget</span>
                      <span className="tabular-nums text-white">{formatUsd(t.budget)}</span>
                    </div>
                    <div
                      className={`mt-0.5 flex justify-between gap-3 border-t border-white/10 pt-0.5 ${
                        over ? "text-cyan" : "text-green"
                      }`}
                    >
                      <span>Variance</span>
                      <span className="tabular-nums">
                        {over ? "+" : ""}
                        {formatUsd(t.variance)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </a>
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
