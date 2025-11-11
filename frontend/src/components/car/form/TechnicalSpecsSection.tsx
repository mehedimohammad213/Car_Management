import React from "react";
import { Settings } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";

interface TechnicalSpecsSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const TechnicalSpecsSection: React.FC<TechnicalSpecsSectionProps> = ({
  formData,
  errors,
  isViewMode,
  onInputChange,
}) => {
  return (
    <div className="rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Technical Specifications
      </h3>
      <div className="space-y-6">
        {/* First row - 5 fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormField
            label="Transmission"
            field="transmission"
            type="text"
            placeholder="e.g., Automatic, Manual, CVT"
            required={false}
            maxLength={32}
            value={formData.transmission}
            error={errors.transmission}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("transmission", value)}
          />
          <FormField
            label="Drive"
            field="drive"
            type="text"
            placeholder="e.g., FWD, AWD, RWD"
            required={false}
            maxLength={32}
            value={formData.drive}
            error={errors.drive}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("drive", value)}
          />
          <FormField
            label="Steering"
            field="steering"
            type="text"
            placeholder="e.g., LHD, RHD"
            required={false}
            maxLength={16}
            value={formData.steering}
            error={errors.steering}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("steering", value)}
          />
          <FormField
            label="Fuel Type"
            field="fuel"
            type="text"
            placeholder="e.g., Gasoline, Diesel, Electric, Hybrid"
            required={false}
            maxLength={32}
            value={formData.fuel}
            error={errors.fuel}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("fuel", value)}
          />
          <FormField
            label="Color"
            field="color"
            type="text"
            placeholder="e.g., Red, Blue, Silver, Black"
            required={false}
            maxLength={64}
            value={formData.color}
            error={errors.color}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("color", value)}
          />
        </div>

        {/* Second row - 3 fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <FormField
            label="Mileage (km)"
            field="mileage_km"
            type="number"
            placeholder="e.g., 50000"
            required={false}
            value={formData.mileage_km}
            error={errors.mileage_km}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("mileage_km", value)}
          />
          <FormField
            label="Engine Capacity (cc)"
            field="engine_cc"
            type="number"
            placeholder="e.g., 2000"
            required={false}
            value={formData.engine_cc}
            error={errors.engine_cc}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("engine_cc", value)}
          />
          <FormField
            label="Seats"
            field="seats"
            type="number"
            placeholder="e.g., 5"
            required={false}
            value={formData.seats}
            error={errors.seats}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("seats", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsSection;
