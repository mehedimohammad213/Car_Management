import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Users,
  DollarSign,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  ShoppingCart,
  Grid,
  List,
  SlidersHorizontal,
  TrendingUp,
  Award,
  Shield,
  Heart,
  Share2,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  carApi,
  Car as CarType,
  CarFilterOptions,
} from "../../services/carApi";
import { categoryApi } from "../../services/categoryApi";
import { useCart } from "../../contexts/CartContext";

const UserCarCatalog: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addToCart, isCarLoading } = useCart();

  useEffect(() => {
    console.log("UserCarCatalog: Component mounted, fetching data...");
    fetchCars();
    fetchCategories();
    fetchFilterOptions();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    categoryFilter,
    makeFilter,
    yearFilter,
    transmissionFilter,
    fuelFilter,
    colorFilter,
    priceRange,
    sortBy,
    sortDirection,
  ]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching cars with params:", {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter || undefined,
        make: makeFilter || undefined,
        year: yearFilter || undefined,
        transmission: transmissionFilter || undefined,
        fuel: fuelFilter || undefined,
        color: colorFilter || undefined,
        price_from: priceRange.min || undefined,
        price_to: priceRange.max || undefined,
        sort_by: sortBy,
        sort_direction: sortDirection,
        per_page: perPage,
        page: currentPage,
      });

      const response = await carApi.getCars({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter || undefined,
        make: makeFilter || undefined,
        year: yearFilter || undefined,
        transmission: transmissionFilter || undefined,
        fuel: fuelFilter || undefined,
        color: colorFilter || undefined,
        price_from: priceRange.min || undefined,
        price_to: priceRange.max || undefined,
        sort_by: sortBy,
        sort_direction: sortDirection,
        per_page: perPage,
        page: currentPage,
      });

      console.log("Cars API response:", response);

      if (response.success && response.data.data) {
        console.log("Setting cars:", response.data.data);
        setCars(response.data.data);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } else {
        console.log("No cars found or invalid response structure");
        setCars([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
      setTotalPages(1);
      setTotalItems(0);

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          console.error("Authentication failed - redirecting to login");
          // The API service should handle this automatically
        } else if (
          error.message.includes("Network Error") ||
          error.message.includes("fetch")
        ) {
          console.error("Network error - backend might be down");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await carApi.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handleViewCar = (car: CarType) => {
    setSelectedCar(car);
    setShowCarModal(true);
  };

  const handleAddToCart = (car: CarType) => {
    addToCart(car);
  };

  const handleCloseCarModal = () => {
    setShowCarModal(false);
    setSelectedCar(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("available");
    setCategoryFilter("");
    setMakeFilter("");
    setYearFilter("");
    setTransmissionFilter("");
    setFuelFilter("");
    setColorFilter("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "Price on request";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "sold":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "reserved":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "in_transit":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const getGradeColor = (grade?: string | number) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
    if (numGrade >= 8) return "bg-green-100 text-green-800";
    if (numGrade >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Enhanced Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Search & Filters
              </h3>
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors touch-manipulation self-start sm:self-auto"
            >
              <span className="text-sm sm:text-base">Advanced</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAdvancedFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Primary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Make */}
            <select
              value={makeFilter}
              onChange={(e) => setMakeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="">All Makes</option>
              {filterOptions?.makes?.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="">All Years</option>
              {filterOptions?.years?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Transmission */}
                <select
                  value={transmissionFilter}
                  onChange={(e) => setTransmissionFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
                >
                  <option value="">All Transmissions</option>
                  {filterOptions?.transmissions?.map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {transmission}
                    </option>
                  ))}
                </select>

         

                {/* Color */}
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
                >
                  <option value="">All Colors</option>
                  {filterOptions?.colors?.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                {/* Price Range */}
                <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-700 dark:text-white text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filter Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation self-start sm:self-auto"
            >
              <X className="w-4 h-4" />
              <span className="text-sm sm:text-base">Clear All Filters</span>
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {cars.length} of {totalItems} cars found
            </div>
          </div>
        </div>

        {/* Results Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {cars.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {totalItems}
              </span>{" "}
              cars
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                View:
              </span>
              <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 touch-manipulation ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 touch-manipulation ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="price_amount-asc">Price: Low to High</option>
              <option value="price_amount-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="year-asc">Year: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Cars Display */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
              Loading premium vehicles...
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No vehicles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't find any vehicles matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {cars.map((car) => (
              <div
                key={car.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Car Image */}
                <div
                  className={`relative ${
                    viewMode === "grid" ? "h-48" : "w-80 h-48 flex-shrink-0"
                  } bg-gray-200 dark:bg-gray-700`}
                >
                  {car.photos && car.photos.length > 0 ? (
                    <img
                      src={
                        car.photos.find((p: any) => p.is_primary)?.url ||
                        car.photos[0].url
                      }
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {car.status?.charAt(0).toUpperCase() +
                        car.status?.slice(1)}
                    </span>
                  </div>

                  {/* Grade Badge */}
                  {car.grade_overall && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(
                          car.grade_overall
                        )}`}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {car.grade_overall}/10
                      </span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(car.id)
                          ? "text-red-500 fill-current"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Car Info */}
                <div className={`${viewMode === "list" ? "flex-1" : ""} p-6`}>
                  {/* Basic Info */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {car.make} {car.model}
                        </h3>
                        {car.variant && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {car.variant}
                          </p>
                        )}
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{car.year}</span>
                      </div>
                      {car.mileage_km && (
                        <div className="flex items-center gap-1">
                          <Gauge className="w-4 h-4" />
                          <span>{car.mileage_km.toLocaleString()} km</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    {car.transmission && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Settings className="w-4 h-4" />
                        <span>{car.transmission}</span>
                      </div>
                    )}
                    {car.fuel && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Fuel className="w-4 h-4" />
                        <span>{car.fuel}</span>
                      </div>
                    )}
                    {car.color && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Palette className="w-4 h-4" />
                        <span>{car.color}</span>
                      </div>
                    )}
                    {car.seats && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{car.seats} seats</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(car.price_amount, car.price_currency)}
                    </div>
                    {car.price_basis && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {car.price_basis}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewCar(car)}
                      className="flex-1 group relative overflow-hidden bg-white dark:bg-gray-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/25"
                      title="View Details"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Eye className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(car)}
                      disabled={isCarLoading(car.id)}
                      className="flex-1 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 disabled:shadow-none"
                      title="Add to Cart"
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {isCarLoading(car.id) ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent relative z-10"></div>
                      ) : (
                        <ShoppingCart className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing page {currentPage} of {totalPages} ({totalItems} total
              vehicles)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Car Detail Modal */}
      {showCarModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseCarModal}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {selectedCar.make} {selectedCar.model}
                    </h2>
                    <p className="text-blue-100 mt-2 text-lg">
                      {selectedCar.variant && `${selectedCar.variant} • `}
                      {selectedCar.year} •{" "}
                      {selectedCar.mileage_km
                        ? `${selectedCar.mileage_km.toLocaleString()} km`
                        : "Mileage not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedCar.id)}
                    className="p-3 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        favorites.includes(selectedCar.id)
                          ? "text-red-400 fill-current"
                          : "text-white"
                      }`}
                    />
                  </button>
                  <button className="p-3 hover:bg-white/20 rounded-xl transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleCloseCarModal}
                    className="p-3 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Photos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Photos
                  </h3>
                  {selectedCar.photos && selectedCar.photos.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCar.photos.map((photo: any, index: number) => (
                        <img
                          key={index}
                          src={photo.url}
                          alt={`${selectedCar.make} ${
                            selectedCar.model
                          } photo ${index + 1}`}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                      <p className="text-gray-500 ml-2">No photos available</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Make:</span>
                        <span className="ml-2 text-gray-900">
                          {selectedCar.make}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Model:
                        </span>
                        <span className="ml-2 text-gray-900">
                          {selectedCar.model}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Year:</span>
                        <span className="ml-2 text-gray-900">
                          {selectedCar.year}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Status:
                        </span>
                        <span
                          className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            selectedCar.status
                          )}`}
                        >
                          {selectedCar.status?.charAt(0).toUpperCase() +
                            selectedCar.status?.slice(1)}
                        </span>
                      </div>
                      {selectedCar.variant && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Variant:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.variant}
                          </span>
                        </div>
                      )}
                      {selectedCar.ref_no && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Ref No:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.ref_no}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {selectedCar.transmission && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Transmission:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.transmission}
                          </span>
                        </div>
                      )}
                      {selectedCar.fuel && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Fuel:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.fuel}
                          </span>
                        </div>
                      )}
                      {selectedCar.color && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Color:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.color}
                          </span>
                        </div>
                      )}
                      {selectedCar.seats && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Seats:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.seats}
                          </span>
                        </div>
                      )}
                      {selectedCar.mileage_km && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Mileage:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.mileage_km.toLocaleString()} km
                          </span>
                        </div>
                      )}
                      {selectedCar.engine_cc && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Engine:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {selectedCar.engine_cc.toLocaleString()} cc
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Pricing
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {formatPrice(
                          selectedCar.price_amount,
                          selectedCar.price_currency
                        )}
                      </div>
                      {selectedCar.price_basis && (
                        <p className="text-sm text-gray-600">
                          Basis: {selectedCar.price_basis}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grading */}
                  {(selectedCar.grade_overall ||
                    selectedCar.grade_exterior ||
                    selectedCar.grade_interior) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Grading
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedCar.grade_overall && (
                          <div className="text-center">
                            <div
                              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getGradeColor(
                                selectedCar.grade_overall
                              )}`}
                            >
                              <Star className="w-4 h-4 mr-1" />
                              {selectedCar.grade_overall}/10
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Overall
                            </p>
                          </div>
                        )}
                        {selectedCar.grade_exterior && (
                          <div className="text-center">
                            <div
                              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getGradeColor(
                                selectedCar.grade_exterior
                              )}`}
                            >
                              {selectedCar.grade_exterior}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Exterior
                            </p>
                          </div>
                        )}
                        {selectedCar.grade_interior && (
                          <div className="text-center">
                            <div
                              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getGradeColor(
                                selectedCar.grade_interior
                              )}`}
                            >
                              {selectedCar.grade_interior}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Interior
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  {selectedCar.detail && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Additional Details
                      </h3>
                      {selectedCar.detail.short_title && (
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {selectedCar.detail.short_title}
                        </p>
                      )}
                      {selectedCar.detail.full_title && (
                        <p className="text-gray-600 mb-2">
                          {selectedCar.detail.full_title}
                        </p>
                      )}
                      {selectedCar.detail.description && (
                        <p className="text-gray-700">
                          {selectedCar.detail.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {(selectedCar.location || selectedCar.country_origin) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Location
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {selectedCar.location}
                          {selectedCar.location &&
                            selectedCar.country_origin &&
                            ", "}
                          {selectedCar.country_origin}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedCar.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Notes
                      </h3>
                      <p className="text-gray-700">{selectedCar.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Actions Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleAddToCart(selectedCar)}
                  disabled={isCarLoading(selectedCar.id)}
                  className="flex-1 group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 disabled:shadow-none"
                  title="Add to Cart"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {isCarLoading(selectedCar.id) ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent relative z-10"></div>
                  ) : (
                    <ShoppingCart className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="ml-2 relative z-10">Add to Cart</span>
                </button>
                <button
                  onClick={handleCloseCarModal}
                  className="flex-1 group relative overflow-hidden bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  title="Close"
                >
                  <X className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCarCatalog;
