import { mockOpsSource } from "./mock-source";
import type { OpsSource } from "./types";

/** Swap this for a live connector when sources are ready. */
export const opsSource: OpsSource = mockOpsSource;

export type {
  OpsDashboard,
  OpsInsight,
  OpsKpi,
  OpsModuleId,
  OpsModuleSummary,
  OpsSeriesPoint,
  OpsSource,
} from "./types";
