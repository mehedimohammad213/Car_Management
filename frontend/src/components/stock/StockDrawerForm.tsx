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

interface StockDrawerFormProps {
  stock?: Stock | null;
  onSubmit: (data: CreateStockData | UpdateStockData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StockDrawerForm: React.FC<StockDrawerFormProps> = ({
  stock,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateStockData>({
    car_id: 0,
    quantity: 1,
    price: undefined,
    status: "available",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stock) {
      setFormData({
        car_id: stock.car_id,
        quantity: stock.quantity,
        price: stock.price,
        status: stock.status,
        notes: stock.notes || "",
      });
    }
  }, [stock]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.car_id) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Car Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <PackageIcon className="w-4 h-4 inline mr-2" />
          Car Selection
        </label>
        <select
          value={formData.car_id}
          onChange={(e) =>
            handleInputChange("car_id", parseInt(e.target.value))
          }
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.car_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value={0}>Select a car</option>
          {/* This would be populated with available cars from the API */}
          <option value={1}>Toyota Camry 2023</option>
          <option value={2}>Honda Civic 2023</option>
        </select>
        {errors.car_id && (
          <p className="mt-1 text-sm text-red-600">{errors.car_id}</p>
        )}
      </div>

      {/* Quantity and Price Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <HashIcon className="w-4 h-4 inline mr-2" />
            Quantity
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              handleInputChange("quantity", parseInt(e.target.value))
            }
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

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
            value={formData.price || ""}
            onChange={(e) =>
              handleInputChange(
                "price",
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileTextIcon className="w-4 h-4 inline mr-2" />
          Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Add any additional notes about this stock item..."
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
