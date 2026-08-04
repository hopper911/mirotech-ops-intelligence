import { MarketingShell } from "@/components/marketing/MarketingShell";

const carousel = [
  "Cloud + SaaS + AI in one ops view",
  "Catch spend anomalies before month-end",
  "Reclaim unused seats before renewal",
  "Forecast savings your CFO can defend",
];

export default function AdsPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">LinkedIn ads</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Static ad mocks</h1>
        <p className="mt-2 text-sm text-muted">Portfolio frames only — not live campaigns.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card/70 p-5">
            <div className="text-xs text-muted">Single image ad</div>
            <div className="mt-3 rounded-xl border border-border bg-navy p-6">
              <div className="brand-display text-sm text-white">Mirotech</div>
              <p className="mt-3 text-lg font-semibold text-white">
                See what your operations are{" "}
                <span className="text-green">really</span> telling you.
              </p>
              <p className="mt-3 text-xs text-muted">
                Monitor cloud, SaaS, AI APIs, and automation in one workspace.
              </p>
              <div className="mt-5 inline-flex rounded-full bg-green px-3 py-1 text-xs font-semibold text-navy">
                Book a demo
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card/70 p-5">
            <div className="text-xs text-muted">Carousel · 4 frames</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {carousel.map((line, idx) => (
                <div key={line} className="rounded-xl border border-border bg-navy p-4">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-cyan">
                    Frame {idx + 1}
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{line}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-64 rounded-[2rem] border-4 border-border bg-navy p-3">
            <div className="rounded-2xl border border-cyan/40 bg-card p-4">
              <div className="text-[9px] uppercase tracking-[0.16em] text-cyan">Event banner</div>
              <p className="mt-2 text-sm font-semibold text-white">
                Webinar: Cutting AI + cloud waste without slowing delivery
              </p>
              <p className="mt-2 text-xs text-muted">Sample banner mock</p>
            </div>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
