
import React from "react";
import { RiskLevel } from "../../types";
import { getRiskText } from "../../utils/riskUtils";

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  size?: "sm" | "md" | "lg";
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel, size = "md" }) => {
  const getBgColor = () => {
    switch (riskLevel) {
      case RiskLevel.High:
        return "bg-risk-high";
      case RiskLevel.Medium:
        return "bg-risk-medium";
      case RiskLevel.Low:
        return "bg-risk-low";
      default:
        return "bg-risk-high";
    }
  };

  const getTextColor = () => {
    switch (riskLevel) {
      case RiskLevel.High:
        return "text-white";
      case RiskLevel.Medium:
        return "text-gray-800";
      case RiskLevel.Low:
        return "text-gray-800";
      default:
        return "text-white";
    }
  };

  const getSize = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-0.5";
      case "md":
        return "text-sm px-2.5 py-1";
      case "lg":
        return "text-base px-3 py-1.5";
      default:
        return "text-sm px-2.5 py-1";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getBgColor()} ${getTextColor()} ${getSize()}`}
    >
      {riskLevel === RiskLevel.High && "🟥 "}
      {riskLevel === RiskLevel.Medium && "🟧 "}
      {riskLevel === RiskLevel.Low && "🟩 "}
      {getRiskText(riskLevel)}
    </span>
  );
};

export default RiskBadge;
