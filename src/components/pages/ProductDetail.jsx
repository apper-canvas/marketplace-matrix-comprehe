import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import Cart from "@/components/pages/Cart";
import Wishlist from "@/components/pages/Wishlist";
import Category from "@/components/pages/Category";
import Home from "@/components/pages/Home";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadProductData()
  }, [productId])

  const loadProductData = async () => {
    try {
      setLoading(true)
      setError(null)
      const productData = await productService.getById(productId)
      
      if (productData) {
        setProduct(productData)
        
        // Load category data if available
        if (productData.category_c?.Id) {
          const categoryData = await categoryService.getById(productData.category_c.Id)
          setCategory(categoryData)
        }
      } else {
        setError('Product not found')
      }
    } catch (error) {
      console.error('Failed to load product data:', error)
      setError('Failed to load product details')
      toast.error('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.Id,
      name: product.name_c,
      price: product.price_c,
      image: product.image_url_c,
      quantity
    }))
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = () => {
    dispatch(addToWishlist({
      id: product.Id,
      name: product.name_c,
      price: product.price_c,
      image: product.image_url_c
    }))
    toast.success('Added to wishlist!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const images = product.image_url_c ? [product.image_url_c] : ['/api/placeholder/400/400']
  const tags = product.tags_c ? product.tags_c.split(',') : []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          {category && (
            <>
              <Link 
                to={`/category/${category.Id}`} 
                className="hover:text-primary-600"
              >
                {category.name_c}
              </Link>
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900">{product.name_c}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name_c}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name_c} ${index + 1}`}
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
                  {product.name_c}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-primary-600">
                    ${product.price_c}
                  </div>
                  {product.rating_c && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Star" className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{product.rating_c}</span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock_quantity_c > 0 ? (
                    <Badge variant="success" className="text-green-700 bg-green-100">
                      In Stock ({product.stock_quantity_c} available)
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-red-700 bg-red-100">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description_c && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{product.description_c}</p>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              {product.stock_quantity_c > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <ApperIcon name="Minus" className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity_c, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity_c === 0}
                    className="flex-1"
                    size="lg"
                  >
                    <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    disabled={product.stock_quantity_c === 0}
                    className="flex-1"
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </div>
                
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ApperIcon name="Heart" className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-600">
                      {category ? category.name_c : 'Uncategorized'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">SKU:</span>
                    <span className="ml-2 text-gray-600">PRD-{product.Id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}