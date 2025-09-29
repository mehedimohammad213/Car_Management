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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4">
          <div className="text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Japanese Used Cars Top</span>
            <span className="mx-2">&gt;</span>
            <span className="hover:text-blue-600 cursor-pointer">Japanese Car Auction</span>
            <span className="mx-2">&gt;</span>
            <span className="hover:text-blue-600 cursor-pointer">List</span>
            {makeFilter && (
              <>
                <span className="mx-2">&gt;</span>
                <span className="hover:text-blue-600 cursor-pointer">{makeFilter}</span>
              </>
            )}
            {categoryFilter && categories.find(c => c.id.toString() === categoryFilter) && (
              <>
                <span className="mx-2">&gt;</span>
                <span className="text-gray-900 font-medium">
                  {categories.find(c => c.id.toString() === categoryFilter)?.name}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {makeFilter && categoryFilter && categories.find(c => c.id.toString() === categoryFilter) 
              ? `Used ${makeFilter} ${categories.find(c => c.id.toString() === categoryFilter)?.name} at Auction`
              : makeFilter 
                ? `Used ${makeFilter} Cars at Auction`
                : categoryFilter && categories.find(c => c.id.toString() === categoryFilter)
                  ? `Used ${categories.find(c => c.id.toString() === categoryFilter)?.name} at Auction`
                  : 'Japanese Used Cars at Auction'
            }
          </h1>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cars by make, model, year, or any keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Filter Grid with Search Button on Same Line */}
          <div className="flex items-start gap-4 mb-4">
            {/* Filter Grid */}
            <div className={`flex-1 transition-all duration-300 ${showAdvancedFilters ? 'opacity-100 max-h-none' : 'opacity-100 max-h-20 overflow-hidden'}`}>
              {/* First Row - Always Visible */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <select
                  value={makeFilter}
                  onChange={(e) => setMakeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Makes</option>
                  {filterOptions?.makes?.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {filterOptions?.years?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Max Year</option>
                  {filterOptions?.years?.map((year) => (
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
                      {filterOptions?.transmissions?.map((transmission) => (
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
                      {filterOptions?.colors?.map((color) => (
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
                      {filterOptions?.fuels?.map((fuel) => (
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

                  {/* Fourth Row */}
                  <div className="grid grid-cols-5 gap-4">
                    <div></div>
                    <div></div>
                    <div></div>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Date From"
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Date To"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Search Button - On Same Line */}
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchCars}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
              <span className="text-gray-500">or</span>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results Count and Advanced Search */}
          <div className="flex items-center justify-between">
            <div className="text-red-600 font-medium text-lg">
              {totalItems} Matches
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <span>Advanced Search</span>
              <span className="text-lg">{showAdvancedFilters ? '−' : '+'}</span>
            </button>
          </div>
        </div>


       

        {/* Cars Table Display */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">
              Loading premium vehicles...
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No vehicles found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-6 p-6 text-sm font-medium text-gray-700">
                <div className="col-span-3">Car Information</div>
                <div className="col-span-1">Mileage</div>
                <div className="col-span-1">Engine</div>
                <div className="col-span-1">Trans.</div>
                <div className="col-span-1">Drive.</div>
                <div className="col-span-1">Steering</div>
                <div className="col-span-1">Color</div>
                <div className="col-span-1">Cut-off Time</div>
                <div className="col-span-1">Starting Price</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {cars.map((car) => (
                <div key={car.id} className="grid grid-cols-12 gap-6 p-6 hover:bg-gray-50 transition-colors">
                  {/* Car Information */}
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-24 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        Ref No. {car.ref_no || `AA${car.id.toString().padStart(6, '0')}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {car.year} {car.make} {car.model} {car.variant && `- ${car.variant}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Chassis No. {(car as any).chassis_no || (car as any).vin || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                          {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.mileage_km ? `${car.mileage_km.toLocaleString()} km` : 'N/A'}
                    </span>
                  </div>

                  {/* Engine */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : 'N/A'}
                    </span>
                  </div>

                  {/* Transmission */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.transmission || 'N/A'}
                    </span>
                  </div>

                  {/* Drive */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {(car as any).drive_type || (car as any).drivetrain || 'N/A'}
                    </span>
                  </div>

                  {/* Steering */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.steering || 'N/A'}
                    </span>
                  </div>

                  {/* Color */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.color || 'N/A'}
                    </span>
                  </div>

                  {/* Cut-off Time */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {(car as any).auction_date ? 
                        new Date((car as any).auction_date).toLocaleDateString('en-US', {
                          month: '2-digit',
                          day: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) + ' (JST)' : 
                        'TBD'
                      }
                    </span>
                  </div>

                  {/* Starting Price */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.price_amount ? 
                        formatPrice(car.price_amount, car.price_currency) : 
                        'Price on request'
                      }
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => handleViewCar(car)}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(car)}
                      disabled={isCarLoading(car.id)}
                      className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      title="Add to Cart"
                    >
                      {isCarLoading(car.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
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
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      {(selectedCar as any).chassis_no && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Chassis No:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).chassis_no}
                          </span>
                        </div>
                      )}
                      {(selectedCar as any).vin && (
                        <div>
                          <span className="font-medium text-gray-600">
                            VIN:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).vin}
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
                      {(selectedCar as any).drive_type && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Drive Type:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).drive_type}
                          </span>
                        </div>
                      )}
                      {(selectedCar as any).drivetrain && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Drivetrain:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).drivetrain}
                          </span>
                        </div>
                      )}
                      {(selectedCar as any).body_type && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Body Type:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).body_type}
                          </span>
                        </div>
                      )}
                      {(selectedCar as any).doors && (
                        <div>
                          <span className="font-medium text-gray-600">
                            Doors:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {(selectedCar as any).doors}
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
                      {(selectedCar as any).auction_date && (
                        <p className="text-sm text-gray-600">
                          Auction Date: {new Date((selectedCar as any).auction_date).toLocaleDateString()}
                        </p>
                      )}
                      {(selectedCar as any).starting_price && (
                        <p className="text-sm text-gray-600">
                          Starting Price: {formatPrice((selectedCar as any).starting_price, selectedCar.price_currency)}
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
                  {(selectedCar.location || selectedCar.country_origin || (selectedCar as any).port) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Location
                      </h3>
                      <div className="space-y-2">
                        {(selectedCar as any).port && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Port: {(selectedCar as any).port}</span>
                          </div>
                        )}
                        {selectedCar.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Location: {selectedCar.location}</span>
                          </div>
                        )}
                        {selectedCar.country_origin && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Country: {selectedCar.country_origin}</span>
                          </div>
                        )}
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
