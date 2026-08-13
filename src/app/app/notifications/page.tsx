"use client";

import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import Link from "next/link";

export default function NotificationsPage() {
  const { workspace, hydrated } = useWorkspace();
  if (!hydrated) return <p className="text-sm text-muted">Loading workspace…</p>;
  const notes = workspace.notifications;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Reveal>
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="brand-sub text-[10px] text-cyan">Alerts</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Anomaly feed</h1>
            <p className="mt-2 text-sm text-muted">
              In-app list mirroring mobile anomaly notifications.
            </p>
          </div>
          <SampleDataBadge />
        </header>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mb-2 flex justify-center md:justify-start">
          <div className="w-64 rounded-[2rem] border-4 border-border bg-navy p-3 shadow-xl">
            <div className="rounded-2xl border border-cyan/30 bg-card p-3">
              <div className="text-[9px] uppercase tracking-[0.16em] text-cyan">Push mock</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {notes[0]?.title ?? "AI spend anomaly"}
              </div>
              <p className="mt-1 text-xs text-muted">{notes[0]?.body ?? "Sample alert"}</p>
            </div>
          </div>
        </div>
      </Reveal>

      <RevealStagger className="space-y-3" stagger={0.06}>
        {notes.map((n) => (
          <RevealItem key={n.id}>
            <Link href={n.href} className="glass-app glass-lift block rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                  {n.severity}
                </span>
                <span className="text-xs text-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 font-semibold text-white">{n.title}</div>
              <p className="mt-1 text-sm text-muted">{n.body}</p>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </div>
  );
}
