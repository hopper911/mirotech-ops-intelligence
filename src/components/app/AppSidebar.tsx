"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app", label: "Executive" },
  { href: "/app/expenses", label: "Expenses" },
  { href: "/app/ai-usage", label: "AI usage" },
  { href: "/app/subscriptions", label: "Subscriptions" },
  { href: "/app/automation", label: "Automation" },
  { href: "/app/forecast", label: "Forecast" },
  { href: "/app/assistant", label: "Assistant" },
  { href: "/app/notifications", label: "Alerts" },
  { href: "/app/onboarding", label: "Onboarding" },
] as const;

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
            className={`rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-blue/20 text-white"
                : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
