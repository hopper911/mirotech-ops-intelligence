"use client";

import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { Sparkline } from "@/components/app/Sparkline";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { formatUsd } from "@/lib/format";
import { buildExecutive, FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import Link from "next/link";
import { useEffect, useState } from "react";

const PERSONA_KEY = "mirotech.persona";

type Persona = "cfo" | "ops" | "tech" | null;

function personaCopy(persona: Persona) {
  if (persona === "cfo") {
    return {
      lead: "Financial visibility first — defend the savings forecast and the AI spend spike.",
      highlightId: "savings",
    };
  }
  if (persona === "ops") {
    return {
      lead: "Ownership and renewals first — watch unused seats and the open investigation.",
      highlightId: "risk",
    };
  }
  if (persona === "tech") {
    return {
      lead: "API anomalies first — inspect the GPT-4o investigation and model routing recommendation.",
      highlightId: "spend",
    };
  }
  return {
    lead: "Spend, savings, risk, and operational health in one glance.",
    highlightId: null as string | null,
  };
}

export default function ExecutivePage() {
  const { workspace, hydrated } = useWorkspace();
  const [persona, setPersona] = useState<Persona>(null);

  useEffect(() => {
    const p = sessionStorage.getItem(PERSONA_KEY);
    if (p === "cfo" || p === "ops" || p === "tech") setPersona(p);
  }, []);

  if (!hydrated) return <p className="text-sm text-muted">Loading workspace…</p>;
  const dash = buildExecutive(workspace);
  const copy = personaCopy(persona);
  const featured = workspace.investigations?.find((i) => i.id === FEATURED_INVESTIGATION_ID);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Executive dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {dash.company}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{copy.lead}</p>
        </div>
        <SampleDataBadge />
      </header>

      {featured ? (
        <Link
          href={`/app/investigations/${featured.id}`}
          className="glass-app glass-lift block rounded-2xl border border-cyan/30 p-5"
        >
          <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">
            Open investigation · {featured.severity}
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">{featured.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{featured.summary}</p>
          <p className="mt-3 text-sm text-green">
            {formatUsd(featured.impactMonthly)}/mo · Continue workflow →
          </p>
        </Link>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dash.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className={`glass-app rounded-2xl p-4 ${
              copy.highlightId === kpi.id ? "ring-1 ring-green/50" : ""
            }`}
          >
            <div className="text-xs uppercase tracking-[0.14em] text-muted">{kpi.label}</div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div className="text-2xl font-semibold text-white">{kpi.value}</div>
              <div
                className={
                  kpi.tone === "up"
                    ? "text-sm text-green"
                    : kpi.tone === "risk"
                      ? "text-sm text-cyan"
                      : "text-sm text-muted"
                }
              >
                {kpi.delta}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-app rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
              Tech spend trend ($k)
            </h2>
            <span className="text-xs text-muted">6 months · sample</span>
          </div>
          <Sparkline series={dash.spendTrend} className="mt-4 h-28 w-full" fill />
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            {dash.spendTrend.map((p) => (
              <span key={p.label} className="rounded-full border border-border px-2 py-1">
                {p.label} {p.value}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-app rounded-2xl p-5">
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Risk notes</h2>
          <ul className="mt-4 space-y-3">
            {dash.riskNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm text-foreground/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
            Top recommendations
          </h2>
          <Link href="/app/forecast" className="text-sm text-green hover:underline">
            View forecast →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {dash.topRecommendations.map((rec) => (
            <Link
              key={rec.id}
              href={
                rec.id === "rec-ai-routing"
                  ? `/app/investigations/${FEATURED_INVESTIGATION_ID}`
                  : `/app/recommendations/${rec.id}`
              }
              className="glass-app glass-lift rounded-2xl p-5"
            >
              <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                {rec.category} · {rec.risk} risk
              </div>
              <h3 className="mt-2 font-semibold text-white">{rec.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{rec.issue}</p>
              <p className="mt-4 text-sm text-green">
                {formatUsd(rec.savingsMonthly)}/mo potential
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
