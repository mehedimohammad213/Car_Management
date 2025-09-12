import React from "react";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Settings,
  Fuel,
  Palette,
  Gauge,
} from "lucide-react";
import { Car } from "../../services/carApi";
import MobileTable from "../MobileTable";

interface CarTableProps {
  cars: Car[];
  isLoading: boolean;
  sortBy: string;
  sortDirection: string;
  onSort: (field: string) => void;
  onViewCar: (car: Car) => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (car: Car) => void;
  onRefresh: () => void;
}

const CarTable: React.FC<CarTableProps> = ({
  cars,
  isLoading,
  sortBy,
  sortDirection,
  onSort,
  onViewCar,
  onEditCar,
  onDeleteCar,
  onRefresh,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const LoadingRow = () => (
    <tr>
      <td colSpan={8} className="px-6 py-12 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading cars...</span>
        </div>
      </td>
    </tr>
  );

  const EmptyRow = () => (
    <tr>
      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
        <div className="space-y-2">
          <p>No cars found</p>
          <p className="text-sm text-gray-400">
            {isLoading
              ? "Loading..."
              : "Try refreshing the page or check your connection"}
          </p>
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            Refresh Data
          </button>
        </div>
      </td>
    </tr>
  );

  const MobileLoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading cars...</span>
    </div>
  );

  const MobileEmptyState = () => (
    <div className="text-center py-12 text-gray-500">
      <div className="space-y-2">
        <p>No cars found</p>
        <p className="text-sm text-gray-400">
          {isLoading
            ? "Loading..."
            : "Try refreshing the page or check your connection"}
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">ID {getSortIcon("id")}</div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Photo</th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("make")}
              >
                <div className="flex items-center">
                  Make & Model {getSortIcon("make")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Category</th>
              <th className="px-6 py-4 text-left font-semibold">Specs</th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("price_amount")}
              >
                <div className="flex items-center">
                  Price {getSortIcon("price_amount")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <LoadingRow />
            ) : cars.length === 0 ? (
              <EmptyRow />
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewCar(car)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{car.id}
                  </td>
                  <td className="px-6 py-4">
                    {car.photos && car.photos.length > 0 ? (
                      <img
                        src={
                          car.photos.find((p) => p.is_primary)?.url ||
                          car.photos[0].url
                        }
                        alt={`${car.make} ${car.model}`}
                        className="w-16 h-12 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-6 text-gray-400 font-bold">
                          🚗
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {car.make} {car.model}
                      </div>
                      {car.variant && (
                        <div className="text-sm text-gray-500 mt-1">
                          {car.variant}
                        </div>
                      )}
                      {car.ref_no && (
                        <div className="text-xs text-gray-400 mt-1">
                          Ref: {car.ref_no}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {car.category && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {car.category.name}
                        </span>
                      )}
                      {car.subcategory && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {car.subcategory.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      {car.transmission && (
                        <div className="flex items-center gap-1">
                          <Settings className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">
                            {car.transmission}
                          </span>
                        </div>
                      )}
                      {car.fuel && (
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{car.fuel}</span>
                        </div>
                      )}
                      {car.color && (
                        <div className="flex items-center gap-1">
                          <Palette className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{car.color}</span>
                        </div>
                      )}
                      {car.mileage_km && (
                        <div className="flex items-center gap-1">
                          <Gauge className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">
                            {car.mileage_km.toLocaleString()} km
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(car.price_amount, car.price_currency)}
                      </div>
                      {car.price_basis && (
                        <div className="text-xs text-gray-500">
                          {car.price_basis}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        car.status
                      )}`}
                    >
                      {car.status?.charAt(0).toUpperCase() +
                        car.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCar(car);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Car"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCar(car);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Car"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCar(car);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Car"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="lg:hidden p-4">
        {isLoading ? (
          <MobileLoadingState />
        ) : cars.length === 0 ? (
          <MobileEmptyState />
        ) : (
          <MobileTable
            data={cars}
            columns={[
              {
                key: "id",
                label: "ID",
                render: (value) => `#${value}`,
              },
              {
                key: "make",
                label: "Car",
                render: (value, item) => (
                  <div>
                    <div className="font-semibold">
                      {item.make} {item.model}
                    </div>
                    {item.variant && (
                      <div className="text-xs text-gray-500">
                        {item.variant}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "price_amount",
                label: "Price",
                render: (value, item) =>
                  formatPrice(value, item.price_currency),
              },
              {
                key: "status",
                label: "Status",
                render: (value) => (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      value
                    )}`}
                  >
                    {value?.charAt(0).toUpperCase() + value?.slice(1)}
                  </span>
                ),
              },
            ]}
            onRowClick={onViewCar}
          />
        )}
      </div>
    </div>
  );
};

export default CarTable;
