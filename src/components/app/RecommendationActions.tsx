"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/ops";
import { formatUsd } from "@/lib/format";

export function RecommendationActions({ recommendation }: { recommendation: Recommendation }) {
  const [status, setStatus] = useState(recommendation.status);
  const [message, setMessage] = useState<string | null>(null);

  function act(next: "approved" | "dismissed") {
    setStatus(next);
    setMessage(
      next === "approved"
        ? "Marked approved (demo only — no live change)."
        : "Dismissed (demo only — no live change).",
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
