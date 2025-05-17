import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-vetter-purple flex items-center justify-center text-white font-bold">V</div>
          <Link to="/" className="text-xl font-semibold text-gray-800">Vetters Closet</Link>
        </div>
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-vetter-purple-dark transition-colors">
            Dashboard
          </Link>
          <Link to="/graph" className="text-gray-600 hover:text-vetter-purple-dark transition-colors">
            Network Graph
          </Link>
          <Link to="/add-application" className="text-gray-600 hover:text-vetter-purple-dark transition-colors">
            Add Application
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
