"use client";

import { WorkspaceProvider } from "@/components/ops/WorkspaceProvider";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  canEdit = false,
}: {
  children: ReactNode;
  canEdit?: boolean;
}) {
  return <WorkspaceProvider canEdit={canEdit}>{children}</WorkspaceProvider>;
}
