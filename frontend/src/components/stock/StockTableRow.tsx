import React from "react";
import { Eye, Edit, Trash2, Car } from "lucide-react";
import { Stock } from "../../services/stockApi";
import { getGradeColor, formatPrice as formatPriceUtil } from "../../utils/carUtils";

interface StockTableRowProps {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
  onView?: (stock: Stock) => void;
}

const StockTableRow: React.FC<StockTableRowProps> = ({
  stock,
  onEdit,
  onDelete,
  onView,
}) => {
  const car = stock.car;

  const formatPrice = (amount?: number | string, currency?: string) => {
    if (amount === undefined || amount === null) return "Price on request";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "Price on request";
    const formatted = formatPriceUtil(numAmount, currency);
    // Extract just the number part to match CarTable display
    return formatted.replace(/^[A-Z]+\s/, "");
  };

  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
    >
      {/* Car Information - Enhanced */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="relative w-28 h-24 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 group-hover:border-blue-300">
          {car?.photos && car.photos.length > 0 ? (
            <img
              src={
                car.photos.find((p: any) => p.is_primary)?.url ||
                car.photos[0].url
              }
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {stock.quantity > 0 && (
            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
              {stock.quantity}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
            {car?.year} {car?.make} {car?.model}
            {car?.variant && (
              <span className="text-sm font-normal text-gray-600">
                {" "}- {car.variant}
              </span>
            )}
          </div>
          <div className="text-xs font-semibold text-gray-600 mb-1">
            <span className="text-gray-500">Ref:</span>{" "}
            <span className="text-blue-600 font-mono">
              {car?.ref_no || `AA${car?.id?.toString().padStart(6, "0") || ""}`}
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2 font-mono truncate">
            <span className="text-gray-400">Chassis:</span>{" "}
            {car?.chassis_no_full || car?.chassis_no_masked || "N/A"}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {car?.package && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {car.package}
              </span>
            )}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                stock.quantity === 0
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : stock.quantity <= 2
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              Stock: {stock.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Mileage - Enhanced */}
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {car?.mileage_km
              ? `${car.mileage_km.toLocaleString()} km`
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Engine - Enhanced */}
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {car?.engine_cc
              ? `${car.engine_cc.toLocaleString()} cc`
              : "N/A"}
          </span>
          {car?.fuel && (
            <span className="text-xs text-gray-500 mt-0.5 capitalize">
              {car.fuel}
            </span>
          )}
        </div>
      </div>

      {/* Color - Enhanced */}
      <div className="col-span-1 flex items-center">
        <div className="flex items-center gap-2">
          {car?.color && (
            <div
              className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm bg-gray-200"
              style={{
                backgroundColor: car.color,
              }}
              title={car.color}
            />
          )}
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {car?.color || "N/A"}
          </span>
        </div>
      </div>

      {/* Grade - Enhanced */}
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col items-start gap-1">
          {car?.grade_overall && (
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-md ${getGradeColor(
                car.grade_overall
              )}`}
            >
              {car.grade_overall}
            </span>
          )}
          <div className="flex gap-1 text-xs">
            {car?.grade_exterior && (
              <span className="text-gray-600 font-medium">
                E:{car.grade_exterior}
              </span>
            )}
            {car?.grade_interior && (
              <span className="text-gray-600 font-medium">
                I:{car.grade_interior}
              </span>
            )}
          </div>
          {!car?.grade_overall &&
            !car?.grade_exterior &&
            !car?.grade_interior && (
              <span className="text-xs text-gray-400">N/A</span>
            )}
        </div>
      </div>

      {/* Key Features - Enhanced */}
      <div className="col-span-3 flex items-center">
        <div className="flex flex-wrap gap-1.5 max-w-full">
          {(car?.keys_feature
            ?.split(",")
            .map((feature: string) => feature.trim())
            .filter(Boolean)
            .slice(0, 8) || []
          ).map((feature: string) => (
            <span
              key={feature}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              {feature}
            </span>
          ))}
          {car?.keys_feature && car.keys_feature.split(",").filter(Boolean).length > 8 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-gray-500">
              +{car.keys_feature.split(",").filter(Boolean).length - 8} more
            </span>
          )}
          {!car?.keys_feature && (
            <span className="text-xs text-gray-400 italic">No features listed</span>
          )}
        </div>
      </div>

      {/* Price - Enhanced */}
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {car?.price_amount
              ? formatPrice(car.price_amount, car.price_currency)
              : "Price on request"}
          </span>
        </div>
      </div>

      {/* Actions - Enhanced */}
      <div
        className="col-span-1 flex items-center justify-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <button
            onClick={() => onView(stock)}
            className="p-2.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 group/btn"
            title="View Stock"
          >
            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
        <button
          onClick={() => onEdit(stock)}
          className="p-2.5 text-amber-600 hover:text-amber-700 rounded-lg transition-all duration-200 group/btn"
          title="Edit Stock"
        >
          <Edit className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onDelete(stock)}
          className="p-2.5 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 group/btn"
          title="Delete Stock"
        >
          <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default StockTableRow;
