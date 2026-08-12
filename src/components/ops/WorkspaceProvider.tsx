"use client";

import {
  clearWorkspaceSession,
  clearWorkspaceStorage,
  exportWorkspaceJson,
  getDefaultWorkspace,
  importWorkspaceJson,
  loadWorkspaceFromSession,
  loadWorkspaceFromStorage,
  saveWorkspaceToSession,
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
  /** True only for admin sessions — clients are read-only for Data Studio, but can apply demo decisions. */
  canEdit: boolean;
  setWorkspace: (next: WorkspaceData) => void;
  updateWorkspace: (updater: (prev: WorkspaceData) => WorkspaceData) => void;
  /** Apply updater and persist (localStorage for admin, sessionStorage for demo clients). */
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
        const session = loadWorkspaceFromSession();
        setWorkspaceState(session ?? getDefaultWorkspace());
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [canEdit]);

  const persist = useCallback(
    (next: WorkspaceData) => {
      if (canEdit) {
        saveWorkspaceToStorage(next);
      } else {
        saveWorkspaceToSession(next);
      }
    },
    [canEdit],
  );

  const setWorkspace = useCallback(
    (next: WorkspaceData) => {
      if (!canEdit) return;
      setWorkspaceState(cloneWorkspace(next));
      setDirty(true);
    },
    [canEdit],
  );

  const updateWorkspace = useCallback((updater: (prev: WorkspaceData) => WorkspaceData) => {
    setWorkspaceState((prev) => {
      const next = cloneWorkspace(updater(prev));
      if (canEdit) {
        setDirty(true);
      } else {
        saveWorkspaceToSession(next);
      }
      return next;
    });
  }, [canEdit]);

  const updateAndSave = useCallback(
    (updater: (prev: WorkspaceData) => WorkspaceData) => {
      setWorkspaceState((prev) => {
        const next = cloneWorkspace(updater(prev));
        persist(next);
        setDirty(false);
        return next;
      });
    },
    [persist],
  );

  const save = useCallback(() => {
    if (!canEdit) return;
    saveWorkspaceToStorage(workspace);
    setDirty(false);
  }, [canEdit, workspace]);

  const reset = useCallback(() => {
    if (canEdit) {
      clearWorkspaceStorage();
    } else {
      clearWorkspaceSession();
    }
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
