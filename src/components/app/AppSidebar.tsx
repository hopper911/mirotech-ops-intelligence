"use client";

import {
  IconConnectivity,
  IconInsights,
  IconOptimization,
  IconPerformance,
  IconSystems,
} from "@/components/brand/BrandIcons";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

const nav: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}[] = [
  { href: "/app", label: "Executive", Icon: IconPerformance },
  { href: "/app/investigations", label: "Investigations", Icon: IconInsights },
  { href: "/app/expenses", label: "Expenses", Icon: IconOptimization },
  { href: "/app/ai-usage", label: "AI usage", Icon: IconInsights },
  { href: "/app/subscriptions", label: "Subscriptions", Icon: IconSystems },
  { href: "/app/automation", label: "Automation", Icon: IconConnectivity },
  { href: "/app/forecast", label: "Forecast", Icon: IconPerformance },
  { href: "/app/assistant", label: "Assistant", Icon: IconInsights },
  { href: "/app/data", label: "Data Studio", Icon: IconSystems, adminOnly: true },
  { href: "/app/media", label: "Media Studio", Icon: IconInsights, adminOnly: true },
  { href: "/app/r2", label: "R2 Storage", Icon: IconConnectivity, adminOnly: true },
  { href: "/app/notifications", label: "Alerts", Icon: IconConnectivity },
  { href: "/app/onboarding", label: "Onboarding", Icon: IconSystems },
];

export function AppSidebar({
  isAdmin = false,
  layoutGroup = "desktop",
}: {
  isAdmin?: boolean;
  /** Unique layoutId scope when multiple sidebars mount (desktop + mobile). */
  layoutGroup?: string;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const items = nav.filter((item) => !item.adminOnly || isAdmin);
  const activeLayoutId = `app-nav-active-${layoutGroup}`;

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="App modules">
      {items.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active
                ? "text-white"
                : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            {active ? (
              reduce ? (
                <span
                  className="absolute inset-0 rounded-xl bg-blue/20"
                  aria-hidden
                />
              ) : (
                <motion.span
                  layoutId={activeLayoutId}
                  className="absolute inset-0 rounded-xl bg-blue/20 ring-1 ring-cyan/20"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden
                />
              )
            ) : null}
            <span
              className={`relative z-[1] h-full w-0.5 shrink-0 rounded-full transition-colors ${
                active ? "bg-cyan" : "bg-transparent"
              }`}
              aria-hidden
            />
            <item.Icon
              className={`relative z-[1] h-4 w-4 shrink-0 ${active ? "text-cyan" : ""}`}
            />
            <span className="relative z-[1]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
