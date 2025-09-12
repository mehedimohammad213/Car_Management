import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Car as CarType,
  CreateCarData,
  CarFilterOptions,
} from "../../services/carApi";
import { Category } from "../../services/categoryApi";
import {
  BasicInfoSection,
  TechnicalSpecsSection,
  GradingSection,
  PricingSection,
  LocationStatusSection,
  NotesSection,
  PhotoSection,
  CarDetailsSection,
} from "./form";

interface CarFormModalProps {
  mode: "create" | "update" | "view";
  car?: CarType | null;
  categories: Category[];
  filterOptions: CarFilterOptions | null;
  onSubmit?: (data: CreateCarData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isModal?: boolean;
}

const CarFormModal: React.FC<CarFormModalProps> = ({
  mode,
  car,
  categories,
  filterOptions,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isModal = false,
}) => {
  const [formData, setFormData] = useState<CreateCarData>({
    category_id: 0,
    subcategory_id: undefined,
    ref_no: "",
    code: "",
    make: "",
    model: "",
    model_code: "",
    variant: "",
    year: new Date().getFullYear(),
    reg_year_month: "",
    mileage_km: undefined,
    engine_cc: undefined,
    transmission: "",
    drive: "",
    steering: "",
    fuel: "",
    color: "",
    seats: undefined,
    grade_overall: undefined,
    grade_exterior: "",
    grade_interior: "",
    price_amount: undefined,
    price_currency: "USD",
    price_basis: "",
    fob_value_usd: undefined,
    freight_usd: undefined,
    chassis_no_masked: "",
    chassis_no_full: "",
    location: "",
    country_origin: "",
    status: "available",
    notes: "",
    photos: [],
    details: [
      {
        short_title: "",
        full_title: "",
        description: "",
        images: [],
        sub_details: [
          {
            title: "",
            description: "",
          },
        ],
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  const isEditMode = mode === "update" && !!car;
  const isViewMode = mode === "view";

  useEffect(() => {
    if (car) {
      setFormData({
        category_id: car.category_id,
        subcategory_id: car.subcategory_id || undefined,
        ref_no: car.ref_no || "",
        make: car.make,
        model: car.model,
        model_code: car.model_code || "",
        variant: car.variant || "",
        year: car.year,
        reg_year_month: car.reg_year_month || "",
        mileage_km: car.mileage_km || undefined,
        engine_cc: car.engine_cc || undefined,
        transmission: car.transmission || "",
        drive: car.drive || "",
        steering: car.steering || "",
        fuel: car.fuel || "",
        color: car.color || "",
        seats: car.seats || undefined,
        grade_overall: car.grade_overall || undefined,
        grade_exterior: car.grade_exterior || "",
        grade_interior: car.grade_interior || "",
        price_amount: car.price_amount || undefined,
        price_currency: car.price_currency || "USD",
        price_basis: car.price_basis || "",
        chassis_no_masked: car.chassis_no_masked || "",
        chassis_no_full: car.chassis_no_full || "",
        location: car.location || "",
        country_origin: car.country_origin || "",
        status: car.status || "available",
        notes: car.notes || "",
        photos:
          car.photos?.map((p) => ({
            url: p.url,
            is_primary: p.is_primary,
            sort_order: p.sort_order,
            is_hidden: p.is_hidden,
          })) || [],
        details: car.details?.map((d) => ({
          short_title: d.short_title,
          full_title: d.full_title,
          description: d.description,
          images: d.images || [],
          sub_details: d.sub_details?.map((sd) => ({
            title: sd.title,
            description: sd.description,
          })) || [
            {
              title: "",
              description: "",
            },
          ],
        })) || [
          {
            short_title: "",
            full_title: "",
            description: "",
            images: [],
            sub_details: [
              {
                title: "",
                description: "",
              },
            ],
          },
        ],
      });
    }
  }, [car]);

  useEffect(() => {
    if (formData.category_id) {
      // Find subcategories that have the selected category as their parent
      const filteredSubcategories = categories.filter(
        (cat) => cat.parent_category_id === formData.category_id
      );
      setSubcategories(filteredSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id, categories]);

  const handleInputChange = (field: keyof CreateCarData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...(prev.photos || []),
        {
          url: "",
          is_primary: prev.photos?.length === 0,
          sort_order: prev.photos?.length || 0,
          is_hidden: false,
        },
      ],
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleDetailImageChange = (
    detailIndex: number,
    imageIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      details:
        prev.details?.map((detail, index) =>
          index === detailIndex
            ? {
                ...detail,
                images:
                  detail.images?.map((image, i) =>
                    i === imageIndex ? value : image
                  ) || [],
              }
            : detail
        ) || [],
    }));
  };

  const addDetailImage = (detailIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      details:
        prev.details?.map((detail, index) =>
          index === detailIndex
            ? {
                ...detail,
                images: [...(detail.images || []), ""],
              }
            : detail
        ) || [],
    }));
  };

  const removeDetailImage = (detailIndex: number, imageIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      details:
        prev.details?.map((detail, index) =>
          index === detailIndex
            ? {
                ...detail,
                images: detail.images?.filter((_, i) => i !== imageIndex) || [],
              }
            : detail
        ) || [],
    }));
  };

  const addDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [
        ...(prev.details || []),
        {
          short_title: "",
          full_title: "",
          description: "",
          images: [],
          sub_details: [
            {
              title: "",
              description: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDetail = (detailIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details?.filter((_, index) => index !== detailIndex) || [],
    }));
  };

  const handleDetailChange = (
    detailIndex: number,
    field: keyof NonNullable<CreateCarData["details"]>[0],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      details: (prev.details || []).map((detail, index) =>
        index === detailIndex ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  // Sub-details functions
  const addSubDetail = (detailIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      details: (prev.details || []).map((detail, index) =>
        index === detailIndex
          ? {
              ...detail,
              sub_details: [
                ...(detail.sub_details || []),
                {
                  title: "",
                  description: "",
                },
              ],
            }
          : detail
      ),
    }));
  };

  const removeSubDetail = (detailIndex: number, subDetailIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      details: (prev.details || []).map((detail, index) =>
        index === detailIndex
          ? {
              ...detail,
              sub_details:
                detail.sub_details?.filter((_, i) => i !== subDetailIndex) ||
                [],
            }
          : detail
      ),
    }));
  };

  const handleSubDetailChange = (
    detailIndex: number,
    subDetailIndex: number,
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      details: (prev.details || []).map((detail, index) =>
        index === detailIndex
          ? {
              ...detail,
              sub_details: (detail.sub_details || []).map(
                (subDetail, subIndex) =>
                  subIndex === subDetailIndex
                    ? { ...subDetail, [field]: value }
                    : subDetail
              ),
            }
          : detail
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.category_id || formData.category_id === 0) {
      newErrors.category_id = "Category is required";
    }

    if (!formData.make.trim()) {
      newErrors.make = "Make is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Valid year is required";
    }

    // Field length validation
    if (formData.make.length > 64) {
      newErrors.make = "Make must be 64 characters or less";
    }

    if (formData.model.length > 64) {
      newErrors.model = "Model must be 64 characters or less";
    }

    if (formData.ref_no && formData.ref_no.length > 32) {
      newErrors.ref_no = "Reference number must be 32 characters or less";
    }

    if (formData.model_code && formData.model_code.length > 32) {
      newErrors.model_code = "Model code must be 32 characters or less";
    }

    if (formData.variant && formData.variant.length > 64) {
      newErrors.variant = "Variant must be 64 characters or less";
    }

    if (formData.transmission && formData.transmission.length > 32) {
      newErrors.transmission = "Transmission must be 32 characters or less";
    }

    if (formData.fuel && formData.fuel.length > 32) {
      newErrors.fuel = "Fuel type must be 32 characters or less";
    }

    if (formData.color && formData.color.length > 32) {
      newErrors.color = "Color must be 32 characters or less";
    }

    if (formData.grade_exterior && formData.grade_exterior.length > 32) {
      newErrors.grade_exterior = "Exterior grade must be 32 characters or less";
    }

    if (formData.grade_interior && formData.grade_interior.length > 32) {
      newErrors.grade_interior = "Interior grade must be 32 characters or less";
    }

    if (formData.location && formData.location.length > 128) {
      newErrors.location = "Location must be 128 characters or less";
    }

    if (formData.country_origin && formData.country_origin.length > 64) {
      newErrors.country_origin =
        "Country of origin must be 64 characters or less";
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = "Notes must be 1000 characters or less";
    }

    if (formData.reg_year_month && formData.reg_year_month.length > 10) {
      newErrors.reg_year_month =
        "Registration year/month must be 10 characters or less";
    }

    // Numeric validation
    if (
      formData.mileage_km &&
      (formData.mileage_km < 0 || formData.mileage_km > 999999)
    ) {
      newErrors.mileage_km = "Mileage must be between 0 and 999,999 km";
    }

    if (
      formData.engine_cc &&
      (formData.engine_cc < 0 || formData.engine_cc > 10000)
    ) {
      newErrors.engine_cc = "Engine capacity must be between 0 and 10,000 cc";
    }

    if (formData.seats && (formData.seats < 1 || formData.seats > 50)) {
      newErrors.seats = "Seats must be between 1 and 50";
    }

    if (
      formData.grade_overall &&
      (formData.grade_overall < 1 || formData.grade_overall > 10)
    ) {
      newErrors.grade_overall = "Overall grade must be between 1 and 10";
    }

    if (
      formData.price_amount &&
      (formData.price_amount < 0 || formData.price_amount > 999999999)
    ) {
      newErrors.price_amount = "Price must be between 0 and 999,999,999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode || !onSubmit) return;

    console.log("Form validation starting...");
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    console.log("Submitting form data:", formData);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const content = (
    <div
      className={
        isModal
          ? "relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          : "bg-white rounded-2xl shadow-lg w-full"
      }
    >
      {/* Header */}
      {isModal && (
        <div className="bg-gray-800 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode
                  ? "Edit Car"
                  : isViewMode
                  ? "View Car"
                  : "Create New Car"}
              </h2>
              <p className="text-gray-300 mt-1">
                {isEditMode
                  ? "Update car information"
                  : isViewMode
                  ? "View car details"
                  : "Add a new car to your inventory"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information Section */}
        <BasicInfoSection
          formData={formData}
          errors={errors}
          categories={categories}
          // subcategories={subcategories}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        />

        {/* Technical Specifications Section */}
        <TechnicalSpecsSection
          formData={formData}
          errors={errors}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        />

        {/* Grading Section */}
        <GradingSection
          formData={formData}
          errors={errors}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        />

        {/* Pricing Section */}
        <PricingSection
          formData={formData}
          errors={errors}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        />

        {/* Location & Status Section */}
        <LocationStatusSection
          formData={formData}
          errors={errors}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        />

        {/* Notes Section */}
        {/* <NotesSection
          formData={formData}
          errors={errors}
          isViewMode={isViewMode}
          onInputChange={handleInputChange}
        /> */}

        {/* Photos Section */}
        <PhotoSection
          formData={formData}
          isViewMode={isViewMode}
          onAddPhoto={addPhoto}
          onRemovePhoto={removePhoto}
          onUpdatePhoto={(index, photo) => {
            const newPhotos = [...(formData.photos || [])];
            newPhotos[index] = photo;
            setFormData((prev) => ({ ...prev, photos: newPhotos }));
          }}
        />

        {/* Car Details Section */}
        <CarDetailsSection
          formData={formData}
          isViewMode={isViewMode}
          onAddDetail={addDetail}
          onRemoveDetail={removeDetail}
          onDetailChange={handleDetailChange}
          onAddDetailImage={addDetailImage}
          onRemoveDetailImage={removeDetailImage}
          onDetailImageChange={handleDetailImageChange}
          onAddSubDetail={addSubDetail}
          onRemoveSubDetail={removeSubDetail}
          onSubDetailChange={handleSubDetailChange}
        />

        {/* Form Actions */}
        {!isViewMode && (
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Car"
                : "Create Car"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur effect */}
        <div
          className="absolute inset-0 bg-white/30 backdrop-blur-md"
          onClick={handleClose}
        />
        {content}
      </div>
    );
  }

  return content;
};

export default CarFormModal;
