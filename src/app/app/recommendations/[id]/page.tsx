import { RecommendationActions } from "@/components/app/RecommendationActions";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { formatUsd } from "@/lib/format";
import { opsSource } from "@/lib/ops";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const recs = await opsSource.getRecommendations();
  return recs.map((r) => ({ id: r.id }));
}

export default async function RecommendationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = await opsSource.getRecommendation(id);
  if (!rec) notFound();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/app" className="text-sm text-cyan hover:underline">
        ← Executive
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">
            Recommendation · {rec.category}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{rec.title}</h1>
          <p className="mt-3 text-sm text-muted">{rec.issue}</p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Savings / mo</div>
          <div className="mt-1 text-xl font-semibold text-green">
            {formatUsd(rec.savingsMonthly)}
          </div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Risk</div>
          <div className="mt-1 text-xl font-semibold capitalize text-white">{rec.risk}</div>
        </div>
        <div className="glass-app rounded-2xl p-4">
          <div className="text-xs text-muted">Owner</div>
          <div className="mt-1 text-xl font-semibold text-white">{rec.owner}</div>
        </div>
      </div>

      <section className="glass-app rounded-2xl p-5">
        <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Evidence</h2>
        <ul className="mt-4 space-y-3">
          {rec.evidence.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-foreground/90">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <RecommendationActions recommendation={rec} />
    </div>
  );
}
