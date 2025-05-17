import { Application, RiskLevel } from "../types";

/**
 * Calculate risk level based on risk score
 * > 70 = High risk
 * 40-70 = Medium risk
 * < 40 = Low risk
 */
export const calculateRiskLevel = (riskScore: number): RiskLevel => {
  if (riskScore > 70) {
    return RiskLevel.High;
  } else if (riskScore >= 40) {
    return RiskLevel.Medium;
  } else {
    return RiskLevel.Low;
  }
};

/**
 * Get color for risk level visualization
 */
export const getRiskColor = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.High:
      return "#ea384c"; // Red for High Risk
    case RiskLevel.Medium:
      return "#FEC6A1"; // Orange for Medium Risk
    case RiskLevel.Low:
      return "#F2FCE2"; // Green for Low Risk
    default:
      return "#F5F5F5"; // Default gray
  }
};

/**
 * Get text representation of risk level
 */
export const getRiskText = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.High:
      return "High Risk";
    case RiskLevel.Medium:
      return "Medium Risk";
    case RiskLevel.Low:
      return "Low Risk";
    default:
      return "Unknown";
  }
};

/**
 * Calculate KPIs from application list
 */
export const calculateKPIs = (applications: Application[]) => {
  const totalApps = applications.length;
  const totalCost = applications.reduce((sum, app) => sum + app.cost_annual, 0);
  
  const highRiskApps = applications.filter(app => calculateRiskLevel(app.risk_score) === RiskLevel.High).length;
  const mediumRiskApps = applications.filter(app => calculateRiskLevel(app.risk_score) === RiskLevel.Medium).length;
  const lowRiskApps = applications.filter(app => calculateRiskLevel(app.risk_score) === RiskLevel.Low).length;
  
  // Count lifecycle stages
  const lifecycles = applications.reduce((acc, app) => {
    acc[app.lifecycle] = (acc[app.lifecycle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extract unique business capabilities
  const businessCapabilities = [...new Set(applications.map(app => app.business_capability))];
  
  return {
    totalApps,
    totalCost,
    highRiskApps,
    mediumRiskApps,
    lowRiskApps,
    lifecycles,
    businessCapabilities
  };
};
