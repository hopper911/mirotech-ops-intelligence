import { Logo } from "@/components/brand/Logo";
import { AppSidebar } from "@/components/app/AppSidebar";
import { NotificationToaster } from "@/components/app/NotificationToaster";
import { SampleDataBadge } from "@/components/app/SampleDataBadge";
import { PageTransition } from "@/components/motion/PageTransition";
import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="theme-app grid-atmosphere flex min-h-screen">
      <aside className="glass-nav sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 md:flex">
        <div className="border-b border-white/10 px-4 py-5">
          <Logo variant="light" size="sm" href="/app" />
          <div className="mt-3">
            <SampleDataBadge compact />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AppSidebar />
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="truncate text-xs text-muted">
            {session?.user?.email ?? "Operator"}
          </div>
          <Link href="/app/notifications" className="mt-2 block text-sm text-cyan hover:underline">
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-nav flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:hidden">
          <Logo variant="light" size="sm" href="/app" showWordmark />
          <SampleDataBadge compact />
        </header>
        <div className="overflow-x-auto border-b border-white/10 px-2 py-2 md:hidden">
          <AppSidebar />
        </div>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <NotificationToaster />
    </div>
  );
}
