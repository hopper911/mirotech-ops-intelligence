import type { OpsSource } from "./types";
import { buildExecutive, DEFAULT_WORKSPACE, type WorkspaceData } from "./workspace";

export class WorkspaceOpsSource implements OpsSource {
  constructor(private workspace: WorkspaceData = DEFAULT_WORKSPACE) {}

  setWorkspace(workspace: WorkspaceData) {
    this.workspace = workspace;
  }

  async getExecutive() {
    return buildExecutive(this.workspace);
  }

  async getExpenses() {
    const vendors = this.workspace.vendors;
    const monthlyTotal = vendors.reduce((s, v) => s + v.monthly, 0);
    const budgetTotal = vendors.reduce((s, v) => s + v.budget, 0);
    return { vendors, monthlyTotal, budgetTotal };
  }

  async getAiUsage() {
    const models = this.workspace.models;
    return {
      models,
      anomalies: models.filter((m) => m.anomaly).map((m) => `${m.model}: ${m.anomaly}`),
    };
  }

  async getSubscriptions() {
    return this.workspace.subscriptions;
  }

  async getAutomation() {
    return this.workspace.automation;
  }

  async getRecommendations() {
    return this.workspace.recommendations;
  }

  async getRecommendation(id: string) {
    return this.workspace.recommendations.find((r) => r.id === id) ?? null;
  }

  async getForecast() {
    return this.workspace.forecast;
  }

  async getAssistantPresets() {
    return this.workspace.assistantPresets;
  }

  async getNotifications() {
    return this.workspace.notifications;
  }
}

/** Server/default source (baked Northline data). */
export const mockOpsSource = new WorkspaceOpsSource(DEFAULT_WORKSPACE);
export const SAMPLE_DATA_LABEL = DEFAULT_WORKSPACE.sampleLabel;
