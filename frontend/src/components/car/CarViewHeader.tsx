import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";
import { Car as CarType } from "../../services/carApi";
import { getStatusColor } from "../../utils/carUtils";

interface CarViewHeaderProps {
  car: CarType;
  isAdmin: boolean;
  getBackRoute: () => string;
}

const CarViewHeader: React.FC<CarViewHeaderProps> = ({
  car,
  isAdmin,
  getBackRoute,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 sm:mb-6">
      <button
        onClick={() => navigate(getBackRoute())}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 sm:mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Catalog</span>
      </button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            {car.year} {car.make} {car.model}
            {car.variant && ` - ${car.variant}`}
          </h1>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                car.status
              )}`}
            >
              {car.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarViewHeader;
