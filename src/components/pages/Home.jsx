import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      applyFilters();
    }
  }, [products, selectedCategory, searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      applyFilters();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const searchResults = await productService.search(query);
      setFilteredProducts(searchResults);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    if (selectedCategory) {
      filtered = filtered.filter(
        product => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setShowFilters(false);
  };

  if (loading && !products.length) {
    return <Loading />;
  }

  if (error && !products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView
          error={error}
          onRetry={loadProducts}
          type="products"
        />
      </div>
    );
  }

  const searchQuery = searchParams.get("q");
  const showingResults = searchQuery || selectedCategory;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        {showingResults ? (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                Found {filteredProducts.length} products
              </p>
              {(searchQuery || selectedCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-primary-600"
                >
                  <ApperIcon name="X" className="h-4 w-4 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Welcome to Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing products at great prices. Your perfect shopping experience starts here.
            </p>
          </div>
        )}
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
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
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            showSorting={true}
            showViewToggle={true}
          />
        </main>
      </div>

      {/* Featured Section */}
      {!showingResults && !loading && (
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked products from our premium collection
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8">
            <ProductGrid
              products={products.filter(p => p.rating >= 4.6).slice(0, 8)}
              loading={false}
              showSorting={false}
              showViewToggle={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;