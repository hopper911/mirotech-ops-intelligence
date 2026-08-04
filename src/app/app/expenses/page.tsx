import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { Sparkline } from "@/components/app/Sparkline";
import { formatUsd } from "@/lib/format";
import { opsSource } from "@/lib/ops";

export default async function ExpensesPage() {
  const { vendors, monthlyTotal, budgetTotal } = await opsSource.getExpenses();
  const variance = monthlyTotal - budgetTotal;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Cloud + software</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Expenses</h1>
          <p className="mt-2 text-sm text-muted">
            Cost trends, vendors, teams, and budget variance.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="text-xs text-muted">Monthly total</div>
          <div className="mt-1 text-2xl font-semibold text-white">{formatUsd(monthlyTotal)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="text-xs text-muted">Budget</div>
          <div className="mt-1 text-2xl font-semibold text-white">{formatUsd(budgetTotal)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="text-xs text-muted">Variance</div>
          <div className={`mt-1 text-2xl font-semibold ${variance > 0 ? "text-cyan" : "text-green"}`}>
            {variance > 0 ? "+" : ""}
            {formatUsd(variance)}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card/80">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Monthly</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border-t border-border/80">
                <td className="px-4 py-3 font-medium text-white">{v.vendor}</td>
                <td className="px-4 py-3 text-muted">{v.category}</td>
                <td className="px-4 py-3 text-muted">{v.team}</td>
                <td className="px-4 py-3">{formatUsd(v.monthly)}</td>
                <td className="px-4 py-3 text-muted">{formatUsd(v.budget)}</td>
                <td className="px-4 py-3 w-36">
                  <Sparkline series={v.trend} className="h-8 w-28" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
