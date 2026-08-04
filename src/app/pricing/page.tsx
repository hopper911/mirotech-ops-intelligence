import { MarketingShell } from "@/components/marketing/MarketingShell";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$499",
    period: "/mo",
    blurb: "Up to 3 connected sources · 2 seats · executive + expenses",
    cta: "Start demo",
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "/mo",
    blurb: "Unlimited SaaS inventory · AI usage · automation · recommendations",
    cta: "Most popular",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    blurb: "Multi-entity · SSO · forecast packs · dedicated success",
    cta: "Talk to sales",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <p className="brand-sub text-[11px] text-cyan">Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Simple plans for ops clarity</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Sample pricing for portfolio demonstration only — not a live offer.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={`rounded-3xl border p-6 ${
                t.featured
                  ? "border-green/50 bg-card/80"
                  : "border-border bg-card/50"
              }`}
            >
              <h2 className="text-lg font-semibold text-white">{t.name}</h2>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-semibold text-white">{t.price}</span>
                <span className="pb-1 text-sm text-muted">{t.period}</span>
              </div>
              <p className="mt-4 text-sm text-muted">{t.blurb}</p>
              <Link
                href="/login"
                className={`mt-6 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  t.featured ? "bg-green text-navy" : "border border-border text-white"
                }`}
              >
                {t.cta}
              </Link>
            </article>
          ))}
        </div>
      </main>
    </MarketingShell>
  );
}
