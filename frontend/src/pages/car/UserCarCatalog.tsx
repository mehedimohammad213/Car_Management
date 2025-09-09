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
  const { addToCart, isLoading: cartLoading } = useCart();

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
        if (error.message.includes('401')) {
          console.error("Authentication failed - redirecting to login");
          // The API service should handle this automatically
        } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
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
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade?: string | number) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
    if (numGrade >= 8) return "bg-green-100 text-green-800";
    if (numGrade >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🚗 Car Catalog
            </h1>
            <p className="text-gray-600 mt-2">
              Discover your perfect vehicle from our extensive collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Years</option>
              {filterOptions?.years?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Transmission */}
            <select
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Transmissions</option>
              {filterOptions?.transmissions?.map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>

            {/* Fuel */}
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Fuels</option>
              {filterOptions?.fuels?.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>

            {/* Color */}
            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Colors</option>
              {filterOptions?.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {cars.length} of {totalItems} cars
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Debug Info - Remove in production */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Cars loaded: {cars.length}</p>
          <p>Total items: {totalItems}</p>
          <p>Current page: {currentPage} of {totalPages}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading cars...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No cars found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
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
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Car Image */}
                <div className="relative h-48 bg-gray-200">
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
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(
                          car.grade_overall
                        )}`}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {car.grade_overall}/10
                      </span>
                    </div>
                  )}
                </div>

                {/* Car Info */}
                <div className="p-4">
                  {/* Basic Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {car.make} {car.model}
                    </h3>
                    {car.variant && (
                      <p className="text-sm text-gray-600 mb-1">
                        {car.variant}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{car.year}</span>
                      {car.mileage_km && (
                        <>
                          <span>•</span>
                          <Gauge className="w-4 h-4" />
                          <span>{car.mileage_km.toLocaleString()} km</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                    {car.transmission && (
                      <div className="flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        <span>{car.transmission}</span>
                      </div>
                    )}
                    {car.fuel && (
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" />
                        <span>{car.fuel}</span>
                      </div>
                    )}
                    {car.color && (
                      <div className="flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        <span>{car.color}</span>
                      </div>
                    )}
                    {car.seats && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{car.seats} seats</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(car.price_amount, car.price_currency)}
                    </div>
                    {car.price_basis && (
                      <p className="text-xs text-gray-500">{car.price_basis}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCar(car)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(car)}
                      disabled={cartLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {cartLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
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
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Car Detail Modal */}
      {showCarModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-md"
            onClick={handleCloseCarModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedCar.make} {selectedCar.model}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {selectedCar.variant && `${selectedCar.variant} • `}
                    {selectedCar.year} •{" "}
                    {selectedCar.mileage_km
                      ? `${selectedCar.mileage_km.toLocaleString()} km`
                      : "Mileage not specified"}
                  </p>
                </div>
                <button
                  onClick={handleCloseCarModal}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCarCatalog;
