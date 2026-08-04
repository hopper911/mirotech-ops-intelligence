import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const screens = [
  {
    title: "Executive dashboard",
    body: "Spend, savings, risk, and operational health at a glance for leadership.",
    href: "/app",
  },
  {
    title: "Cloud + software expenses",
    body: "Cost trends by vendor, team ownership, and budget variance.",
    href: "/app/expenses",
  },
  {
    title: "AI API usage",
    body: "Model costs, team attribution, and anomaly detection.",
    href: "/app/ai-usage",
  },
  {
    title: "Subscription inventory",
    body: "Ownership, utilization, renewals, and unused licenses.",
    href: "/app/subscriptions",
  },
  {
    title: "Automation health",
    body: "Failures, runtime, volume, and business impact.",
    href: "/app/automation",
  },
  {
    title: "Recommendation detail",
    body: "Issue, evidence, savings estimate, risk, and approval.",
    href: "/app/recommendations/rec-aws-rightsizing",
  },
  {
    title: "Savings forecast",
    body: "Current versus optimized spend with confidence notes.",
    href: "/app/forecast",
  },
  {
    title: "AI assistant",
    body: "Plain-language questions with sourced answers and next steps.",
    href: "/app/assistant",
  },
];

export default function ProductPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">Product</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">One workspace for tech ops signal</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Mirotech Ops Intelligence helps growing companies monitor cloud services, software
          subscriptions, AI API usage, operational expenses, and automation performance — with
          recommendations that finance and engineering can defend.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-navy"
        >
          Open interactive demo
        </Link>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {screens.map((s) => (
            <article key={s.title} className="rounded-2xl border border-border bg-card/60 p-5">
              <h2 className="font-semibold text-white">{s.title}</h2>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
              <p className="mt-3 text-xs text-cyan">Demo path: {s.href} (sign in required)</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-white">Onboarding & states</h2>
          <p className="mt-2 text-sm text-muted">
            The demo includes a guided onboarding flow, empty/loading/error/success panels,
            recommendation approve/dismiss, and a mobile-style anomaly notification toast.
          </p>
          <Link href="/app/onboarding" className="mt-3 inline-block text-sm text-green hover:underline">
            Preview onboarding (after sign-in) →
          </Link>
        </section>
      </main>
    </MarketingShell>
  );
}
