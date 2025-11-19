import React from "react";
import { Pencil, Trash2, Eye, Car } from "lucide-react";
import { Stock } from "../../services/stockApi";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border border-green-200";
      case "sold":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "damaged":
        return "bg-red-100 text-red-700 border border-red-200";
      case "lost":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "stolen":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };


  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
    >
      {/* Stock ID */}
      {/* <div className="col-span-1 flex items-center">
        <span className="text-sm font-semibold text-gray-900">
          #{stock.id}
        </span>
      </div> */}

      {/* Car Details */}
      <div className="col-span-6 flex items-center gap-3">
        {stock.car?.photos && stock.car.photos.length > 0 ? (
          <div className="relative w-20 h-16 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300 border-2 border-gray-200 group-hover:border-blue-300">
            <img
              src={
                stock.car.photos.find((p: any) => p.is_primary)?.url ||
                stock.car.photos[0].url
              }
              alt={`${stock.car.make} ${stock.car.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="relative w-20 h-16 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-300 border-2 border-gray-200 group-hover:border-blue-300 flex items-center justify-center">
            <Car className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
            {stock.car?.year} {stock.car?.make} {stock.car?.model}
          </div>
          {stock.car?.ref_no && (
            <div className="text-xs font-semibold text-gray-600 mb-1">
              <span className="text-gray-500">Ref:</span>{" "}
              <span className="text-blue-600 font-mono">
                {stock.car.ref_no}
              </span>
            </div>
          )}
          {stock.car?.category?.name && (
            <div className="text-xs text-gray-500">
              {stock.car.category.name}
            </div>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-2 flex items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          {stock.quantity}
        </span>
      </div>

      {/* Status */}
      <div className="col-span-2 flex items-center">
        {stock.car?.status ? (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(
              stock.car.status
            )}`}
          >
            {stock.car.status.charAt(0).toUpperCase() + stock.car.status.slice(1)}
          </span>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        )}
      </div>

      {/* Actions */}
      <div
        className="col-span-2 flex items-center justify-center gap-1.5"
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
          <Pencil className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
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
