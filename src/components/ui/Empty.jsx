import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No Students Found", 
  description = "Get started by adding your first student to the system.",
  onAction,
  actionLabel = "Add Student"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-4">
        <ApperIcon name="Users" className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;