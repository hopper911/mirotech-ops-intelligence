import Link from "next/link";
import type { OpsInsight } from "@/lib/ops";
import { ModuleIcon } from "@/components/icons/ModuleIcon";

const severityStyles = {
  info: "border-cyan/30 text-cyan",
  watch: "border-blue/40 text-blue",
  action: "border-green/40 text-green",
} as const;

export function InsightCard({ insight }: { insight: OpsInsight }) {
  return (
    <article className="rounded-2xl border border-border bg-card/80 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-cyan">
          <ModuleIcon id={insight.module} className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
            {insight.module}
          </span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${severityStyles[insight.severity]}`}
        >
          {insight.severity}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">
        {insight.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{insight.summary}</p>
      <Link
        href={`/app/${insight.module}`}
        className="mt-4 inline-flex text-sm font-medium text-green hover:underline"
      >
        Open module →
      </Link>
    </article>
  );
}
