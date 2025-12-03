import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      setFeaturedProducts(productsData.filter(product => product.is_featured_c))
    } catch (error) {
      console.error('Failed to load home data:', error)
      setError('Failed to load data. Please try again.')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = async (categoryId) => {
    try {
      setLoading(true)
      setSelectedCategory(categoryId)
      
      if (categoryId) {
        const filteredProducts = await productService.getByCategory(categoryId)
        setProducts(filteredProducts)
      } else {
        const allProducts = await productService.getAll()
        setProducts(allProducts)
      }
    } catch (error) {
      console.error('Failed to filter products:', error)
      toast.error('Failed to filter products')
    } finally {
      setLoading(false)
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Our Marketplace
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing products from trusted sellers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="ShoppingBag" className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Check out our handpicked selection of amazing products
              </p>
            </div>
            <ProductGrid products={featuredProducts.slice(0, 8)} />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Browse our wide selection of product categories
            </p>
          </div>
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </section>

      {/* All Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory ? 'Filtered Products' : 'All Products'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => handleCategorySelect(null)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Show All Products
              </button>
            )}
          </div>
          
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Package" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try selecting a different category or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-300 mb-8">
            Get the latest deals and product updates delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}