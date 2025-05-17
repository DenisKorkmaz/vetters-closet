import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, ZAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { calculateRiskLevel, getRiskColor } from "../../utils/riskUtils";
import { Application } from "../../types";

interface MetricsSectionProps {
  applications: Application[];
  businessDomainFilter: string;
  criticalityFilter: string;
}

interface RiskTrendPoint {
  month: string;
  averageRisk: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  applications, 
  businessDomainFilter, 
  criticalityFilter 
}) => {
  const navigate = useNavigate();
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [riskTrendData, setRiskTrendData] = useState<RiskTrendPoint[]>([]);
  
  useEffect(() => {
    let filtered = [...applications];
    
    if (businessDomainFilter !== 'all') {
      filtered = filtered.filter(app => app.business_capability === businessDomainFilter);
    }
    
    // Sort by risk score and cost for better visualization
    filtered.sort((a, b) => b.risk_score - a.risk_score);
    setFilteredApps(filtered);
    
    // Realistic risk trend data for a pharma environment
    const trendData = [
      { month: 'Jul 2024', averageRisk: 45 }, // Baseline
      { month: 'Aug 2024', averageRisk: 62 }, // Security patch needed
      { month: 'Sep 2024', averageRisk: 70 }, // Critical updates pending
      { month: 'Oct 2024', averageRisk: 65 }, // Partial updates applied
      { month: 'Nov 2024', averageRisk: 60 }, // System updates
      { month: 'Dec 2024', averageRisk: 58 }, // Year-end stability
      { month: 'Jan 2025', averageRisk: 55 }, // New year maintenance
      { month: 'Feb 2025', averageRisk: 48 }, // Updates completed
      { month: 'Mar 2025', averageRisk: 40 }, // System optimization
      { month: 'Apr 2025', averageRisk: 35 }, // Further improvements
      { month: 'May 2025', averageRisk: 32 }, // Stable state
      { month: 'Jun 2025', averageRisk: 30 }  // Target state
    ];
    
    setRiskTrendData(trendData);
  }, [applications, businessDomainFilter, criticalityFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleBubbleClick = (data: any) => {
    if (data && data.id) {
      navigate(`/app/${data.id}`);
    }
  };
  
  const getLifecycleColor = (lifecycle: string) => {
    switch (lifecycle.toLowerCase()) {
      case 'production':
        return '#22c55e';
      case 'legacy':
        return '#ef4444';
      case 'planned':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };

  const getTechStackSummary = (stack: string) => {
    const technologies = stack.split(',').map(tech => tech.trim());
    return technologies[0]; // Return primary technology
  };
  
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-6">System Landscape Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technical Debt & Risk Analysis */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Technical Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={filteredApps}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    label={{ 
                      value: 'Risk Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#4b5563' }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      const app = filteredApps.find(a => a.risk_score === value);
                      return [
                        `Risk Score: ${value}`,
                        `Stack: ${app?.stack}`,
                        `OS: ${app?.operating_system}`,
                        `DB: ${app?.databases}`
                      ].join('\n');
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      whiteSpace: 'pre-line'
                    }}
                  />
                  <Bar
                    dataKey="risk_score"
                    name="Technical Risk"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="Critical Risk" />
                  <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label="Moderate Risk" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">System Health Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={riskTrendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    interval={1}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    label={{ 
                      value: 'System Health Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#4b5563' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px'
                    }}
                  />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label="Critical Threshold" />
                  <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label="Warning Threshold" />
                  <Line
                    type="monotone"
                    dataKey="averageRisk"
                    name="Avg. Health Score"
                    stroke="#9b87f5"
                    strokeWidth={2}
                    dot={{ fill: '#9b87f5', r: 4 }}
                    activeDot={{ r: 6, fill: '#7c3aed' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack Analysis */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Technology vs. Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="risk_score" 
                    name="Risk Score"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    label={{ 
                      value: 'Risk Score', 
                      position: 'bottom',
                      style: { fill: '#4b5563' }
                    }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="cost_annual" 
                    name="Cost"
                    tick={{ fontSize: 12, fill: '#4b5563' }}
                    label={{ 
                      value: 'Annual Cost (k€)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fill: '#4b5563' }
                    }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px'
                    }}
                    content={(props) => {
                      if (!props.active || !props.payload || props.payload.length === 0) return null;
                      const data = props.payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                          <p className="font-semibold text-sm">{data.name}</p>
                          <p className="text-sm text-gray-600">Tech Stack: {data.stack}</p>
                          <p className="text-sm text-gray-600">Database: {data.databases}</p>
                          <p className="text-sm text-gray-600">OS: {data.operating_system}</p>
                          <p className="text-sm text-gray-600">Risk Score: {data.risk_score}</p>
                          <p className="text-sm text-gray-600">Annual Cost: {formatCurrency(data.cost_annual)}</p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine x={70} stroke="#ef4444" strokeDasharray="3 3" />
                  <ReferenceLine x={40} stroke="#f59e0b" strokeDasharray="3 3" />
                  <Scatter
                    name="Applications" 
                    data={filteredApps}
                    fill="#9b87f5"
                    onClick={handleBubbleClick}
                    cursor="pointer"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      const size = Math.sqrt(payload.cost_annual) / 100;
                      const radius = Math.max(6, Math.min(20, size));
                      
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={radius}
                          fill={getLifecycleColor(payload.lifecycle)}
                          stroke="#4b5563"
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MetricsSection;
