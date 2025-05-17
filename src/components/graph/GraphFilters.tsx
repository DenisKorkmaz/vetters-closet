import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Lifecycle, Criticality } from "../../types";

interface GraphFiltersProps {
  onStatusChange: (status: string, checked: boolean) => void;
  onCriticalityChange: (criticality: string, checked: boolean) => void;
  onZoomToFit: () => void;
  selectedStatuses: Set<string>;
  selectedCriticalities: Set<string>;
}

const GraphFilters: React.FC<GraphFiltersProps> = ({
  onStatusChange,
  onCriticalityChange,
  onZoomToFit,
  selectedStatuses,
  selectedCriticalities
}) => {
  return (
    <div className="w-64 space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">System Status</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-healthy"
              checked={selectedStatuses.has('healthy')}
              onCheckedChange={(checked) => onStatusChange('healthy', checked as boolean)}
            />
            <label htmlFor="status-healthy" className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              Healthy
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-warning"
              checked={selectedStatuses.has('warning')}
              onCheckedChange={(checked) => onStatusChange('warning', checked as boolean)}
            />
            <label htmlFor="status-warning" className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              Warning
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="status-error"
              checked={selectedStatuses.has('error')}
              onCheckedChange={(checked) => onStatusChange('error', checked as boolean)}
            />
            <label htmlFor="status-error" className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Error
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Interface Criticality</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="criticality-high"
              checked={selectedCriticalities.has('High')}
              onCheckedChange={(checked) => onCriticalityChange('High', checked as boolean)}
            />
            <label htmlFor="criticality-high" className="text-sm flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-600" style={{ height: '3px' }} />
              High
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="criticality-medium"
              checked={selectedCriticalities.has('Medium')}
              onCheckedChange={(checked) => onCriticalityChange('Medium', checked as boolean)}
            />
            <label htmlFor="criticality-medium" className="text-sm flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-600" style={{ height: '2px' }} />
              Medium
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="criticality-low"
              checked={selectedCriticalities.has('Low')}
              onCheckedChange={(checked) => onCriticalityChange('Low', checked as boolean)}
            />
            <label htmlFor="criticality-low" className="text-sm flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-600" />
              Low
            </label>
          </div>
        </div>
      </Card>

      <Button 
        onClick={onZoomToFit}
        variant="outline"
        className="w-full"
      >
        Zoom to Fit
      </Button>
    </div>
  );
};

export default GraphFilters;
