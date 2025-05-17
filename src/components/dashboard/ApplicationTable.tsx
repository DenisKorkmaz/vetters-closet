import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Application, RiskLevel } from "../../types";
import { calculateRiskLevel } from "../../utils/riskUtils";
import RiskBadge from "../ui/RiskBadge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ApplicationTableProps {
  applications: Application[];
  businessDomainFilter: string;
  criticalityFilter: string;
}

type SortField = 'name' | 'owner' | 'business_capability' | 'lifecycle' | 'cost_annual' | 'risk_score';
type SortOrder = 'asc' | 'desc';

const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  businessDomainFilter,
  criticalityFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.stack.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBusinessDomain = 
      businessDomainFilter === 'all' || 
      app.business_capability === businessDomainFilter;

    let matchesCriticality = true;
    if (criticalityFilter !== 'all') {
      const riskLevel = calculateRiskLevel(app.risk_score);
      switch (criticalityFilter) {
        case 'high':
          matchesCriticality = riskLevel === RiskLevel.High;
          break;
        case 'medium':
          matchesCriticality = riskLevel === RiskLevel.Medium;
          break;
        case 'low':
          matchesCriticality = riskLevel === RiskLevel.Low;
          break;
      }
    }

    return matchesSearch && matchesBusinessDomain && matchesCriticality;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortField === 'cost_annual' || sortField === 'risk_score') {
      return sortOrder === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } 
    // String comparison
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    return sortOrder === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          type="search"
          placeholder="Search applications..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="ml-4 text-sm text-gray-500">
          Showing {filteredApplications.length} of {applications.length} applications
        </p>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('owner')}
              >
                Owner {sortField === 'owner' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('business_capability')}
              >
                Business Capability {sortField === 'business_capability' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('lifecycle')}
              >
                Lifecycle {sortField === 'lifecycle' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 text-right"
                onClick={() => handleSort('cost_annual')}
              >
                Annual Cost {sortField === 'cost_annual' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('risk_score')}
              >
                Risk {sortField === 'risk_score' && (sortOrder === 'asc' ? '▲' : '▼')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              sortedApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.owner}</TableCell>
                  <TableCell>{app.business_capability}</TableCell>
                  <TableCell>{app.lifecycle}</TableCell>
                  <TableCell className="text-right">{formatCurrency(app.cost_annual)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{app.risk_score}</span>
                      <RiskBadge riskLevel={calculateRiskLevel(app.risk_score)} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={`/app/${app.id}`} 
                      className="text-vetter-purple hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicationTable;
