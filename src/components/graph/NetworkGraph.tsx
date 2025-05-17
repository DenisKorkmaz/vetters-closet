import React, { useEffect, useRef, useState } from 'react';
import { Application, Interface, ApplicationStatus, Criticality } from "../../types";
import { Network, DataSet, Node, Edge, Options, FontStyles } from 'vis-network/standalone';
import { useNavigate } from 'react-router-dom';
import { networkOptions, shouldDisablePhysics } from './GraphConfig';
import { getContrastColor } from '../../utils/graphUtils';
import GraphFilters from './GraphFilters';
import { Button } from '@/components/ui/button';

interface NetworkGraphProps {
  applications: Application[];
  interfaces: Interface[];
  width?: string;
  height?: string;
}

interface CustomNode extends Node {
  status?: ApplicationStatus;
  type?: string;
}

interface CustomEdge extends Edge {
  criticality?: Criticality;
  data?: string;
}

const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case 'healthy':
      return '#22c55e';
    case 'warning':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    default:
      return '#64748b';
  }
};

const NetworkGraph = ({ 
  applications, 
  interfaces,
  width = "100%",
  height = "100%" 
}: NetworkGraphProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const hasFittedRef = useRef<boolean>(false);
  const navigate = useNavigate();
  
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set(['healthy', 'warning', 'error'])
  );
  const [selectedCriticalities, setSelectedCriticalities] = useState<Set<Criticality>>(
    new Set([Criticality.High, Criticality.Medium, Criticality.Low])
  );
  
  const [nodes, setNodes] = useState<DataSet<CustomNode>>();
  const [edges, setEdges] = useState<DataSet<CustomEdge>>();

  const handleZoomToFit = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 600,
          easingFunction: "easeInOutQuad"
        }
      });
    }
  };

  useEffect(() => {
    if (!containerRef.current || applications.length === 0 || interfaces.length === 0) {
      return;
    }
    
    try {
      const nodesData = applications.map((app) => ({
        id: app.id,
        label: `${app.name}\n(${app.application_type})`,
        title: `${app.name}` +
               `${app.error_message ? '\n\nError: ' + app.error_message : ''}` +
               `${app.warning_message ? '\n\nWarning: ' + app.warning_message : ''}`,
        color: {
          background: getStatusColor(app.status),
          border: "#334155",
          highlight: { 
            background: getStatusColor(app.status), 
            border: "#0f172a" 
          },
          hover: {
            background: getStatusColor(app.status),
            border: "#0f172a"
          }
        },
        font: { 
          color: getContrastColor(getStatusColor(app.status)),
          size: 14,
          face: 'Inter, system-ui, -apple-system, sans-serif',
          bold: 'bold' as FontStyles,
          multi: false,
          align: 'center'
        },
        shape: 'box',
        shadow: true,
        status: app.status,
        type: "application"
      }));
      
      const edgesData = interfaces.map((interface_, index) => {
        const sourceApp = applications.find(app => app.id === interface_.source);
        const targetApp = applications.find(app => app.id === interface_.target);
        
        // Only create edge if both source and target applications exist
        if (!sourceApp || !targetApp) return null;
        
        const isAffectedByError = 
          sourceApp?.status === 'error' || 
          targetApp?.status === 'error';
        
        const width = interface_.criticality === Criticality.High ? 3 : 
                     interface_.criticality === Criticality.Medium ? 2 : 1;
        
        return {
          id: interface_.id || index.toString(),
          from: interface_.source,
          to: interface_.target,
          label: interface_.data,
          title: `${interface_.description}\n` +
                 `Protocol: ${interface_.protocol}\n` +
                 `Criticality: ${interface_.criticality}\n` +
                 `Data: ${interface_.data}`,
          color: { 
            color: isAffectedByError ? '#ef4444' : '#64748b',
            highlight: isAffectedByError ? '#dc2626' : '#475569',
            hover: isAffectedByError ? '#dc2626' : '#475569'
          },
          width,
          dashes: isAffectedByError,
          criticality: interface_.criticality,
          smooth: { 
            enabled: true,
            type: "curvedCW",
            roundness: 0.2
          },
          font: {
            size: 12,
            align: 'horizontal',
            face: 'Inter, system-ui, -apple-system, sans-serif',
            background: 'white',
            strokeWidth: 4,
            strokeColor: 'white',
            multi: false,
            bold: 'normal' as FontStyles
          },
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.7,
              type: 'arrow'
            }
          }
        };
      }).filter(Boolean) as CustomEdge[]; // Filter out null values and cast to CustomEdge[]
      
      const nodesDataset = new DataSet<CustomNode>(nodesData);
      const edgesDataset = new DataSet<CustomEdge>(edgesData);
      
      setNodes(nodesDataset);
      setEdges(edgesDataset);
      
      if (networkRef.current) {
        networkRef.current.destroy();
      }
      
      networkRef.current = new Network(
        containerRef.current,
        { nodes: nodesDataset, edges: edgesDataset },
        networkOptions
      );
      
      networkRef.current.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          navigate(`/app/${nodeId}`);
        }
      });
      
      networkRef.current.once("stabilizationIterationsDone", () => {
        if (networkRef.current && !hasFittedRef.current) {
          setTimeout(() => {
            if (networkRef.current) {
              networkRef.current.fit({
                animation: {
                  duration: 600,
                  easingFunction: "easeInOutQuad"
                }
              });
              
              networkRef.current.setOptions({ physics: { enabled: false } });
              hasFittedRef.current = true;
            }
          }, 1000);
        }
      });
    } catch (error) {
      console.error('NetworkGraph: Error initializing graph', error);
    }
    
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
      hasFittedRef.current = false;
    };
  }, [applications, interfaces, navigate]);
  
  useEffect(() => {
    if (!nodes) return;
    
    nodes.forEach((node: CustomNode) => {
      const isVisible = selectedStatuses.has(node.status || 'healthy');
      if (nodes.get(node.id)) {
        nodes.update({ id: node.id, hidden: !isVisible });
      }
    });
  }, [selectedStatuses, nodes]);
  
  useEffect(() => {
    if (!edges) return;
    
    edges.forEach((edge: CustomEdge) => {
      const isVisible = selectedCriticalities.has(edge.criticality || Criticality.Low);
      if (edges.get(edge.id)) {
        edges.update({ id: edge.id, hidden: !isVisible });
      }
    });
  }, [selectedCriticalities, edges]);
  
  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses(prev => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(status);
      } else {
        updated.delete(status);
      }
      return updated;
    });
  };
  
  const handleCriticalityChange = (criticality: Criticality, checked: boolean) => {
    setSelectedCriticalities(prev => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(criticality);
      } else {
        updated.delete(criticality);
      }
      return updated;
    });
  };

  return (
    <div className="flex gap-4">
      <div 
        className="flex-grow relative h-[70vh] min-h-[500px] bg-white rounded-md p-4"
      >
        <div 
          ref={containerRef} 
          style={{ width: "100%", height: "100%" }} 
          className="border border-gray-200 rounded-md"
        />
        <Button 
          onClick={handleZoomToFit} 
          className="fixed bottom-4 right-4 shadow-md"
          variant="secondary"
        >
          Zoom to Fit
        </Button>
      </div>
      <GraphFilters
        onStatusChange={handleStatusChange}
        onCriticalityChange={handleCriticalityChange}
        onZoomToFit={handleZoomToFit}
        selectedStatuses={selectedStatuses}
        selectedCriticalities={selectedCriticalities}
      />
    </div>
  );
};

export default NetworkGraph;
