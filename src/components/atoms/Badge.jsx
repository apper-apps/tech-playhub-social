import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default",
  size = "md",
  className = "" 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-700 text-gray-300",
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-500 text-white",
    accent: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
    online: "bg-green-500 text-white animate-pulse-glow"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs min-h-[16px]",
    md: "px-2.5 py-1 text-xs min-h-[20px]",
    lg: "px-3 py-1.5 text-sm min-h-[24px]"
  };
  
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;