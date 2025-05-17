import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Application, Interface, RiskLevel, ApplicationStatus } from "../types";
import { 
  fetchApplicationById, 
  fetchInterfacesForApplication, 
  fetchApplications 
} from "../services/mockData";
import { calculateRiskLevel, getRiskText } from "../utils/riskUtils";
import Layout from "../components/layout/Layout";
import RiskBadge from "../components/ui/RiskBadge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Helper function to get status color
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

// Helper function to get status text
const getStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case 'healthy':
      return 'Healthy';
    case 'warning':
      return 'Warning';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
};

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [interfaces, setInterfaces] = useState<Interface[]>([]);
  const [relatedApps, setRelatedApps] = useState<Record<string, Application>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Load application details
        const app = await fetchApplicationById(id);
        if (!app) {
          toast({
            title: "Application not found",
            description: "The requested application could not be found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        setApplication(app);
        
        // Load interfaces for this application
        const appInterfaces = await fetchInterfacesForApplication(id);
        setInterfaces(appInterfaces);
        
        // Load related applications
        const allApps = await fetchApplications();
        const relatedAppIds = new Set<string>();
        
        appInterfaces.forEach(intf => {
          if (intf.source === id) {
            relatedAppIds.add(intf.target);
          } else if (intf.target === id) {
            relatedAppIds.add(intf.source);
          }
        });
        
        const relatedAppsMap: Record<string, Application> = {};
        allApps.forEach(app => {
          if (relatedAppIds.has(app.id)) {
            relatedAppsMap[app.id] = app;
          }
        });
        
        setRelatedApps(relatedAppsMap);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load application details:", error);
        toast({
          title: "Error loading application details",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vetter-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Application Not Found</h1>
          <p className="mb-6">The requested application could not be found.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const riskLevel = calculateRiskLevel(application.risk_score);
  const inboundInterfaces = interfaces.filter(intf => intf.target === application.id);
  const outboundInterfaces = interfaces.filter(intf => intf.source === application.id);

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link 
          to="/dashboard" 
          className="text-vetter-purple hover:underline mr-4"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold">Application Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Information */}
        <Card className="bg-white p-6 col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{application.name}</h2>
              <p className="text-gray-600 mt-1">{application.description}</p>
              <div className="flex items-center mt-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                />
                <span className="text-sm font-medium">{getStatusText(application.status)}</span>
                {application.error_message && (
                  <span className="ml-2 text-sm text-red-600">{application.error_message}</span>
                )}
                {application.warning_message && (
                  <span className="ml-2 text-sm text-amber-600">{application.warning_message}</span>
                )}
              </div>
            </div>
            <RiskBadge riskLevel={riskLevel} size="lg" />
          </div>

          {/* Technical Details */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Technical Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Technology Stack</h4>
                <p>{application.stack}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Database</h4>
                <p>{application.databases}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Operating System</h4>
                <p>{application.operating_system}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Lifecycle Stage</h4>
                <p>{application.lifecycle}</p>
              </div>
            </div>
          </div>

          {/* Business Functions */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Business Functions</h3>
            <div className="flex flex-wrap gap-2">
              {application.business_functions.map((func, index) => (
                <Badge key={index} variant="secondary">{func}</Badge>
              ))}
            </div>
          </div>

          {/* Responsibility */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Responsibility</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Owner</h4>
                <p>{application.owner}</p>
                <p className="text-sm text-gray-500">{application.owner_department}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Person</h4>
                <p>{application.contact_person}</p>
                <div className="text-sm text-gray-500">
                  <a href={`mailto:${application.contact_email}`} className="hover:underline">{application.contact_email}</a>
                  <br />
                  <a href={`tel:${application.contact_phone}`} className="hover:underline">{application.contact_phone}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Data Management</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data Processed</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {application.data_processed.map((data, index) => (
                    <Badge key={index} variant="outline">{data}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Data Storage</h4>
                <p>{application.data_storage}</p>
              </div>
            </div>
          </div>

          {/* Cost and Risk */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Annual Cost</h4>
                <p className="text-xl font-semibold">
                  {formatCurrency(application.cost_annual)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Risk Assessment</h4>
                <div className="flex items-center">
                  <p className="text-xl font-semibold mr-2">{application.risk_score}/100</p>
                  <span className="text-sm text-gray-500">({getRiskText(riskLevel)})</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Information */}
        <Card className="bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Risk Assessment</h2>
          
          <div className="space-y-4">
            {riskLevel === RiskLevel.High && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="font-medium text-red-800 mb-1">High Risk</h3>
                <p className="text-sm text-red-700">
                  This application has critical risks that require immediate action. Modernization or replacement should be planned in the near term.
                </p>
              </div>
            )}
            
            {riskLevel === RiskLevel.Medium && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
                <h3 className="font-medium text-orange-800 mb-1">Medium Risk</h3>
                <p className="text-sm text-orange-700">
                  This application needs improvement. A gradual optimization of risk factors should be planned.
                </p>
              </div>
            )}
            
            {riskLevel === RiskLevel.Low && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-medium text-green-800 mb-1">Low Risk</h3>
                <p className="text-sm text-green-700">
                  This application is stable and meets requirements. Regular maintenance and updates should continue.
                </p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Lifecycle Stage</h3>
              {application.lifecycle === "End of Life" || application.lifecycle === "Sunset" ? (
                <Badge variant="destructive">{application.lifecycle}</Badge>
              ) : application.lifecycle === "Development" ? (
                <Badge variant="secondary">{application.lifecycle}</Badge>
              ) : (
                <Badge>{application.lifecycle}</Badge>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Interfaces</h3>
              <p className="text-sm">
                {interfaces.length} total connections
                <br />
                {inboundInterfaces.length} inbound, {outboundInterfaces.length} outbound
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button asChild variant="outline" className="w-full">
              <Link to={`/graph`}>View in Network Graph</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Interfaces */}
      <h2 className="text-xl font-semibold mb-4">Application Interfaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Inbound Interfaces */}
        <Card className="bg-white p-6">
          <h3 className="font-medium mb-4">Inbound Interfaces ({inboundInterfaces.length})</h3>
          
          {inboundInterfaces.length === 0 ? (
            <p className="text-gray-500 text-sm">No inbound interfaces</p>
          ) : (
            <div className="space-y-4">
              {inboundInterfaces.map((intf, index) => {
                const sourceApp = relatedApps[intf.source];
                if (!sourceApp) return null;
                
                const sourceRiskLevel = calculateRiskLevel(sourceApp.risk_score);
                
                return (
                  <div key={index} className="border border-gray-100 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/app/${sourceApp.id}`} 
                          className="font-medium text-vetter-purple hover:underline"
                        >
                          {sourceApp.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          {sourceApp.business_capability} | {sourceApp.lifecycle}
                        </div>
                      </div>
                      <RiskBadge riskLevel={sourceRiskLevel} size="sm" />
                    </div>
                    <div className="flex items-center mt-3">
                      <Badge variant="outline" className="mr-2">
                        {intf.protocol}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Criticality: {intf.criticality}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Outbound Interfaces */}
        <Card className="bg-white p-6">
          <h3 className="font-medium mb-4">Outbound Interfaces ({outboundInterfaces.length})</h3>
          
          {outboundInterfaces.length === 0 ? (
            <p className="text-gray-500 text-sm">No outbound interfaces</p>
          ) : (
            <div className="space-y-4">
              {outboundInterfaces.map((intf, index) => {
                const targetApp = relatedApps[intf.target];
                if (!targetApp) return null;
                
                const targetRiskLevel = calculateRiskLevel(targetApp.risk_score);
                
                return (
                  <div key={index} className="border border-gray-100 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/app/${targetApp.id}`} 
                          className="font-medium text-vetter-purple hover:underline"
                        >
                          {targetApp.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1">
                          {targetApp.business_capability} | {targetApp.lifecycle}
                        </div>
                      </div>
                      <RiskBadge riskLevel={targetRiskLevel} size="sm" />
                    </div>
                    <div className="flex items-center mt-3">
                      <Badge variant="outline" className="mr-2">
                        {intf.protocol}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Criticality: {intf.criticality}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AppDetail;
