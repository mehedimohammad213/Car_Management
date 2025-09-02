import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../services/mockData";
import { Car, Brand, Category } from "../types";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import CarManagementHeader from "../components/CarManagementHeader";
import CarTable from "../components/CarTable";
import Pagination from "../components/Pagination";

const CarManagement: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, brandsData, categoriesData] = await Promise.all([
          mockApi.getCars(),
          mockApi.getBrands(),
          mockApi.getCategories(),
        ]);
        await mockApi.delay();
        setCars(carsData);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesCategory =
      !selectedCategory || car.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, selectedCategory]);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCars(cars.filter((car) => car.id !== carToDelete.id));
      setShowDeleteModal(false);
      setCarToDelete(null);
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCarToDelete(null);
  };

  const handleToggleAvailability = (carId: string) => {
    setCars(
      cars.map((car) =>
        car.id === carId ? { ...car, isAvailable: !car.isAvailable } : car
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header Component */}
      <CarManagementHeader
        cars={cars}
        brands={brands}
        categories={categories}
        searchTerm={searchTerm}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onBrandChange={setSelectedBrand}
        onCategoryChange={setSelectedCategory}
      />

      {/* Table Component */}
      <div className="relative">
        <CarTable
          cars={paginatedCars}
          onToggleAvailability={handleToggleAvailability}
          onDeleteCar={handleDeleteCar}
        />

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCars.length}
          onPageChange={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </div>

      {/* Add/Edit Car Modal (Placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Car
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature is coming soon. For now, you can manage existing
              cars.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Car"
        message="Are you sure you want to delete"
        itemName={
          carToDelete ? `${carToDelete.brand} ${carToDelete.model}` : ""
        }
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CarManagement;
