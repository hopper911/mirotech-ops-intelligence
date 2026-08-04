import { Logo } from "@/components/brand/Logo";
import { ModuleIcon } from "@/components/icons/ModuleIcon";
import { BRAND } from "@/lib/brand";
import type { OpsModuleId } from "@/lib/ops";
import Link from "next/link";

const modules: { id: OpsModuleId; blurb: string }[] = [
  { id: "performance", blurb: "Throughput and delivery health" },
  { id: "optimization", blurb: "Capacity, cost, and waste signal" },
  { id: "connectivity", blurb: "Integrations and sync freshness" },
  { id: "systems", blurb: "Runtime posture for critical platforms" },
  { id: "insights", blurb: "Narratives distilled from telemetry" },
];

export default function LandingPage() {
  return (
    <div className="theme-app grid-atmosphere flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo variant="light" size="md" />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm text-muted hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy transition hover:brightness-110"
          >
            Open app
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-10 lg:pt-16">
        <section className="max-w-3xl">
          <p className="brand-sub text-[11px] text-cyan">Ops Intelligence</p>
          <h1 className="brand-display mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Mirotech
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {BRAND.taglineParts.before}
            <span className="font-semibold text-green">
              {BRAND.taglineParts.emphasis}
            </span>
            {BRAND.taglineParts.after}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-navy transition hover:brightness-110"
            >
              Enter the dashboard
            </Link>
            <a
              href="#modules"
              className="rounded-full border border-border px-6 py-3 text-sm text-white hover:border-cyan/50"
            >
              Explore modules
            </a>
          </div>
        </section>

        <section
          id="modules"
          className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {modules.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur"
            >
              <div className="text-cyan">
                <ModuleIcon id={m.id} className="h-6 w-6" />
              </div>
              <h2 className="mt-3 text-sm font-semibold capitalize text-white">
                {m.id}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{m.blurb}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {BRAND.legalName}
      </footer>
    </div>
  );
}
