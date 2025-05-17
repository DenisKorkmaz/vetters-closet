import React, { useEffect, useState } from "react";
import { Application } from "../types";
import { fetchApplications, fetchInterfaces } from "../services/mockData";
import { calculateKPIs } from "../utils/riskUtils";
import Layout from "../components/layout/Layout";
import KPICard from "../components/dashboard/KPICard";
import ApplicationTable from "../components/dashboard/ApplicationTable";
import FilterControls from "../components/dashboard/FilterControls";
import FutureWorkBanner from "../components/dashboard/FutureWorkBanner";
import MetricsSection from "../components/dashboard/MetricsSection";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessDomainFilter, setBusinessDomainFilter] = useState("all");
  const [criticalityFilter, setCriticalityFilter] = useState("all");
  const [businessDomains, setBusinessDomains] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apps = await fetchApplications();
        setApplications(apps);
        
        // Extract unique business domains
        const domains = [...new Set(apps.map(app => app.business_capability))];
        setBusinessDomains(domains);
        
        setLoading(false);
        toast({
          title: "Data loaded successfully",
          description: `Loaded ${apps.length} applications`,
        });
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error loading data",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Calculate KPIs
  const kpis = calculateKPIs(applications);

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
            <p className="mt-4 text-gray-600">Loading application data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">APM Dashboard</h1>
      
      <FutureWorkBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard 
          title="Total Applications" 
          value={kpis.totalApps}
          description="Number of applications in portfolio"
        />
        <KPICard 
          title="Total Annual Cost" 
          value={formatCurrency(kpis.totalCost)}
          description="Total yearly operating costs"
        />
        <KPICard 
          title="High Risk Applications" 
          value={kpis.highRiskApps}
          description="Applications marked for elimination"
        />
        <KPICard 
          title="Business Capabilities" 
          value={kpis.businessCapabilities.length}
          description="Unique business domains served"
        />
      </div>

      {/* Filters */}
      <FilterControls
        businessDomains={businessDomains}
        selectedBusinessDomain={businessDomainFilter}
        onBusinessDomainChange={setBusinessDomainFilter}
        selectedCriticality={criticalityFilter}
        onCriticalityChange={setCriticalityFilter}
      />

      {/* Metrics & Insights Section */}
      <MetricsSection 
        applications={applications}
        businessDomainFilter={businessDomainFilter}
        criticalityFilter={criticalityFilter}
      />

      {/* Application Table */}
      <ApplicationTable 
        applications={applications}
        businessDomainFilter={businessDomainFilter}
        criticalityFilter={criticalityFilter}
      />
    </Layout>
  );
};

export default Dashboard;
