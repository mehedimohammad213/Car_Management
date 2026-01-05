import React from "react";
import { Search, X, Download, FileText, Plus } from "lucide-react";
import { makeToModels } from "../../utils/carData";

interface StockFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  yearFilter: string;
  onYearFilterChange: (year: string) => void;
  makeFilter?: string;
  onMakeFilterChange?: (make: string) => void;
  modelFilter?: string;
  onModelFilterChange?: (model: string) => void;
  colorFilter: string;
  onColorFilterChange: (color: string) => void;
  fuelFilter: string;
  onFuelFilterChange: (fuel: string) => void;
  isGeneratingPDF: boolean;
  onGeneratePDF?: () => void;
  onCreateInvoice?: () => void;
  onCreateStock?: () => void;
  filterOptions?: {
    years?: number[];
    colors?: string[];
    fuels?: string[];
  };
}

export const StockFilters: React.FC<StockFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  yearFilter,
  onYearFilterChange,
  makeFilter,
  onMakeFilterChange,
  modelFilter,
  onModelFilterChange,
  colorFilter,
  onColorFilterChange,
  fuelFilter,
  onFuelFilterChange,
  isGeneratingPDF,
  onGeneratePDF,
  onCreateInvoice,
  onCreateStock,
  filterOptions,
}) => {
  const hasActiveFilters =
    searchTerm ||
    searchTerm ||
    yearFilter ||
    makeFilter ||
    modelFilter ||
    colorFilter ||
    fuelFilter;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative w-full lg:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stocks by make, model, year, chassis number, or any keyword..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>


        {/* Make Filter */}
        <div className="w-full lg:w-auto">
          <select
            value={makeFilter || ""}
            onChange={(e) => {
              if (onMakeFilterChange) {
                onMakeFilterChange(e.target.value);
                if (onModelFilterChange) onModelFilterChange("");
              }
            }}
            className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Makes</option>
            {Object.keys(makeToModels).sort().map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Filter */}
        <div className="w-full lg:w-auto">
          <select
            value={modelFilter || ""}
            onChange={(e) => onModelFilterChange && onModelFilterChange(e.target.value)}
            disabled={!makeFilter}
            className={`w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!makeFilter ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
          >
            <option value="">All Models</option>
            {makeFilter && makeToModels[makeFilter]?.sort().map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="w-full lg:w-auto">
          <select
            value={yearFilter}
            onChange={(e) => onYearFilterChange(e.target.value)}
            className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {filterOptions?.years?.map((year: number) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Color Filter */}
        {/* <div className="w-full lg:w-auto">
          <select
            value={colorFilter}
            onChange={(e) => onColorFilterChange(e.target.value)}
            className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
          >
            <option value="">All Colors</option>
            {filterOptions?.colors?.map((color: string) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div> */}

        {/* Fuel Type Filter */}
        {/* <div className="w-full lg:w-auto">
          <select
            value={fuelFilter}
            onChange={(e) => onFuelFilterChange(e.target.value)}
            className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
          >
            <option value="">All Fuel Types</option>
            {filterOptions?.fuels?.map((fuel: string) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div> */}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
            title="Clear Filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Download PDF Button */}
        {onGeneratePDF && (
          <button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            className={`flex items-center justify-center transition-colors font-medium shadow-sm ${isGeneratingPDF
              ? "w-auto px-4 py-2 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed gap-2"
              : "w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700"
              }`}
            title="Download PDF"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                <span>Generating...</span>
              </>
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Create Invoice Button */}
        {onCreateInvoice && (
          <button
            onClick={onCreateInvoice}
            className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-sm"
            title="Create Invoice"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}

        {/* Add Stock Button - Commented out */}
        {/* {onCreateStock && (
          <button
            onClick={onCreateStock}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            title="Add Stock"
          >
            <Plus className="w-5 h-5" />
            <span>Add Stock</span>
          </button>
        )} */}
      </div>
    </div>
  );
};
