import React from "react";
import { Star, MapPin } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";
import SelectField from "./SelectField";

interface GradingLocationSectionProps {
    formData: CreateCarData;
    errors: Record<string, string>;
    isViewMode: boolean;
    onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const GradingLocationSection: React.FC<GradingLocationSectionProps> = ({
    formData,
    errors,
    isViewMode,
    onInputChange,
}) => {
    const overallGradeOptions = ["S", "6", "5", "4.5", "4", "3.5", "3", "2", "1", "R", "RA", "R1", "RA1"];
    const exteriorGradeOptions = ["A", "B", "C", "D", "E"];
    const interiorGradeOptions = ["A", "B", "C", "D", "E"];

    const statusOptions = [
        { value: "available", label: "Available" },
        { value: "sold", label: "Sold" },
        { value: "reserved", label: "Reserved" },
        { value: "in_transit", label: "In Transit" },
        { value: "preorder", label: "Preorder" },
    ];

    return (
        <div className="rounded-xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Grading */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary-600" />
                        Grading
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            label="Overall Grade"
                            field="grade_overall"
                            type="text"
                            required={false}
                            value={formData.grade_overall}
                            error={errors.grade_overall}
                            isViewMode={isViewMode}
                            onChange={(value) => onInputChange("grade_overall", value)}
                            options={overallGradeOptions}
                        />
                        <FormField
                            label="Exterior Grade"
                            field="grade_exterior"
                            type="text"
                            required={false}
                            value={formData.grade_exterior}
                            error={errors.grade_exterior}
                            isViewMode={isViewMode}
                            onChange={(value) => onInputChange("grade_exterior", value)}
                            options={exteriorGradeOptions}
                        />
                        <FormField
                            label="Interior Grade"
                            field="grade_interior"
                            type="text"
                            required={false}
                            value={formData.grade_interior}
                            error={errors.grade_interior}
                            isViewMode={isViewMode}
                            onChange={(value) => onInputChange("grade_interior", value)}
                            options={interiorGradeOptions}
                        />
                    </div>
                </div>

                {/* Right Side: Location & Status */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        Location & Status
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            label="Location"
                            field="location"
                            type="text"
                            placeholder="Tokyo, Japan"
                            required={false}
                            maxLength={128}
                            value={formData.location}
                            error={errors.location}
                            isViewMode={isViewMode}
                            onChange={(value) => onInputChange("location", value)}
                        />
                        <FormField
                            label="Origin"
                            field="country_origin"
                            type="text"
                            placeholder="Japan"
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
                </div>
            </div>
        </div>
    );
};

export default GradingLocationSection;
