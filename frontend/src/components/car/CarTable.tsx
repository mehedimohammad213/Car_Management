import React from "react";
import { Car, Eye, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { Car as CarType } from "../../services/carApi";
import { Stock } from "../../services/stockApi";

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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Table Header - match payment page blue header */}
          <div className="bg-blue-600">
            <div className="grid grid-cols-10 gap-3 p-6 text-sm font-bold text-white uppercase tracking-wide">
              <div className="col-span-3">Car Information</div>
              <div className="col-span-1">Mileage</div>
              <div className="col-span-1">Engine</div>
              <div className="col-span-1">Color</div>
              <div className="col-span-1">AA Score</div>
              <div className="col-span-1">Key Features</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {cars.map((car) => (
              <div
                key={car.id}
                onClick={() => onViewCar(car)}
                className="grid grid-cols-10 gap-3 p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
            {/* Car Information */}
            <div className="col-span-3 flex items-center gap-4">
              <div className="w-24 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                {car.photos && car.photos.length > 0 ? (
                  <img
                    src={
                      car.photos.find((p: any) => p.is_primary)?.url ||
                      car.photos[0].url
                    }
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  {car.year} {car.make} {car.model}{" "}
                  {car.variant && `- ${car.variant}`}
                </div>
                <div className="text-sm text-gray-600">
                  Ref No :{" "}
                  {car.ref_no || `AA${car.id.toString().padStart(6, "0")}`}
                </div>
                <div className="text-xs text-gray-500">
                  Chassis No :{" "}
                  {(car as any).chassis_no || (car as any).vin || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  Status:{" "}
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      car.status
                    )}`}
                  >
                    {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                  </span>
                  {(() => {
                    const stock = stockData.get(car.id);
                    if (stock) {
                      return (
                        <span
                          className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(
                            stock.quantity,
                            stock.status
                          )}`}
                        >
                          Stock: {stock.quantity}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>

            {/* Mileage */}
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-gray-900">
                {car.mileage_km
                  ? `${car.mileage_km.toLocaleString()} km`
                  : "N/A"}
              </span>
            </div>

            {/* Engine */}
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-gray-900">
                {car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : "N/A"}
              </span>
            </div>

            {/* Color */}
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-gray-900">
                {car.color || "N/A"}
              </span>
            </div>

            {/* AA Score */}
            <div className="col-span-1 flex items-center">
              <div className="flex flex-col items-center">
                {car.grade_overall && (
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(
                        car.grade_overall
                      )}`}
                    >
                      {car.grade_overall}
                    </span>
                  </div>
                )}
                {car.grade_exterior && (
                  <span className="text-xs text-gray-600 mt-1">
                    Ext: {car.grade_exterior}
                  </span>
                )}
                {car.grade_interior && (
                  <span className="text-xs text-gray-600">
                    Int: {car.grade_interior}
                  </span>
                )}
                {!car.grade_overall &&
                  !car.grade_exterior &&
                  !car.grade_interior && (
                    <span className="text-xs text-gray-500">N/A</span>
                  )}
              </div>
            </div>

            {/* Key Features */}
            <div className="col-span-1 flex items-center">
              <div className="flex flex-wrap gap-1">
                {(car.keys_feature
                  ?.split(",")
                  .map((feature) => feature.trim())
                  .filter(Boolean) || []
                ).map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {feature}
                  </span>
                ))}
                {!car.keys_feature && (
                  <span className="text-xs text-gray-500">N/A</span>
                )}
              </div>
            </div>

            {/* Starting Price */}
            <div className="col-span-1 flex items-center">
              <span className="text-sm text-gray-900">
                {car.price_amount
                  ? formatPrice(car.price_amount, car.price_currency)
                  : "Price on request"}
              </span>
            </div>

            {/* Action */}
            <div
              className="col-span-1 flex items-center justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  isAdmin && onViewCarAdmin
                    ? onViewCarAdmin(car)
                    : onViewCar(car)
                }
                className="p-2 text-blue-600 hover:text-blue-700 rounded-lg transition-colors"
                title={
                  isAdmin ? "View Car Details (Admin)" : "View Car Details"
                }
              >
                <Eye className="w-5 h-5" />
              </button>

              {/* Edit button for admin */}
              {isAdmin && onEditCar && (
                <button
                  onClick={() => onEditCar(car)}
                  className="p-2 text-orange-600 hover:text-orange-700 rounded-lg transition-colors"
                  title="Edit Car"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}

              {/* Delete button for admin */}
              {isAdmin && onDeleteCar && (
                <button
                  onClick={() => onDeleteCar(car)}
                  className="p-2 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                  title="Delete Car"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              {/* Add to Cart button - hidden for admin */}
              {!isAdmin && (
                <button
                  onClick={() => onAddToCart(car)}
                  disabled={isCarLoading(car.id)}
                  className="p-2 text-green-600 hover:text-green-700 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  title="Add to Cart"
                >
                  {isCarLoading(car.id) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarTable;
