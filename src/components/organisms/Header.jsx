import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cartItems = useSelector(state => state.cart.items)
  const wishlistItems = useSelector(state => state.wishlist.items)
  const { user, isAuthenticated } = useSelector(state => state.user)
  const { logout } = useAuth()

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlistItems.length

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Categories
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                My Orders
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ApperIcon name="Heart" className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ApperIcon name="ShoppingCart" className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden lg:block">
                  Hi, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                  title="Logout"
                >
                  <ApperIcon name="LogOut" className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <ApperIcon name="User" className="w-6 h-6" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="px-2 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className="px-2 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/orders" 
                  className="px-2 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              <div className="px-2 py-3 border-t border-gray-200 mt-2">
                <SearchBar />
              </div>
              {!isAuthenticated && (
                <div className="px-2 py-3 border-t border-gray-200 mt-2 space-y-2">
                  <Link 
                    to="/login" 
                    className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
)
}