import React from "react";
import { Plus, Download } from "lucide-react";

interface CarManagementHeaderProps {
  onExportExcel: () => void;
  onCreateCar: () => void;
}

const CarManagementHeader: React.FC<CarManagementHeaderProps> = ({
  onExportExcel,
  onCreateCar,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            🚗 Car Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your vehicle inventory with advanced features
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={onCreateCar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Car
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarManagementHeader;
