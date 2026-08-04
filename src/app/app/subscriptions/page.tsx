import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { StatePanel } from "@/components/app/StatePanel";
import { formatUsd, utilizationPct } from "@/lib/format";
import { opsSource } from "@/lib/ops";

export default async function SubscriptionsPage() {
  const rows = await opsSource.getSubscriptions();
  const unused = rows.filter((r) => r.status === "unused");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand-sub text-[10px] text-cyan">Subscription inventory</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Ownership & renewals</h1>
          <p className="mt-2 text-sm text-muted">
            Utilization, renewals, and unused licenses.
          </p>
        </div>
        <SampleDataBadge />
      </header>

      {unused.length === 0 ? (
        <StatePanel
          variant="empty"
          title="No unused licenses"
          body="When seats go idle, they will appear here with reclaim actions."
        />
      ) : (
        <StatePanel
          variant="success"
          title={`${unused.length} unused subscription(s) flagged`}
          body="Sample reclaim opportunity ready for Ops review."
        />
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card/80">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Util %</th>
              <th className="px-4 py-3">Renews</th>
              <th className="px-4 py-3">Monthly</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-border/80">
                <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                <td className="px-4 py-3 text-muted">{s.owner}</td>
                <td className="px-4 py-3">
                  {s.used}/{s.seats}
                </td>
                <td className="px-4 py-3">{utilizationPct(s.used, s.seats)}%</td>
                <td className="px-4 py-3 text-muted">{s.renewsOn}</td>
                <td className="px-4 py-3">{formatUsd(s.monthly)}</td>
                <td className="px-4 py-3 capitalize text-cyan">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
