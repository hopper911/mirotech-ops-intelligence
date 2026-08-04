import { Logo } from "@/components/brand/Logo";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BRAND } from "@/lib/brand";

export default function OnePagerPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-3xl px-6 py-12 print:max-w-none print:px-0">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <p className="text-sm text-muted">Printable one-pager</p>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-white"
            // client-less: use native print via form isn't possible; use anchor trick
          >
            Use browser Print → Save PDF
          </button>
        </div>

        <article className="rounded-3xl border border-border bg-card/80 p-8 print:border-0 print:bg-white print:text-navy">
          <Logo variant="dark" size="md" href={undefined} />
          <h1 className="mt-6 text-2xl font-semibold print:text-navy">{BRAND.legalName}</h1>
          <p className="mt-2 text-sm text-muted print:text-navy/70">{BRAND.tagline}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="text-xs uppercase tracking-[0.14em] text-cyan print:text-blue">
                Problem
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted print:text-navy/80">
                Growing companies run cloud, SaaS, AI APIs, and automations without a single view of
                cost, utilization, or optimization.
              </p>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.14em] text-cyan print:text-blue">
                Solution
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted print:text-navy/80">
                One workspace for spend, subscriptions, AI usage, automation health, recommendations,
                and a defensible savings forecast.
              </p>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.14em] text-cyan print:text-blue">
                Audiences
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-muted print:text-navy/80">
                <li>• Founder / CFO</li>
                <li>• Operations manager</li>
                <li>• Technical lead</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.14em] text-cyan print:text-blue">
                Sample outcomes
              </h2>
              <ul className="mt-2 space-y-1 text-sm text-muted print:text-navy/80">
                <li>• $15.9k/mo identified savings</li>
                <li>• AI + cloud anomaly alerts</li>
                <li>• Renewal-ready seat reclaim</li>
              </ul>
            </section>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.14em] text-cyan print:text-blue">
            Sample concept · not a live commercial offer
          </p>
        </article>
      </main>
    </MarketingShell>
  );
}
