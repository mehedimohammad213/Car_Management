import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CarIcon } from "lucide-react";
import CarFormModal from "../../components/car/CarFormModal";
import { carApi, CreateCarData, CarFilterOptions } from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";

const CreateCar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);
        const [categoriesData, filterOptionsData] = await Promise.all([
          categoryApi.getCategories(),
          carApi.getFilterOptions(),
        ]);

        console.log("Categories API response:", categoriesData);
        console.log("Response structure:", {
          success: categoriesData.success,
          message: categoriesData.message,
          data: categoriesData.data,
          dataType: typeof categoriesData.data,
          dataKeys: Object.keys(categoriesData.data || {}),
          categoriesInData: categoriesData.data?.categories,
          categoriesType: typeof categoriesData.data?.categories,
          categoriesLength: categoriesData.data?.categories?.length,
        });

        // Handle different possible response structures
        let categoriesList: Category[] = [];
        if (categoriesData.data.categories) {
          categoriesList = categoriesData.data.categories;
        } else if (Array.isArray(categoriesData.data)) {
          categoriesList = categoriesData.data;
        }

        console.log("Processed categories:", categoriesList);
        console.log("Categories list length:", categoriesList.length);
        setCategories(categoriesList);
        setFilterOptions(filterOptionsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: CreateCarData | FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Submitting car data:", formData);
      const response = await carApi.createCar(formData);
      console.log("Car creation response:", response);
      navigate("/admin/cars", {
        state: { message: "Car created successfully!" },
      });
    } catch (error: any) {
      console.error("Error creating car:", error);

      // Extract error message from API response
      let errorMessage = "Failed to create car. Please try again.";

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

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/cars");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="font-medium">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Car
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a new car listing for your inventory
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
              <CarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
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
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No Categories Available
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  No categories were loaded from the API. Please check the
                  backend connection or create some categories first.
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Categories loaded: {categories.length}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <CarFormModal
            mode="create"
            categories={categories || []}
            filterOptions={filterOptions}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isLoading}
            isModal={false}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCar;
