import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "products") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "product-detail") {
    return (
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="w-full h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="text-center space-y-4">
        <div className="relative">
          <ApperIcon 
            name="ShoppingBag" 
            className="h-16 w-16 text-primary-500 mx-auto animate-bounce" 
          />
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-primary-500 opacity-20 animate-ping"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Loading your marketplace</h3>
          <p className="text-gray-600">Discovering amazing products for you...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;