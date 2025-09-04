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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">
                  Stock ID {getSortIcon("id")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Car Image</th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("car.make")}
              >
                <div className="flex items-center">
                  Car Details {getSortIcon("car.make")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("quantity")}
              >
                <div className="flex items-center">
                  Quantity {getSortIcon("quantity")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center">
                  Price {getSortIcon("price")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => onSort("created_at")}
              >
                <div className="flex items-center">
                  Created {getSortIcon("created_at")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
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
                  colSpan={8}
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
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
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
    </div>
  );
};

export default StockTable;
