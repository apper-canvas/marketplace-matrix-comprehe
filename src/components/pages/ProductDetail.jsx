import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import ProductGrid from "@/components/organisms/ProductGrid";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const isInWishlist = product ? wishlistItems.some((item) => item.Id === product.Id) : false;
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(id);
      setProduct(productData);
      setSelectedImage(0);
loadRecommendedProducts(id);
    } catch (err) {
      setError(err.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedProducts = async (productId) => {
    try {
      setRecommendedLoading(true);
      const recommended = await productService.getRecommended(productId, 4);
      setRecommendedProducts(recommended);
    } catch (err) {
      console.error("Failed to load recommended products:", err);
    } finally {
      setRecommendedLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity} ${product.name}(s) added to cart!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    dispatch(toggleWishlistItem(product));
    
    if (isInWishlist) {
      toast.success(`${product.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.success(`${product.name} added to wishlist!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
        <ApperIcon key={i} name="Star" className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="StarHalf" className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="product-detail" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView
          error={error}
          onRetry={loadProduct}
          type="product-detail"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <button 
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-primary-600"
            >
              Home
            </button>
          </li>
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
          <li>
            <button 
              onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
              className="text-gray-500 hover:text-primary-600"
            >
              {product.category}
            </button>
          </li>
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
          <li className="text-gray-900 truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <Badge variant="outline" className="text-sm">
                {product.category}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="accent">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                </>
)}
              
              <Button
                onClick={handleToggleWishlist}
                variant="secondary"
                className={`w-full flex items-center justify-center space-x-2 transition-all duration-200 ${
                  isInWishlist 
                    ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100" 
                    : "hover:bg-gray-50"
                }`}
              >
                <ApperIcon 
                  name="Heart" 
                  className={`h-5 w-5 transition-all duration-200 ${
                    isInWishlist ? "fill-current text-red-600" : ""
                  }`}
                />
                <span>
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            {product.inStock ? (
              <>
                <div className="flex items-center text-green-600">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                  <span className="font-medium">In Stock</span>
                </div>
                {product.stockCount <= 10 && (
                  <p className="text-orange-600 text-sm font-medium">
                    Only {product.stockCount} left - order soon!
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center text-red-600">
                <ApperIcon name="XCircle" className="w-5 h-5 mr-2" />
                <span className="font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            {product.inStock && (
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <ApperIcon name="Minus" className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-16 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="h-10 w-10 p-0"
                  >
                    <ApperIcon name="Plus" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <ApperIcon name="Shield" className="w-8 h-8 mx-auto text-green-600" />
              <p className="text-sm text-gray-600">Secure Payment</p>
            </div>
            <div className="text-center space-y-2">
              <ApperIcon name="Truck" className="w-8 h-8 mx-auto text-blue-600" />
              <p className="text-sm text-gray-600">Fast Shipping</p>
            </div>
            <div className="text-center space-y-2">
              <ApperIcon name="RotateCcw" className="w-8 h-8 mx-auto text-purple-600" />
              <p className="text-sm text-gray-600">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You Might Also Like
            </h2>
            <p className="text-gray-600">
              Similar products from the same category
            </p>
          </div>
          
          <ProductGrid
            products={recommendedProducts}
            loading={recommendedLoading}
            showSorting={false}
            showViewToggle={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;