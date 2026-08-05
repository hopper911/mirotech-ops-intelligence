"use client";

import { Logo } from "@/components/brand/Logo";
import { SignalDots } from "@/components/brand/SignalDots";
import { BRAND } from "@/lib/brand";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app/onboarding";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);
    if (result?.error) {
      setError("Invalid credentials. Use the demo account below.");
      return;
    }
    const safeCallback =
      callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/app";
    router.push(safeCallback);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={BRAND.demoCredentials.email}
          className="mt-1.5 w-full rounded-xl border border-border bg-navy/60 px-3 py-2.5 text-sm text-white outline-none ring-cyan focus:ring-2"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue={BRAND.demoCredentials.password}
          className="mt-1.5 w-full rounded-xl border border-border bg-navy/60 px-3 py-2.5 text-sm text-white outline-none ring-cyan focus:ring-2"
        />
      </label>
      {error ? <p className="text-sm text-cyan">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-specular w-full rounded-full bg-green py-3 text-sm font-semibold text-navy disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs text-muted">
        Demo: {BRAND.demoCredentials.email} / {BRAND.demoCredentials.password}
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="theme-app grid-atmosphere relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <SignalDots
        variant="orbit"
        className="pointer-events-none absolute right-[8%] top-[12%] h-32 w-32 opacity-50"
        interactive={false}
      />
      <div className="glass-strong animate-fade-up relative w-full max-w-md rounded-3xl p-8">
        <Logo variant="light" size="md" href="/" />
        <h1 className="mt-8 text-2xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Client demo sign-in. Operators explore sample ops data in a read-only workspace.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-cyan hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
