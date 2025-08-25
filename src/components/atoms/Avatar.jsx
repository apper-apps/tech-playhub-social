import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = "md",
  online = false,
  className = "",
  fallbackIcon = "User"
}) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20"
  };
  
  const containerClasses = cn(
    "relative inline-block",
    sizes[size],
    className
  );
  
  const avatarClasses = cn(
    "rounded-full object-cover border-2 border-gray-600",
    "bg-gradient-to-br from-purple-500 to-pink-500",
    sizes[size]
  );
  
  const onlineIndicatorSize = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5", 
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
    "2xl": "w-5 h-5"
  };
  
  return (
    <div className={containerClasses}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className={avatarClasses}
        />
      ) : (
        <div className={cn(avatarClasses, "flex items-center justify-center")}>
          <ApperIcon 
            name={fallbackIcon} 
            className={cn(
              "text-white",
              size === "xs" && "w-3 h-3",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              size === "lg" && "w-6 h-6",
              size === "xl" && "w-8 h-8",
              size === "2xl" && "w-10 h-10"
            )}
          />
        </div>
      )}
      
      {online && (
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 bg-green-500 border-2 border-gray-900 rounded-full",
          "shadow-lg animate-pulse-glow",
          onlineIndicatorSize[size]
        )} />
      )}
    </div>
  );
};

export default Avatar;