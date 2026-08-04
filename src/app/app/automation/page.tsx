import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { opsSource } from "@/lib/ops";

export default async function AutomationPage() {
  const jobs = await opsSource.getAutomation();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Automation health</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Workflows</h1>
          <p className="mt-2 text-sm text-muted">
            Failures, runtime, volume, and business impact.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <article key={job.id} className="glass-app rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-white">{job.name}</h2>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                  job.status === "healthy"
                    ? "border-green/40 text-green"
                    : job.status === "degraded"
                      ? "border-cyan/40 text-cyan"
                      : "border-red-400/40 text-red-300"
                }`}
              >
                {job.status}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Volume</dt>
                <dd className="mt-1 text-white">{job.volume}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Fail rate</dt>
                <dd className="mt-1 text-white">{(job.failureRate * 100).toFixed(0)}%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Avg runtime</dt>
                <dd className="mt-1 text-white">{job.avgRuntimeSec}s</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-muted">{job.impact}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
