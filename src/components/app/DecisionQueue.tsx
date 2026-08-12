"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import {
  applyInvestigationDecision,
  applyRecommendationStatus,
  approveInvestigationInPlace,
  decisionKindLabel,
  dismissInvestigationInPlace,
  recommendationDecisionKind,
  type DecisionKind,
} from "@/lib/ops/decisions";
import { FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import type { Investigation, Recommendation } from "@/lib/ops";
import Link from "next/link";
import { useMemo, useState } from "react";

type QueueItem = {
  key: string;
  kind: DecisionKind;
  title: string;
  blurb: string;
  savingsMonthly: number;
  risk: "low" | "medium" | "high";
  reviewHref: string;
  investigation?: Investigation;
  recommendation?: Recommendation;
};

function buildQueue(
  investigations: Investigation[],
  recommendations: Recommendation[],
): QueueItem[] {
  const openInvs = investigations.filter((i) => i.status === "open");
  const linkedRecIds = new Set(openInvs.map((i) => i.recommendationId));

  const invItems: QueueItem[] = openInvs.map((inv) => {
    const linked = recommendations.find((r) => r.id === inv.recommendationId);
    return {
      key: `inv-${inv.id}`,
      kind: "anomaly" as const,
      title: inv.title,
      blurb: inv.summary,
      savingsMonthly: inv.impactMonthly,
      risk: inv.risk,
      reviewHref: `/app/investigations/${inv.id}`,
      investigation: inv,
      recommendation: linked,
    };
  });

  const recItems: QueueItem[] = recommendations
    .filter((r) => r.status === "open" && !linkedRecIds.has(r.id))
    .map((rec) => {
      const kind = recommendationDecisionKind(rec);
      const blurb =
        kind === "rightsizing"
          ? rec.evidence[0] ?? rec.issue
          : rec.issue;
      return {
        key: `rec-${rec.id}`,
        kind,
        title: rec.title,
        blurb,
        savingsMonthly: rec.savingsMonthly,
        risk: rec.risk,
        reviewHref:
          rec.id === "rec-ai-routing"
            ? `/app/investigations/${FEATURED_INVESTIGATION_ID}`
            : `/app/recommendations/${rec.id}`,
        recommendation: rec,
      };
    });

  // Rightsizing first among recs, then by savings desc; investigations stay at top for the signature story.
  const sortedRecs = [...recItems].sort((a, b) => {
    if (a.kind === "rightsizing" && b.kind !== "rightsizing") return -1;
    if (b.kind === "rightsizing" && a.kind !== "rightsizing") return 1;
    return b.savingsMonthly - a.savingsMonthly;
  });

  return [...invItems, ...sortedRecs];
}

export function DecisionQueue() {
  const { workspace, updateAndSave, canEdit } = useWorkspace();
  const [flash, setFlash] = useState<string | null>(null);

  const items = useMemo(
    () => buildQueue(workspace.investigations ?? [], workspace.recommendations),
    [workspace.investigations, workspace.recommendations],
  );

  const openSavings = items.reduce((sum, i) => sum + i.savingsMonthly, 0);

  function approveItem(item: QueueItem) {
    if (item.investigation) {
      const next = approveInvestigationInPlace(item.investigation);
      updateAndSave((prev) => applyInvestigationDecision(prev, next));
      setFlash(`Approved “${item.title}” — tracking unlocked.`);
      return;
    }
    if (item.recommendation) {
      updateAndSave((prev) =>
        applyRecommendationStatus(prev, item.recommendation!.id, "approved"),
      );
      setFlash(
        canEdit
          ? `Approved “${item.title}” and saved.`
          : `Approved “${item.title}” (saved for this session).`,
      );
    }
  }

  function dismissItem(item: QueueItem) {
    if (item.investigation) {
      const next = dismissInvestigationInPlace(item.investigation);
      updateAndSave((prev) => applyInvestigationDecision(prev, next));
      setFlash(`Dismissed “${item.title}”.`);
      return;
    }
    if (item.recommendation) {
      updateAndSave((prev) =>
        applyRecommendationStatus(prev, item.recommendation!.id, "dismissed"),
      );
      setFlash(`Dismissed “${item.title}”.`);
    }
  }

  return (
    <section id="needs-decision" className="scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Needs decision</h2>
          <p className="mt-1 text-sm text-muted">
            {items.length === 0
              ? "No open optimizations — queue clear."
              : `${items.length} open · ${formatUsd(openSavings)}/mo if approved`}
          </p>
        </div>
      </div>

      {flash ? (
        <p className="mb-3 text-sm text-green" role="status">
          {flash}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="glass-app rounded-2xl p-5 text-sm text-muted">
          All optimizations decided for this session. Open{" "}
          <Link href="/app/forecast" className="text-cyan hover:underline">
            forecast
          </Link>{" "}
          to see the optimized path.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.key}
              id={item.kind === "rightsizing" ? "decision-rightsizing" : undefined}
              className={`glass-app rounded-2xl p-4 sm:p-5 ${
                item.kind === "rightsizing" ? "border border-green/35" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                    {decisionKindLabel(item.kind)} · {item.risk} risk
                  </div>
                  <h3 className="mt-1.5 font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{item.blurb}</p>
                  <p className="mt-2 text-sm text-green">
                    {formatUsd(item.savingsMonthly)}/mo potential
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => approveItem(item)}
                    className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissItem(item)}
                    className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white"
                  >
                    Dismiss
                  </button>
                  <Link
                    href={item.reviewHref}
                    className="rounded-full px-3 py-2 text-sm text-cyan hover:underline"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
