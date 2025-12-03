import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";

export function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({
      id: product.Id,
      name: product.name_c,
      price: product.price_c,
      image: product.image_url_c,
      quantity: 1
    }))
    toast.success('Added to cart!')
  }

  const handleAddToWishlist = (e) => {
    e.preventDefault()
    dispatch(addToWishlist({
      id: product.Id,
      name: product.name_c,
      price: product.price_c,
      image: product.image_url_c
    }))
    toast.success('Added to wishlist!')
  }

  return (
    <Card className="group overflow-hidden card-hover">
      <Link to={`/product/${product.Id}`} className="block">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.image_url_c || '/api/placeholder/300/300'}
            alt={product.name_c}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {product.name_c}
            </h3>
            {product.is_featured_c && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description_c}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-primary-600">
              ${product.price_c}
            </div>
            {product.rating_c && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating_c}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {product.stock_quantity_c > 0 ? `${product.stock_quantity_c} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons */}
      <div className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock_quantity_c === 0}
          size="sm"
          className="flex-1"
        >
          <ApperIcon name="ShoppingCart" className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleAddToWishlist}
          variant="outline"
          size="sm"
        >
          <ApperIcon name="Heart" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
)
}