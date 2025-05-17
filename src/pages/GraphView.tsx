
import React, { useEffect, useState } from "react";
import { Application, Interface } from "../types";
import { fetchApplications, fetchInterfaces } from "../services/mockData";
import Layout from "../components/layout/Layout";
import NetworkGraph from "../components/graph/NetworkGraph";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const GraphView: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [apps, intf] = await Promise.all([
          fetchApplications(),
          fetchInterfaces()
        ]);
        setApplications(apps);
        setInterfaces(intf);
        setLoading(false);
        toast({
          title: "Network data loaded",
          description: `Loaded ${apps.length} applications and ${intf.length} interfaces`,
        });
      } catch (error) {
        console.error("Failed to load graph data:", error);
        toast({
          title: "Error loading graph data",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Application Network Graph</h1>
      
      <div className="mb-6">
        <Card className="bg-white p-4">
          <p className="text-sm text-gray-600">
            This visualization shows the relationships between applications in your IT landscape.
            Use the filters on the right to focus on specific application lifecycles or interface criticalities.
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vetter-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading network graph...</p>
          </div>
        </div>
      ) : (
        <div className="h-[70vh] min-h-[500px]">
          <NetworkGraph 
            applications={applications} 
            interfaces={interfaces}
            height="100%"
          />
        </div>
      )}
    </Layout>
  );
};

export default GraphView;
