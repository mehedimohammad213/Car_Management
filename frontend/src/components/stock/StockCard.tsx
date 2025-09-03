import React from "react";
import { PackageIcon, DollarSignIcon, HashIcon, ClockIcon } from "lucide-react";
import { Stock } from "../../services/stockApi";

interface StockCardProps {
  stock: Stock;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "sold":
      return "bg-blue-100 text-blue-800";
    case "reserved":
      return "bg-yellow-100 text-yellow-800";
    case "damaged":
      return "bg-red-100 text-red-800";
    case "lost":
      return "bg-gray-100 text-gray-800";
    case "stolen":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "available":
      return "✓";
    case "sold":
      return "💰";
    case "reserved":
      return "⏳";
    case "damaged":
      return "⚠️";
    case "lost":
      return "❓";
    case "stolen":
      return "🚨";
    default:
      return "📦";
  }
};

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const car = stock.car;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Car Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {car?.photos && car.photos.length > 0 ? (
          <img
            src={
              car.photos.find((photo) => photo.is_primary)?.url ||
              car.photos[0].url
            }
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">🚗</div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Car Info */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {car?.make} {car?.model}
          </h3>
          <p className="text-sm text-gray-600">
            {car?.year} • {car?.category?.name}
          </p>
          {car?.ref_no && (
            <p className="text-xs text-gray-500 mt-1">Ref: {car.ref_no}</p>
          )}
        </div>

        {/* Stock Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <PackageIcon className="w-4 h-4 mr-2" />
              Quantity
            </div>
            <span className="font-medium text-gray-900">{stock.quantity}</span>
          </div>

          {stock.price && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSignIcon className="w-4 h-4 mr-2" />
                Price
              </div>
              <span className="font-medium text-gray-900">
                ${stock.price.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <HashIcon className="w-4 h-4 mr-2" />
              Stock ID
            </div>
            <span className="font-medium text-gray-900">#{stock.id}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              stock.status
            )}`}
          >
            <span className="mr-1">{getStatusIcon(stock.status)}</span>
            {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
          </span>

          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="w-3 h-3 mr-1" />
            {new Date(stock.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Notes */}
        {stock.notes && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span className="font-medium">Notes:</span> {stock.notes}
          </div>
        )}
      </div>
    </div>
  );
};
