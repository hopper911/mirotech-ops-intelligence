import {
  cloneWorkspace,
  DEFAULT_WORKSPACE,
  isWorkspaceData,
  normalizeWorkspace,
  WORKSPACE_SESSION_KEY,
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
    return normalizeWorkspace(parsed);
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

export function loadWorkspaceFromSession(): WorkspaceData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(WORKSPACE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isWorkspaceData(parsed)) return null;
    return normalizeWorkspace(parsed);
  } catch {
    return null;
  }
}

export function saveWorkspaceToSession(data: WorkspaceData): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(WORKSPACE_SESSION_KEY, JSON.stringify(data));
  } catch {
    /* private mode / quota */
  }
}

export function clearWorkspaceSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(WORKSPACE_SESSION_KEY);
  } catch {
    /* private mode */
  }
}

export function exportWorkspaceJson(data: WorkspaceData): string {
  return JSON.stringify(data, null, 2);
}

export function importWorkspaceJson(raw: string): WorkspaceData {
  const parsed = JSON.parse(raw) as unknown;
  if (!isWorkspaceData(parsed)) {
    throw new Error("Invalid workspace JSON shape");
  }
  return normalizeWorkspace(parsed);
}

export function getDefaultWorkspace(): WorkspaceData {
  return cloneWorkspace(DEFAULT_WORKSPACE);
}
