import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-xl">
              <ApperIcon name="ShoppingBag" className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

          <div className="text-gray-500 max-w-md mx-auto leading-relaxed">
            <p>
              The page might have been moved, deleted, or you entered an incorrect URL. 
              Don't worry, let's get you back to shopping!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGoHome}
              className="px-8"
            >
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoBack}
              className="px-8"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Help Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button
                onClick={() => navigate("/")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Browse Products
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => navigate("/orders")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Your Orders
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => navigate("/cart")}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Shopping Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;