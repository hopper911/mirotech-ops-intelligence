"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import type { Recommendation } from "@/lib/ops";
import { useState } from "react";

export function RecommendationActions({ recommendation }: { recommendation: Recommendation }) {
  const { updateAndSave } = useWorkspace();
  const [message, setMessage] = useState<string | null>(null);
  const status = recommendation.status;

  function act(next: "approved" | "dismissed") {
    updateAndSave((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((r) =>
        r.id === recommendation.id ? { ...r, status: next } : r,
      ),
    }));
    setMessage(
      next === "approved"
        ? "Approved and saved to this browser’s workspace."
        : "Dismissed and saved to this browser’s workspace.",
    );
  }

  return (
    <div className="glass-app rounded-2xl p-5">
      <div className="text-xs uppercase tracking-[0.14em] text-muted">Actions</div>
      <p className="mt-2 text-sm text-muted">
        Potential savings {formatUsd(recommendation.savingsMonthly)}/mo · Risk {recommendation.risk}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={status !== "open"}
          onClick={() => act("approved")}
          className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={status !== "open"}
          onClick={() => act("dismissed")}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white disabled:opacity-40"
        >
          Dismiss
        </button>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.12em] text-cyan">Status: {status}</p>
      {message ? <p className="mt-2 text-sm text-green">{message}</p> : null}
    </div>
  );
}
