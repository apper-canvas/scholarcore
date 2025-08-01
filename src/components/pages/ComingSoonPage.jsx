import React from "react";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const ComingSoonPage = ({ title, subtitle, icon, description, onMobileMenuToggle }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title={title} 
        subtitle={subtitle} 
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-8">
            <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <h3 className="font-semibold mb-2">Stay Tuned!</h3>
            <p className="text-sm opacity-90">
              We're working hard to bring you this feature. Check back soon for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;