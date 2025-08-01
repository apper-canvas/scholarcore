import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;