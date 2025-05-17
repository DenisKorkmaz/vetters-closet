import React, { useEffect, useRef, useMemo } from 'react';
import { Network, Node, Edge, Options } from 'vis-network';
import { DataSet } from 'vis-data';

interface SystemNode extends Node {
  id: string;
  label: string;
  color: string;
  title?: string;
}

interface SystemEdge extends Edge {
  from: string;
  to: string;
  label: string;
  arrows: string;
  color?: { color: string };
  title?: string;
}

const baseSystemNodes: SystemNode[] = [
  { id: 'ERP', label: 'ERP', color: '#6366f1' },
  { id: 'MES', label: 'MES', color: '#14b8a6' },
  { id: 'LIMS', label: 'LIMS', color: '#f97316' },
  { id: 'QMS', label: 'QMS', color: '#8b5cf6' },
  { id: 'DMS', label: 'DMS', color: '#ec4899' },
];

const baseSystemEdges: SystemEdge[] = [
  // ERP Dependencies
  { from: 'ERP', to: 'MES', label: 'Production Orders, BOM, Specs', arrows: 'to' },
  { from: 'MES', to: 'ERP', label: 'Production Progress, Material Use', arrows: 'to' },
  { from: 'QMS', to: 'ERP', label: 'Batch Release Status', arrows: 'to' },

  // MES Dependencies
  { from: 'MES', to: 'LIMS', label: 'Sample Info, Test Requests', arrows: 'to' },
  { from: 'MES', to: 'QMS', label: 'Deviations, Parameters, Batch Status', arrows: 'to' },
  { from: 'DMS', to: 'MES', label: 'SOPs, Batch Records', arrows: 'to' },
  { from: 'LIMS', to: 'MES', label: 'Test Results', arrows: 'to' },
  { from: 'QMS', to: 'MES', label: 'Deviation Info, CAPA Status', arrows: 'to' },

  // LIMS Dependencies
  { from: 'LIMS', to: 'MES', label: 'QC Results, Batch Status', arrows: 'to' },
  { from: 'LIMS', to: 'QMS', label: 'OOS Results, Quality Status', arrows: 'to' },
  { from: 'MES', to: 'LIMS', label: 'Sample Info', arrows: 'to' },
  { from: 'DMS', to: 'LIMS', label: 'Test Methods, Specs', arrows: 'to' },

  // QMS Dependencies
  { from: 'QMS', to: 'ERP', label: 'Release Status', arrows: 'to' },
  { from: 'MES', to: 'QMS', label: 'Parameters, Deviations', arrows: 'to' },
  { from: 'LIMS', to: 'QMS', label: 'QC Results', arrows: 'to' },
  { from: 'DMS', to: 'QMS', label: 'SOPs, CAPA Records', arrows: 'to' },

  // DMS Dependencies
  { from: 'DMS', to: 'LIMS', label: 'Test Methods', arrows: 'to' },
  { from: 'DMS', to: 'QMS', label: 'SOPs, CAPA Templates', arrows: 'to' },
  { from: 'DMS', to: 'ERP', label: 'Specs, Documents', arrows: 'to' },
];

const options: Options = {
  nodes: {
    shape: 'box',
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    font: {
      size: 16,
      color: '#ffffff'
    },
    borderWidth: 2,
    shadow: true
  },
  edges: {
    font: {
      size: 12,
      align: 'middle'
    },
    color: { color: '#64748b' },
    smooth: {
      enabled: true,
      type: 'curvedCW',
      roundness: 0.2
    }
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -100,
      centralGravity: 0.01,
      springLength: 200,
      springConstant: 0.08
    },
    stabilization: {
      enabled: true,
      iterations: 1000
    }
  },
  layout: {
    hierarchical: {
      enabled: false
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    zoomView: true,
    dragView: true
  }
};

interface SystemError {
  systemId: string;
  errorMessage: string;
}

interface DependencyGraphProps {
  className?: string;
  errorState?: SystemError;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ 
  className = '',
  errorState
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  console.log('DependencyGraph: Component rendering', { errorState });

  // Calculate affected systems and prepare nodes/edges with error states
  const { nodes: systemNodes, edges: systemEdges } = useMemo(() => {
    console.log('DependencyGraph: Preparing nodes and edges');
    const nodes = [...baseSystemNodes];
    const edges = [...baseSystemEdges];

    if (errorState) {
      console.log('DependencyGraph: Applying error state to nodes and edges');
      // Find the failing system and mark it red
      const failingNode = nodes.find(node => node.id === errorState.systemId);
      if (failingNode) {
        failingNode.color = '#ef4444'; // Red color
        failingNode.title = `Error: ${errorState.errorMessage}`;

        // Find all edges that depend on the failing system
        const affectedEdges = edges.filter(edge => 
          edge.from === errorState.systemId || edge.to === errorState.systemId
        );

        // Mark affected edges and their connected systems
        affectedEdges.forEach(edge => {
          edge.color = { color: '#ef4444' };
          edge.title = `Affected by ${errorState.systemId} failure`;

          // Mark connected systems as affected (orange)
          const connectedId = edge.from === errorState.systemId ? edge.to : edge.from;
          const connectedNode = nodes.find(node => node.id === connectedId);
          if (connectedNode && connectedNode.id !== errorState.systemId) {
            connectedNode.color = '#f97316'; // Orange color
            connectedNode.title = `Affected by ${errorState.systemId} failure`;
          }
        });
      }
    }

    return { nodes, edges };
  }, [errorState]);

  useEffect(() => {
    console.log('DependencyGraph: Initializing network', { 
      containerExists: !!containerRef.current,
      nodesCount: systemNodes.length,
      edgesCount: systemEdges.length
    });

    if (!containerRef.current) {
      console.warn('DependencyGraph: Container ref is not available');
      return;
    }

    try {
      const nodes = new DataSet<SystemNode>(systemNodes);
      const edges = new DataSet<SystemEdge>(systemEdges);
      console.log('DependencyGraph: Created DataSets', { 
        nodesSize: nodes.length,
        edgesSize: edges.length 
      });

      const data = { nodes, edges };
      networkRef.current = new Network(containerRef.current, data, options);
      console.log('DependencyGraph: Network instance created successfully');

      // Clean up
      return () => {
        if (networkRef.current) {
          console.log('DependencyGraph: Cleaning up network instance');
          networkRef.current.destroy();
        }
      };
    } catch (error) {
      console.error('DependencyGraph: Error initializing network', error);
    }
  }, [systemNodes, systemEdges]);

  return (
    <div className="space-y-4">
      <div className={`w-full h-[600px] border border-border rounded-lg bg-card ${className}`}>
        <div ref={containerRef} className="w-full h-full" />
      </div>
      {errorState && (
        <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <span>Failed System</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full" />
            <span>Affected Systems</span>
          </div>
          <div className="ml-4 text-red-500">
            Error in {errorState.systemId}: {errorState.errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph; 