import React from "react";
import { Car, Eye, ShoppingCart, Edit, Trash2, Gauge, Settings, Palette, Award, Tag } from "lucide-react";
import { Car as CarType } from "../../services/carApi";
import { Stock } from "../../services/stockApi";
import { CurrencyBDTIcon } from "../icons/CurrencyBDTIcon";

interface CarTableProps {
  cars: CarType[];
  stockData: Map<number, Stock>;
  onViewCar: (car: CarType) => void;
  onViewCarAdmin?: (car: CarType) => void;
  onAddToCart: (car: CarType) => void;
  onEditCar?: (car: CarType) => void;
  onDeleteCar?: (car: CarType) => void;
  isCarLoading: (carId: number) => boolean;
  getStatusColor: (status: string) => string;
  getGradeColor: (grade?: string | number) => string;
  getStockStatusColor: (quantity: number, status: string) => string;
  formatPrice: (amount?: number, currency?: string) => string;
  isAdmin?: boolean;
}

const CarTable: React.FC<CarTableProps> = ({
  cars,
  stockData,
  onViewCar,
  onViewCarAdmin,
  onAddToCart,
  onEditCar,
  onDeleteCar,
  isCarLoading,
  getStatusColor,
  getGradeColor,
  getStockStatusColor,
  formatPrice,
  isAdmin = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Professional Table Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
            <div className="grid grid-cols-12 gap-2 p-5 text-sm font-bold text-white uppercase tracking-wider">
              <div className="col-span-3 flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>Car Information</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <span>Mileage</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Engine</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Color</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>AA Score</span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Key Features</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <CurrencyBDTIcon className="w-4 h-4" />
                <span>Price</span>
              </div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body with Enhanced Styling */}
          <div className="divide-y divide-gray-100 bg-gray-50/30">
            {cars.map((car, index) => {
              const stock = stockData.get(car.id);
              return (
                <div
                  key={car.id}
                  onClick={() => onViewCar(car)}
                  className="grid grid-cols-12 gap-2 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
                >
                  {/* Car Information - Enhanced */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="relative w-28 h-24 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 group-hover:border-blue-300">
                      {car.photos && car.photos.length > 0 ? (
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
                      {stock && stock.quantity > 0 && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                          {stock.quantity}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                        {car.year} {car.make} {car.model}
                        {car.variant && (
                          <span className="text-sm font-normal text-gray-600">
                            {" "}- {car.variant}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        <span className="text-gray-500">Ref:</span>{" "}
                        <span className="text-blue-600 font-mono">
                          {car.ref_no || `AA${car.id.toString().padStart(6, "0")}`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2 font-mono truncate">
                        <span className="text-gray-400">Chassis:</span>{" "}
                        {car.chassis_no_full || car.chassis_no_masked || "N/A"}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getStatusColor(
                            car.status
                          )}`}
                        >
                          {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                        </span>
                        {stock && (
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
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mileage - Enhanced */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {car.mileage_km
                          ? `${car.mileage_km.toLocaleString()} km`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Engine - Enhanced */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {car.engine_cc
                          ? `${car.engine_cc.toLocaleString()} cc`
                          : "N/A"}
                      </span>
                      {car.fuel && (
                        <span className="text-xs text-gray-500 mt-0.5 capitalize">
                          {car.fuel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Color - Enhanced */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-2">
                      {car.color && (
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm bg-gray-200"
                          style={{
                            backgroundColor: car.color,
                          }}
                          title={car.color}
                        />
                      )}
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {car.color || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* AA Score - Enhanced */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1">
                      {car.grade_overall && (
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-md ${getGradeColor(
                            car.grade_overall
                          )}`}
                        >
                          {car.grade_overall}
                        </span>
                      )}
                      <div className="flex gap-1 text-xs">
                        {car.grade_exterior && (
                          <span className="text-gray-600 font-medium">
                            E:{car.grade_exterior}
                          </span>
                        )}
                        {car.grade_interior && (
                          <span className="text-gray-600 font-medium">
                            I:{car.grade_interior}
                          </span>
                        )}
                      </div>
                      {!car.grade_overall &&
                        !car.grade_exterior &&
                        !car.grade_interior && (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                    </div>
                  </div>

                  {/* Key Features - Enhanced */}
                  <div className="col-span-3 flex items-center">
                    <div className="flex flex-wrap gap-1.5">
                      {(car.keys_feature
                        ?.split(",")
                        .map((feature) => feature.trim())
                        .filter(Boolean) || []
                      ).map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {feature}
                        </span>
                      ))}
                      {!car.keys_feature && (
                        <span className="text-xs text-gray-400 italic">No features listed</span>
                      )}
                    </div>
                  </div>

                  {/* Price - Enhanced */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-gray-900">
                        {car.price_amount
                          ? car.price_amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "Price on request"}
                      </span>
                      {/* {car.price_amount && car.price_currency === "USD" && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          ≈ ${(car.price_amount / 110).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      )} */}
                    </div>
                  </div>

                  {/* Actions - Enhanced */}
                  <div
                    className="col-span-1 flex items-center justify-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        isAdmin && onViewCarAdmin
                          ? onViewCarAdmin(car)
                          : onViewCar(car)
                      }
                      className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group/btn"
                      title={
                        isAdmin ? "View Car Details (Admin)" : "View Car Details"
                      }
                    >
                      <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>

                    {/* Edit button for admin */}
                    {isAdmin && onEditCar && (
                      <button
                        onClick={() => onEditCar(car)}
                        className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group/btn"
                        title="Edit Car"
                      >
                        <Edit className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}

                    {/* Delete button for admin */}
                    {isAdmin && onDeleteCar && (
                      <button
                        onClick={() => onDeleteCar(car)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group/btn"
                        title="Delete Car"
                      >
                        <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}

                    {/* Add to Cart button - hidden for admin */}
                    {!isAdmin && (
                      <button
                        onClick={() => onAddToCart(car)}
                        disabled={isCarLoading(car.id)}
                        className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-sm group/btn"
                        title="Add to Cart"
                      >
                        {isCarLoading(car.id) ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                        ) : (
                          <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTable;
