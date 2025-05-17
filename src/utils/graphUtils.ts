import { Lifecycle, NodeType } from "../types";

// Colors for application lifecycles
export const getLifecycleColor = (lifecycle: string): string => {
  switch (lifecycle) {
    case Lifecycle.Production:
      return "#DAF5DC"; // Soft Green
    case Lifecycle.Legacy:
      return "#FFE0E0"; // Soft Pink
    case Lifecycle.Development:
      return "#E0F0FF"; // Soft Blue
    case Lifecycle.Sunset:
      return "#FFE8D9"; // Soft Orange
    case Lifecycle.EndOfLife:
      return "#FFE0E0"; // Soft Red
    default:
      return "#F5F5F5"; // Default light gray
  }
};

// Colors for interface criticality
export const getCriticalityColor = (criticality: string): string => {
  switch (criticality.toLowerCase()) {
    case "high":
      return "#ea384c"; // Red
    case "medium":
      return "#F97316"; // Bright Orange
    case "low":
    default:
      return "#888888"; // Gray
  }
};

// Determine node shape based on type
export const getNodeShape = (type: string): string => {
  switch (type) {
    case NodeType.InterfaceHub:
      return "diamond";
    case NodeType.Application:
    default:
      return "box";
  }
};

// Get font color based on background color brightness
export const getContrastColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Use dark text on light backgrounds and vice versa
  return luminance > 0.5 ? "#333333" : "#ffffff";
};
