import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

export default function ConceptPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">Case study · credibility</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Self-initiated product concept</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Mirotech Ops Intelligence is a portfolio flagship: a realistic B2B SaaS brand and product
          experience designed to show end-to-end craft — strategy, product UX, web design, technical
          communication, marketing, and sales enablement.
        </p>

        <section className="mt-10 space-y-6 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="text-base font-semibold text-white">Core business problem</h2>
            <p className="mt-2">
              Growing businesses use dozens of technology services but lack one clear view of cost,
              utilization, automation health, and optimization opportunities.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Approach</h2>
            <p className="mt-2">
              Brand system first (logo, palette, type, viz), then an interactive product shell with
              eight flagship screens, onboarding, anomaly alerts, and a sales kit. All figures use
              the fictional company <strong className="text-white">Northline Commerce</strong> and
              are labeled as sample data.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Outcome</h2>
            <p className="mt-2">
              One complete B2B SaaS project that hiring managers can click through — not slideware
              alone. Explore the{" "}
              <Link href="/login" className="text-cyan hover:underline">
                live demo
              </Link>
              ,{" "}
              <Link href="/sales" className="text-cyan hover:underline">
                sales kit
              </Link>
              , and{" "}
              <Link href="/brand" className="text-cyan hover:underline">
                brand guidelines
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
