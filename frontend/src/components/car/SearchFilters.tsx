import React from "react";
import { Search, Download, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  makeFilter: string;
  setMakeFilter: (make: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  yearFilter: string;
  setYearFilter: (year: string) => void;
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
  filterOptions: any;
  categories: Array<{ id: number; name: string }>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  makeFilter,
  setMakeFilter,
  categoryFilter,
  setCategoryFilter,
  yearFilter,
  setYearFilter,
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
  filterOptions,
  categories,
}) => {
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
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-3 px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
            >
              <span>Advanced Search</span>
              <span className="text-lg">{showAdvancedFilters ? "−" : "+"}</span>
            </button>

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
          </div>
        </div>
      </div>

      {/* Filter Grid with Search Button on Same Line */}
      <div className="flex items-start gap-4 mb-6">
        {/* Filter Grid */}
        <div
          className={`flex-1 transition-all duration-300 ${
            showAdvancedFilters
              ? "opacity-100 max-h-none"
              : "opacity-100 max-h-20 overflow-hidden"
          }`}
        >
          {/* First Row - Always Visible */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Makes</option>
              {filterOptions?.makes?.map((make: string) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-100 text-sm transition-all duration-200">
              <option value="">Body Type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="wagon">Wagon</option>
              <option value="coupe">Coupe</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="">All Years</option>
              {filterOptions?.years?.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200">
              <option value="">Max Year</option>
              {filterOptions?.years?.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Rows - Only Visible When Expanded */}
          {showAdvancedFilters && (
            <div className="space-y-4">
              {/* Second Row */}
              <div className="grid grid-cols-5 gap-4">
                <select
                  value={transmissionFilter}
                  onChange={(e) => setTransmissionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Transmission</option>
                  {filterOptions?.transmissions?.map((transmission: string) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Drivetrain</option>
                  <option value="2wd">2WD</option>
                  <option value="4wd">4WD</option>
                  <option value="awd">AWD</option>
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Steering</option>
                  <option value="left">Left Hand Drive</option>
                  <option value="right">Right Hand Drive</option>
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Min Mileage</option>
                  <option value="0">0 km</option>
                  <option value="10000">10,000 km</option>
                  <option value="50000">50,000 km</option>
                  <option value="100000">100,000 km</option>
                  <option value="200000">200,000 km</option>
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Max Mileage</option>
                  <option value="50000">50,000 km</option>
                  <option value="100000">100,000 km</option>
                  <option value="200000">200,000 km</option>
                  <option value="300000">300,000 km</option>
                  <option value="500000">500,000 km</option>
                </select>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-5 gap-4">
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Color</option>
                  {filterOptions?.colors?.map((color: string) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Fuel Types</option>
                  {filterOptions?.fuels?.map((fuel: string) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Auction Grade</option>
                  <option value="5">5</option>
                  <option value="4.5">4.5</option>
                  <option value="4">4</option>
                  <option value="3.5">3.5</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                  <option value="R">R</option>
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Min Eng.cc</option>
                  <option value="1000">1000cc</option>
                  <option value="1500">1500cc</option>
                  <option value="2000">2000cc</option>
                  <option value="2500">2500cc</option>
                  <option value="3000">3000cc</option>
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Max Eng.cc</option>
                  <option value="2000">2000cc</option>
                  <option value="2500">2500cc</option>
                  <option value="3000">3000cc</option>
                  <option value="4000">4000cc</option>
                  <option value="5000">5000cc</option>
                </select>
              </div>

              {/* Fourth Row - Removed date inputs */}
              <div className="grid grid-cols-5 gap-4">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
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
