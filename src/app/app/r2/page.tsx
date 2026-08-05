import { R2BrowserClient } from "@/components/data-studio/R2BrowserClient";
import { auth, isAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function R2AdminPage() {
  const session = await auth();
  if (!isAdminSession(session)) {
    redirect("/app");
  }
  return <R2BrowserClient />;
}
