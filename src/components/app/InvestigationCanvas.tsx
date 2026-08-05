"use client";

import { DualSeriesChart, Sparkline } from "@/components/app/Sparkline";
import { LoadingBlock, StatePanel } from "@/components/app/StatePanel";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import type { AuditEvent, Investigation, InvestigationStatus } from "@/lib/ops";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";

const STEPS = [
  { id: "summary", label: "Summary" },
  { id: "spike", label: "Cost spike" },
  { id: "cause", label: "Cause" },
  { id: "recommendation", label: "Recommendation" },
  { id: "approval", label: "Approval" },
  { id: "tracking", label: "Tracking" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const PERSONA_KEY = "mirotech.persona";

function actorLabel() {
  if (typeof window === "undefined") return "Demo operator";
  const persona = sessionStorage.getItem(PERSONA_KEY);
  if (persona === "cfo") return "Founder / CFO (demo)";
  if (persona === "ops") return "Ops manager (demo)";
  if (persona === "tech") return "Technical lead (demo)";
  return "Demo operator";
}

export function InvestigationCanvas({ investigationId }: { investigationId: string }) {
  const { workspace, hydrated, canEdit, updateAndSave, updateWorkspace } = useWorkspace();
  const reduce = useReducedMotion();
  const liveId = useId();
  const [step, setStep] = useState<StepId>("summary");
  const [localInv, setLocalInv] = useState<Investigation | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fromWorkspace = useMemo(
    () => workspace.investigations?.find((i) => i.id === investigationId) ?? null,
    [workspace.investigations, investigationId],
  );

  useEffect(() => {
    if (fromWorkspace) {
      setLocalInv(structuredClone(fromWorkspace));
      setOwner(fromWorkspace.owner);
    }
  }, [fromWorkspace]);

  if (!hydrated) {
    return <LoadingBlock label="Loading investigation…" />;
  }

  if (!localInv) {
    return (
      <StatePanel
        variant="empty"
        title="Investigation not found"
        body="This sample investigation id is missing from the workspace."
        action={
          <Link href="/app" className="text-sm text-cyan hover:underline">
            ← Executive
          </Link>
        }
      />
    );
  }

  const inv = localInv;
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const trackingLocked = inv.status === "open";

  function persist(next: Investigation) {
    setLocalInv(next);
    const updater = (prev: typeof workspace) => ({
      ...prev,
      investigations: (prev.investigations ?? []).map((i) => (i.id === next.id ? next : i)),
      recommendations: prev.recommendations.map((r) =>
        r.id === next.recommendationId
          ? {
              ...r,
              status:
                next.status === "approved" || next.status === "tracking"
                  ? ("approved" as const)
                  : next.status === "dismissed"
                    ? ("dismissed" as const)
                    : r.status,
              owner: next.owner,
            }
          : r,
      ),
    });
    if (canEdit) {
      updateAndSave(updater);
    } else {
      updateWorkspace(updater);
    }
  }

  function appendAudit(
    base: Investigation,
    action: AuditEvent["action"],
    note: string,
  ): Investigation {
    return {
      ...base,
      auditTrail: [
        ...base.auditTrail,
        {
          id: `ae-${Date.now()}`,
          at: new Date().toISOString(),
          actor: actorLabel(),
          action,
          note,
        },
      ],
    };
  }

  function approve() {
    let next = appendAudit(
      { ...inv, owner, status: "approved" },
      "assigned",
      `Owner set to ${owner}.`,
    );
    next = appendAudit(next, "approved", "Recommendation approved — tracking unlocked.");
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
    next = appendAudit(next, "tracking_started", "Expected vs observed savings window opened.");
    persist(next);
    setStatusMsg("Approved. Tracking step unlocked with sample observed savings.");
    setStep("tracking");
  }

  function dismiss() {
    const next = appendAudit(
      { ...inv, owner, status: "dismissed" },
      "dismissed",
      "Investigation dismissed — no routing change.",
    );
    persist(next);
    setStatusMsg("Dismissed. Decision recorded in the audit trail.");
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Anomaly investigation</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{inv.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{inv.summary}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <SampleDataBadge />
          <button
            type="button"
            onClick={() => setNotesOpen((o) => !o)}
            className="text-xs text-cyan hover:underline"
          >
            {notesOpen ? "Hide" : "Developer notes"}
          </button>
        </div>
      </header>

      <nav aria-label="Investigation steps">
        <ol className="flex flex-wrap gap-2">
          {STEPS.map((s, i) => {
            const locked = s.id === "tracking" && trackingLocked;
            const active = s.id === step;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setStep(s.id)}
                  aria-current={active ? "step" : undefined}
                  className={`rounded-full px-3 py-1.5 text-xs transition ${
                    active
                      ? "bg-blue/30 text-white"
                      : locked
                        ? "cursor-not-allowed text-muted/50"
                        : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {i + 1}. {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        id={liveId}
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {statusMsg ?? ""}
      </div>
      {statusMsg ? (
        <StatePanel variant="success" title="Decision recorded" body={statusMsg} />
      ) : null}

      {notesOpen ? <DeveloperNotes inv={inv} /> : null}

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="glass-app rounded-2xl p-5 sm:p-6"
          aria-labelledby={`step-${step}`}
        >
          <h2 id={`step-${step}`} className="text-sm uppercase tracking-[0.14em] text-muted">
            {STEPS[stepIndex]?.label}
          </h2>

          {step === "summary" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Severity" value={inv.severity} />
              <Metric label="Service" value={inv.service} />
              <Metric label="Team" value={inv.team} />
              <Metric label="Confidence" value={`${Math.round(inv.confidence * 100)}%`} />
              <Metric label="Risk" value={inv.risk} />
              <Metric label="Impact / mo" value={formatUsd(inv.impactMonthly)} tone="green" />
              <Metric label="Impact / yr" value={formatUsd(inv.impactAnnual)} tone="green" />
              <Metric label="Status" value={inv.status} />
            </div>
          ) : null}

          {step === "spike" ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-muted">
                Window <span className="text-white">{inv.spikeWindow}</span> ·{" "}
                <span className="text-cyan">{inv.spikeDelta}</span>
              </p>
              <figure>
                <figcaption className="mb-2 text-xs text-muted">
                  Daily Support GPT-4o spend ($k) — sample
                </figcaption>
                <Sparkline series={inv.spikeSeries} className="h-28 w-full" fill />
              </figure>
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Spike series by day</caption>
                <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th scope="col" className="py-2">
                      Day
                    </th>
                    <th scope="col" className="py-2">
                      Spend ($k)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inv.spikeSeries.map((p) => (
                    <tr key={p.label} className="border-t border-border/70">
                      <th scope="row" className="py-2 font-medium text-white">
                        {p.label}
                      </th>
                      <td className="py-2 text-muted">{p.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {step === "cause" ? (
            <ul className="mt-4 space-y-4">
              {inv.causes.map((c) => (
                <li key={c.id} className="rounded-xl border border-border/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{c.title}</h3>
                    <span className="rounded-full border border-cyan/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-cyan">
                      {c.likelihood} likelihood
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {c.service} · {c.team}
                  </p>
                  <p className="mt-2 text-sm text-foreground/90">{c.summary}</p>
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {c.evidence.map((e) => (
                      <li key={e} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}

          {step === "recommendation" ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm leading-relaxed text-foreground/90">{inv.action}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Risk" value={inv.risk} />
                <Metric label="Confidence" value={`${Math.round(inv.confidence * 100)}%`} />
                <Metric
                  label="Est. monthly impact"
                  value={formatUsd(inv.impactMonthly)}
                  tone="green"
                />
              </div>
              <Link
                href={`/app/recommendations/${inv.recommendationId}`}
                className="inline-block text-sm text-cyan hover:underline"
              >
                Open linked recommendation record →
              </Link>
            </div>
          ) : null}

          {step === "approval" ? (
            <div className="mt-4 space-y-5">
              <label className="block text-xs">
                <span className="uppercase tracking-[0.12em] text-muted">Owner</span>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  disabled={inv.status !== "open"}
                  className="mt-1 w-full max-w-sm rounded-lg border border-white/10 bg-navy/50 px-3 py-2 text-sm text-white"
                >
                  {["Engineering", "Support", "Platform", "Ops", "Finance Systems"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={inv.status !== "open"}
                  onClick={approve}
                  className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={inv.status !== "open"}
                  onClick={dismiss}
                  className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white disabled:opacity-40"
                >
                  Dismiss
                </button>
              </div>
              <AuditList events={inv.auditTrail} />
            </div>
          ) : null}

          {step === "tracking" ? (
            trackingLocked ? (
              <StatePanel
                variant="empty"
                title="Tracking locked"
                body="Approve the recommendation to unlock expected vs observed savings."
                action={
                  <button
                    type="button"
                    onClick={() => setStep("approval")}
                    className="text-sm text-cyan hover:underline"
                  >
                    Go to approval →
                  </button>
                }
              />
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted">{inv.tracking.checkpointNote}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric
                    label="Expected / mo"
                    value={formatUsd(inv.tracking.expectedMonthlySavings)}
                    tone="green"
                  />
                  <Metric
                    label="Observed / mo (sample)"
                    value={
                      inv.tracking.observedMonthlySavings == null
                        ? "—"
                        : formatUsd(inv.tracking.observedMonthlySavings)
                    }
                  />
                </div>
                <p className="text-xs text-muted">{inv.tracking.windowLabel}</p>
                <DualSeriesChart
                  current={inv.tracking.seriesExpected}
                  optimized={inv.tracking.seriesObserved}
                  className="h-40 w-full"
                />
                <AuditList events={inv.auditTrail} />
              </div>
            )
          ) : null}
        </motion.section>
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={stepIndex === 0}
          onClick={() => setStep(STEPS[stepIndex - 1].id)}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={
            stepIndex >= STEPS.length - 1 ||
            (STEPS[stepIndex + 1].id === "tracking" && trackingLocked)
          }
          onClick={() => setStep(STEPS[stepIndex + 1].id)}
          className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
        >
          Next
        </button>
        <Link href="/app" className="self-center text-sm text-cyan hover:underline">
          ← Executive
        </Link>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green";
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-navy/30 p-3">
      <div className="text-[10px] uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className={`mt-1 text-sm font-semibold capitalize ${tone === "green" ? "text-green" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function AuditList({ events }: { events: AuditEvent[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Audit trail</h3>
      <ol className="mt-3 space-y-3">
        {[...events].reverse().map((e) => (
          <li key={e.id} className="border-l border-cyan/40 pl-3 text-sm">
            <div className="text-white">
              {e.action.replace("_", " ")} · {e.actor}
            </div>
            <p className="text-xs text-muted">{e.note}</p>
            <time className="text-[10px] text-muted" dateTime={e.at}>
              {new Date(e.at).toLocaleString()}
            </time>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DeveloperNotes({ inv }: { inv: Investigation }) {
  return (
    <aside className="rounded-2xl border border-dashed border-cyan/30 bg-cyan/5 p-4 text-xs text-muted">
      <h2 className="text-[10px] uppercase tracking-[0.16em] text-cyan">Developer notes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-4">
        <li>
          Entity: <code className="text-white">Investigation</code> with steps Summary → Spike →
          Cause → Recommendation → Approval → Tracking.
        </li>
        <li>
          Props of note: <code className="text-white">spikeSeries</code>,{" "}
          <code className="text-white">causes[].evidence</code>,{" "}
          <code className="text-white">confidence</code>, <code className="text-white">auditTrail</code>,{" "}
          <code className="text-white">tracking</code>.
        </li>
        <li>
          States: loading (<code className="text-white">LoadingBlock</code>), empty (missing id),
          success (approve), locked tracking until status ≠ open.
        </li>
        <li>
          Current status: <code className="text-white">{inv.status as InvestigationStatus}</code> ·
          Persist via workspace for admins; clients keep an in-session trail.
        </li>
        <li>Motion: step transitions honor prefers-reduced-motion; approve uses aria-live.</li>
      </ul>
    </aside>
  );
}
