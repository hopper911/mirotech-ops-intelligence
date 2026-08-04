import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BRAND } from "@/lib/brand";
import Link from "next/link";

const audiences = [
  {
    title: "Founder or CFO",
    body: "Financial visibility and a defensible savings forecast across cloud, SaaS, and AI spend.",
  },
  {
    title: "Operations manager",
    body: "Subscription ownership, renewals, unused licenses, and workflow health in one inventory.",
  },
  {
    title: "Technical lead",
    body: "API usage, anomalies, and actionable optimization recommendations with evidence.",
  },
];

const modules = [
  "Executive dashboard",
  "Cloud + software expenses",
  "AI API usage",
  "Subscription inventory",
  "Automation health",
  "Recommendations",
  "Savings forecast",
  "AI assistant",
];

export default function HomePage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 lg:pt-16">
        <section className="max-w-3xl">
          <p className="brand-sub text-[11px] text-cyan">B2B SaaS · Ops Intelligence</p>
          <h1 className="brand-display mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Mirotech
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {BRAND.taglineParts.before}
            <span className="font-semibold text-green">{BRAND.taglineParts.emphasis}</span>
            {BRAND.taglineParts.after}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Growing companies run dozens of technology services but lack one clear view of cost,
            utilization, automation health, and optimization opportunities. Mirotech unifies cloud,
            software subscriptions, AI API usage, and automation performance in a single workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-navy"
            >
              Enter the demo
            </Link>
            <Link
              href="/product"
              className="rounded-full border border-border px-6 py-3 text-sm text-white hover:border-cyan/50"
            >
              Explore product
            </Link>
          </div>
          <p className="mt-4 text-xs text-cyan">
            Sample concept · Northline Commerce workspace · not live billing data
          </p>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <article key={a.title} className="rounded-2xl border border-border bg-card/60 p-5">
              <h2 className="text-sm font-semibold text-white">{a.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-sm uppercase tracking-[0.16em] text-muted">Flagship screens</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
              <div
                key={m}
                className="rounded-xl border border-border bg-card/40 px-4 py-3 text-sm text-white"
              >
                {m}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-border bg-card/50 p-8">
          <h2 className="text-xl font-semibold text-white">Portfolio case study ready</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            This site demonstrates brand strategy, product UX, marketing pages, and sales
            enablement for a self-initiated B2B SaaS concept.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/concept" className="text-sm text-green hover:underline">
              Read the concept →
            </Link>
            <Link href="/sales" className="text-sm text-cyan hover:underline">
              Open sales kit →
            </Link>
            <Link href="/pricing" className="text-sm text-cyan hover:underline">
              View pricing →
            </Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
