import React from "react";
import { Package, Car, Gauge, Settings, Palette, Award, Tag } from "lucide-react";
import { Stock } from "../../services/stockApi";
import StockTableRow from "./StockTableRow";
import { CurrencyBDTIcon } from "../icons/CurrencyBDTIcon";

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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading stocks...</span>
          </div>
        </div>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stocks found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            {isLoading
              ? "Loading..."
              : "Try refreshing the page or check your connection"}
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
        <div className="min-w-[1200px]">
          {/* Professional Table Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
            <div className="grid grid-cols-12 gap-4 p-5 text-sm font-bold text-white uppercase tracking-wider">
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
              <div className="col-span-1 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body with Enhanced Styling */}
          <div className="divide-y divide-gray-100 bg-gray-50/30">
            {stocks.map((stock) => (
              <StockTableRow
                key={stock.id}
                stock={stock}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
