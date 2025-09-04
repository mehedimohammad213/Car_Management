import React from "react";
import { PackageIcon, TrendingUpIcon, PlusIcon } from "lucide-react";

interface StockHeaderProps {
  onCreateStock: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ onCreateStock }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
            <PackageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your vehicle inventory stock levels
            </p>
          </div>
        </div>

        <button
          onClick={onCreateStock}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Stock
        </button>
      </div>
    </div>
  );
};
