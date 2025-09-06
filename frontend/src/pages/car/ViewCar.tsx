import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, EditIcon, TrashIcon, CarIcon } from "lucide-react";
import CarFormModal from "../../components/car/CarFormModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { carApi, Car } from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";

const ViewCar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [carData, categoriesData] = await Promise.all([
          carApi.getCar(parseInt(id)),
          categoryApi.getCategories(),
        ]);
        // Extract car from response - handle both single car and paginated responses
        let car: Car | null = null;
        if (carData.data.car) {
          car = carData.data.car;
        } else if (
          Array.isArray(carData.data.data) &&
          carData.data.data.length > 0
        ) {
          car = carData.data.data[0];
        } else if (carData.data && "id" in carData.data) {
          car = carData.data as Car;
        }
        setCar(car);
        setCategories(categoriesData.data.categories || []);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!car) return;

    setIsDeleting(true);
    try {
      await carApi.deleteCar(car.id);
      navigate("/admin/cars", {
        state: { message: "Car deleted successfully!" },
      });
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Car not found
          </h2>
          <button
            onClick={() => navigate("/admin/cars")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Car Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/cars")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {car.make} {car.model}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Car Details • ID: {car.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/update-car/${car.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <CarFormModal
          mode="view"
          car={car}
          categories={categories || []}
          filterOptions={null}
          isModal={false}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Car"
        message="Are you sure you want to delete"
        itemName={car ? `${car.make} ${car.model}` : ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ViewCar;
