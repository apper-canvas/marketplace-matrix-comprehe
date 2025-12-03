import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  className,
  children,
  variant = "default",
  hover = false,
  ...props
}, ref) => {
  const baseClasses = "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200";
  
  const variants = {
    default: "border border-gray-200",
    elevated: "shadow-xl border-0",
    glass: "backdrop-blur-sm bg-white/80 border border-white/20",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100"
  };

  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-2xl cursor-pointer" : "";

  const cardClasses = cn(
    baseClasses,
    variants[variant],
    hoverClasses,
    className
  );

  return (
    <div ref={ref} className={cardClasses} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;