
// Application data types
export interface Application {
  id: string;
  name: string;
  owner: string;
  stack: string;
  business_capability: string;
  lifecycle: string;
  cost_annual: number;
  risk_score: number;
}

export interface Interface {
  id?: string;
  source: string;
  target: string;
  protocol: string;
  criticality: string;
}

// Risk levels based on score
export enum RiskLevel {
  High = "high",
  Medium = "medium",
  Low = "low"
}

// Business domain filter options
export type BusinessDomain = string;

// Criticality filter options
export type Criticality = "High" | "Medium" | "Low";

// Application with calculated risk level
export interface ApplicationWithRisk extends Application {
  riskLevel: RiskLevel;
}

// Lifecycle types for node colors
export enum Lifecycle {
  Production = "Production",
  Legacy = "Legacy",
  Planned = "Planned"
}

// Node type definitions 
export enum NodeType {
  Application = "application",
  InterfaceHub = "interface_hub"
}
