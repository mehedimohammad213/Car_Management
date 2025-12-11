import React from "react";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { Car as CarType } from "../../services/carApi";
import { Stock } from "../../services/stockApi";
import {
  getStatusColor,
  getStockStatusColor,
  getStockStatusTextColor,
} from "../../utils/carUtils";

interface CarSpecificationsProps {
  car: CarType;
  stockData: Stock | null;
}

const CarSpecifications: React.FC<CarSpecificationsProps> = ({
  car,
  stockData,
}) => {
  const specificationItems: Array<{
    label: string;
    value: React.ReactNode;
  }> = [
    {
      label: "Mileage",
      value: car.mileage_km
        ? `${car.mileage_km.toLocaleString()} km`
        : "N/A",
    },
    {
      label: "Year",
      value: car.year || "N/A",
    },
    {
      label: "Engine",
      value: car.engine_cc
        ? `${car.engine_cc.toLocaleString()} cc`
        : "N/A",
    },
    {
      label: "Transmission",
      value: car.transmission || "N/A",
    },
    {
      label: "Drivetrain",
      value:
        (car as any).drive_type || (car as any).drivetrain || "N/A",
    },
    {
      label: "Steering",
      value: car.steering || "N/A",
    },
    {
      label: "Fuel",
      value: car.fuel || "N/A",
    },
    {
      label: "Reference No.",
      value: car.ref_no || `AA${car.id.toString().padStart(6, "0")}`,
    },
    {
      label: "Registration Year",
      value: car.year || "N/A",
    },
    {
      label: "Exterior Color",
      value: car.color || "N/A",
    },
    {
      label: "Seating Capacity",
      value: car.seats || "N/A",
    },
    {
      label: "Overall Grade",
      value:
        car.grade_overall !== undefined && car.grade_overall !== null
          ? car.grade_overall
          : "N/A",
    },
    {
      label: "Engine No.",
      value: car.engine_number || "N/A",
    },
    {
      label: "Chassis No.",
      value: car.chassis_no_full || car.chassis_no_masked || "N/A",
    },
    {
      label: "No. of Keys",
      value:
        car.number_of_keys !== undefined && car.number_of_keys !== null
          ? car.number_of_keys
          : "N/A",
    },
    {
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            car.status
          )}`}
        >
          {car.status
            ? car.status.charAt(0).toUpperCase() + car.status.slice(1)
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Specifications Section */}
      <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
            Specifications
          </h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {/* Refined Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
            {specificationItems.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-4 py-3 shadow-sm"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {label}
                </span>
                <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Stock Information - Full Width */}
          {stockData && (
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Stock:</span>
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-medium ${getStockStatusColor(
                    stockData.quantity,
                    stockData.status
                  )}`}
                >
                  {stockData.quantity}
                </span>
                <span
                  className={`text-xs ${getStockStatusTextColor(
                    stockData.quantity,
                    stockData.status
                  )}`}
                >
                  {stockData.status}
                </span>
                {stockData.price && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Stock Price: ${typeof stockData.price === "string" ? parseFloat(stockData.price).toLocaleString() : stockData.price.toLocaleString()}
                  </span>
                )}
                {stockData.notes && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                    {stockData.notes}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chassis Number with View Button */}
          {(car as any).chassis_no && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Chassis No.:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {(car as any).chassis_no}
                </span>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium">
                  View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      {car.detail && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
            Additional Details
          </h3>
          {car.detail.short_title && (
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {car.detail.short_title}
            </p>
          )}
          {car.detail.full_title && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {car.detail.full_title}
            </p>
          )}
          {car.detail.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {car.detail.description}
            </p>
          )}
        </div>
      )}

      {/* Location */}
      {(car.location || car.country_origin || (car as any).port) && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
            Location
          </h3>
          <div className="space-y-2">
            {(car as any).port && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Port: {(car as any).port}</span>
              </div>
            )}
            {car.location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Location: {car.location}</span>
              </div>
            )}
            {car.country_origin && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Country: {car.country_origin}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {car.notes && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
            Notes
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{car.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CarSpecifications;
