import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({
  className,
  type = "text",
  label,
  error,
  icon,
  iconPosition = "left",
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputClasses = cn(
    "w-full px-4 py-3 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
    error 
      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
      : "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    icon && iconPosition === "left" && "pl-12",
    icon && iconPosition === "right" && "pr-12",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute inset-y-0 flex items-center pointer-events-none",
            iconPosition === "left" ? "left-3" : "right-3"
          )}>
            <ApperIcon 
              name={icon} 
              className="h-5 w-5 text-gray-400" 
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;