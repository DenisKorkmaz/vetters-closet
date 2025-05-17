import { Application, Interface, ApplicationStatus, Lifecycle, Criticality } from "../types";

// Sample application data based on the drug manufacturing systems
export const sampleApplications: Application[] = [
  {
    id: "ERP",
    name: "SAP S/4HANA",
    description: "Core ERP system managing enterprise-wide business processes including finance, procurement, and sales",
    application_type: "ERP",
    business_functions: [
      "Financial Accounting",
      "Procurement",
      "Sales Order Management",
      "Production Planning",
      "Material Management"
    ],
    owner: "John Smith",
    owner_department: "IT Operations",
    contact_person: "John Smith",
    contact_email: "john.smith@pharma.com",
    contact_phone: "+49 (0)30 12345-678",
    stack: "SAP HANA, ABAP, Fiori UI",
    databases: "SAP HANA 2.0",
    operating_system: "SUSE Linux Enterprise Server",
    business_capability: "Enterprise Resource Planning",
    lifecycle: Lifecycle.Production,
    cost_annual: 420000,
    risk_score: 35,
    status: "healthy" as ApplicationStatus,
    last_update: "2024-03-15",
    data_processed: [
      "Financial Records",
      "Purchase Orders",
      "Sales Orders",
      "Material Master Data",
      "Customer Data"
    ],
    data_storage: "SAP HANA In-Memory Database, with disaster recovery in Azure"
  },
  {
    id: "MES",
    name: "Siemens SIMATIC IT",
    description: "Manufacturing Execution System for production process control and monitoring",
    application_type: "MES",
    business_functions: [
      "Production Execution",
      "Process Control",
      "Quality Control",
      "Material Tracking",
      "Production Scheduling"
    ],
    owner: "Sarah Johnson",
    owner_department: "Production",
    contact_person: "Sarah Johnson",
    contact_email: "sarah.johnson@pharma.com",
    contact_phone: "+49 (0)30 12345-679",
    stack: "Java, Oracle, OPC UA",
    databases: "Oracle 19c RAC",
    operating_system: "Windows Server 2019",
    business_capability: "Manufacturing",
    lifecycle: Lifecycle.Production,
    cost_annual: 260000,
    risk_score: 85,
    status: "error" as ApplicationStatus,
    error_message: "Database connection timeout - Production data not syncing",
    last_update: "2024-03-10",
    data_processed: [
      "Production Orders",
      "Batch Records",
      "Equipment Status",
      "Process Parameters",
      "Material Movements"
    ],
    data_storage: "Oracle RAC Cluster with local redundancy"
  },
  {
    id: "LIMS",
    name: "Thermo Fisher SampleManager LIMS",
    description: "Laboratory Information Management System for sample tracking and quality control",
    application_type: "LIMS",
    business_functions: [
      "Sample Management",
      "Test Execution",
      "Results Management",
      "Instrument Integration",
      "CoA Generation"
    ],
    owner: "Michael Chen",
    owner_department: "Quality Control",
    contact_person: "Michael Chen",
    contact_email: "michael.chen@pharma.com",
    contact_phone: "+49 (0)30 12345-680",
    stack: "Python, PostgreSQL, React",
    databases: "PostgreSQL 15",
    operating_system: "Red Hat Enterprise Linux 8",
    business_capability: "Quality Management",
    lifecycle: Lifecycle.Production,
    cost_annual: 165000,
    risk_score: 35,
    status: "healthy" as ApplicationStatus,
    last_update: "2024-03-14",
    data_processed: [
      "Sample Data",
      "Test Results",
      "Instrument Data",
      "Specifications",
      "Certificates of Analysis"
    ],
    data_storage: "PostgreSQL with streaming replication to standby"
  },
  {
    id: "QMS",
    name: "TrackWise Digital QMS",
    description: "Quality Management System for compliance and quality assurance",
    application_type: "QMS",
    business_functions: [
      "Document Control",
      "Change Control",
      "CAPA Management",
      "Audit Management",
      "Training Management"
    ],
    owner: "Emma Davis",
    owner_department: "Quality Assurance",
    contact_person: "Emma Davis",
    contact_email: "emma.davis@pharma.com",
    contact_phone: "+49 (0)30 12345-681",
    stack: "Java, PostgreSQL, Angular",
    databases: "PostgreSQL 14",
    operating_system: "Windows Server 2019",
    business_capability: "Quality Management",
    lifecycle: Lifecycle.Production,
    cost_annual: 110000,
    risk_score: 65,
    status: "warning" as ApplicationStatus,
    warning_message: "Security update required - Compliance patch pending",
    last_update: "2024-01-20",
    data_processed: [
      "Quality Records",
      "SOPs",
      "Change Requests",
      "CAPAs",
      "Audit Reports"
    ],
    data_storage: "PostgreSQL with AWS RDS backup"
  },
  {
    id: "DMS",
    name: "OpenText Documentum",
    description: "Enterprise Document Management System for regulatory documentation",
    application_type: "DMS",
    business_functions: [
      "Document Management",
      "Records Management",
      "Regulatory Submissions",
      "Archive Management",
      "Workflow Management"
    ],
    owner: "David Wilson",
    owner_department: "Document Control",
    contact_person: "David Wilson",
    contact_email: "david.wilson@pharma.com",
    contact_phone: "+49 (0)30 12345-682",
    stack: "Java, Documentum Server, REST APIs",
    databases: "Oracle 19c",
    operating_system: "Red Hat Enterprise Linux 8",
    business_capability: "Document Management",
    lifecycle: Lifecycle.Production,
    cost_annual: 88000,
    risk_score: 30,
    status: "healthy" as ApplicationStatus,
    last_update: "2024-03-12",
    data_processed: [
      "Regulatory Documents",
      "Technical Documents",
      "Validation Records",
      "Product Specifications",
      "Research Documents"
    ],
    data_storage: "Oracle Database with content stored in Documentum content server"
  },
  {
    id: "SUP",
    name: "Splunk Enterprise",
    description: "Centralized monitoring and logging platform for application performance",
    application_type: "Monitoring",
    business_functions: [
      "Application Monitoring",
      "Log Management",
      "Performance Monitoring",
      "Security Monitoring",
      "Alert Management"
    ],
    owner: "Lisa Anderson",
    owner_department: "IT Operations",
    contact_person: "Lisa Anderson",
    contact_email: "lisa.anderson@pharma.com",
    contact_phone: "+49 (0)30 12345-683",
    stack: "Splunk Enterprise, Splunk Forwarders, REST APIs",
    databases: "Splunk Index Storage",
    operating_system: "Linux (Various Distributions)",
    business_capability: "IT Operations",
    lifecycle: Lifecycle.Production,
    cost_annual: 70000,
    risk_score: 25,
    status: "healthy" as ApplicationStatus,
    last_update: "2024-03-15",
    data_processed: [
      "Application Logs",
      "System Metrics",
      "Performance Data",
      "Security Events",
      "Network Data"
    ],
    data_storage: "Splunk Indexers with clustered storage"
  }
];

// Sample interface data with more detailed descriptions
export const sampleInterfaces: Interface[] = [
  {
    id: "INT001",
    source: "ERP",
    target: "MES",
    protocol: "SAP PI/PO REST API",
    criticality: Criticality.High,
    description: "Production order release and material requirements planning",
    data: "Production Orders & BOM"
  },
  {
    id: "INT002",
    source: "MES",
    target: "LIMS",
    protocol: "OPC UA / REST",
    criticality: Criticality.High,
    description: "In-process control samples and quality inspection requests",
    data: "IPC Samples & Tests"
  },
  {
    id: "INT003",
    source: "MES",
    target: "ERP",
    protocol: "SAP PI/PO OPC UA",
    criticality: Criticality.High,
    description: "Batch completion confirmation and material consumption",
    data: "Batch Records"
  },
  {
    id: "INT004",
    source: "ERP",
    target: "QMS",
    protocol: "REST API",
    criticality: Criticality.Medium,
    description: "Quality inspection lots and material specifications",
    data: "Quality Controls"
  },
  {
    id: "INT005",
    source: "QMS",
    target: "DMS",
    protocol: "CMIS / WebDAV",
    criticality: Criticality.Medium,
    description: "GMP documentation and quality records archival",
    data: "GMP Documents"
  },
  {
    id: "INT006",
    source: "LIMS",
    target: "QMS",
    protocol: "REST API",
    criticality: Criticality.High,
    description: "Laboratory results and CoA generation",
    data: "Lab Results & CoA"
  },
  {
    id: "INT007",
    source: "SUP",
    target: "ERP",
    protocol: "Splunk HTTP Event Collector",
    criticality: Criticality.Low,
    description: "ERP system health and performance monitoring",
    data: "System Metrics"
  },
  {
    id: "INT008",
    source: "SUP",
    target: "MES",
    protocol: "Splunk Universal Forwarder",
    criticality: Criticality.Low,
    description: "Production system monitoring and alerts",
    data: "System Metrics"
  },
  {
    id: "INT009",
    source: "SUP",
    target: "LIMS",
    protocol: "Splunk Universal Forwarder",
    criticality: Criticality.Low,
    description: "Laboratory system performance monitoring",
    data: "System Metrics"
  },
  {
    id: "INT010",
    source: "SUP",
    target: "QMS",
    protocol: "Splunk Universal Forwarder",
    criticality: Criticality.Low,
    description: "Quality system compliance monitoring",
    data: "System Metrics"
  },
  {
    id: "INT011",
    source: "SUP",
    target: "DMS",
    protocol: "Splunk Universal Forwarder",
    criticality: Criticality.Low,
    description: "Document system availability monitoring",
    data: "System Metrics"
  }
];

/**
 * Function to simulate fetching applications data
 */
export const fetchApplications = (): Promise<Application[]> => {
  return new Promise((resolve) => {
    // Get applications from localStorage
    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Combine with sample applications
    const allApps = [...sampleApplications, ...storedApps];
    
    // Return combined list
    resolve(allApps);
  });
};

/**
 * Function to simulate fetching interfaces data
 */
export const fetchInterfaces = (): Promise<Interface[]> => {
  return new Promise((resolve) => {
    // Get interfaces from localStorage
    const storedInterfaces = JSON.parse(localStorage.getItem('interfaces') || '[]');
    
    // Combine with sample interfaces
    const allInterfaces = [...sampleInterfaces, ...storedInterfaces];
    
    // Return combined list
    resolve(allInterfaces);
  });
};

/**
 * Function to simulate fetching an application by ID
 */
export const fetchApplicationById = (id: string): Promise<Application | null> => {
  return new Promise((resolve) => {
    // Get applications from localStorage
    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Combine with sample applications
    const allApps = [...sampleApplications, ...storedApps];
    
    // Find the application
    const app = allApps.find(app => app.id === id);
    resolve(app || null);
  });
};

/**
 * Function to simulate fetching interfaces for a specific application
 */
export const fetchInterfacesForApplication = (appId: string): Promise<Interface[]> => {
  return new Promise((resolve) => {
    // Get interfaces from localStorage
    const storedInterfaces = JSON.parse(localStorage.getItem('interfaces') || '[]');
    
    // Combine with sample interfaces
    const allInterfaces = [...sampleInterfaces, ...storedInterfaces];
    
    // Find interfaces for the application
    const relatedInterfaces = allInterfaces.filter(
      intf => intf.source === appId || intf.target === appId
    );
    resolve(relatedInterfaces);
  });
};

/**
 * CSV format for applications
 * This would be used for the seed script
 */
export const appsCsvSample = `id,name,owner,stack,business_capability,lifecycle,cost_annual,risk_score,status,error_message,last_update
app-001,SAP ERP,Finance Department,"SAP HANA, ABAP",Finance,Production,420000,85,healthy,,2024-03-15
app-002,MES (Manufacturing Execution System),Production,"Java, Oracle",Manufacturing,Production,260000,72,error,Database connection timeout - Production data not syncing,2024-03-10
app-003,LIMS (Laboratory Information Management),Quality Control,"Python, PostgreSQL",Quality,Production,165000,68,healthy,,2024-03-14
app-004,Legacy Inventory System,Warehouse,"COBOL, DB2",Supply Chain,End of Life,110000,28,warning,Security update required - Critical patch pending,2024-01-20
app-005,CRM System,Sales,Salesforce,Sales,Production,230000,76,healthy,,2024-03-15
app-006,Document Management System,Regulatory Affairs,"SharePoint, .NET",Document Management,Production,88000,65,healthy,,2024-03-12
app-007,Clinical Trials Portal,Clinical Research,"React, Node.js, MongoDB",Clinical,Development,290000,58,warning,Performance degradation detected - Optimization needed,2024-03-01
app-008,HR Management System,Human Resources,SAP SuccessFactors,HR,Production,160000,81,healthy,,2024-03-13
app-009,Legacy Reporting Tool,Business Intelligence,"Crystal Reports, SQL Server",Analytics,Sunset,79000,35,healthy,,2024-03-14
app-010,Supply Chain Management,Logistics,"Java, Oracle",Supply Chain,Production,295000,74,healthy,,2024-03-15`;

/**
 * CSV format for interfaces
 * This would be used for the seed script
 */
export const interfacesCsvSample = `source,target,protocol,criticality
app-001,app-004,SOAP API,High
app-001,app-010,REST API,High
app-001,app-008,SFTP,Medium
app-002,app-003,REST API,High
app-002,app-004,Batch File,Medium
app-003,app-006,REST API,Medium
app-005,app-001,SOAP API,High
app-005,app-007,REST API,Low
app-007,app-003,GraphQL,Medium
app-007,app-006,REST API,High
app-009,app-001,ODBC,Medium
app-010,app-004,SOAP API,Medium`;

/**
 * Function to simulate seeding data to Supabase (in a real app, this would be in a server API)
 */
export const seedDemoData = async (): Promise<{ success: boolean, message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real application, this would send the data to Supabase
      resolve({ 
        success: true, 
        message: "Demo data successfully seeded to database"
      });
    }, 1200);
  });
};
