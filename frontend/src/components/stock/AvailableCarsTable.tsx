import React from "react";
import { Package, Car, Gauge, Settings, Palette, Award, Tag, Eye } from "lucide-react";
import { CurrencyBDTIcon } from "../icons/CurrencyBDTIcon";

interface AvailableCar {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage_km?: number;
  engine_cc?: number;
  color?: string;
  grade_overall?: string;
  keys_feature?: string;
  price_amount?: string | number;
  ref_no?: string;
  chassis_no_full?: string;
  chassis_no_masked?: string;
  status?: string;
  category?: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
  photos?: Array<{
    id: number;
    url: string;
    is_primary: boolean;
  }>;
}

interface AvailableCarsTableProps {
  cars: AvailableCar[];
  isLoading: boolean;
  onCreateStock: (car: AvailableCar) => void;
  onRefresh: () => void;
  onView?: (car: AvailableCar) => void;
}

const AvailableCarsTable: React.FC<AvailableCarsTableProps> = ({
  cars,
  isLoading,
  onCreateStock,
  onRefresh,
  onView,
}) => {
  // Filter out cars with status="sold"
  const filteredCars = cars.filter((car) => car.status !== "sold");

  // Calculate current available cars count for each make/model
  const availableCarsCountMap = React.useMemo(() => {
    const counts = new Map<string, number>();
    cars.forEach((car) => {
      const key = `${car.make}_${car.model}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [cars]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading available cars...</span>
          </div>
        </div>
      </div>
    );
  }

  if (filteredCars.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No available cars found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            All cars have stock entries. Try refreshing the page or check your connection.
          </p>
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px] sm:min-w-full">
          {/* Professional Table Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 shadow-lg">
            <div className="grid grid-cols-12 gap-4 p-5 text-sm font-bold text-white uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-2">
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
                <span>Grade</span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Key Features</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <CurrencyBDTIcon className="w-4 h-4" />
                <span>Price</span>
              </div>
              <div className="col-span-1 flex items-center gap-2 justify-center">
                <Package className="w-4 h-4" />
                <span>Available Cars</span>
              </div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body with Enhanced Styling */}
          <div className="divide-y divide-gray-100 bg-gray-50/30">
            {filteredCars.map((car, index) => {
              const makeModelKey = `${car.make}_${car.model}`;
              const availableCarsCount = availableCarsCountMap.get(makeModelKey) || 0;

              // Only show count on first occurrence of each make/model in the current filtered list
              const isFirstOfMakeModel = filteredCars.findIndex(
                (c) => `${c.make}_${c.model}` === makeModelKey
              ) === index;

              return (
                <div
                  key={car.id}
                  className="grid grid-cols-12 gap-4 p-5 hover:bg-blue-50/50 transition-colors"
                >
                  {/* Car Information */}
                  <div className="col-span-2 flex items-center gap-3">
                    {car.photos && car.photos.length > 0 && (
                      <img
                        src={car.photos.find((p) => p.is_primary)?.url || car.photos[0].url}
                        alt={`${car.make} ${car.model}`}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {car.year} {car.make} {car.model}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {car.ref_no && `Ref: ${car.ref_no}`}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {car.chassis_no_full || car.chassis_no_masked || "N/A"}
                      </div>
                      {car.category && (
                        <div className="text-xs text-blue-600 mt-1">
                          {car.category.name}
                          {car.subcategory && ` / ${car.subcategory.name}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="col-span-1 flex items-center text-sm text-gray-700">
                    {car.mileage_km
                      ? `${car.mileage_km.toLocaleString()} km`
                      : "N/A"}
                  </div>

                  {/* Engine */}
                  <div className="col-span-1 flex items-center text-sm text-gray-700">
                    {car.engine_cc
                      ? `${car.engine_cc.toLocaleString()} CC`
                      : "N/A"}
                  </div>

                  {/* Color */}
                  <div className="col-span-1 flex items-center text-sm text-gray-700 capitalize">
                    {car.color || "N/A"}
                  </div>

                  {/* Grade */}
                  <div className="col-span-1 flex items-center">
                    {car.grade_overall ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                        {car.grade_overall}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="col-span-3 flex items-center text-sm text-gray-600">
                    <div className="truncate max-w-full">
                      {car.keys_feature
                        ? car.keys_feature.split(",").slice(0, 3).join(", ")
                        : "N/A"}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 flex items-center text-sm font-semibold text-gray-900">
                    {car.price_amount
                      ? `৳ ${typeof car.price_amount === "string"
                        ? parseFloat(car.price_amount).toLocaleString("en-IN")
                        : car.price_amount.toLocaleString("en-IN")
                      }`
                      : "Price on request"}
                  </div>

                  {/* Available Cars Count */}
                  <div className="col-span-1 flex items-center justify-center">
                    {isFirstOfMakeModel ? (
                      <span className="inline-flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-bold min-w-[60px]">
                        {availableCarsCount}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-sm">-</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(car)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 group/btn"
                        title="View Car"
                      >
                        <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}
                    <button
                      onClick={() => onCreateStock(car)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Add Stock
                    </button>
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

export default AvailableCarsTable;
