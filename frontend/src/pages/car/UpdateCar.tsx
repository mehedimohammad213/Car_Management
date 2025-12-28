import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, CarIcon } from "lucide-react";
import CarFormModal from "../../components/car/CarFormModal";
import { carApi, Car, CreateCarData, CarFilterOptions } from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";

const UpdateCar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setFetchError("Car ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [carData, categoriesData, filterOptionsData] = await Promise.all([
          carApi.getCar(parseInt(id)),
          categoryApi.getCategories(),
          carApi.getFilterOptions(),
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
        setFilterOptions(filterOptionsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load car data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData: CreateCarData | FormData) => {
    if (!car) return;

    setIsSaving(true);
    setSubmitError(null);
    try {
      console.log("Updating car data:", formData);

      // Handle FormData differently
      let response;
      if (formData instanceof FormData) {
        formData.append('id', car.id.toString());
        response = await carApi.updateCar(formData);
      } else {
        response = await carApi.updateCar({ id: car.id, ...formData });
      }
      console.log("Car update response:", response);
      navigate(`/cars?${searchParams.toString()}`, {
        state: { message: "Car updated successfully!" },
      });
    } catch (error: any) {
      console.error("Error updating car:", error);

      // Extract error message from API response
      let errorMessage = "Failed to update car. Please try again.";

      if (error.response?.data) {
        const responseData = error.response.data;

        // Check for validation errors
        if (responseData.errors) {
          const errors = responseData.errors;

          // Check for chassis_no_full duplicate error
          if (errors.chassis_no_full) {
            errorMessage = Array.isArray(errors.chassis_no_full)
              ? errors.chassis_no_full[0]
              : errors.chassis_no_full;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else {
            // Get first error message from validation errors
            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey && errors[firstErrorKey]) {
              errorMessage = Array.isArray(errors[firstErrorKey])
                ? errors[firstErrorKey][0]
                : errors[firstErrorKey];
            }
          }
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/cars?${searchParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (fetchError || !car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {fetchError || "Car not found"}
          </h2>
          <button
            onClick={() => navigate(`/cars?${searchParams.toString()}`)}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/cars?${searchParams.toString()}`)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit {car.make} {car.model}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Update car information and specifications
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <CarFormModal
          mode="update"
          car={car}
          categories={categories || []}
          filterOptions={filterOptions}
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
