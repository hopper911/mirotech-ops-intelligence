"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import type { WorkspaceData } from "@/lib/ops";
import { useMemo, useRef, useState } from "react";

type TabId =
  | "company"
  | "kpis"
  | "expenses"
  | "ai"
  | "subscriptions"
  | "automation"
  | "recommendations"
  | "forecast"
  | "assistant"
  | "alerts"
  | "raw";

const TABS: { id: TabId; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "kpis", label: "KPIs" },
  { id: "expenses", label: "Expenses" },
  { id: "ai", label: "AI usage" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "automation", label: "Automation" },
  { id: "recommendations", label: "Recommendations" },
  { id: "forecast", label: "Forecast" },
  { id: "assistant", label: "Assistant" },
  { id: "alerts", label: "Alerts" },
  { id: "raw", label: "Raw JSON" },
];

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs">
      <span className="uppercase tracking-[0.12em] text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-navy/50 px-3 py-2 text-sm text-white outline-none focus:border-cyan/40";

export function DataStudioClient() {
  const { workspace, updateWorkspace, save, reset, exportJson, importJson, dirty, hydrated } =
    useWorkspace();
  const [tab, setTab] = useState<TabId>("company");
  const [message, setMessage] = useState<string | null>(null);
  const [raw, setRaw] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const rawSynced = useMemo(() => exportJson(), [exportJson]);

  function flash(msg: string) {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 2500);
  }

  function patch<K extends keyof WorkspaceData>(key: K, value: WorkspaceData[K]) {
    updateWorkspace((prev) => ({ ...prev, [key]: value }));
  }

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading workspace…</p>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Data Studio</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Customize sample data</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Admin only. Edit every dataset used by the demo. Changes save to this browser
            (localStorage) and do not affect client sessions. Reset restores Northline defaults.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="glass-app flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <button
          type="button"
          onClick={() => {
            save();
            flash("Saved to this browser.");
          }}
          className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy"
        >
          Save{dirty ? " *" : ""}
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all data to Northline defaults?")) {
              reset();
              flash("Reset to defaults.");
            }
          }}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white"
        >
          Reset defaults
        </button>
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([exportJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mirotech-workspace.json";
            a.click();
            URL.revokeObjectURL(url);
            flash("Exported JSON.");
          }}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn-ghost-glass rounded-full px-4 py-2 text-sm text-white"
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              importJson(await file.text());
              flash("Imported workspace.");
            } catch (err) {
              flash(err instanceof Error ? err.message : "Import failed");
            }
            e.target.value = "";
          }}
        />
        {dirty ? (
          <span className="text-xs text-cyan">Unsaved changes</span>
        ) : (
          <span className="text-xs text-muted">In sync with localStorage</span>
        )}
        {message ? <span className="text-xs text-green">{message}</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              if (t.id === "raw") setRaw(rawSynced);
            }}
            className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
              tab === t.id
                ? "bg-cyan/20 text-cyan"
                : "border border-white/10 text-muted hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-app rounded-2xl p-5">
        {tab === "company" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <input
                className={inputClass}
                value={workspace.company}
                onChange={(e) => patch("company", e.target.value)}
              />
            </Field>
            <Field label="Sample label">
              <input
                className={inputClass}
                value={workspace.sampleLabel}
                onChange={(e) => patch("sampleLabel", e.target.value)}
              />
            </Field>
            <Field label="Risk notes (one per line)">
              <textarea
                className={`${inputClass} min-h-28`}
                value={workspace.riskNotes.join("\n")}
                onChange={(e) =>
                  patch(
                    "riskNotes",
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>
            <Field label="Spend trend JSON">
              <textarea
                className={`${inputClass} min-h-28 font-mono text-xs`}
                value={JSON.stringify(workspace.spendTrend, null, 2)}
                onChange={(e) => {
                  try {
                    patch("spendTrend", JSON.parse(e.target.value));
                  } catch {
                    /* ignore while typing */
                  }
                }}
              />
            </Field>
          </div>
        ) : null}

        {tab === "kpis" ? (
          <CollectionEditor
            rows={workspace.kpis}
            onChange={(kpis) => patch("kpis", kpis)}
            onAdd={() =>
              patch("kpis", [
                ...workspace.kpis,
                {
                  id: newId("kpi"),
                  label: "New KPI",
                  value: "—",
                  delta: "0",
                  tone: "flat",
                  hint: "",
                },
              ])
            }
            render={(row, i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
                <Field label="Label">
                  <input className={inputClass} value={row.label} onChange={(e) => update({ ...row, label: e.target.value })} />
                </Field>
                <Field label="Value">
                  <input className={inputClass} value={row.value} onChange={(e) => update({ ...row, value: e.target.value })} />
                </Field>
                <Field label="Delta">
                  <input className={inputClass} value={row.delta} onChange={(e) => update({ ...row, delta: e.target.value })} />
                </Field>
                <Field label="Tone">
                  <select
                    className={inputClass}
                    value={row.tone}
                    onChange={(e) =>
                      update({ ...row, tone: e.target.value as typeof row.tone })
                    }
                  >
                    <option value="up">up</option>
                    <option value="down">down</option>
                    <option value="flat">flat</option>
                    <option value="risk">risk</option>
                  </select>
                </Field>
                <Field label="Hint">
                  <input className={inputClass} value={row.hint} onChange={(e) => update({ ...row, hint: e.target.value })} />
                </Field>
                <div className="flex items-end">
                  <button type="button" className="text-xs text-cyan" onClick={remove}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        ) : null}

        {tab === "expenses" ? (
          <CollectionEditor
            rows={workspace.vendors}
            onChange={(vendors) => patch("vendors", vendors)}
            onAdd={() =>
              patch("vendors", [
                ...workspace.vendors,
                {
                  id: newId("v"),
                  vendor: "New vendor",
                  category: "Software",
                  team: "Ops",
                  monthly: 1000,
                  budget: 1000,
                  trend: [{ label: "Jun", value: 1 }],
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
                <Field label="Vendor">
                  <input className={inputClass} value={row.vendor} onChange={(e) => update({ ...row, vendor: e.target.value })} />
                </Field>
                <Field label="Category">
                  <select
                    className={inputClass}
                    value={row.category}
                    onChange={(e) =>
                      update({ ...row, category: e.target.value as typeof row.category })
                    }
                  >
                    <option>Cloud</option>
                    <option>Software</option>
                    <option>AI</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Team">
                  <input className={inputClass} value={row.team} onChange={(e) => update({ ...row, team: e.target.value })} />
                </Field>
                <Field label="Monthly">
                  <input
                    type="number"
                    className={inputClass}
                    value={row.monthly}
                    onChange={(e) => update({ ...row, monthly: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Budget">
                  <input
                    type="number"
                    className={inputClass}
                    value={row.budget}
                    onChange={(e) => update({ ...row, budget: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Trend JSON">
                  <textarea
                    className={`${inputClass} min-h-16 font-mono text-xs`}
                    value={JSON.stringify(row.trend)}
                    onChange={(e) => {
                      try {
                        update({ ...row, trend: JSON.parse(e.target.value) });
                      } catch {
                        /* ignore */
                      }
                    }}
                  />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "ai" ? (
          <CollectionEditor
            rows={workspace.models}
            onChange={(models) => patch("models", models)}
            onAdd={() =>
              patch("models", [
                ...workspace.models,
                {
                  id: newId("m"),
                  model: "new-model",
                  provider: "OpenAI",
                  team: "Engineering",
                  tokensM: 10,
                  cost: 100,
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
                <Field label="Model">
                  <input className={inputClass} value={row.model} onChange={(e) => update({ ...row, model: e.target.value })} />
                </Field>
                <Field label="Provider">
                  <input className={inputClass} value={row.provider} onChange={(e) => update({ ...row, provider: e.target.value })} />
                </Field>
                <Field label="Team">
                  <input className={inputClass} value={row.team} onChange={(e) => update({ ...row, team: e.target.value })} />
                </Field>
                <Field label="Tokens (M)">
                  <input type="number" className={inputClass} value={row.tokensM} onChange={(e) => update({ ...row, tokensM: Number(e.target.value) })} />
                </Field>
                <Field label="Cost">
                  <input type="number" className={inputClass} value={row.cost} onChange={(e) => update({ ...row, cost: Number(e.target.value) })} />
                </Field>
                <Field label="Anomaly">
                  <input className={inputClass} value={row.anomaly ?? ""} onChange={(e) => update({ ...row, anomaly: e.target.value || undefined })} />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "subscriptions" ? (
          <CollectionEditor
            rows={workspace.subscriptions}
            onChange={(subscriptions) => patch("subscriptions", subscriptions)}
            onAdd={() =>
              patch("subscriptions", [
                ...workspace.subscriptions,
                {
                  id: newId("s"),
                  name: "New subscription",
                  owner: "Ops",
                  seats: 10,
                  used: 5,
                  renewsOn: "2026-12-01",
                  monthly: 500,
                  status: "active",
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
                <Field label="Name">
                  <input className={inputClass} value={row.name} onChange={(e) => update({ ...row, name: e.target.value })} />
                </Field>
                <Field label="Owner">
                  <input className={inputClass} value={row.owner} onChange={(e) => update({ ...row, owner: e.target.value })} />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={row.status} onChange={(e) => update({ ...row, status: e.target.value as typeof row.status })}>
                    <option value="active">active</option>
                    <option value="underused">underused</option>
                    <option value="unused">unused</option>
                    <option value="renewing">renewing</option>
                  </select>
                </Field>
                <Field label="Seats">
                  <input type="number" className={inputClass} value={row.seats} onChange={(e) => update({ ...row, seats: Number(e.target.value) })} />
                </Field>
                <Field label="Used">
                  <input type="number" className={inputClass} value={row.used} onChange={(e) => update({ ...row, used: Number(e.target.value) })} />
                </Field>
                <Field label="Monthly">
                  <input type="number" className={inputClass} value={row.monthly} onChange={(e) => update({ ...row, monthly: Number(e.target.value) })} />
                </Field>
                <Field label="Renews on">
                  <input className={inputClass} value={row.renewsOn} onChange={(e) => update({ ...row, renewsOn: e.target.value })} />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "automation" ? (
          <CollectionEditor
            rows={workspace.automation}
            onChange={(automation) => patch("automation", automation)}
            onAdd={() =>
              patch("automation", [
                ...workspace.automation,
                {
                  id: newId("a"),
                  name: "New job",
                  volume: 100,
                  failureRate: 0.01,
                  avgRuntimeSec: 30,
                  impact: "TBD",
                  status: "healthy",
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
                <Field label="Name">
                  <input className={inputClass} value={row.name} onChange={(e) => update({ ...row, name: e.target.value })} />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={row.status} onChange={(e) => update({ ...row, status: e.target.value as typeof row.status })}>
                    <option value="healthy">healthy</option>
                    <option value="degraded">degraded</option>
                    <option value="failing">failing</option>
                  </select>
                </Field>
                <Field label="Volume">
                  <input type="number" className={inputClass} value={row.volume} onChange={(e) => update({ ...row, volume: Number(e.target.value) })} />
                </Field>
                <Field label="Fail rate (0-1)">
                  <input type="number" step="0.01" className={inputClass} value={row.failureRate} onChange={(e) => update({ ...row, failureRate: Number(e.target.value) })} />
                </Field>
                <Field label="Avg runtime (s)">
                  <input type="number" className={inputClass} value={row.avgRuntimeSec} onChange={(e) => update({ ...row, avgRuntimeSec: Number(e.target.value) })} />
                </Field>
                <Field label="Impact">
                  <input className={inputClass} value={row.impact} onChange={(e) => update({ ...row, impact: e.target.value })} />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "recommendations" ? (
          <CollectionEditor
            rows={workspace.recommendations}
            onChange={(recommendations) => patch("recommendations", recommendations)}
            onAdd={() =>
              patch("recommendations", [
                ...workspace.recommendations,
                {
                  id: newId("rec"),
                  title: "New recommendation",
                  issue: "Describe the issue",
                  evidence: ["Evidence line"],
                  savingsMonthly: 1000,
                  risk: "low",
                  status: "open",
                  category: "Cloud",
                  owner: "Ops",
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="ID (used in URL)">
                    <input className={inputClass} value={row.id} onChange={(e) => update({ ...row, id: e.target.value })} />
                  </Field>
                  <Field label="Title">
                    <input className={inputClass} value={row.title} onChange={(e) => update({ ...row, title: e.target.value })} />
                  </Field>
                  <Field label="Category">
                    <input className={inputClass} value={row.category} onChange={(e) => update({ ...row, category: e.target.value })} />
                  </Field>
                  <Field label="Owner">
                    <input className={inputClass} value={row.owner} onChange={(e) => update({ ...row, owner: e.target.value })} />
                  </Field>
                  <Field label="Savings / mo">
                    <input type="number" className={inputClass} value={row.savingsMonthly} onChange={(e) => update({ ...row, savingsMonthly: Number(e.target.value) })} />
                  </Field>
                  <Field label="Risk">
                    <select className={inputClass} value={row.risk} onChange={(e) => update({ ...row, risk: e.target.value as typeof row.risk })}>
                      <option value="low">low</option>
                      <option value="medium">medium</option>
                      <option value="high">high</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select className={inputClass} value={row.status} onChange={(e) => update({ ...row, status: e.target.value as typeof row.status })}>
                      <option value="open">open</option>
                      <option value="approved">approved</option>
                      <option value="dismissed">dismissed</option>
                    </select>
                  </Field>
                </div>
                <Field label="Issue">
                  <textarea className={`${inputClass} min-h-16`} value={row.issue} onChange={(e) => update({ ...row, issue: e.target.value })} />
                </Field>
                <Field label="Evidence (one per line)">
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={row.evidence.join("\n")}
                    onChange={(e) =>
                      update({
                        ...row,
                        evidence: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "forecast" ? (
          <div className="space-y-4">
            <Field label="Confidence note">
              <textarea
                className={`${inputClass} min-h-20`}
                value={workspace.forecast.confidenceNote}
                onChange={(e) =>
                  patch("forecast", { ...workspace.forecast, confidenceNote: e.target.value })
                }
              />
            </Field>
            <Field label="Annual savings">
              <input
                type="number"
                className={inputClass}
                value={workspace.forecast.annualSavings}
                onChange={(e) =>
                  patch("forecast", {
                    ...workspace.forecast,
                    annualSavings: Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Assumptions (one per line)">
              <textarea
                className={`${inputClass} min-h-24`}
                value={workspace.forecast.assumptions.join("\n")}
                onChange={(e) =>
                  patch("forecast", {
                    ...workspace.forecast,
                    assumptions: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Forecast scenarios JSON (current + optimized)">
              <textarea
                className={`${inputClass} min-h-48 font-mono text-xs`}
                value={JSON.stringify(
                  { current: workspace.forecast.current, optimized: workspace.forecast.optimized },
                  null,
                  2,
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value) as {
                      current: WorkspaceData["forecast"]["current"];
                      optimized: WorkspaceData["forecast"]["optimized"];
                    };
                    patch("forecast", {
                      ...workspace.forecast,
                      current: parsed.current,
                      optimized: parsed.optimized,
                    });
                  } catch {
                    /* ignore while typing */
                  }
                }}
              />
            </Field>
          </div>
        ) : null}

        {tab === "assistant" ? (
          <Field label="Assistant presets JSON">
            <textarea
              className={`${inputClass} min-h-[28rem] font-mono text-xs`}
              value={JSON.stringify(workspace.assistantPresets, null, 2)}
              onChange={(e) => {
                try {
                  patch("assistantPresets", JSON.parse(e.target.value));
                } catch {
                  /* ignore */
                }
              }}
            />
          </Field>
        ) : null}

        {tab === "alerts" ? (
          <CollectionEditor
            rows={workspace.notifications}
            onChange={(notifications) => patch("notifications", notifications)}
            onAdd={() =>
              patch("notifications", [
                ...workspace.notifications,
                {
                  id: newId("n"),
                  title: "New alert",
                  body: "Details",
                  severity: "info",
                  createdAt: new Date().toISOString(),
                  href: "/app",
                },
              ])
            }
            render={(row, _i, update, remove) => (
              <div key={row.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-2">
                <Field label="Title">
                  <input className={inputClass} value={row.title} onChange={(e) => update({ ...row, title: e.target.value })} />
                </Field>
                <Field label="Severity">
                  <select className={inputClass} value={row.severity} onChange={(e) => update({ ...row, severity: e.target.value as typeof row.severity })}>
                    <option value="info">info</option>
                    <option value="watch">watch</option>
                    <option value="critical">critical</option>
                  </select>
                </Field>
                <Field label="Body">
                  <input className={inputClass} value={row.body} onChange={(e) => update({ ...row, body: e.target.value })} />
                </Field>
                <Field label="Href">
                  <input className={inputClass} value={row.href} onChange={(e) => update({ ...row, href: e.target.value })} />
                </Field>
                <Field label="Created at">
                  <input className={inputClass} value={row.createdAt} onChange={(e) => update({ ...row, createdAt: e.target.value })} />
                </Field>
                <button type="button" className="text-xs text-cyan" onClick={remove}>
                  Delete
                </button>
              </div>
            )}
          />
        ) : null}

        {tab === "raw" ? (
          <div className="space-y-3">
            <textarea
              className={`${inputClass} min-h-[32rem] font-mono text-xs`}
              value={raw || rawSynced}
              onChange={(e) => setRaw(e.target.value)}
            />
            <button
              type="button"
              className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy"
              onClick={() => {
                try {
                  importJson(raw || rawSynced);
                  flash("Imported from raw JSON.");
                } catch (err) {
                  flash(err instanceof Error ? err.message : "Invalid JSON");
                }
              }}
            >
              Apply raw JSON
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CollectionEditor<T>({
  rows,
  onChange,
  onAdd,
  render,
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  onAdd: () => void;
  render: (
    row: T,
    index: number,
    update: (next: T) => void,
    remove: () => void,
  ) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <button type="button" onClick={onAdd} className="btn-ghost-glass rounded-full px-3 py-1.5 text-xs text-white">
        Add row
      </button>
      {rows.map((row, index) =>
        render(
          row,
          index,
          (next) => {
            const copy = [...rows];
            copy[index] = next;
            onChange(copy);
          },
          () => onChange(rows.filter((_, i) => i !== index)),
        ),
      )}
    </div>
  );
}
