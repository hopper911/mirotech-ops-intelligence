import { Sparkline } from "@/components/app/Sparkline";
import { ModuleIcon } from "@/components/icons/ModuleIcon";
import { opsSource, type OpsModuleId } from "@/lib/ops";
import { notFound } from "next/navigation";

const MODULE_IDS: OpsModuleId[] = [
  "performance",
  "optimization",
  "connectivity",
  "systems",
  "insights",
];

export function generateStaticParams() {
  return MODULE_IDS.map((module) => ({ module }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: raw } = await params;
  if (!MODULE_IDS.includes(raw as OpsModuleId)) {
    notFound();
  }
  const id = raw as OpsModuleId;
  const mod = await opsSource.getModule(id);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header className="flex items-start gap-4">
        <div className="rounded-2xl border border-border bg-card p-3 text-cyan">
          <ModuleIcon id={id} className="h-7 w-7" />
        </div>
        <div>
          <p className="brand-sub text-[10px] text-cyan">Module</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{mod.title}</h1>
          <p className="mt-2 text-sm text-muted">{mod.description}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-green">
            {mod.status}
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card/80 p-6">
        <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
          Trend (mock)
        </h2>
        <Sparkline series={mod.series} className="mt-4 h-28 w-full" />
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
          {mod.series.map((p) => (
            <span key={p.label} className="rounded-full border border-border px-2 py-1">
              {p.label}: {p.value}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-6">
        <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
          Highlights
        </h2>
        <ul className="mt-4 space-y-3">
          {mod.highlights.map((line) => (
            <li key={line} className="flex gap-3 text-sm text-foreground/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
              {line}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
