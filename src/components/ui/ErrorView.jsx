import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className = "",
  type = "default" 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const getErrorContent = () => {
    if (type === "products") {
      return {
        icon: "ShoppingBag",
        title: "Unable to load products",
        description: "We're having trouble loading the product catalog. Please try again."
      };
    }
    
    if (type === "product-detail") {
      return {
        icon: "Package",
        title: "Product not found",
        description: "The product you're looking for might have been moved or removed."
      };
    }

    if (type === "network") {
      return {
        icon: "WifiOff",
        title: "Connection error",
        description: "Please check your internet connection and try again."
      };
    }

    return {
      icon: "AlertTriangle",
      title: "Oops! Something went wrong",
      description: error
    };
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-8 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-error/20 to-warning/20 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-full">
          <ApperIcon 
            name={icon} 
            className="h-16 w-16 text-error mx-auto" 
          />
        </div>
      </div>
      
      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleRetry}
            disabled={isRetrying}
            variant="primary"
            className="min-w-[120px]"
          >
            {isRetrying ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                Retrying...
              </>
            ) : (
              <>
                <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"}
            variant="secondary"
            className="min-w-[120px]"
          >
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorView;