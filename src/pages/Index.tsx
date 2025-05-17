
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "../components/layout/Layout";

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white p-8 shadow-sm mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Application Portfolio Management
          </h1>
          <p className="text-lg mb-8 text-center text-gray-600">
            Visualize your application landscape, identify risks, and optimize your technology portfolio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-vetter-bg p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-3">Dashboard View</h2>
              <p className="text-gray-600 mb-4">
                Explore your application portfolio with detailed metrics, risk assessments, and filtering capabilities.
              </p>
              <Button asChild className="bg-vetter-purple hover:bg-vetter-purple-dark">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            <div className="bg-vetter-bg p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-3">Network Graph</h2>
              <p className="text-gray-600 mb-4">
                Visualize application relationships and dependencies with an interactive force-directed graph.
              </p>
              <Button asChild className="bg-vetter-purple hover:bg-vetter-purple-dark">
                <Link to="/graph">View Graph</Link>
              </Button>
            </div>
          </div>

          <div className="bg-vetter-bg p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-3">Key Features</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-vetter-purple text-white flex items-center justify-center mr-2">✓</div>
                Comprehensive application inventory with metadata
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-vetter-purple text-white flex items-center justify-center mr-2">✓</div>
                Risk assessment with traffic light indicators
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-vetter-purple text-white flex items-center justify-center mr-2">✓</div>
                Interface mapping and dependency visualization
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-vetter-purple text-white flex items-center justify-center mr-2">✓</div>
                Business domain and criticality filtering
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-vetter-purple text-white flex items-center justify-center mr-2">✓</div>
                Admin tools for data management
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button asChild className="bg-vetter-purple hover:bg-vetter-purple-dark">
              <Link to="/admin/seed">Admin Area</Link>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
