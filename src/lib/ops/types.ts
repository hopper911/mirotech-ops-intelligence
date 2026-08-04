export type Money = {
  amount: number;
  currency: "USD";
};

export type SeriesPoint = {
  label: string;
  value: number;
};

export type ExecutiveKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down" | "flat" | "risk";
  hint: string;
};

export type VendorSpend = {
  id: string;
  vendor: string;
  category: "Cloud" | "Software" | "AI" | "Other";
  team: string;
  monthly: number;
  budget: number;
  trend: SeriesPoint[];
};

export type AiModelUsage = {
  id: string;
  model: string;
  provider: string;
  team: string;
  tokensM: number;
  cost: number;
  anomaly?: string;
};

export type Subscription = {
  id: string;
  name: string;
  owner: string;
  seats: number;
  used: number;
  renewsOn: string;
  monthly: number;
  status: "active" | "underused" | "unused" | "renewing";
};

export type AutomationJob = {
  id: string;
  name: string;
  volume: number;
  failureRate: number;
  avgRuntimeSec: number;
  impact: string;
  status: "healthy" | "degraded" | "failing";
};

export type Recommendation = {
  id: string;
  title: string;
  issue: string;
  evidence: string[];
  savingsMonthly: number;
  risk: "low" | "medium" | "high";
  status: "open" | "approved" | "dismissed";
  category: string;
  owner: string;
};

export type ForecastScenario = {
  id: string;
  label: string;
  monthlySpend: number;
  series: SeriesPoint[];
};

export type ForecastBundle = {
  current: ForecastScenario;
  optimized: ForecastScenario;
  confidenceNote: string;
  assumptions: string[];
  annualSavings: number;
};

export type AssistantSource = {
  id: string;
  label: string;
  kind: "invoice" | "api-log" | "subscription" | "automation" | "forecast";
};

export type AssistantTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: AssistantSource[];
  nextSteps?: string[];
};

export type AssistantPreset = {
  id: string;
  question: string;
  answer: AssistantTurn;
};

export type OpsNotification = {
  id: string;
  title: string;
  body: string;
  severity: "info" | "watch" | "critical";
  createdAt: string;
  href: string;
};

export type ExecutiveDashboard = {
  company: string;
  sampleLabel: string;
  generatedAt: string;
  kpis: ExecutiveKpi[];
  spendTrend: SeriesPoint[];
  topRecommendations: Recommendation[];
  riskNotes: string[];
};

export interface OpsSource {
  getExecutive(): Promise<ExecutiveDashboard>;
  getExpenses(): Promise<{ vendors: VendorSpend[]; monthlyTotal: number; budgetTotal: number }>;
  getAiUsage(): Promise<{ models: AiModelUsage[]; anomalies: string[] }>;
  getSubscriptions(): Promise<Subscription[]>;
  getAutomation(): Promise<AutomationJob[]>;
  getRecommendations(): Promise<Recommendation[]>;
  getRecommendation(id: string): Promise<Recommendation | null>;
  getForecast(): Promise<ForecastBundle>;
  getAssistantPresets(): Promise<AssistantPreset[]>;
  getNotifications(): Promise<OpsNotification[]>;
}
