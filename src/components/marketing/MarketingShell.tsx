"use client";

import { Logo } from "@/components/brand/Logo";
import { PageTransition } from "@/components/motion/PageTransition";
import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/concept", label: "Concept" },
  { href: "/sales", label: "Sales kit" },
  { href: "/brand", label: "Brand" },
];

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background,box-shadow] duration-300 ${
        scrolled ? "glass-nav" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Logo variant="light" size="md" />
        <nav className="hidden items-center gap-1 text-sm text-muted md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="btn-specular rounded-full bg-green px-4 py-2 text-sm font-semibold text-navy"
          >
            Open demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 glass">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.legalName}. Self-initiated product concept with
          labeled sample data — not a live production SaaS.
        </p>
        <div className="flex flex-wrap gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-cyan">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-app grid-atmosphere flex min-h-screen flex-col">
      <MarketingHeader />
      <PageTransition className="flex-1">{children}</PageTransition>
      <MarketingFooter />
    </div>
  );
}
