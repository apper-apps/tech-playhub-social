import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  const inputClasses = cn(
    "flex h-12 w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200",
    error && "border-red-500 focus:ring-red-500",
    className
  );
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;