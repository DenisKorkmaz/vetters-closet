import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterControlsProps {
  businessDomains: string[];
  selectedBusinessDomain: string;
  onBusinessDomainChange: (domain: string) => void;
  selectedCriticality: string;
  onCriticalityChange: (criticality: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  businessDomains,
  selectedBusinessDomain,
  onBusinessDomainChange,
  selectedCriticality,
  onCriticalityChange
}) => {
  return (
    <div className="flex flex-wrap gap-6 mb-6 p-4 bg-white rounded-md shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="business-domain">Business Domain</Label>
        <Select
          value={selectedBusinessDomain}
          onValueChange={onBusinessDomainChange}
        >
          <SelectTrigger className="w-[200px]" id="business-domain">
            <SelectValue placeholder="Select Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {businessDomains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="criticality">Risk Level</Label>
        <Select 
          value={selectedCriticality} 
          onValueChange={onCriticalityChange}
        >
          <SelectTrigger className="w-[200px]" id="criticality">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterControls;
