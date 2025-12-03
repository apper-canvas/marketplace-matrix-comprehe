import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import Home from "@/components/pages/Home";
import CategoryFilter from "@/components/molecules/CategoryFilter";

export default function Category() {
  const { categoryId } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategoryData()
  }, [categoryId])

  const loadCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [categoryData, productsData] = await Promise.all([
        categoryService.getById(categoryId),
        productService.getByCategory(categoryId)
      ])
      
      setCategory(categoryData)
      setProducts(productsData)
    } catch (error) {
      console.error('Failed to load category data:', error)
      setError('Failed to load category data')
      toast.error('Failed to load category data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Category not found'}
          </h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900">{category.name_c}</span>
        </nav>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color_c || 'bg-primary-100'}`}>
              <ApperIcon name={category.icon_c || 'Package'} className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name_c}</h1>
              <p className="text-gray-600">{products.length} products available</p>
            </div>
          </div>
          {category.description_c && (
            <p className="text-gray-700">{category.description_c}</p>
          )}
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No products in this category</h3>
            <p className="text-gray-500 mb-6">Check back later for new products.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              Browse All Products
            </Link>
          </div>
        )}
</div>
    </div>
  )
}