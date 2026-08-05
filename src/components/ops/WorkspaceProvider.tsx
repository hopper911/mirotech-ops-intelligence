"use client";

import {
  clearWorkspaceStorage,
  exportWorkspaceJson,
  getDefaultWorkspace,
  importWorkspaceJson,
  loadWorkspaceFromStorage,
  saveWorkspaceToStorage,
} from "@/lib/ops/storage";
import { cloneWorkspace, type WorkspaceData } from "@/lib/ops/workspace";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WorkspaceContextValue = {
  workspace: WorkspaceData;
  hydrated: boolean;
  dirty: boolean;
  /** True only for admin sessions — clients are read-only. */
  canEdit: boolean;
  setWorkspace: (next: WorkspaceData) => void;
  updateWorkspace: (updater: (prev: WorkspaceData) => WorkspaceData) => void;
  /** Apply updater and persist to localStorage in one step. */
  updateAndSave: (updater: (prev: WorkspaceData) => WorkspaceData) => void;
  save: () => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (raw: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
  canEdit = false,
}: {
  children: ReactNode;
  canEdit?: boolean;
}) {
  const [workspace, setWorkspaceState] = useState<WorkspaceData>(() => getDefaultWorkspace());
  const [hydrated, setHydrated] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (canEdit) {
        const stored = loadWorkspaceFromStorage();
        if (stored) {
          setWorkspaceState(stored);
        }
      } else {
        setWorkspaceState(getDefaultWorkspace());
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [canEdit]);

  const setWorkspace = useCallback(
    (next: WorkspaceData) => {
      if (!canEdit) return;
      setWorkspaceState(cloneWorkspace(next));
      setDirty(true);
    },
    [canEdit],
  );

  const updateWorkspace = useCallback(
    (updater: (prev: WorkspaceData) => WorkspaceData) => {
      if (!canEdit) return;
      setWorkspaceState((prev) => {
        setDirty(true);
        return cloneWorkspace(updater(prev));
      });
    },
    [canEdit],
  );

  const updateAndSave = useCallback(
    (updater: (prev: WorkspaceData) => WorkspaceData) => {
      if (!canEdit) return;
      setWorkspaceState((prev) => {
        const next = cloneWorkspace(updater(prev));
        saveWorkspaceToStorage(next);
        setDirty(false);
        return next;
      });
    },
    [canEdit],
  );

  const save = useCallback(() => {
    if (!canEdit) return;
    saveWorkspaceToStorage(workspace);
    setDirty(false);
  }, [canEdit, workspace]);

  const reset = useCallback(() => {
    if (!canEdit) return;
    clearWorkspaceStorage();
    setWorkspaceState(getDefaultWorkspace());
    setDirty(false);
  }, [canEdit]);

  const exportJson = useCallback(() => exportWorkspaceJson(workspace), [workspace]);

  const importJson = useCallback(
    (raw: string) => {
      if (!canEdit) return;
      const next = importWorkspaceJson(raw);
      setWorkspaceState(next);
      saveWorkspaceToStorage(next);
      setDirty(false);
    },
    [canEdit],
  );

  const value = useMemo(
    () => ({
      workspace,
      hydrated,
      dirty,
      canEdit,
      setWorkspace,
      updateWorkspace,
      updateAndSave,
      save,
      reset,
      exportJson,
      importJson,
    }),
    [
      workspace,
      hydrated,
      dirty,
      canEdit,
      setWorkspace,
      updateWorkspace,
      updateAndSave,
      save,
      reset,
      exportJson,
      importJson,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
}
