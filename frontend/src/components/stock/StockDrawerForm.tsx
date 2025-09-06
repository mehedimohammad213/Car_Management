import React, { useState, useEffect } from "react";
import {
  PackageIcon,
  DollarSignIcon,
  HashIcon,
  FileTextIcon,
} from "lucide-react";
import {
  Stock,
  CreateStockData,
  UpdateStockData,
} from "../../services/stockApi";
import { stockApi } from "../../services/stockApi";

interface StockDrawerFormProps {
  stock?: Stock | null;
  onSubmit: (data: CreateStockData | UpdateStockData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onError?: (error: string) => void;
}

interface AvailableCar {
  id: number;
  make: string;
  model: string;
  year: number;
  ref_no?: string;
  category?: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
}

const StockDrawerForm: React.FC<StockDrawerFormProps> = ({
  stock,
  onSubmit,
  onCancel,
  isLoading = false,
  onError,
}) => {
  const [formData, setFormData] = useState<CreateStockData>({
    car_id: 0,
    quantity: 1,
    price: 0,
    status: "available",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableCars, setAvailableCars] = useState<AvailableCar[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(false);

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  useEffect(() => {
    if (stock) {
      setFormData({
        car_id: stock.car_id,
        quantity: stock.quantity,
        price: stock.price || 0,
        status: stock.status,
        notes: stock.notes || "",
      });
    }
  }, [stock]);

  const fetchAvailableCars = async () => {
    try {
      setIsLoadingCars(true);
      const response = await stockApi.getAvailableCars();
      if (response.success && response.data) {
        setAvailableCars(response.data);
      }
    } catch (error) {
      console.error("Error fetching available cars:", error);
    } finally {
      setIsLoadingCars(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Only validate car_id for new stocks, not updates
    if (!stock && formData.car_id === 0) {
      newErrors.car_id = "Car selection is required";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // For updates, only send the fields that can be updated (exclude car_id)
        const submitData = stock
          ? {
              quantity: formData.quantity,
              price: formData.price,
              status: formData.status,
              notes: formData.notes,
            }
          : formData;

        onSubmit(submitData);
      } catch (error: any) {
        console.error("Form submission error:", error);
        if (onError) {
          onError(
            error.message || "An error occurred while submitting the form"
          );
        }
      }
    }
  };

  const handleInputChange = (
    field: keyof CreateStockData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const statusOptions = [
    { value: "available", label: "Available", color: "text-green-600" },
    { value: "sold", label: "Sold", color: "text-blue-600" },
    { value: "reserved", label: "Reserved", color: "text-yellow-600" },
    { value: "damaged", label: "Damaged", color: "text-red-600" },
    { value: "lost", label: "Lost", color: "text-gray-600" },
    { value: "stolen", label: "Stolen", color: "text-red-600" },
  ];

  const formatCarLabel = (car: AvailableCar) => {
    const category = car.category?.name || "";
    const subcategory = car.subcategory?.name || "";
    const categoryInfo =
      category && subcategory
        ? ` (${category} > ${subcategory})`
        : category
        ? ` (${category})`
        : "";
    return `${car.make} ${car.model} ${car.year}${categoryInfo}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Car Selection, Quantity, and Status Fields - 3 Columns */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <PackageIcon className="w-4 h-4 inline mr-2" />
              {stock ? "Car" : "Car Selection *"}
            </label>
            {!stock && (
              <button
                type="button"
                onClick={fetchAvailableCars}
                disabled={isLoadingCars}
                className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
              >
                {isLoadingCars ? "Loading..." : "Refresh"}
              </button>
            )}
          </div>
          {stock ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {stock.car
                ? `${stock.car.make} ${stock.car.model} (${stock.car.year})`
                : "N/A"}
            </div>
          ) : (
            <select
              value={formData.car_id}
              onChange={(e) =>
                handleInputChange("car_id", parseInt(e.target.value))
              }
              disabled={isLoadingCars}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.car_id ? "border-red-300" : "border-gray-300"
              } ${isLoadingCars ? "bg-gray-100 cursor-not-allowed" : ""}`}
            >
              <option value={0}>
                {isLoadingCars ? "Loading cars..." : "Select a car"}
              </option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {formatCarLabel(car)}
                </option>
              ))}
            </select>
          )}
          {errors.car_id && (
            <p className="mt-1 text-sm text-red-600">{errors.car_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <HashIcon className="w-4 h-4 inline mr-2" />
            Quantity *
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              handleInputChange("quantity", parseInt(e.target.value))
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.quantity ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price and Notes - 2 Columns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSignIcon className="w-4 h-4 inline mr-2" />
            Price (Optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.price === 0 ? "" : formData.price}
            onChange={(e) =>
              handleInputChange(
                "price",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.price ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileTextIcon className="w-4 h-4 inline mr-2" />
            Notes (Optional)
          </label>
          <textarea
            rows={1}
            placeholder="Add any additional notes about this stock item..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : stock ? (
            "Update Stock"
          ) : (
            "Create Stock"
          )}
        </button>
      </div>
    </form>
  );
};

export default StockDrawerForm;
