import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
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
  const formatPrice = (price?: number | string) => {
    if (!price) return "N/A";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `BDT ${numPrice.toLocaleString()}`;
  };

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

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">#{stock.id}</td>
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold text-gray-900">
            {stock.car?.make} {stock.car?.model}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {stock.car?.year} • {stock.car?.category?.name}
          </div>
          {stock.car?.ref_no && (
            <div className="text-xs text-gray-400 mt-1">
              Ref: {stock.car.ref_no}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {stock.quantity}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">
        {formatPrice(stock.price)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            stock.status
          )}`}
        >
          <span className="mr-1">{getStatusIcon(stock.status)}</span>
          {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(stock)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Stock"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(stock)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Stock"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(stock)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Stock"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default StockTableRow;
