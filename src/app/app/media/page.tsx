import { MediaStudioClient } from "@/components/data-studio/MediaStudioClient";
import { auth, isAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MediaStudioPage() {
  const session = await auth();
  if (!isAdminSession(session)) {
    redirect("/app");
  }
  return <MediaStudioClient />;
}
