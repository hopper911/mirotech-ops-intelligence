import type {
  AiModelUsage,
  AssistantPreset,
  AutomationJob,
  ExecutiveDashboard,
  ExecutiveKpi,
  ForecastBundle,
  OpsNotification,
  Recommendation,
  SeriesPoint,
  Subscription,
  VendorSpend,
} from "./types";

export type WorkspaceData = {
  company: string;
  sampleLabel: string;
  kpis: ExecutiveKpi[];
  spendTrend: SeriesPoint[];
  riskNotes: string[];
  vendors: VendorSpend[];
  models: AiModelUsage[];
  subscriptions: Subscription[];
  automation: AutomationJob[];
  recommendations: Recommendation[];
  forecast: ForecastBundle;
  assistantPresets: AssistantPreset[];
  notifications: OpsNotification[];
};

export const WORKSPACE_STORAGE_KEY = "mirotech.ops.workspace";

export const DEFAULT_WORKSPACE: WorkspaceData = {
  company: "Northline Commerce",
  sampleLabel: "Sample data · Northline Commerce · concept demo",
  kpis: [
    {
      id: "spend",
      label: "Monthly tech spend",
      value: "$91.3k",
      delta: "+6.4% MoM",
      tone: "risk",
      hint: "Cloud + AI driving most of the increase",
    },
    {
      id: "savings",
      label: "Identified monthly savings",
      value: "$15.9k",
      delta: "4 open recs",
      tone: "up",
      hint: "If approved recommendations land",
    },
    {
      id: "risk",
      label: "Risk score",
      value: "Medium",
      delta: "2 critical alerts",
      tone: "risk",
      hint: "AI anomaly + failing finance sync",
    },
    {
      id: "health",
      label: "Automation health",
      value: "92%",
      delta: "-3 pts",
      tone: "down",
      hint: "NetSuite sync dragging the score",
    },
  ],
  spendTrend: [
    { label: "Jan", value: 72 },
    { label: "Feb", value: 76 },
    { label: "Mar", value: 79 },
    { label: "Apr", value: 84 },
    { label: "May", value: 88 },
    { label: "Jun", value: 91.3 },
  ],
  riskNotes: [
    "OpenAI over budget by 24%",
    "HubSpot renewal in 28 days with unused seats",
    "NetSuite sync failure rate at 11%",
  ],
  vendors: [
    {
      id: "v-aws",
      vendor: "Amazon Web Services",
      category: "Cloud",
      team: "Platform",
      monthly: 48200,
      budget: 45000,
      trend: [
        { label: "Jan", value: 41 },
        { label: "Feb", value: 43 },
        { label: "Mar", value: 44 },
        { label: "Apr", value: 46 },
        { label: "May", value: 47 },
        { label: "Jun", value: 48.2 },
      ],
    },
    {
      id: "v-gcp",
      vendor: "Google Cloud",
      category: "Cloud",
      team: "Data",
      monthly: 12400,
      budget: 14000,
      trend: [
        { label: "Jan", value: 11 },
        { label: "Feb", value: 11.5 },
        { label: "Mar", value: 12 },
        { label: "Apr", value: 12.2 },
        { label: "May", value: 12.1 },
        { label: "Jun", value: 12.4 },
      ],
    },
    {
      id: "v-openai",
      vendor: "OpenAI",
      category: "AI",
      team: "Engineering",
      monthly: 18600,
      budget: 15000,
      trend: [
        { label: "Jan", value: 9 },
        { label: "Feb", value: 11 },
        { label: "Mar", value: 13 },
        { label: "Apr", value: 15 },
        { label: "May", value: 17 },
        { label: "Jun", value: 18.6 },
      ],
    },
    {
      id: "v-hubspot",
      vendor: "HubSpot",
      category: "Software",
      team: "Revenue",
      monthly: 6200,
      budget: 6000,
      trend: [
        { label: "Jan", value: 5.8 },
        { label: "Feb", value: 5.9 },
        { label: "Mar", value: 6 },
        { label: "Apr", value: 6.1 },
        { label: "May", value: 6.2 },
        { label: "Jun", value: 6.2 },
      ],
    },
    {
      id: "v-datadog",
      vendor: "Datadog",
      category: "Software",
      team: "Platform",
      monthly: 4100,
      budget: 4500,
      trend: [
        { label: "Jan", value: 3.8 },
        { label: "Feb", value: 3.9 },
        { label: "Mar", value: 4 },
        { label: "Apr", value: 4.1 },
        { label: "May", value: 4.1 },
        { label: "Jun", value: 4.1 },
      ],
    },
    {
      id: "v-figma",
      vendor: "Figma",
      category: "Software",
      team: "Design",
      monthly: 1800,
      budget: 1600,
      trend: [
        { label: "Jan", value: 1.5 },
        { label: "Feb", value: 1.6 },
        { label: "Mar", value: 1.7 },
        { label: "Apr", value: 1.7 },
        { label: "May", value: 1.8 },
        { label: "Jun", value: 1.8 },
      ],
    },
  ],
  models: [
    {
      id: "m1",
      model: "gpt-4o",
      provider: "OpenAI",
      team: "Support",
      tokensM: 420,
      cost: 9840,
      anomaly: "Spend +38% WoW on summarization",
    },
    {
      id: "m2",
      model: "gpt-4o-mini",
      provider: "OpenAI",
      team: "Support",
      tokensM: 910,
      cost: 2100,
    },
    {
      id: "m3",
      model: "claude-sonnet-4",
      provider: "Anthropic",
      team: "Engineering",
      tokensM: 180,
      cost: 4200,
    },
    {
      id: "m4",
      model: "text-embedding-3-large",
      provider: "OpenAI",
      team: "Data",
      tokensM: 2400,
      cost: 980,
    },
    {
      id: "m5",
      model: "gemini-2.5-pro",
      provider: "Google",
      team: "Product",
      tokensM: 95,
      cost: 1650,
      anomaly: "Spike 02:00–04:00 UTC — batch job loop",
    },
  ],
  subscriptions: [
    {
      id: "s1",
      name: "HubSpot Marketing Hub",
      owner: "Maya Chen (RevOps)",
      seats: 25,
      used: 18,
      renewsOn: "2026-09-01",
      monthly: 4200,
      status: "renewing",
    },
    {
      id: "s2",
      name: "Figma Organization",
      owner: "Jordan Lee (Design)",
      seats: 40,
      used: 22,
      renewsOn: "2026-11-12",
      monthly: 1800,
      status: "underused",
    },
    {
      id: "s3",
      name: "Notion Business",
      owner: "Alex Rivera (Ops)",
      seats: 120,
      used: 71,
      renewsOn: "2026-08-20",
      monthly: 1440,
      status: "underused",
    },
    {
      id: "s4",
      name: "Slack Business+",
      owner: "IT",
      seats: 210,
      used: 198,
      renewsOn: "2027-01-05",
      monthly: 2600,
      status: "active",
    },
    {
      id: "s5",
      name: "Adobe Creative Cloud",
      owner: "Jordan Lee (Design)",
      seats: 12,
      used: 0,
      renewsOn: "2026-10-01",
      monthly: 660,
      status: "unused",
    },
    {
      id: "s6",
      name: "Datadog Pro",
      owner: "Sam Ortiz (Platform)",
      seats: 15,
      used: 14,
      renewsOn: "2026-12-15",
      monthly: 4100,
      status: "active",
    },
  ],
  automation: [
    {
      id: "a1",
      name: "NetSuite invoice sync",
      volume: 1840,
      failureRate: 0.11,
      avgRuntimeSec: 142,
      impact: "Finance overtime + delayed close",
      status: "failing",
    },
    {
      id: "a2",
      name: "CRM → warehouse ETL",
      volume: 720,
      failureRate: 0.02,
      avgRuntimeSec: 58,
      impact: "Reporting lag under 20m",
      status: "healthy",
    },
    {
      id: "a3",
      name: "Seat provisioning (Okta)",
      volume: 96,
      failureRate: 0.06,
      avgRuntimeSec: 24,
      impact: "Onboarding delays for new hires",
      status: "degraded",
    },
    {
      id: "a4",
      name: "Cost anomaly digest",
      volume: 30,
      failureRate: 0.0,
      avgRuntimeSec: 11,
      impact: "CFO morning brief",
      status: "healthy",
    },
  ],
  recommendations: [
    {
      id: "rec-aws-rightsizing",
      title: "Rightsize idle AWS compute",
      issue: "12 EC2 instances average <18% CPU over 30 days while billed as on-demand.",
      evidence: [
        "CloudWatch CPU p95 under 22% for instance family m5.xlarge (prod-analytics)",
        "Invoice line AWS-EC2-OD: $18,420 last month (+14% MoM)",
        "No scheduled scale-down windows on weekends",
      ],
      savingsMonthly: 6200,
      risk: "low",
      status: "open",
      category: "Cloud",
      owner: "Platform",
    },
    {
      id: "rec-unused-seats",
      title: "Reclaim unused SaaS seats",
      issue: "41 licenses across Figma, Notion, and HubSpot show zero activity in 45 days.",
      evidence: [
        "SSO last-login export: 41 accounts dormant >45 days",
        "Renewal for HubSpot Marketing Hub in 28 days",
        "Finance tagged $4,180/mo as recoverable",
      ],
      savingsMonthly: 4180,
      risk: "low",
      status: "open",
      category: "Software",
      owner: "Ops",
    },
    {
      id: "rec-ai-routing",
      title: "Route low-stakes prompts to cheaper models",
      issue:
        "Support summarization uses GPT-4o for 72% of tickets where gpt-4o-mini matches quality gates.",
      evidence: [
        "API log sample n=2,400: latency and eval score within ±3%",
        "Team Support spend $9,840 MoM on summarization alone",
        "Shadow eval passed on 94% of tickets",
      ],
      savingsMonthly: 3100,
      risk: "medium",
      status: "open",
      category: "AI",
      owner: "Engineering",
    },
    {
      id: "rec-automation-retry",
      title: "Fix invoice sync automation retries",
      issue: "Nightly NetSuite sync fails 11% of runs, creating manual finance overtime.",
      evidence: [
        "Automation runbook: timeout on line-item payloads >2MB",
        "Finance logged 26 hours of manual remediation last quarter",
        "Estimated overtime cost ~$2,400/mo",
      ],
      savingsMonthly: 2400,
      risk: "medium",
      status: "open",
      category: "Automation",
      owner: "Finance Systems",
    },
  ],
  forecast: {
    current: {
      id: "current",
      label: "Current path",
      monthlySpend: 91300,
      series: [
        { label: "Jul", value: 92 },
        { label: "Aug", value: 94 },
        { label: "Sep", value: 96 },
        { label: "Oct", value: 98 },
        { label: "Nov", value: 99 },
        { label: "Dec", value: 101 },
      ],
    },
    optimized: {
      id: "optimized",
      label: "Optimized path",
      monthlySpend: 75400,
      series: [
        { label: "Jul", value: 88 },
        { label: "Aug", value: 82 },
        { label: "Sep", value: 78 },
        { label: "Oct", value: 76 },
        { label: "Nov", value: 75 },
        { label: "Dec", value: 75.4 },
      ],
    },
    annualSavings: 190800,
    confidenceNote:
      "Confidence: medium-high. Assumes 80% of open recommendations are approved within 60 days and AI traffic mix stays within ±15%.",
    assumptions: [
      "AWS rightsizing removes idle on-demand capacity without SLA breach",
      "Seat reclaim does not block active contributors",
      "Model routing keeps support quality gates ≥90%",
      "Automation fix lands in Q3 engineering sprint",
    ],
  },
  assistantPresets: [
    {
      id: "q1",
      question: "Where are we over budget this month?",
      answer: {
        id: "a-q1",
        role: "assistant",
        content:
          "AWS (+$3.2k vs budget) and OpenAI (+$3.6k vs budget) are the two largest overruns. HubSpot is slightly over; GCP and Datadog are under.",
        sources: [
          { id: "src1", label: "Vendor ledger · June sample", kind: "invoice" },
          { id: "src2", label: "Budget variance sheet", kind: "forecast" },
        ],
        nextSteps: [
          "Open Expenses and filter category Cloud + AI",
          "Review recommendation: Rightsize idle AWS compute",
          "Review recommendation: Route low-stakes prompts to cheaper models",
        ],
      },
    },
    {
      id: "q2",
      question: "Which subscriptions can we cut before renewals?",
      answer: {
        id: "a-q2",
        role: "assistant",
        content:
          "Adobe Creative Cloud shows 0/12 seats used. Figma has 18 idle seats. Notion has 49 idle seats. HubSpot renews in 28 days with 7 unused seats.",
        sources: [
          { id: "src3", label: "SSO last-login export", kind: "subscription" },
          { id: "src4", label: "Renewal calendar", kind: "subscription" },
        ],
        nextSteps: [
          "Approve ‘Reclaim unused SaaS seats’",
          "Confirm owners before canceling Adobe",
        ],
      },
    },
    {
      id: "q3",
      question: "What’s driving AI cost spikes overnight?",
      answer: {
        id: "a-q3",
        role: "assistant",
        content:
          "Gemini 2.5 Pro shows a 02:00–04:00 UTC spike consistent with a looping batch job. Support GPT-4o summarization is the larger weekly driver (+38% WoW).",
        sources: [
          { id: "src5", label: "API usage log · anomaly window", kind: "api-log" },
          { id: "src6", label: "AI usage module", kind: "api-log" },
        ],
        nextSteps: [
          "Inspect Product team batch job schedule",
          "Pilot gpt-4o-mini routing for summarization",
        ],
      },
    },
  ],
  notifications: [
    {
      id: "n1",
      title: "AI spend anomaly",
      body: "Support GPT-4o spend +38% week over week.",
      severity: "critical",
      createdAt: "2026-08-04T14:12:00Z",
      href: "/app/ai-usage",
    },
    {
      id: "n2",
      title: "Renewal in 28 days",
      body: "HubSpot Marketing Hub — 7 unused seats flagged.",
      severity: "watch",
      createdAt: "2026-08-04T09:00:00Z",
      href: "/app/subscriptions",
    },
    {
      id: "n3",
      title: "Automation failing",
      body: "NetSuite invoice sync failure rate at 11%.",
      severity: "critical",
      createdAt: "2026-08-03T22:40:00Z",
      href: "/app/automation",
    },
    {
      id: "n4",
      title: "Forecast updated",
      body: "Optimized path shows $190k annual savings (sample).",
      severity: "info",
      createdAt: "2026-08-03T16:00:00Z",
      href: "/app/forecast",
    },
  ],
};

export function cloneWorkspace(data: WorkspaceData = DEFAULT_WORKSPACE): WorkspaceData {
  return structuredClone(data);
}

export function buildExecutive(workspace: WorkspaceData): ExecutiveDashboard {
  return {
    company: workspace.company,
    sampleLabel: workspace.sampleLabel,
    generatedAt: new Date().toISOString(),
    kpis: workspace.kpis,
    spendTrend: workspace.spendTrend,
    topRecommendations: workspace.recommendations.slice(0, 3),
    riskNotes: workspace.riskNotes,
  };
}

export function isWorkspaceData(value: unknown): value is WorkspaceData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.company === "string" &&
    Array.isArray(v.kpis) &&
    Array.isArray(v.vendors) &&
    Array.isArray(v.models) &&
    Array.isArray(v.subscriptions) &&
    Array.isArray(v.automation) &&
    Array.isArray(v.recommendations) &&
    typeof v.forecast === "object" &&
    Array.isArray(v.assistantPresets) &&
    Array.isArray(v.notifications)
  );
}
