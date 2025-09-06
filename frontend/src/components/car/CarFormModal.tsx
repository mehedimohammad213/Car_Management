import React, { useState, useEffect } from "react";
import {
  X,
  Image,
  Plus,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Users,
  DollarSign,
  Settings,
  Star,
  MapPin,
  FileText,
} from "lucide-react";
import {
  Car as CarType,
  CreateCarData,
  CarFilterOptions,
} from "../../services/carApi";
import { Category } from "../../services/categoryApi";

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
        })) || [
          {
            short_title: "",
            full_title: "",
            description: "",
            images: [],
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

  const renderFormField = (
    label: string,
    field: keyof CreateCarData,
    type: string = "text",
    placeholder: string = "",
    required: boolean = false,
    maxLength?: number
  ) => {
    const value = formData[field] as any;
    const error = errors[field];

    if (isViewMode) {
      return (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
            {value || "Not specified"}
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={value || ""}
          onChange={(e) =>
            handleInputChange(
              field,
              type === "number"
                ? parseFloat(e.target.value) || undefined
                : e.target.value
            )
          }
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? "border-red-300" : "border-gray-200"
          }`}
          placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

  const renderSelectField = (
    label: string,
    field: keyof CreateCarData,
    options: { value: any; label: string }[],
    required: boolean = false,
    placeholder: string = "Select..."
  ) => {
    const value = formData[field] as any;
    const error = errors[field];

    if (isViewMode) {
      const selectedOption = options.find((opt) => opt.value === value);
      return (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
            {selectedOption?.label || "Not specified"}
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={(e) =>
            handleInputChange(
              field,
              e.target.value
                ? field === "category_id"
                  ? parseInt(e.target.value)
                  : e.target.value
                : undefined
            )
          }
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? "border-red-300" : "border-gray-200"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

  const renderTextareaField = (
    label: string,
    field: keyof CreateCarData,
    placeholder: string = "",
    maxLength?: number
  ) => {
    const value = formData[field] as any;
    const error = errors[field];

    if (isViewMode) {
      return (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 min-h-[100px]">
            {value || "Not specified"}
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <textarea
          value={value || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          maxLength={maxLength}
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? "border-red-300" : "border-gray-200"
          }`}
          placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

  const content = (
    <div
      className={
        isModal
          ? "relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          : "bg-white rounded-2xl shadow-lg"
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
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category */}
            {renderSelectField(
              "Category",
              "category_id",
              (categories || [])
                .filter((category) => category.children_count > 0)
                .map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              true,
              "Select Category"
            )}

            {/* Subcategory */}
            {renderSelectField(
              "Subcategory",
              "subcategory_id",
              (subcategories || []).map((subcategory) => ({
                value: subcategory.id,
                label: subcategory.name,
              })),
              false,
              "Select Subcategory"
            )}

            {/* Reference Number */}
            {renderFormField(
              "Reference Number",
              "ref_no",
              "text",
              "Auto-generated if empty",
              false,
              32
            )}

            {/* Make */}
            {renderFormField(
              "Make",
              "make",
              "text",
              "e.g., Toyota, Honda",
              true,
              64
            )}

            {/* Model */}
            {renderFormField(
              "Model",
              "model",
              "text",
              "e.g., Camry, Civic",
              true,
              64
            )}

            {/* Model Code */}
            {renderFormField(
              "Model Code",
              "model_code",
              "text",
              "e.g., XV50, FB",
              false,
              32
            )}

            {/* Variant */}
            {renderFormField(
              "Variant",
              "variant",
              "text",
              "e.g., Hybrid, Sport",
              false,
              64
            )}

            {/* Year */}
            {renderFormField("Year", "year", "number", "e.g., 2023", true)}

            {/* Registration Year/Month */}
            {renderFormField(
              "Registration Year/Month",
              "reg_year_month",
              "text",
              "e.g., 2023-03",
              false,
              10
            )}
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Transmission */}
            {renderFormField(
              "Transmission",
              "transmission",
              "text",
              "e.g., Automatic, Manual, CVT",
              false,
              32
            )}

            {/* Drive */}
            {renderFormField(
              "Drive",
              "drive",
              "text",
              "e.g., FWD, AWD, RWD",
              false,
              32
            )}

            {/* Steering */}
            {renderFormField(
              "Steering",
              "steering",
              "text",
              "e.g., LHD, RHD",
              false,
              16
            )}

            {/* Fuel */}
            {renderFormField(
              "Fuel Type",
              "fuel",
              "text",
              "e.g., Gasoline, Diesel, Electric, Hybrid",
              false,
              32
            )}

            {/* Color */}
            {renderFormField(
              "Color",
              "color",
              "text",
              "e.g., Red, Blue, Silver, Black",
              false,
              64
            )}

            {/* Mileage */}
            {renderFormField(
              "Mileage (km)",
              "mileage_km",
              "number",
              "e.g., 50000",
              false
            )}

            {/* Engine Capacity */}
            {renderFormField(
              "Engine Capacity (cc)",
              "engine_cc",
              "number",
              "e.g., 2000",
              false
            )}

            {/* Seats */}
            {renderFormField("Seats", "seats", "number", "e.g., 5", false)}
          </div>
        </div>

        {/* Grading Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Grading
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Grade */}
            {renderFormField(
              "Overall Grade (0-10)",
              "grade_overall",
              "number",
              "e.g., 8.5",
              false
            )}

            {/* Exterior Grade */}
            {renderFormField(
              "Exterior Grade",
              "grade_exterior",
              "text",
              "e.g., A, B, C, D or Excellent, Good, Fair, Poor",
              false,
              32
            )}

            {/* Interior Grade */}
            {renderFormField(
              "Interior Grade",
              "grade_interior",
              "text",
              "e.g., A, B, C, D or Excellent, Good, Fair, Poor",
              false,
              32
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Amount */}
            {renderFormField(
              "Price Amount",
              "price_amount",
              "number",
              "e.g., 25000.00",
              false
            )}

            {/* Price Currency */}
            {renderSelectField(
              "Currency",
              "price_currency",
              [
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
                { value: "GBP", label: "GBP" },
                { value: "JPY", label: "JPY" },
              ],
              false,
              "Select Currency"
            )}

            {/* Price Basis */}
            {renderFormField(
              "Price Basis",
              "price_basis",
              "text",
              "e.g., FOB, CIF",
              false,
              32
            )}
          </div>
        </div>

        {/* Location & Status Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Location & Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Chassis Number (Masked) */}
            {renderFormField(
              "Chassis Number (Masked)",
              "chassis_no_masked",
              "text",
              "e.g., ABC123******XYZ789",
              false,
              32
            )}

            {/* Chassis Number (Full) */}
            {renderFormField(
              "Chassis Number (Full)",
              "chassis_no_full",
              "text",
              "Complete chassis number",
              false,
              64
            )}

            {/* Location */}
            {renderFormField(
              "Location",
              "location",
              "text",
              "e.g., Tokyo, Japan",
              false,
              128
            )}

            {/* Country of Origin */}
            {renderFormField(
              "Country of Origin",
              "country_origin",
              "text",
              "e.g., Japan, Germany, USA, UK",
              false,
              64
            )}

            {/* Status */}
            {renderSelectField(
              "Status",
              "status",
              [
                { value: "available", label: "Available" },
                { value: "sold", label: "Sold" },
                { value: "reserved", label: "Reserved" },
                { value: "in_transit", label: "In Transit" },
              ],
              false,
              "Select Status"
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Additional Information
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {/* Notes */}
            {renderTextareaField(
              "Notes",
              "notes",
              "Additional notes about the car...",
              1000
            )}
          </div>
        </div>

        {/* Photos Section */}
        {!isViewMode && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-600" />
              Photos
            </h3>
            <div className="space-y-4">
              {formData.photos?.map((photo, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => {
                        const newPhotos = [...(formData.photos || [])];
                        newPhotos[index] = { ...photo, url: e.target.value };
                        setFormData((prev) => ({ ...prev, photos: newPhotos }));
                      }}
                      placeholder="Photo URL"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={photo.is_primary}
                        onChange={(e) => {
                          const newPhotos = (formData.photos || []).map(
                            (p, i) => ({
                              ...p,
                              is_primary:
                                i === index ? e.target.checked : false,
                            })
                          );
                          setFormData((prev) => ({
                            ...prev,
                            photos: newPhotos,
                          }));
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">Primary</span>
                    </label>
                    <input
                      type="number"
                      value={photo.sort_order}
                      onChange={(e) => {
                        const newPhotos = [...(formData.photos || [])];
                        newPhotos[index] = {
                          ...photo,
                          sort_order: parseInt(e.target.value),
                        };
                        setFormData((prev) => ({ ...prev, photos: newPhotos }));
                      }}
                      placeholder="Order"
                      className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-center"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoto}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Photo
              </button>
            </div>
          </div>
        )}

        {/* View Mode Photos */}
        {isViewMode && formData.photos && formData.photos.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-600" />
              Photos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo.url}
                    alt={`Car photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  {photo.is_primary && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Car Details Section */}
        {!isViewMode && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Car Details
              </h3>
              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Detail Section
              </button>
            </div>

            <div className="space-y-6">
              {formData.details?.map((detail, detailIndex) => (
                <div
                  key={detailIndex}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-700">
                      Detail Section {detailIndex + 1}
                    </h4>
                    {formData.details && formData.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetail(detailIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Short Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Short Title
                      </label>
                      <input
                        type="text"
                        value={detail.short_title || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            detailIndex,
                            "short_title",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Brief title for the car"
                      />
                    </div>

                    {/* Full Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Title
                      </label>
                      <input
                        type="text"
                        value={detail.full_title || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            detailIndex,
                            "full_title",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Complete title for the car"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={detail.description || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            detailIndex,
                            "description",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Detailed description of the car..."
                      />
                    </div>

                    {/* Detail Images */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Detail Images
                      </label>
                      <div className="space-y-3">
                        {detail.images?.map((image, imageIndex) => (
                          <div
                            key={imageIndex}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex-1">
                              <input
                                type="text"
                                value={image}
                                onChange={(e) =>
                                  handleDetailImageChange(
                                    detailIndex,
                                    imageIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Detail image URL"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeDetailImage(detailIndex, imageIndex)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addDetailImage(detailIndex)}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Detail Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
