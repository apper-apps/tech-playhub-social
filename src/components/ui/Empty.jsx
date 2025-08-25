import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by taking your first action.",
  icon = "Gamepad2",
  action,
  actionText = "Get Started",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-display text-gradient-primary mb-3">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <Button 
            onClick={action}
            variant="primary"
            size="lg"
            className="min-w-[140px] shadow-lg hover:shadow-purple-500/25"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;