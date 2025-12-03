import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import categoryService from "@/services/api/categoryService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";

const CategoryFilter = ({ selectedCategory, onCategoryChange, className = "" }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (onCategoryChange) {
      onCategoryChange(categoryName);
    } else {
      navigate(`/category/${encodeURIComponent(categoryName.toLowerCase())}`);
    }
  };

  const handleClearFilter = () => {
    if (onCategoryChange) {
      onCategoryChange("");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorView
        error={error}
        onRetry={loadCategories}
        type="network"
        className="py-8"
      />
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden"
        >
          <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
        </Button>
      </div>

      <div className={`space-y-2 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="w-full justify-start text-left text-primary-600 hover:bg-primary-50"
          >
            <ApperIcon name="X" className="h-4 w-4 mr-2" />
            Clear Filter
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCategoryClick("")}
          className={`w-full justify-start text-left ${
            !selectedCategory 
              ? "bg-primary-100 text-primary-900 font-medium" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ApperIcon name="Grid" className="h-4 w-4 mr-2" />
          All Products
        </Button>

        {categories.map((category) => (
          <Button
            key={category.Id}
            variant="ghost"
            size="sm"
            onClick={() => handleCategoryClick(category.name)}
            className={`w-full justify-start text-left ${
              selectedCategory?.toLowerCase() === category.name.toLowerCase()
                ? "bg-primary-100 text-primary-900 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ApperIcon name="Tag" className="h-4 w-4 mr-2" />
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;