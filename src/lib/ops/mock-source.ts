import type {
  OpsDashboard,
  OpsModuleId,
  OpsModuleSummary,
  OpsSource,
} from "./types";

const modules: OpsModuleSummary[] = [
  {
    id: "performance",
    title: "Performance",
    description: "Throughput, cycle time, and delivery health across active ops streams.",
    status: "Stable · 98.2% SLA",
    series: [
      { label: "Mon", value: 62 },
      { label: "Tue", value: 71 },
      { label: "Wed", value: 68 },
      { label: "Thu", value: 79 },
      { label: "Fri", value: 84 },
      { label: "Sat", value: 76 },
      { label: "Sun", value: 88 },
    ],
    highlights: [
      "Median cycle time down 11% week over week",
      "Peak load window shifted to Thu–Fri",
      "Two streams above target throughput",
    ],
  },
  {
    id: "optimization",
    title: "Optimization",
    description: "Where capacity, cost, and waste are leaving signal on the table.",
    status: "3 opportunities ready",
    series: [
      { label: "Mon", value: 44 },
      { label: "Tue", value: 48 },
      { label: "Wed", value: 52 },
      { label: "Thu", value: 49 },
      { label: "Fri", value: 61 },
      { label: "Sat", value: 58 },
      { label: "Sun", value: 64 },
    ],
    highlights: [
      "Idle capacity highest between 13:00–15:00",
      "Rebalance shift coverage could reclaim ~6%",
      "Top cost driver: overtime on Stream B",
    ],
  },
  {
    id: "connectivity",
    title: "Connectivity",
    description: "Integrations, sync freshness, and cross-system dependency health.",
    status: "12 of 13 healthy",
    series: [
      { label: "Mon", value: 97 },
      { label: "Tue", value: 98 },
      { label: "Wed", value: 96 },
      { label: "Thu", value: 99 },
      { label: "Fri", value: 95 },
      { label: "Sat", value: 98 },
      { label: "Sun", value: 99 },
    ],
    highlights: [
      "CRM sync lagging by 14 minutes",
      "Warehouse feed recovered after overnight blip",
      "Webhook error rate under 0.4%",
    ],
  },
  {
    id: "systems",
    title: "Systems",
    description: "Runtime posture for the platforms that keep operations moving.",
    status: "All critical green",
    series: [
      { label: "Mon", value: 99.1 },
      { label: "Tue", value: 99.4 },
      { label: "Wed", value: 99.2 },
      { label: "Thu", value: 99.6 },
      { label: "Fri", value: 99.3 },
      { label: "Sat", value: 99.7 },
      { label: "Sun", value: 99.8 },
    ],
    highlights: [
      "No P1 incidents in the last 14 days",
      "Staging deploy cadence: 4 / week",
      "Disk pressure watch on analytics warehouse",
    ],
  },
  {
    id: "insights",
    title: "Insights",
    description: "Narrative signals distilled from operational telemetry.",
    status: "5 new this week",
    series: [
      { label: "Mon", value: 2 },
      { label: "Tue", value: 3 },
      { label: "Wed", value: 2 },
      { label: "Thu", value: 4 },
      { label: "Fri", value: 5 },
      { label: "Sat", value: 3 },
      { label: "Sun", value: 5 },
    ],
    highlights: [
      "Demand spike correlated with Friday promotions",
      "Cancellation risk elevated evenings & weekends",
      "North region outperforming forecast by 8%",
    ],
  },
];

function buildDashboard(): OpsDashboard {
  return {
    generatedAt: new Date().toISOString(),
    kpis: [
      {
        id: "fill",
        label: "Ops fill rate",
        value: "94.6%",
        delta: "+2.1%",
        trend: "up",
        module: "performance",
      },
      {
        id: "latency",
        label: "Signal latency",
        value: "1.4m",
        delta: "-18s",
        trend: "up",
        module: "connectivity",
      },
      {
        id: "waste",
        label: "Idle capacity",
        value: "7.8%",
        delta: "-1.2%",
        trend: "up",
        module: "optimization",
      },
      {
        id: "uptime",
        label: "Critical uptime",
        value: "99.7%",
        delta: "0.0%",
        trend: "flat",
        module: "systems",
      },
    ],
    insights: [
      {
        id: "i1",
        title: "Thursday load cresting early",
        summary:
          "Throughput is peaking before lunch on Thursdays. Shift one float resource earlier to protect SLA.",
        severity: "action",
        module: "performance",
      },
      {
        id: "i2",
        title: "CRM sync drift",
        summary:
          "Customer updates are arriving ~14 minutes late. Connectivity looks otherwise healthy.",
        severity: "watch",
        module: "connectivity",
      },
      {
        id: "i3",
        title: "Weekend cancellation pattern",
        summary:
          "Insight model flags elevated risk Sat–Sun evenings — same pattern for three weeks.",
        severity: "info",
        module: "insights",
      },
    ],
    modules,
  };
}

export class MockOpsSource implements OpsSource {
  async getDashboard(): Promise<OpsDashboard> {
    return buildDashboard();
  }

  async getModule(id: OpsModuleId): Promise<OpsModuleSummary> {
    const found = modules.find((m) => m.id === id);
    if (!found) {
      throw new Error(`Unknown module: ${id}`);
    }
    return found;
  }
}

export const mockOpsSource = new MockOpsSource();
