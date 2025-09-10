import React from "react";
import { Car } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import { Category } from "../../../services/categoryApi";
import FormField from "./FormField";
import SelectField from "./SelectField";

interface BasicInfoSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  categories: Category[];
  subcategories: Category[];
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  categories,
  subcategories,
  isViewMode,
  onInputChange,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Car className="w-5 h-5 text-blue-600" />
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category */}
        <SelectField
          label="Category"
          field="category_id"
          options={(categories || [])
            .filter((category) => category.children_count > 0)
            .map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          required={true}
          placeholder="Select Category"
          value={formData.category_id}
          error={errors.category_id}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("category_id", value)}
        />

        {/* Subcategory */}
        <SelectField
          label="Subcategory"
          field="subcategory_id"
          options={(subcategories || []).map((subcategory) => ({
            value: subcategory.id,
            label: subcategory.name,
          }))}
          required={false}
          placeholder="Select Subcategory"
          value={formData.subcategory_id}
          error={errors.subcategory_id}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("subcategory_id", value)}
        />

        {/* Reference Number */}
        <FormField
          label="Reference Number"
          field="ref_no"
          type="text"
          placeholder="Auto-generated if empty"
          required={false}
          maxLength={32}
          value={formData.ref_no}
          error={errors.ref_no}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("ref_no", value)}
        />

        {/* Code */}
        <FormField
          label="Code"
          field="code"
          type="text"
          placeholder="e.g., CAR001"
          required={false}
          maxLength={50}
          value={formData.code}
          error={errors.code}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("code", value)}
        />

        {/* Make */}
        <FormField
          label="Make"
          field="make"
          type="text"
          placeholder="e.g., Toyota, Honda"
          required={true}
          maxLength={64}
          value={formData.make}
          error={errors.make}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("make", value)}
        />

        {/* Model */}
        <FormField
          label="Model"
          field="model"
          type="text"
          placeholder="e.g., Camry, Civic"
          required={true}
          maxLength={64}
          value={formData.model}
          error={errors.model}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("model", value)}
        />

        {/* Model Code */}
        <FormField
          label="Model Code"
          field="model_code"
          type="text"
          placeholder="e.g., XV50, FB"
          required={false}
          maxLength={32}
          value={formData.model_code}
          error={errors.model_code}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("model_code", value)}
        />

        {/* Variant */}
        <FormField
          label="Variant"
          field="variant"
          type="text"
          placeholder="e.g., Hybrid, Sport"
          required={false}
          maxLength={64}
          value={formData.variant}
          error={errors.variant}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("variant", value)}
        />

        {/* Year */}
        <FormField
          label="Year"
          field="year"
          type="number"
          placeholder="e.g., 2023"
          required={true}
          value={formData.year}
          error={errors.year}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("year", value)}
        />

        {/* Registration Year/Month */}
        <FormField
          label="Registration Year/Month"
          field="reg_year_month"
          type="text"
          placeholder="e.g., 2023-03"
          required={false}
          maxLength={10}
          value={formData.reg_year_month}
          error={errors.reg_year_month}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("reg_year_month", value)}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
