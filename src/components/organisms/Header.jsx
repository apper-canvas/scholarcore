import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, subtitle, onMobileMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 mr-3"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm text-gray-500">
            <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;