import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BRAND } from "@/lib/brand";

export default function EmailPreviewPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">Launch email</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">HTML preview</h1>
        <p className="mt-2 text-sm text-muted">Static mock of a product launch message.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white text-navy shadow-xl">
          <div className="bg-navy px-6 py-5 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-cyan">Mirotech</div>
            <div className="mt-1 text-lg font-semibold">Ops Intelligence is ready for your stack</div>
          </div>
          <div className="space-y-4 px-6 py-6 text-sm leading-relaxed">
            <p>Hi {"{{first_name}}"},</p>
            <p>
              Growing teams should not need five spreadsheets to answer “what are we spending, and
              what can we safely cut?”
            </p>
            <p>
              <strong>{BRAND.legalName}</strong> brings cloud, SaaS, AI API usage, and automation
              health into one workspace — with recommendations your CFO can defend.
            </p>
            <p>
              <a className="font-semibold text-blue underline" href="/login">
                Open the interactive demo
              </a>
            </p>
            <p className="text-xs text-[#5b6b82]">
              Sample launch email for portfolio use. Mirotech is a self-initiated product concept.
            </p>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
