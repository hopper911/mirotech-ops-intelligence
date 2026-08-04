"use client";

import {
  IconConnectivity,
  IconInsights,
  IconOptimization,
  IconPerformance,
  IconSystems,
} from "@/components/brand/BrandIcons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

const nav: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { href: "/app", label: "Executive", Icon: IconPerformance },
  { href: "/app/expenses", label: "Expenses", Icon: IconOptimization },
  { href: "/app/ai-usage", label: "AI usage", Icon: IconInsights },
  { href: "/app/subscriptions", label: "Subscriptions", Icon: IconSystems },
  { href: "/app/automation", label: "Automation", Icon: IconConnectivity },
  { href: "/app/forecast", label: "Forecast", Icon: IconPerformance },
  { href: "/app/assistant", label: "Assistant", Icon: IconInsights },
  { href: "/app/notifications", label: "Alerts", Icon: IconConnectivity },
  { href: "/app/onboarding", label: "Onboarding", Icon: IconSystems },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="App modules">
      {nav.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-blue/20 text-white"
                : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.Icon className={`h-4 w-4 shrink-0 ${active ? "text-cyan" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
