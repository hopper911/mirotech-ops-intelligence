"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import { applyRecommendationStatus } from "@/lib/ops/decisions";
import type { Recommendation } from "@/lib/ops";
import { useEffect, useState } from "react";

export function RecommendationActions({ recommendation }: { recommendation: Recommendation }) {
  const { workspace, canEdit, updateAndSave } = useWorkspace();
  const live =
    workspace.recommendations.find((r) => r.id === recommendation.id) ?? recommendation;
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(null);
  }, [live.status]);

  function act(next: "approved" | "dismissed") {
    updateAndSave((prev) => applyRecommendationStatus(prev, recommendation.id, next));
    setMessage(
      next === "approved"
        ? canEdit
          ? "Approved and saved to this admin workspace."
          : "Marked approved — saved for this session."
        : canEdit
          ? "Dismissed and saved to this admin workspace."
          : "Dismissed — saved for this session.",
    );
  }

  return (
    <div className="glass-app rounded-2xl p-5">
      <div className="text-xs uppercase tracking-[0.14em] text-muted">Actions</div>
      <p className="mt-2 text-sm text-muted">
        Potential savings {formatUsd(live.savingsMonthly)}/mo · Risk {live.risk}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={live.status !== "open"}
          onClick={() => act("approved")}
          className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={live.status !== "open"}
          onClick={() => act("dismissed")}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Dismiss
        </button>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-cyan">
        Status: {live.status}
      </p>
      {message ? <p className="mt-2 text-sm text-green">{message}</p> : null}
    </div>
  );
}
