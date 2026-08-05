"use client";

import { FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PERSONA_KEY = "mirotech.persona";

const personas = [
  {
    id: "cfo" as const,
    title: "Founder / CFO",
    body: "Emphasize savings, forecast defensibility, and spend anomalies on the executive view.",
  },
  {
    id: "ops" as const,
    title: "Ops manager",
    body: "Emphasize renewals, ownership, and risk alerts tied to open investigations.",
  },
  {
    id: "tech" as const,
    title: "Technical lead",
    body: "Emphasize API usage, model routing, and the signature anomaly investigation.",
  },
];

const steps = [
  {
    title: "Choose your seat",
    body: "Pick a persona. This demo only changes emphasis — not permissions.",
    kind: "persona" as const,
  },
  {
    title: "Connect sources",
    body: "Link cloud billing, SaaS SSO, AI gateways, and automation run logs. This demo uses sample connectors.",
    kind: "copy" as const,
  },
  {
    title: "Open the investigation",
    body: "Walk spike → cause → recommendation → approval → tracking on the Support GPT-4o anomaly.",
    kind: "copy" as const,
  },
  {
    title: "Approve with an audit trail",
    body: "Assign ownership, approve or dismiss, and unlock savings tracking — sample actions stay local.",
    kind: "copy" as const,
  },
];

export function OnboardingClient() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [persona, setPersona] = useState<(typeof personas)[number]["id"] | null>(null);
  const step = steps[index];

  function finish(goInvestigation = false) {
    document.cookie = "mirotech_onboarded=1; path=/; max-age=31536000";
    if (persona) sessionStorage.setItem(PERSONA_KEY, persona);
    router.push(
      goInvestigation ? `/app/investigations/${FEATURED_INVESTIGATION_ID}` : "/app",
    );
    router.refresh();
  }

  return (
    <div className="glass-strong mx-auto max-w-xl rounded-3xl p-8">
      <div className="text-xs uppercase tracking-[0.16em] text-cyan">
        Onboarding · {index + 1}/{steps.length}
      </div>
      <h1 className="mt-3 text-2xl font-semibold text-white">{step.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>

      {step.kind === "persona" ? (
        <div className="mt-6 grid gap-2" role="radiogroup" aria-label="Persona">
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={persona === p.id}
              onClick={() => setPersona(p.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                persona === p.id
                  ? "border-green/50 bg-green/10"
                  : "border-border hover:border-white/20"
              }`}
            >
              <div className="text-sm font-semibold text-white">{p.title}</div>
              <p className="mt-1 text-xs text-muted">{p.body}</p>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {index < steps.length - 1 ? (
          <button
            type="button"
            disabled={step.kind === "persona" && !persona}
            onClick={() => setIndex((i) => i + 1)}
            className="btn-specular rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-navy disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => finish(true)}
              className="btn-specular rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-navy"
            >
              Open investigation
            </button>
            <button
              type="button"
              onClick={() => finish(false)}
              className="btn-ghost-glass rounded-full px-5 py-2.5 text-sm text-white"
            >
              Enter dashboard
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => finish(false)}
          className="btn-ghost-glass rounded-full px-5 py-2.5 text-sm text-muted hover:text-white"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
