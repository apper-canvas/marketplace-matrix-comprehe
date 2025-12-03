import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import categoryService from "@/services/api/categoryService";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
const { itemCount } = useSelector((state) => state.cart);
  const { itemCount: wishlistItemCount } = useSelector((state) => state.wishlist);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName.toLowerCase())}`);
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: "Home" },
{ name: "Orders", href: "/orders", icon: "Package" },
    { name: "Wishlist", href: "/wishlist", icon: "Heart", count: wishlistItemCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center space-x-1"
              >
                <ApperIcon name="Grid" className="h-5 w-5" />
                <span>Categories</span>
                <ApperIcon 
                  name={isCategoriesOpen ? "ChevronUp" : "ChevronDown"} 
                  className="h-4 w-4" 
                />
              </Button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {categories.map((category) => (
                    <button
                      key={category.Id}
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center space-x-2"
                    >
                      <ApperIcon name="Tag" className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <SearchBar placeholder="Search for products..." />
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" className="relative">
                <ApperIcon name="ShoppingCart" className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge
                    variant="accent"
                    size="sm"
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs flex items-center justify-center animate-scale-pulse"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </Badge>
                )}
</Button>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/wishlist")}
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              >
                <ApperIcon name="Heart" className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <Badge
                    variant="primary"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center bg-red-500 text-white"
                  >
                    {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="h-6 w-6" 
              />
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-4">
          <SearchBar placeholder="Search products..." />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors"
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.Id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="Tag" className="h-4 w-4" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;