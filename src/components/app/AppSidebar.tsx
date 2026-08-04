"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModuleIcon } from "@/components/icons/ModuleIcon";
import type { OpsModuleId } from "@/lib/ops";

const nav: { href: string; label: string; id?: OpsModuleId }[] = [
  { href: "/app", label: "Overview" },
  { href: "/app/performance", label: "Performance", id: "performance" },
  { href: "/app/optimization", label: "Optimization", id: "optimization" },
  { href: "/app/connectivity", label: "Connectivity", id: "connectivity" },
  { href: "/app/systems", label: "Systems", id: "systems" },
  { href: "/app/insights", label: "Insights", id: "insights" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="App modules">
      {nav.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "bg-blue/20 text-white"
                : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.id ? (
              <ModuleIcon id={item.id} className="h-4 w-4 shrink-0" />
            ) : (
              <span className="inline-block h-4 w-4 rounded-sm border border-current/40" />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
