import { Logo } from "@/components/brand/Logo";
import { AppAmbientChrome } from "@/components/app/AppAmbientChrome";
import { AppSidebar } from "@/components/app/AppSidebar";
import { NotificationToaster } from "@/components/app/NotificationToaster";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { PageTransition } from "@/components/motion/PageTransition";
import { AppProviders } from "@/components/ops/AppProviders";
import { auth, isAdminSession, signOut } from "@/lib/auth";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = isAdminSession(session);

  return (
    <AppProviders canEdit={isAdmin}>
      <div className="theme-app grid-atmosphere flex min-h-screen">
        <AppAmbientChrome />
        <aside className="glass-nav sticky top-0 z-10 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 md:flex">
          <div className="border-b border-white/10 px-4 py-5">
            <Logo variant="light" size="sm" href="/app" />
            <div className="mt-3">
              <SampleDataBadge compact />
            </div>
            <div
              className="node-rail-pulse mt-4 h-2 w-full rounded-full"
              aria-hidden
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <AppSidebar isAdmin={isAdmin} layoutGroup="desktop" />
          </div>
          <div className="border-t border-white/10 p-4">
            <div
              className="node-rail mb-3 h-1.5 w-full rounded-full"
              aria-hidden
            />
            <div className="truncate text-xs text-muted">
              {session?.user?.email ?? "Operator"}
            </div>
            {isAdmin ? (
              <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-green">
                Admin
              </div>
            ) : null}
            {isAdmin ? (
              <>
                <Link href="/app/data" className="mt-2 block text-sm text-green hover:underline">
                  Data Studio
                </Link>
                <Link href="/app/media" className="mt-1 block text-sm text-green hover:underline">
                  Media Studio
                </Link>
              </>
            ) : null}
            <Link href="/app/notifications" className="mt-1 block text-sm text-cyan hover:underline">
              Alerts
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
              className="mt-2"
            >
              <button type="submit" className="text-sm text-muted hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="glass-nav flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:hidden">
            <Logo variant="light" size="sm" href="/app" showWordmark />
            <SampleDataBadge compact />
          </header>
          <div className="overflow-x-auto border-b border-white/10 px-2 py-2 md:hidden">
            <AppSidebar isAdmin={isAdmin} layoutGroup="mobile" />
          </div>
          <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <NotificationToaster />
      </div>
    </AppProviders>
  );
}
