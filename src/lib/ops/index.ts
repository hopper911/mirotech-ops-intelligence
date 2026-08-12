import { mockOpsSource } from "./mock-source";
import type { OpsSource } from "./types";

export const opsSource: OpsSource = mockOpsSource;
export { SAMPLE_DATA_LABEL } from "./mock-source";
export {
  DEFAULT_WORKSPACE,
  FEATURED_INVESTIGATION_ID,
  buildExecutive,
  cloneWorkspace,
  normalizeWorkspace,
  type WorkspaceData,
} from "./workspace";
export {
  WORKSPACE_SESSION_KEY,
  WORKSPACE_STORAGE_KEY,
} from "./workspace";

export {
  applyInvestigationDecision,
  applyRecommendationStatus,
  approveInvestigationInPlace,
  decisionActorLabel,
  decisionKindLabel,
  dismissInvestigationInPlace,
  recommendationDecisionKind,
} from "./decisions";

export type {
  AiModelUsage,
  AssistantPreset,
  AssistantSource,
  AssistantTurn,
  AuditEvent,
  AutomationJob,
  ExecutiveDashboard,
  ExecutiveKpi,
  ForecastBundle,
  Investigation,
  InvestigationStatus,
  OpsNotification,
  OpsSource,
  ProbableCause,
  Recommendation,
  SeriesPoint,
  Subscription,
  VendorSpend,
} from "./types";
