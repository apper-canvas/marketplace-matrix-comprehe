import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "default",
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "products":
        return {
          icon: "Package",
          title: title || "No products found",
          description: description || "We couldn't find any products matching your criteria. Try adjusting your filters or search terms.",
          actionLabel: actionLabel || "Clear Filters",
          gradient: "from-blue-50 to-indigo-50"
        };
      
      case "cart":
        return {
          icon: "ShoppingCart",
          title: title || "Your cart is empty",
          description: description || "Looks like you haven't added any items to your cart yet. Start shopping to fill it up!",
          actionLabel: actionLabel || "Start Shopping",
          gradient: "from-green-50 to-emerald-50"
        };
      
      case "search":
        return {
          icon: "Search",
          title: title || "No results found",
          description: description || "We couldn't find any products matching your search. Try different keywords or browse our categories.",
          actionLabel: actionLabel || "Browse Categories",
          gradient: "from-purple-50 to-pink-50"
        };
      
      case "orders":
        return {
          icon: "Package",
          title: title || "No orders yet",
          description: description || "You haven't placed any orders yet. Start shopping to see your order history here.",
          actionLabel: actionLabel || "Shop Now",
          gradient: "from-orange-50 to-yellow-50"
        };
      
      case "wishlist":
        return {
          icon: "Heart",
          title: title || "Your wishlist is empty",
          description: description || "Save items you love to your wishlist so you can easily find them later.",
          actionLabel: actionLabel || "Discover Products",
          gradient: "from-red-50 to-pink-50"
        };
      
      default:
        return {
          icon: "Inbox",
          title: title || "Nothing here yet",
          description: description || "This section is empty. Check back later or explore other areas.",
          actionLabel: actionLabel || "Explore",
          gradient: "from-gray-50 to-slate-50"
        };
    }
  };

  const content = getEmptyContent();

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 p-8 ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} rounded-full blur-xl opacity-60`}></div>
        <div className={`relative bg-gradient-to-r ${content.gradient} p-8 rounded-full`}>
          <ApperIcon 
            name={content.icon} 
            className="h-20 w-20 text-gray-400 mx-auto" 
          />
        </div>
      </div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {content.title}
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          {content.description}
        </p>
      </div>

      {onAction && content.actionLabel && (
        <div className="space-y-3">
          <Button 
            onClick={onAction}
            variant="primary"
            size="lg"
            className="px-8 py-3"
          >
            <ApperIcon name="ArrowRight" className="h-5 w-5 mr-2" />
            {content.actionLabel}
          </Button>
          
          <p className="text-sm text-gray-500">
            or browse our featured products below
          </p>
        </div>
      )}
    </div>
  );
};

export default Empty;