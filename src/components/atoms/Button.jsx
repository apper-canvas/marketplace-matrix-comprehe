import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "default",
  children,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 focus:ring-primary-500",
    secondary: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 focus:ring-gray-500",
    accent: "bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-lg hover:from-accent-500 hover:to-accent-600 hover:shadow-xl hover:scale-105 focus:ring-accent-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105 focus:ring-red-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed hover:scale-100",
    loading && "cursor-wait",
    className
  );

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />;
    }
    if (icon) {
      return <ApperIcon name={icon} className="h-4 w-4" />;
    }
    return null;
  };

  const iconElement = renderIcon();

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {iconElement && iconPosition === "left" && (
        <span className={children ? "mr-2" : ""}>{iconElement}</span>
      )}
      {children}
      {iconElement && iconPosition === "right" && (
        <span className={children ? "ml-2" : ""}>{iconElement}</span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;