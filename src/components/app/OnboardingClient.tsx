"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = [
  {
    title: "Connect sources",
    body: "Link cloud billing, SaaS SSO, AI gateways, and automation run logs. This demo uses sample connectors.",
  },
  {
    title: "Invite roles",
    body: "Founder/CFO, Ops, and Technical Lead each get a tailored view of spend, renewals, and anomalies.",
  },
  {
    title: "Review first insight",
    body: "Mirotech surfaces rightsizing, unused seats, and AI routing recommendations with savings estimates.",
  },
  {
    title: "Approve a recommendation",
    body: "Walk an approval with evidence, risk, and forecast impact — demo actions stay local.",
  },
];

export function OnboardingClient() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const step = steps[index];

  function finish() {
    document.cookie = "mirotech_onboarded=1; path=/; max-age=31536000";
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card/80 p-8">
      <div className="text-xs uppercase tracking-[0.16em] text-cyan">
        Onboarding · {index + 1}/{steps.length}
      </div>
      <h1 className="mt-3 text-2xl font-semibold text-white">{step.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {index < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-navy"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-navy"
          >
            Enter dashboard
          </button>
        )}
        <button
          type="button"
          onClick={finish}
          className="rounded-full border border-border px-5 py-2.5 text-sm text-muted hover:text-white"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
