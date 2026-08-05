import { Logo } from "@/components/brand/Logo";
import { SignalDots } from "@/components/brand/SignalDots";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BRAND } from "@/lib/brand";
import Image from "next/image";

const viz = [
  { name: "Primary series", hex: BRAND.colors.cyan },
  { name: "Positive / savings", hex: BRAND.colors.green },
  { name: "Action / link", hex: BRAND.colors.blue },
  { name: "Axis / muted", hex: "#8FA0B8" },
  { name: "Risk callout", hex: "#F87171" },
];

export default function BrandGuidelinesPage() {
  return (
    <MarketingShell>
      <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
        <SignalDots
          variant="trail"
          className="absolute bottom-8 right-4 hidden h-36 w-36 opacity-70 lg:block"
        />

        <p className="brand-sub text-[11px] text-cyan">Brand system</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Compact guidelines</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Primary mark, palette, type, spacing, and data-visualization direction for Mirotech Ops
          Intelligence.
        </p>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Logo</h2>
            <div className="mt-6 space-y-6">
              <div className="rounded-xl bg-surface p-6">
                <Logo variant="dark" size="lg" href={undefined} />
              </div>
              <div className="rounded-xl bg-navy p-6">
                <Logo variant="light" size="lg" href={undefined} />
              </div>
              <Image
                src="/brand/app-icon.svg"
                alt="App icon"
                width={72}
                height={72}
                className="rounded-2xl"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Color</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(BRAND.colors).map(([name, hex]) => (
                <div key={name} className="overflow-hidden rounded-xl border border-border">
                  <div className="h-16" style={{ background: hex }} />
                  <div className="px-3 py-2 text-xs">
                    <div className="capitalize text-white">{name}</div>
                    <div className="font-mono text-muted">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Typography</h2>
            <p className="brand-display mt-4 text-2xl text-white">Manrope · display</p>
            <p className="mt-2 text-base text-muted">Geist Sans · UI body and tables</p>
            <p className="mt-4 text-sm text-muted">
              Spacing rhythm: 4 / 8 / 12 / 16 / 24 / 32. Cards use 16–20px padding; section gaps 24–32.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm uppercase tracking-[0.14em] text-muted">
              Data visualization
            </h2>
            <ul className="mt-4 space-y-2">
              {viz.map((v) => (
                <li key={v.name} className="flex items-center gap-3 text-sm">
                  <span className="h-3 w-8 rounded-full" style={{ background: v.hex }} />
                  <span className="text-white">{v.name}</span>
                  <span className="font-mono text-xs text-muted">{v.hex}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 glass rounded-2xl p-6">
          <h2 className="text-sm uppercase tracking-[0.14em] text-muted">Full kit reference</h2>
          <p className="mt-2 text-sm text-muted">
            Source brand board (icons, photography direction, variants):
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <Image
              src="/brand/brand-kit.png"
              alt="Mirotech brand kit"
              width={1600}
              height={900}
              className="h-auto w-full"
            />
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
