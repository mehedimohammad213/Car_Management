import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowUp,
  ArrowDown,
  Upload,
  Download,
  Settings,
  Star,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  FileSpreadsheet,
} from "lucide-react";
import {
  carApi,
  Car,
  CreateCarData,
  CarFilterOptions,
} from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ExcelImportModal from "../../components/ExcelImportModal";

const CarManagement: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states (only for delete confirmation and excel import)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Success/Error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    console.log("CarManagement component mounted");
    console.log("Current user token:", localStorage.getItem("token"));
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
        sort_by: sortBy,
        sort_direction: sortDirection,
        per_page: perPage,
        page: currentPage,
      });

      console.log("Cars response:", response);
      console.log("Response data structure:", {
        success: response.success,
        hasData: !!response.data.data,
        dataLength: response.data.data?.length,
        pagination: {
          lastPage: response.data.last_page,
          total: response.data.total,
        },
      });

      if (response.success && response.data.data) {
        setCars(response.data.data);
        // Handle pagination from Laravel's pagination structure
        if (response.data.last_page !== undefined) {
          setTotalPages(response.data.last_page);
          setTotalItems(response.data.total || 0);
        }
      } else {
        console.log("Response not successful or no cars data:", response);
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      showMessage("error", "Failed to fetch cars");
      setCars([]);
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

  const handleCreateCar = () => {
    navigate("/create-car");
  };

  const handleEditCar = (car: Car) => {
    navigate(`/update-car/${car.id}`);
  };

  const handleViewCar = (car: Car) => {
    navigate(`/view-car/${car.id}`);
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      await carApi.deleteCar(carToDelete.id);
      setCars(cars.filter((car) => car.id !== carToDelete.id));
      setShowDeleteModal(false);
      setCarToDelete(null);
      showMessage("success", "Car deleted successfully");
    } catch (error) {
      console.error("Error deleting car:", error);
      showMessage("error", "Failed to delete car");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportExcel = () => {
    setShowExcelModal(true);
  };

  const handleExcelImportClose = () => {
    setShowExcelModal(false);
  };

  const handleExcelImportSubmit = async (file: File) => {
    try {
      await carApi.importFromExcel(file);
      showMessage("success", "Cars imported successfully");
      handleExcelImportClose();
      fetchCars(); // Refresh the list
    } catch (error) {
      console.error("Error importing cars:", error);
      showMessage("error", "Failed to import cars");
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await carApi.exportToExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cars_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      showMessage("success", "Cars exported successfully");
    } catch (error) {
      console.error("Error exporting cars:", error);
      showMessage("error", "Failed to export cars");
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "N/A";
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

  console.log(
    "CarManagement render - cars:",
    cars.length,
    "loading:",
    isLoading
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              🚗 Car Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your vehicle inventory with advanced features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportExcel}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Import Excel
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Export Excel
            </button>
            <button
              onClick={handleCreateCar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add Car
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-lg ${
            message.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : message.type === "error"
              ? "bg-red-100 border-l-4 border-red-500 text-red-700"
              : "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">All Status</option>
            {filterOptions?.statuses?.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Make Filter */}
          <select
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">All Makes</option>
            {filterOptions?.makes?.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCategoryFilter("");
              setMakeFilter("");
              setYearFilter("");
              setTransmissionFilter("");
              setFuelFilter("");
              setColorFilter("");
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Photo</th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort("make")}
                >
                  <div className="flex items-center">
                    Make & Model {getSortIcon("make")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Category</th>
                <th className="px-6 py-4 text-left font-semibold">Specs</th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort("price_amount")}
                >
                  <div className="flex items-center">
                    Price {getSortIcon("price_amount")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {getSortIcon("status")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">
                        Loading cars...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="space-y-2">
                      <p>No cars found</p>
                      <p className="text-sm text-gray-400">
                        {isLoading
                          ? "Loading..."
                          : "Try refreshing the page or check your connection"}
                      </p>
                      <button
                        onClick={() => {
                          console.log("Manual refresh clicked");
                          fetchCars();
                          fetchCategories();
                          fetchFilterOptions();
                        }}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                      >
                        Refresh Data
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{car.id}
                    </td>
                    <td className="px-6 py-4">
                      {car.photos && car.photos.length > 0 ? (
                        <img
                          src={
                            car.photos.find((p) => p.is_primary)?.url ||
                            car.photos[0].url
                          }
                          alt={`${car.make} ${car.model}`}
                          className="w-16 h-12 rounded-lg object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="w-6 h-6 text-gray-400 font-bold">
                            🚗
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {car.make} {car.model}
                        </div>
                        {car.variant && (
                          <div className="text-sm text-gray-500 mt-1">
                            {car.variant}
                          </div>
                        )}
                        {car.ref_no && (
                          <div className="text-xs text-gray-400 mt-1">
                            Ref: {car.ref_no}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {car.category && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {car.category.name}
                          </span>
                        )}
                        {car.subcategory && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {car.subcategory.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        {car.transmission && (
                          <div className="flex items-center gap-1">
                            <Settings className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              {car.transmission}
                            </span>
                          </div>
                        )}
                        {car.fuel && (
                          <div className="flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{car.fuel}</span>
                          </div>
                        )}
                        {car.color && (
                          <div className="flex items-center gap-1">
                            <Palette className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{car.color}</span>
                          </div>
                        )}
                        {car.mileage_km && (
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              {car.mileage_km.toLocaleString()} km
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(car.price_amount, car.price_currency)}
                        </div>
                        {car.price_basis && (
                          <div className="text-xs text-gray-500">
                            {car.price_basis}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          car.status
                        )}`}
                      >
                        {car.status?.charAt(0).toUpperCase() +
                          car.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCar(car)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Car"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCar(car)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Car"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Car"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalItems)} of {totalItems}{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
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
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Car"
        message={`Are you sure you want to delete "${carToDelete?.make} ${carToDelete?.model}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={showExcelModal}
        onClose={handleExcelImportClose}
        onSubmit={handleExcelImportSubmit}
      />
    </div>
  );
};

export default CarManagement;
