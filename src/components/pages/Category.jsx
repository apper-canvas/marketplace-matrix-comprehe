import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (categoryName) {
      loadCategoryData();
    }
  }, [categoryName]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load category info and products in parallel
      const [categoryData, productsData] = await Promise.all([
        categoryService.getByName(categoryName),
        productService.getByCategory(categoryName)
      ]);
      
      setCategory(categoryData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView
          error={error}
          onRetry={loadCategoryData}
          type="products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {category?.name || categoryName}
          </h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
            {category?.subcategories && category.subcategories.length > 0 && (
              <div className="text-sm text-gray-500">
                Subcategories: {category.subcategories.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CategoryFilter
              selectedCategory={category?.name}
              onCategoryChange={() => {}} // Disabled in category page
              className="opacity-75"
            />
          </div>
        </aside>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-between"
          >
            <span className="flex items-center">
              <ApperIcon name="Filter" className="h-5 w-5 mr-2" />
              Filter & Sort
            </span>
            <ApperIcon 
              name={showFilters ? "ChevronUp" : "ChevronDown"} 
              className="h-5 w-5" 
            />
          </Button>

          {showFilters && (
            <div className="mt-4">
              <CategoryFilter
                selectedCategory={category?.name}
                onCategoryChange={() => {}}
                className="opacity-75"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            loading={false}
            showSorting={true}
            showViewToggle={true}
          />
        </main>
      </div>
    </div>
  );
};

export default Category;