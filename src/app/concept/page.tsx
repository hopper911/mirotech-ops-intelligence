import { SignalDots } from "@/components/brand/SignalDots";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { FEATURED_INVESTIGATION_ID } from "@/lib/ops";
import Link from "next/link";

const journey = [
  {
    title: "Executive summary",
    body: "Surface the important change — an AI spend spike — without a wall of charts.",
  },
  {
    title: "Cost spike",
    body: "Show when and where the anomaly began with a dense daily series and table.",
  },
  {
    title: "Probable cause",
    body: "Connect evidence to the Support summarizer and GPT-4o default routing.",
  },
  {
    title: "Recommendation",
    body: "Explain action, risk, confidence, and estimated monthly impact.",
  },
  {
    title: "Approval",
    body: "Assign ownership and preserve an auditable decision trail.",
  },
  {
    title: "Tracking",
    body: "Show whether the change produced expected savings after approval.",
  },
];

export default function ConceptPage() {
  const prototypeHref = `/login?callbackUrl=${encodeURIComponent(
    `/app/investigations/${FEATURED_INVESTIGATION_ID}`,
  )}`;

  return (
    <MarketingShell>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-12">
        <div className="mb-8 flex justify-center">
          <SignalDots variant="orbit" className="h-40 w-40" />
        </div>

        <Reveal>
          <p className="brand-sub text-[11px] text-cyan">Case study · Moment design challenge</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            One investigation workflow for ops clarity
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            <strong className="text-white">Problem in one sentence:</strong> Small and midsize
            companies cannot easily understand spending and performance across cloud, subscriptions,
            AI APIs, and automated workflows — so anomalies become end-of-month surprises.
          </p>
        </Reveal>

        <Reveal className="mt-8" delay={0.08}>
          <GlassCard variant="strong" className="space-y-4 p-6 text-sm leading-relaxed text-muted">
            <div>
              <h2 className="text-base font-semibold text-white">Users & context</h2>
              <p className="mt-2">
                Founder/CFO, Ops manager, and Technical lead at a fictional company (Northline
                Commerce). Sample data only — portfolio concept, not a billed SaaS.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Role</h2>
              <p className="mt-2">
                Self-initiated product design + front-end build by Kiril Mironyuk: brand system,
                investigation IA, and clickable Next.js prototype.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Research & limitations</h2>
              <p className="mt-2">
                Competitive teardown of FinOps / SaaS spend tools and informal interviews with ops
                practitioners. No production customer dataset; all figures are labeled sample data.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Opportunity</h2>
              <p className="mt-2">
                Narrow to one excellent path — alert → spike → cause → recommendation → approval →
                tracking — instead of a decorative dashboard or ad campaign.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Success criteria</h2>
              <p className="mt-2">
                A reviewer can complete the investigation in under two minutes, understand the
                business value in 30 seconds, and see empty/loading/success states, audit trail, and
                developer notes on the prototype.
              </p>
            </div>
          </GlassCard>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Primary journey</h2>
          <ol className="mt-4 space-y-3">
            {journey.map((j, i) => (
              <li key={j.title} className="glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">Step {i + 1}</div>
                <h3 className="mt-1 font-semibold text-white">{j.title}</h3>
                <p className="mt-1 text-sm text-muted">{j.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-10" delay={0.12}>
          <GlassCard className="p-6">
            <h2 className="text-base font-semibold text-white">Visual system</h2>
            <p className="mt-2 text-sm text-muted">
              Navy base, cyan signal, green savings. Glass surfaces for density without clutter.
              Pulsing signal nodes carry continuity across marketing and product without repeating
              one layout.
            </p>
          </GlassCard>
        </Reveal>

        <Reveal className="mt-8" delay={0.14}>
          <div className="flex flex-wrap gap-3">
            <Link
              href={prototypeHref}
              className="btn-specular rounded-full bg-green px-6 py-3 text-sm font-semibold text-navy"
            >
              Open investigation prototype
            </Link>
            <Link
              href="/product"
              className="btn-ghost-glass rounded-full px-6 py-3 text-sm text-white"
            >
              Product overview
            </Link>
          </div>
          <p className="mt-3 text-xs text-cyan">
            Demo login: demo@mirotech.io / ops-demo · Sample data labeled throughout
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.16}>
          <GlassCard variant="strong" className="space-y-3 p-6 text-sm text-muted">
            <h2 className="text-base font-semibold text-white">Reflection & next steps</h2>
            <p>
              Depth on one workflow beats a wide marketing kit. Next: live connectors, shared audit
              storage, and stronger chart accessibility (data tables already accompany the spike
              sparkline).
            </p>
          </GlassCard>
        </Reveal>
      </main>
    </MarketingShell>
  );
}
