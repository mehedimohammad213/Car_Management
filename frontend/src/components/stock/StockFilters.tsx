import React from "react";
import { Search } from "lucide-react";

interface StockFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
  { value: "reserved", label: "Reserved" },
  { value: "damaged", label: "Damaged" },
  { value: "lost", label: "Lost" },
  { value: "stolen", label: "Stolen" },
];

export const StockFilters: React.FC<StockFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars, make, model, or reference number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};
