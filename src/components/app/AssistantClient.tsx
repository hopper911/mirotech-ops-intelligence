"use client";

import { useMemo, useState } from "react";
import type { AssistantPreset, AssistantTurn } from "@/lib/ops";

export function AssistantClient({ presets }: { presets: AssistantPreset[] }) {
  const [turns, setTurns] = useState<AssistantTurn[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask about spend, renewals, AI anomalies, or savings. Answers cite sample sources from the Northline Commerce demo workspace.",
    },
  ]);
  const [pending, setPending] = useState(false);
  const map = useMemo(() => new Map(presets.map((p) => [p.question, p])), [presets]);

  function ask(question: string) {
    const preset = map.get(question) ?? presets[0];
    if (!preset) return;
    setPending(true);
    setTurns((t) => [...t, { id: `u-${Date.now()}`, role: "user", content: question }]);
    window.setTimeout(() => {
      setTurns((t) => [...t, { ...preset.answer, id: `${preset.answer.id}-${Date.now()}` }]);
      setPending(false);
    }, 500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
      <div className="rounded-2xl border border-border bg-card/80 p-4 sm:p-5">
        <div className="space-y-4">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`rounded-xl px-3 py-3 text-sm ${
                turn.role === "user"
                  ? "ml-8 bg-blue/20 text-white"
                  : "mr-8 border border-border bg-navy/40 text-foreground"
              }`}
            >
              <p>{turn.content}</p>
              {turn.sources?.length ? (
                <ul className="mt-3 space-y-1 border-t border-border pt-2 text-xs text-cyan">
                  {turn.sources.map((s) => (
                    <li key={s.id}>
                      Source · {s.label} ({s.kind})
                    </li>
                  ))}
                </ul>
              ) : null}
              {turn.nextSteps?.length ? (
                <ol className="mt-3 list-decimal space-y-1 pl-4 text-xs text-muted">
                  {turn.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              ) : null}
            </div>
          ))}
          {pending ? <p className="text-xs text-cyan">Thinking with sample sources…</p> : null}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.14em] text-muted">Try asking</div>
        <div className="mt-3 flex flex-col gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => ask(p.question)}
              className="rounded-xl border border-border bg-card/60 px-3 py-2 text-left text-xs text-white hover:border-cyan/40"
            >
              {p.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
