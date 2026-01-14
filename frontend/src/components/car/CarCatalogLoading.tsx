import React from "react";
import { Car } from "lucide-react";

const CarCatalogLoading: React.FC = () => {
  return (
    <div className="text-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-primary-600 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Car className="w-8 h-8 text-primary-600 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-600 mt-6 text-xl font-semibold">
        Loading premium vehicles...
      </p>
      <p className="text-gray-500 mt-2">
        Please wait while we fetch the latest inventory
      </p>
    </div>
  );
};

export default CarCatalogLoading;
