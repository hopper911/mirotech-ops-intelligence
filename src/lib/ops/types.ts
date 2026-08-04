export type OpsModuleId =
  | "performance"
  | "optimization"
  | "connectivity"
  | "systems"
  | "insights";

export type KpiTrend = "up" | "down" | "flat";

export type OpsKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: KpiTrend;
  module: OpsModuleId;
};

export type OpsSeriesPoint = {
  label: string;
  value: number;
};

export type OpsInsight = {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "watch" | "action";
  module: OpsModuleId;
};

export type OpsModuleSummary = {
  id: OpsModuleId;
  title: string;
  description: string;
  status: string;
  series: OpsSeriesPoint[];
  highlights: string[];
};

export type OpsDashboard = {
  generatedAt: string;
  kpis: OpsKpi[];
  insights: OpsInsight[];
  modules: OpsModuleSummary[];
};

/** Pluggable source for future BI / calendar / ERP connectors. */
export interface OpsSource {
  getDashboard(): Promise<OpsDashboard>;
  getModule(id: OpsModuleId): Promise<OpsModuleSummary>;
}
