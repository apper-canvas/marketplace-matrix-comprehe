import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
    accent: "bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-sm",
    outline: "border border-gray-300 text-gray-700 bg-white"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const badgeClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;