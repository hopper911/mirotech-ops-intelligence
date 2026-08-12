import type { AuditEvent, Investigation, Recommendation } from "./types";
import type { WorkspaceData } from "./workspace";

export function decisionActorLabel(): string {
  if (typeof window === "undefined") return "Demo operator";
  try {
    const persona = sessionStorage.getItem("mirotech.persona");
    if (persona === "cfo") return "Founder / CFO (demo)";
    if (persona === "ops") return "Ops manager (demo)";
    if (persona === "tech") return "Technical lead (demo)";
  } catch {
    /* private mode */
  }
  return "Demo operator";
}

function appendAudit(
  base: Investigation,
  action: AuditEvent["action"],
  note: string,
  actor: string,
): Investigation {
  return {
    ...base,
    auditTrail: [
      ...base.auditTrail,
      {
        id: `ae-${Date.now()}-${action}`,
        at: new Date().toISOString(),
        actor,
        action,
        note,
      },
    ],
  };
}

/** One-click approve: assign owner, unlock tracking with sample observed savings. */
export function approveInvestigationInPlace(
  inv: Investigation,
  opts?: { owner?: string; actor?: string },
): Investigation {
  const owner = opts?.owner?.trim() || inv.owner || "Platform";
  const actor = opts?.actor ?? decisionActorLabel();
  let next = appendAudit(
    { ...inv, owner, status: "approved" },
    "assigned",
    `Owner set to ${owner}.`,
    actor,
  );
  next = appendAudit(next, "approved", "Recommendation approved — tracking unlocked.", actor);
  next = {
    ...next,
    status: "tracking",
    tracking: {
      ...next.tracking,
      observedMonthlySavings: Math.round(next.tracking.expectedMonthlySavings * 0.42),
      seriesObserved: next.tracking.seriesExpected.map((p, i) => ({
        label: p.label,
        value: Number((p.value * (0.35 + i * 0.12)).toFixed(2)),
      })),
    },
  };
  return appendAudit(next, "tracking_started", "Expected vs observed savings window opened.", actor);
}

export function dismissInvestigationInPlace(
  inv: Investigation,
  opts?: { owner?: string; actor?: string },
): Investigation {
  const owner = opts?.owner?.trim() || inv.owner;
  const actor = opts?.actor ?? decisionActorLabel();
  return appendAudit(
    { ...inv, owner, status: "dismissed" },
    "dismissed",
    "Investigation dismissed — no change applied.",
    actor,
  );
}

export function syncLinkedRecommendation(
  recommendations: Recommendation[],
  inv: Investigation,
): Recommendation[] {
  return recommendations.map((r) =>
    r.id === inv.recommendationId
      ? {
          ...r,
          status:
            inv.status === "approved" || inv.status === "tracking"
              ? ("approved" as const)
              : inv.status === "dismissed"
                ? ("dismissed" as const)
                : r.status,
          owner: inv.owner,
        }
      : r,
  );
}

export function applyInvestigationDecision(
  prev: WorkspaceData,
  next: Investigation,
): WorkspaceData {
  return {
    ...prev,
    investigations: (prev.investigations ?? []).map((i) => (i.id === next.id ? next : i)),
    recommendations: syncLinkedRecommendation(prev.recommendations, next),
  };
}

export function applyRecommendationStatus(
  prev: WorkspaceData,
  recommendationId: string,
  status: "approved" | "dismissed",
): WorkspaceData {
  return {
    ...prev,
    recommendations: prev.recommendations.map((r) =>
      r.id === recommendationId ? { ...r, status } : r,
    ),
  };
}

export type DecisionKind = "anomaly" | "rightsizing" | "seats" | "automation" | "optimization";

export function recommendationDecisionKind(rec: Recommendation): DecisionKind {
  if (rec.id === "rec-aws-rightsizing") return "rightsizing";
  if (rec.id === "rec-unused-seats") return "seats";
  if (rec.category === "Automation") return "automation";
  if (rec.category === "AI") return "anomaly";
  return "optimization";
}

export function decisionKindLabel(kind: DecisionKind): string {
  switch (kind) {
    case "anomaly":
      return "Anomaly";
    case "rightsizing":
      return "Rightsizing";
    case "seats":
      return "Seats";
    case "automation":
      return "Automation";
    default:
      return "Optimization";
  }
}
