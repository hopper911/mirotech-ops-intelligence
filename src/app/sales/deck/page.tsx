"use client";

import { MarketingShell } from "@/components/marketing/MarketingShell";
import { useState } from "react";

const slides = [
  { title: "Mirotech Ops Intelligence", body: "See what your operations are really telling you." },
  { title: "The problem", body: "Dozens of tech services. No single view of cost, utilization, or automation health." },
  { title: "Who feels it", body: "Founders/CFOs, Ops managers, and technical leads each lack defensible signal." },
  { title: "The workspace", body: "Cloud, SaaS, AI APIs, expenses, and automation — unified." },
  { title: "Executive clarity", body: "Spend, savings, risk, and health on one dashboard." },
  { title: "Recommendations", body: "Evidence-backed actions with savings estimates and risk." },
  { title: "Forecast", body: "Current vs optimized path with confidence notes." },
  { title: "Assistant", body: "Plain-language questions with sourced answers." },
  { title: "Sample impact", body: "Northline Commerce: ~$191k annual savings opportunity (sample)." },
  { title: "Next step", body: "Open the interactive demo and walk an approval together." },
];

export default function DeckPage() {
  const [i, setI] = useState(0);
  const slide = slides[i];

  return (
    <MarketingShell>
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="brand-sub text-[11px] text-cyan">Sales deck</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">10-slide presentation</h1>
          </div>
          <p className="text-sm text-muted">
            {i + 1} / {slides.length}
          </p>
        </div>

        <div className="glass-strong flex min-h-[22rem] flex-col justify-center rounded-3xl p-10">
          <h2 className="text-3xl font-semibold text-white">{slide.title}</h2>
          <p className="mt-4 max-w-xl text-lg text-muted">{slide.body}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={i === 0}
            onClick={() => setI((x) => Math.max(0, x - 1))}
            className="btn-ghost-glass rounded-full px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={i === slides.length - 1}
            onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))}
            className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </MarketingShell>
  );
}
