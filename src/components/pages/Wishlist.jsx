import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearWishlist } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { ProductCard } from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const Wishlist = () => {
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) return;
    
    if (!confirm("Are you sure you want to clear your entire wishlist?")) return;

    setIsClearing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(clearWishlist());
      toast.success("Wishlist cleared successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to clear wishlist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          
          <Empty 
            icon="Heart"
            title="Your wishlist is empty"
            message="Save items you love for later by clicking the heart icon on any product."
            actionLabel="Start Shopping"
            onAction={handleContinueShopping}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleContinueShopping}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
            
            <Button
              variant="danger"
              onClick={handleClearWishlist}
              disabled={isClearing}
              className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isClearing ? (
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
              ) : (
                <ApperIcon name="Trash2" className="h-4 w-4" />
              )}
              <span>{isClearing ? "Clearing..." : "Clear Wishlist"}</span>
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              className="card-hover"
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Keep shopping to discover more amazing products to add to your wishlist!
            </div>
            
            <Button
              variant="primary"
              onClick={handleContinueShopping}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ShoppingBag" className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;