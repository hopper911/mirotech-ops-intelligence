import { Logo } from "@/components/brand/Logo";
import { AppSidebar } from "@/components/app/AppSidebar";
import { auth, signOut } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="theme-app grid-atmosphere flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-navy/90 md:flex">
        <div className="border-b border-border px-4 py-5">
          <Logo variant="light" size="sm" href="/app" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <AppSidebar />
        </div>
        <div className="border-t border-border p-4">
          <div className="truncate text-xs text-muted">
            {session?.user?.email ?? "Operator"}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-2"
          >
            <button
              type="submit"
              className="text-sm text-cyan hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <Logo variant="light" size="sm" href="/app" showWordmark />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="text-sm text-cyan">
              Sign out
            </button>
          </form>
        </header>
        <div className="border-b border-border px-4 py-2 md:hidden">
          <AppSidebar />
        </div>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
