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

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspaceState] = useState<WorkspaceData>(() => getDefaultWorkspace());
  const [hydrated, setHydrated] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const stored = loadWorkspaceFromStorage();
    if (stored) {
      setWorkspaceState(stored);
    }
    setHydrated(true);
  }, []);

  const setWorkspace = useCallback((next: WorkspaceData) => {
    setWorkspaceState(cloneWorkspace(next));
    setDirty(true);
  }, []);

  const updateWorkspace = useCallback((updater: (prev: WorkspaceData) => WorkspaceData) => {
    setWorkspaceState((prev) => {
      setDirty(true);
      return cloneWorkspace(updater(prev));
    });
  }, []);

  const updateAndSave = useCallback((updater: (prev: WorkspaceData) => WorkspaceData) => {
    setWorkspaceState((prev) => {
      const next = cloneWorkspace(updater(prev));
      saveWorkspaceToStorage(next);
      setDirty(false);
      return next;
    });
  }, []);

  const save = useCallback(() => {
    saveWorkspaceToStorage(workspace);
    setDirty(false);
  }, [workspace]);

  const reset = useCallback(() => {
    clearWorkspaceStorage();
    setWorkspaceState(getDefaultWorkspace());
    setDirty(false);
  }, []);

  const exportJson = useCallback(() => exportWorkspaceJson(workspace), [workspace]);

  const importJson = useCallback((raw: string) => {
    const next = importWorkspaceJson(raw);
    setWorkspaceState(next);
    saveWorkspaceToStorage(next);
    setDirty(false);
  }, []);

  const value = useMemo(
    () => ({
      workspace,
      hydrated,
      dirty,
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
