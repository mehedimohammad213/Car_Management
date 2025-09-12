import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  carApi,
  Car,
  CreateCarData,
  CarFilterOptions,
} from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import CarManagementHeader from "../../components/car/CarManagementHeader";
import CarFilters from "../../components/car/CarFilters";
import CarTable from "../../components/car/CarTable";
import Pagination from "../../components/common/Pagination";
import MessageAlert from "../../components/common/MessageAlert";

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

  // const handleExcelImportSubmit = async (file: File) => {
  //   try {
  //     await carApi.importFromExcel(file);
  //     showMessage("success", "Cars imported successfully");
  //     handleExcelImportClose();
  //     fetchCars(); // Refresh the list
  //   } catch (error) {
  //     console.error("Error importing cars:", error);
  //     showMessage("error", "Failed to import cars");
  //   }
  // };

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

  console.log(
    "CarManagement render - cars:",
    cars.length,
    "loading:",
    isLoading
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setMakeFilter("");
    setYearFilter("");
    setTransmissionFilter("");
    setFuelFilter("");
    setColorFilter("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    console.log("Manual refresh clicked");
    fetchCars();
    fetchCategories();
    fetchFilterOptions();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <CarManagementHeader
        onExportExcel={handleExportExcel}
        onCreateCar={handleCreateCar}
      />

      <MessageAlert message={message} />

      <CarFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        makeFilter={makeFilter}
        yearFilter={yearFilter}
        transmissionFilter={transmissionFilter}
        fuelFilter={fuelFilter}
        colorFilter={colorFilter}
        filterOptions={filterOptions}
        categories={categories}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onMakeChange={setMakeFilter}
        onYearChange={setYearFilter}
        onTransmissionChange={setTransmissionFilter}
        onFuelChange={setFuelFilter}
        onColorChange={setColorFilter}
        onClearFilters={handleClearFilters}
      />

      <CarTable
        cars={cars}
        isLoading={isLoading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        onViewCar={handleViewCar}
        onEditCar={handleEditCar}
        onDeleteCar={handleDeleteCar}
        onRefresh={handleRefresh}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Car"
        message={`Are you sure you want to delete "${carToDelete?.make} ${carToDelete?.model}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CarManagement;
