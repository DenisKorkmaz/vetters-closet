export type ApplicationStatus = 'healthy' | 'warning' | 'error';

export enum RiskLevel {
  Low = "low",
  Medium = "medium",
  High = "high"
}

export enum Criticality {
  High = "High",
  Medium = "Medium",
  Low = "Low"
}

export enum Lifecycle {
  Development = "Development",
  Production = "Production",
  Legacy = "Legacy",
  Sunset = "Sunset",
  EndOfLife = "End of Life"
}

export enum NodeType {
  Application = "Application",
  InterfaceHub = "InterfaceHub"
}

export enum ApplicationType {
  ERP = "Enterprise Resource Planning (ERP)",
  CRM = "Customer Relationship Management (CRM)",
  MES = "Manufacturing Execution System (MES)",
  LIMS = "Laboratory Information Management System (LIMS)",
  QMS = "Quality Management System (QMS)",
  DMS = "Document Management System (DMS)",
  PLM = "Product Lifecycle Management (PLM)",
  SCM = "Supply Chain Management (SCM)",
  BPM = "Business Process Management (BPM)",
  BI = "Business Intelligence (BI)",
  MDM = "Master Data Management (MDM)",
  OTHER = "Other"
}

export interface Application {
  id: string;
  name: string;
  description: string;
  application_type: ApplicationType;
  business_functions: string[];
  owner: string;
  owner_department: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  stack: string;
  databases: string;
  operating_system: string;
  business_capability: string;
  lifecycle: Lifecycle;
  cost_annual: number;
  risk_score: number;
  status: ApplicationStatus;
  error_message?: string;
  warning_message?: string;
  last_update: string;
  data_processed: string[];
  data_storage: string;
  interfaces_count?: number;
}

export interface Interface {
  id: string;
  source: string;
  target: string;
  protocol: string;
  criticality: Criticality;
  description: string;
  data: string;
} 