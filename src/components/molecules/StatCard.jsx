import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendValue, className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
            }`}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className="h-4 w-4 mr-1" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;