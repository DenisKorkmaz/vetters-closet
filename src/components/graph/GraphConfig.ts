import { Options } from "vis-network/standalone";

// Graph layout and physics configuration
export const networkOptions: Options = {
  layout: {
    improvedLayout: true,
    randomSeed: 2
  },
  nodes: {
    shape: "box",
    margin: {
      top: 15,
      right: 20,
      bottom: 15,
      left: 20
    },
    widthConstraint: {
      minimum: 150,    // More flexible minimum
      maximum: 200     // More flexible maximum
    },
    font: {
      size: 14,
      face: 'Inter, system-ui, -apple-system, sans-serif',
      align: 'center',
      color: '#ffffff',
      multi: 'html',
      bold: {
        size: 14,
        color: '#ffffff',
        face: 'Inter, system-ui, -apple-system, sans-serif'
      }
    },
    borderWidth: 2,
    color: {
      border: '#334155',
      background: '#4A90E2',
      highlight: {
        border: '#0f172a',
        background: '#357ABD'
      },
      hover: {
        border: '#0f172a',
        background: '#357ABD'
      }
    },
    shadow: {
      enabled: true,
      color: 'rgba(0,0,0,0.2)',
      size: 10,
      x: 5,
      y: 5
    }
  },
  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.7,
        type: 'arrow'
      }
    },
    smooth: {
      enabled: true,
      type: 'curvedCW',
      roundness: 0.2,
      forceDirection: "horizontal"
    },
    font: {
      size: 12,
      face: 'Inter, system-ui, -apple-system, sans-serif',
      align: 'middle',
      background: 'white',
      strokeWidth: 4,
      strokeColor: 'white'
    },
    color: {
      color: '#64748b',
      highlight: '#475569',
      hover: '#475569',
      inherit: false
    },
    width: 2,
    selectionWidth: 3,
    hoverWidth: 3
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -200,
      centralGravity: 0.01,
      springLength: 300,
      springConstant: 0.05,
      damping: 0.4,
      avoidOverlap: 1.2  // Increased to prevent overlap
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      fit: true
    }
  },
  interaction: {
    dragNodes: true,
    dragView: true,
    zoomView: true,
    hover: true,
    selectable: true,
    selectConnectedEdges: true,
    navigationButtons: true,
    keyboard: true,
    zoomSpeed: 0.5,
    tooltipDelay: 300,
    hideEdgesOnDrag: true,
    hideEdgesOnZoom: true
  }
};

// Function to disable physics for large graphs
export const shouldDisablePhysics = (edgeCount: number): boolean => {
  return edgeCount > 100;  // Only disable for very large graphs
};

// Helper to truncate long labels
export const truncateLabel = (label: string, maxLength: number = 40): string => {
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};
