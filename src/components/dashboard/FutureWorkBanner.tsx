
import React from "react";
import { Card } from "@/components/ui/card";

const FutureWorkBanner: React.FC = () => {
  return (
    <Card className="bg-white p-4 border-l-4 border-vetter-purple mb-6 shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-vetter-purple"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-vetter-purple-dark">
            Next Step: Replace CSV with auto-discovery API
          </h3>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Future work will integrate an automated scan API to replace manual CSV uploads. 
              This will enable real-time application discovery and continuous monitoring.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FutureWorkBanner;
