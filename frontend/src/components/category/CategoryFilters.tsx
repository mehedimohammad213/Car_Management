import React from "react";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">All Types</option>
          <option value="parent">Parent Categories</option>
          <option value="child">Child Categories</option>
        </select>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default CategoryFilters;
