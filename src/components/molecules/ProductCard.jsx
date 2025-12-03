import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ProductCard = ({ product, className = "" }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="StarHalf" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <Card
      hover
      variant="default"
      className={cn("group cursor-pointer", className)}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>

        {/* Sale Badge */}
        {product.originalPrice && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3 animate-pulse"
          >
            Sale
          </Badge>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <Badge
            variant="error"
            className="absolute top-3 right-3"
          >
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <div className="text-sm font-medium text-green-600">
                Save {formatPrice(product.originalPrice - product.price)}
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            variant={product.inStock ? "primary" : "secondary"}
            size="sm"
            className="shrink-0"
          >
            {product.inStock ? (
              <>
                <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-1" />
                Add
              </>
            ) : (
              "Sold Out"
            )}
          </Button>
        </div>

        {/* Stock Count */}
        {product.inStock && product.stockCount <= 10 && (
          <div className="text-sm text-orange-600 font-medium">
            Only {product.stockCount} left in stock!
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;