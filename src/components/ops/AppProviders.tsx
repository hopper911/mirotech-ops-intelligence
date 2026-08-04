"use client";

import { WorkspaceProvider } from "@/components/ops/WorkspaceProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
