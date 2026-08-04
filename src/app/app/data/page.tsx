import { DataStudioClient } from "@/components/data-studio/DataStudioClient";
import { auth, isAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DataStudioPage() {
  const session = await auth();
  if (!isAdminSession(session)) {
    redirect("/app");
  }
  return <DataStudioClient />;
}
