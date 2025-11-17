import React from "react";
import { Star } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";

interface GradingSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const GradingSection: React.FC<GradingSectionProps> = ({
  formData,
  errors,
  isViewMode,
  onInputChange,
}) => {
  return (
    <div className="rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-blue-600" />
        Grading
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Grade */}
        <FormField
          label="Overall Grade (0-10)"
          field="grade_overall"
          type="number"
          placeholder="e.g., 8.5"
          required={false}
          value={formData.grade_overall}
          error={errors.grade_overall}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("grade_overall", value)}
        />

        {/* Exterior Grade */}
        <FormField
          label="Exterior Grade"
          field="grade_exterior"
          type="text"
          placeholder="e.g., A, B, C, D or Excellent, Good, Fair, Poor"
          required={false}
          maxLength={32}
          value={formData.grade_exterior}
          error={errors.grade_exterior}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("grade_exterior", value)}
        />

        {/* Interior Grade */}
        <FormField
          label="Interior Grade"
          field="grade_interior"
          type="text"
          placeholder="e.g., A, B, C, D or Excellent, Good, Fair, Poor"
          required={false}
          maxLength={32}
          value={formData.grade_interior}
          error={errors.grade_interior}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("grade_interior", value)}
        />
      </div>
    </div>
  );
};

export default GradingSection;
