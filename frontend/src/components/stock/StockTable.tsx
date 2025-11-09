import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Stock } from "../../services/stockApi";
import StockTableRow from "./StockTableRow";

interface StockTableProps {
  stocks: Stock[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
  onView?: (stock: Stock) => void;
  onRefresh: () => void;
}

const StockTable: React.FC<StockTableProps> = ({
  stocks,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

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
                <div className="flex items-center">
                  Stock ID {getSortIcon("id")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("car.make")}
              >
                <div className="flex items-center">
                  Car Details {getSortIcon("car.make")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("quantity")}
              >
                <div className="flex items-center">
                  Quantity {getSortIcon("quantity")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => onSort("car.status")}
              >
                <div className="flex items-center">
                  Car Status {getSortIcon("car.status")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading stocks...
                    </span>
                  </div>
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="space-y-2">
                    <p>No stocks found</p>
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
            ) : (
              stocks.map((stock) => (
                <StockTableRow
                  key={stock.id}
                  stock={stock}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="lg:hidden p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading stocks...</span>
          </div>
        ) : stocks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="space-y-2">
              <p>No stocks found</p>
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
        ) : (
          <div className="space-y-4">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Stock #{stock.id}
                  </h3>
                  <div className="flex items-center gap-2">
                    {stock.car?.status && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {stock.car.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {stock.car?.make} {stock.car?.model} - Qty: {stock.quantity}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(stock)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(stock)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockTable;
