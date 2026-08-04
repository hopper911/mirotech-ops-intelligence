import { mockOpsSource } from "./mock-source";
import type { OpsSource } from "./types";

export const opsSource: OpsSource = mockOpsSource;
export { SAMPLE_DATA_LABEL } from "./mock-source";

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
