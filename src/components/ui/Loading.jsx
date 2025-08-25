import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {/* Game Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-1/2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded w-20"></div>
              <div className="h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;