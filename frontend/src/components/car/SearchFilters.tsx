import React from "react";
import { Search, Download, Plus } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  makeFilter: string;
  setMakeFilter: (make: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  transmissionFilter: string;
  setTransmissionFilter: (transmission: string) => void;
  colorFilter: string;
  setColorFilter: (color: string) => void;
  fuelFilter: string;
  setFuelFilter: (fuel: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  isGeneratingPDF: boolean;
  onGeneratePDF: () => void;
  onClearFilters: () => void;
  onAddCar?: () => void;
  isAdmin?: boolean;
  filterOptions: any;
  categories: Array<{ id: number; name: string }>;
}

const SearchFilters: React.FC<SearchFiltersProps> = (props) => {
  const {
    searchTerm,
    setSearchTerm,
    makeFilter,
    setMakeFilter,
    categoryFilter,
    setCategoryFilter,
    yearFilter,
    setYearFilter,
    statusFilter,
    setStatusFilter,
    transmissionFilter,
    setTransmissionFilter,
    colorFilter,
    setColorFilter,
    fuelFilter,
    setFuelFilter,
    showAdvancedFilters,
    setShowAdvancedFilters,
    isGeneratingPDF,
    onGeneratePDF,
    onClearFilters,
    onAddCar,
    isAdmin,
    filterOptions,
    categories,
  } = props;
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* Search Input with Buttons */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cars by make, model, year, or any keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Advanced Search button temporarily disabled
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-3 px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
            >
              <span>Advanced Search</span>
              <span className="text-lg">{showAdvancedFilters ? "−" : "+"}</span>
            </button>
            */}

            <button
              onClick={onGeneratePDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-3 px-6 py-3 border-2 rounded-xl transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg ${
                isGeneratingPDF
                  ? "text-gray-400 border-gray-400 cursor-not-allowed"
                  : "text-green-600 border-green-600 hover:bg-green-50"
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Add New Car Button - Admin Only */}
            {isAdmin && onAddCar && (
              <button
                onClick={onAddCar}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Car</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Grid with Search Button on Same Line */}
      <div className="flex items-start gap-4 mb-6">
        {/* Filter Grid */}
        <div className="flex-1">
          {/* First Row - Always Visible */}
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Makes</option>
              {filterOptions?.makes?.map((make: string) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Statuses</option>
              {(
                filterOptions?.statuses || [
                  "available",
                  "reserved",
                  "sold",
                  "in_transit",
                ]
              ).map((status: string) => (
                <option key={status} value={status}>
                  {status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Years</option>
              {filterOptions?.years?.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Colors</option>
              {filterOptions?.colors?.map((color: string) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Fuel Types</option>
              {filterOptions?.fuels?.map((fuel: string) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClearFilters}
            className="px-4 py-3 text-blue-600 hover:text-blue-800 border border-blue-300 hover:bg-blue-50 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
