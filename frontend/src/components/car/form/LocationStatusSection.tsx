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
    <div className="rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        Location & Status
      </h3>
      <div className="space-y-6">
        {/* First row - 5 fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <div className="w-full">
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

        {/* Second row - New fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <FormField
            label="Package"
            field="package"
            type="text"
            placeholder="e.g., Premium, Standard"
            required={false}
            maxLength={255}
            value={formData.package}
            error={errors.package}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("package", value)}
          />
          <FormField
            label="Body"
            field="body"
            type="text"
            placeholder="e.g., Sedan, SUV, Hatchback"
            required={false}
            maxLength={64}
            value={formData.body}
            error={errors.body}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("body", value)}
          />
          <FormField
            label="Type"
            field="type"
            type="text"
            placeholder="e.g., Standard, Luxury, Sport"
            required={false}
            maxLength={64}
            value={formData.type}
            error={errors.type}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("type", value)}
          />
          <FormField
            label="Engine Number"
            field="engine_number"
            type="text"
            placeholder="Engine identification number"
            required={false}
            maxLength={64}
            value={formData.engine_number}
            error={errors.engine_number}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("engine_number", value)}
          />
        </div>

        {/* Third row - Keys fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Number of Keys"
            field="number_of_keys"
            type="number"
            placeholder="e.g., 2, 3"
            required={false}
            value={formData.number_of_keys}
            error={errors.number_of_keys}
            isViewMode={isViewMode}
            onChange={(value) =>
              onInputChange(
                "number_of_keys",
                value ? Number(value) : undefined
              )
            }
          />
          <div className="w-full">
            <FormField
              label="Keys Feature"
              field="keys_feature"
              type="text"
              placeholder="e.g., Keyless entry, Remote start"
              required={false}
              value={formData.keys_feature}
              error={errors.keys_feature}
              isViewMode={isViewMode}
              onChange={(value) => onInputChange("keys_feature", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStatusSection;
