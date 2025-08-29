import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  SearchIcon,
  CarIcon,
  CheckCircleIcon,
  TagIcon,
  FolderIcon,
} from "lucide-react";
import { Car, Brand, Category } from "../types";

interface CarManagementHeaderProps {
  cars: Car[];
  brands: Brand[];
  categories: Category[];
  searchTerm: string;
  selectedBrand: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const CarManagementHeader: React.FC<CarManagementHeaderProps> = ({
  cars,
  brands,
  categories,
  searchTerm,
  selectedBrand,
  selectedCategory,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Cars
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {cars.length}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                +2 from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Available
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {cars.filter((car) => car.isAvailable).length}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Ready for sale
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Brands
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {brands.length}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Active brands
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <TagIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Categories
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Vehicle types
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <FolderIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cars by brand or model..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 min-w-[140px]"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 min-w-[140px]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate("/create-car")}
              className="group relative flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl border border-blue-600 hover:border-blue-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              <span>Add New Car</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarManagementHeader;
