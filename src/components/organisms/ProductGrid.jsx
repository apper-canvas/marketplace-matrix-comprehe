import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  className = "",
  showSorting = true,
  showViewToggle = true 
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
    { value: "newest", label: "Newest First" },
  ];

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    let sorted = [...products];

    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a, b) => b.Id - a.Id);
        break;
      default:
        // Featured - keep original order but prioritize high ratings
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sorted;
  }, [products, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (loading) {
    return (
      <div className={className}>
        <Loading type="products" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className={className}>
        <Empty 
          type="products"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Controls */}
      {(showSorting || showViewToggle) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Showing {paginatedProducts.length} of {sortedProducts.length} products</span>
          </div>

          <div className="flex items-center space-x-4">
            {showViewToggle && (
              <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary-100 text-primary-600" : ""}`}
                >
                  <ApperIcon name="Grid3X3" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary-100 text-primary-600" : ""}`}
                >
                  <ApperIcon name="List" className="h-4 w-4" />
                </Button>
              </div>
            )}

            {showSorting && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.Id}
            product={product}
            className={viewMode === "list" ? "max-w-none" : ""}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2"
          >
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "ghost"}
              onClick={() => handlePageChange(page)}
              className="px-3 py-2 min-w-[40px]"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2"
          >
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;