import { SignalDots } from "@/components/brand/SignalDots";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
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
      <main className="relative mx-auto w-full max-w-6xl overflow-hidden px-6 py-12">
        <SignalDots variant="corner" className="absolute -right-6 -top-4 h-52 w-52 opacity-80" />

        <Reveal>
          <p className="brand-sub text-[11px] text-cyan">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Simple plans for ops clarity</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Sample pricing for portfolio demonstration only — not a live offer.
          </p>
        </Reveal>

        <RevealStagger className="relative mt-10 grid gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <RevealItem key={t.name}>
              <GlassCard
                as="article"
                lift
                variant={t.featured ? "strong" : "default"}
                className={`h-full rounded-3xl p-6 ${t.featured ? "ring-1 ring-green/40" : ""}`}
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
                    t.featured
                      ? "btn-specular bg-green text-navy"
                      : "btn-ghost-glass text-white"
                  }`}
                >
                  {t.cta}
                </Link>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealStagger>
      </main>
    </MarketingShell>
  );
}
