import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, CarIcon } from "lucide-react";
import CarFormModal from "../../components/car/CarFormModal";
import { carApi, Car, CreateCarData } from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";

const UpdateCar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Car ID is required");
        setIsLoading(false);
        return;
      }

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
        console.error("Error fetching data:", error);
        setError("Failed to load car data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData: CreateCarData) => {
    if (!car) return;

    setIsSaving(true);
    try {
      await carApi.updateCar({ id: car.id, ...formData });
      navigate("/admin/cars", {
        state: { message: "Car updated successfully!" },
      });
    } catch (error) {
      console.error("Error updating car:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (car) {
      navigate(`/view-car/${car.id}`);
    } else {
      navigate("/admin/cars");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Car not found"}
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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/view-car/${car.id}`)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit {car.make} {car.model}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update car information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <CarFormModal
          mode="update"
          car={car}
          categories={categories || []}
          filterOptions={null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSaving}
          isModal={false}
        />
      </div>
    </div>
  );
};

export default UpdateCar;
