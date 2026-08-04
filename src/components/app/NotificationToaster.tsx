"use client";

import { useWorkspace } from "@/components/ops/WorkspaceProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

type Toast = { id: string; title: string; body: string; href?: string };

export function NotificationToaster() {
  const { workspace, hydrated } = useWorkspace();
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const key = "mirotech-anomaly-toast";
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const note = workspace.notifications[0];
    const t = window.setTimeout(() => {
      setToast({
        id: note?.id ?? "toast-ai",
        title: note?.title ?? "AI spend anomaly",
        body: note?.body ?? "Sample alert",
        href: note?.href ?? "/app/ai-usage",
      });
    }, 1200);
    return () => window.clearTimeout(t);
  }, [hydrated, workspace.notifications]);

  if (!toast) return null;

  return (
    <div className="glass-strong fixed bottom-4 right-4 z-50 w-[min(100%,22rem)] rounded-2xl border border-cyan/30 p-4 shadow-2xl shadow-cyan/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-cyan">
            Mobile-style alert
          </div>
          <div className="mt-1 text-sm font-semibold text-white">{toast.title}</div>
          <p className="mt-1 text-xs text-muted">{toast.body}</p>
          {toast.href ? (
            <Link href={toast.href} className="mt-2 inline-block text-xs text-green hover:underline">
              Review →
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          className="text-muted hover:text-white"
          onClick={() => setToast(null)}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
