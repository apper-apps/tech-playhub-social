import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-display text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="min-w-[120px]"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;