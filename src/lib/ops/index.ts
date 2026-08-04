import { mockOpsSource } from "./mock-source";
import type { OpsSource } from "./types";

export const opsSource: OpsSource = mockOpsSource;
export { SAMPLE_DATA_LABEL } from "./mock-source";
export {
  DEFAULT_WORKSPACE,
  buildExecutive,
  cloneWorkspace,
  type WorkspaceData,
} from "./workspace";
export {
  WORKSPACE_STORAGE_KEY,
} from "./workspace";

export type {
  AiModelUsage,
  AssistantPreset,
  AssistantSource,
  AssistantTurn,
  AutomationJob,
  ExecutiveDashboard,
  ExecutiveKpi,
  ForecastBundle,
  OpsNotification,
  OpsSource,
  Recommendation,
  SeriesPoint,
  Subscription,
  VendorSpend,
} from "./types";
