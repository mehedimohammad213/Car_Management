import React from "react";
import { MapPin } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";
import SelectField from "./SelectField";

interface LocationStatusSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const LocationStatusSection: React.FC<LocationStatusSectionProps> = ({
  formData,
  errors,
  isViewMode,
  onInputChange,
}) => {
  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "sold", label: "Sold" },
    { value: "reserved", label: "Reserved" },
    { value: "in_transit", label: "In Transit" },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Location & Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Chassis Number (Masked) */}
        <FormField
          label="Chassis Number (Masked)"
          field="chassis_no_masked"
          type="text"
          placeholder="e.g., ABC123******XYZ789"
          required={false}
          maxLength={32}
          value={formData.chassis_no_masked}
          error={errors.chassis_no_masked}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("chassis_no_masked", value)}
        />

        {/* Chassis Number (Full) */}
        <FormField
          label="Chassis Number (Full)"
          field="chassis_no_full"
          type="text"
          placeholder="Complete chassis number"
          required={false}
          maxLength={64}
          value={formData.chassis_no_full}
          error={errors.chassis_no_full}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("chassis_no_full", value)}
        />

        {/* Location */}
        <FormField
          label="Location"
          field="location"
          type="text"
          placeholder="e.g., Tokyo, Japan"
          required={false}
          maxLength={128}
          value={formData.location}
          error={errors.location}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("location", value)}
        />

        {/* Country of Origin */}
        <FormField
          label="Country of Origin"
          field="country_origin"
          type="text"
          placeholder="e.g., Japan, Germany, USA, UK"
          required={false}
          maxLength={64}
          value={formData.country_origin}
          error={errors.country_origin}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("country_origin", value)}
        />

        {/* Status */}
        <SelectField
          label="Status"
          field="status"
          options={statusOptions}
          required={false}
          placeholder="Select Status"
          value={formData.status}
          error={errors.status}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("status", value)}
        />
      </div>
    </div>
  );
};

export default LocationStatusSection;
