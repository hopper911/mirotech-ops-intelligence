import {
  cloneWorkspace,
  DEFAULT_WORKSPACE,
  isWorkspaceData,
  WORKSPACE_STORAGE_KEY,
  type WorkspaceData,
} from "./workspace";

export function loadWorkspaceFromStorage(): WorkspaceData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isWorkspaceData(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkspaceToStorage(data: WorkspaceData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
}

export function clearWorkspaceStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WORKSPACE_STORAGE_KEY);
}

export function exportWorkspaceJson(data: WorkspaceData): string {
  return JSON.stringify(data, null, 2);
}

export function importWorkspaceJson(raw: string): WorkspaceData {
  const parsed = JSON.parse(raw) as unknown;
  if (!isWorkspaceData(parsed)) {
    throw new Error("Invalid workspace JSON shape");
  }
  return cloneWorkspace(parsed);
}

export function getDefaultWorkspace(): WorkspaceData {
  return cloneWorkspace(DEFAULT_WORKSPACE);
}
