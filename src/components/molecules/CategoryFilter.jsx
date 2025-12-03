import React from "react";
import ApperIcon from "@/components/ApperIcon";
import ErrorView from "@/components/ui/ErrorView";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        
        {categories.map((category) => (
          <button
            key={category.Id}
            onClick={() => onCategorySelect(category.Id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.Id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon_c && (
              <ApperIcon 
                name={category.icon_c} 
                className="w-4 h-4" 
              />
            )}
            {category.name_c}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter;