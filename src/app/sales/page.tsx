import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

const items = [
  { href: "/sales/one-pager", title: "Sales one-pager", body: "Printable overview for outbound and discovery." },
  { href: "/sales/deck", title: "10-slide sales deck", body: "Interactive presentation for demos and reviews." },
  { href: "/sales/brief", title: "Solution brief", body: "Problem, approach, outcomes for stakeholders." },
  { href: "/sales/email", title: "Launch email", body: "HTML preview of a product launch message." },
  { href: "/sales/ads", title: "LinkedIn ads", body: "Three ad mocks plus a four-side carousel with optional images." },
];

export default function SalesHubPage() {
  return (
    <MarketingShell>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <Reveal>
          <p className="brand-sub text-[11px] text-cyan">Sales enablement</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Sales kit</h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Portfolio sales assets for Mirotech Ops Intelligence. Sample messaging only.
          </p>
        </Reveal>
        <RevealStagger className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <RevealItem key={item.href}>
              <Link href={item.href} className="block h-full">
                <GlassCard lift className="h-full p-5">
                  <h2 className="font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </GlassCard>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </main>
    </MarketingShell>
  );
}
