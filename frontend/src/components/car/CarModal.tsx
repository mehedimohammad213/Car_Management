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
import { Category } from "../services/categoryApi";

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCarData) => void;
  car: CarType | null;
  categories: Category[];
  filterOptions: CarFilterOptions | null;
}

const CarModal: React.FC<CarModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  car,
  categories,
  filterOptions,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subcategories, setSubcategories] = useState<Category[]>([]);

  const isEditMode = !!car;

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
        details:
          car.details && car.details.length > 0
            ? car.details.map((d) => ({
                short_title: d.short_title || "",
                full_title: d.full_title || "",
                description: d.description || "",
                images: d.images || [],
              }))
            : [
                {
                  short_title: "",
                  full_title: "",
                  description: "",
                  images: [],
                },
              ],
      });
    } else {
      resetForm();
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

  const resetForm = () => {
    setFormData({
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
    setErrors({});
  };

  const handleInputChange = (field: keyof CreateCarData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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

  const handlePhotoChange = (
    index: number,
    field: keyof NonNullable<CreateCarData["photos"]>[0],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).map((photo, i) =>
        i === index ? { ...photo, [field]: value } : photo
      ),
    }));
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation (matching backend)
    if (!formData.category_id) {
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

    // Field length validation (matching backend max lengths)
    if (formData.make.length > 64) {
      newErrors.make = "Make must be 64 characters or less";
    }

    if (formData.model.length > 64) {
      newErrors.model = "Model must be 64 characters or less";
    }

    if (formData.model_code && formData.model_code.length > 32) {
      newErrors.model_code = "Model code must be 32 characters or less";
    }

    if (formData.variant && formData.variant.length > 128) {
      newErrors.variant = "Variant must be 128 characters or less";
    }

    if (formData.ref_no && formData.ref_no.length > 32) {
      newErrors.ref_no = "Reference number must be 32 characters or less";
    }

    if (formData.chassis_no_masked && formData.chassis_no_masked.length > 32) {
      newErrors.chassis_no_masked =
        "Masked chassis number must be 32 characters or less";
    }

    if (formData.chassis_no_full && formData.chassis_no_full.length > 64) {
      newErrors.chassis_no_full =
        "Full chassis number must be 64 characters or less";
    }

    if (formData.location && formData.location.length > 128) {
      newErrors.location = "Location must be 128 characters or less";
    }

    if (formData.country_origin && formData.country_origin.length > 64) {
      newErrors.country_origin =
        "Country of origin must be 64 characters or less";
    }

    if (formData.transmission && formData.transmission.length > 32) {
      newErrors.transmission = "Transmission must be 32 characters or less";
    }

    if (formData.drive && formData.drive.length > 32) {
      newErrors.drive = "Drive type must be 32 characters or less";
    }

    if (formData.steering && formData.steering.length > 16) {
      newErrors.steering = "Steering must be 16 characters or less";
    }

    if (formData.fuel && formData.fuel.length > 32) {
      newErrors.fuel = "Fuel type must be 32 characters or less";
    }

    if (formData.color && formData.color.length > 64) {
      newErrors.color = "Color must be 64 characters or less";
    }

    if (formData.price_currency && formData.price_currency.length > 3) {
      newErrors.price_currency = "Price currency must be 3 characters or less";
    }

    if (formData.price_basis && formData.price_basis.length > 32) {
      newErrors.price_basis = "Price basis must be 32 characters or less";
    }

    if (formData.status && formData.status.length > 32) {
      newErrors.status = "Status must be 32 characters or less";
    }

    // Numeric validation (matching backend)
    if (formData.price_amount && formData.price_amount < 0) {
      newErrors.price_amount = "Price must be positive";
    }

    if (formData.mileage_km && formData.mileage_km < 0) {
      newErrors.mileage_km = "Mileage must be positive";
    }

    if (formData.engine_cc && formData.engine_cc < 0) {
      newErrors.engine_cc = "Engine CC must be positive";
    }

    if (formData.seats && (formData.seats < 1 || formData.seats > 20)) {
      newErrors.seats = "Seats must be between 1 and 20";
    }

    if (
      formData.grade_overall &&
      (formData.grade_overall < 0 || formData.grade_overall > 10)
    ) {
      newErrors.grade_overall = "Grade must be between 0 and 10";
    }

    // Registration year/month validation
    if (
      formData.reg_year_month &&
      !/^\d{4}-\d{2}$/.test(formData.reg_year_month)
    ) {
      newErrors.reg_year_month =
        "Registration year/month must be in YYYY-MM format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit Car" : "Create New Car"}
              </h2>
              <p className="text-emerald-100 mt-1">
                {isEditMode
                  ? "Update car information"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) =>
                    handleInputChange("category_id", parseInt(e.target.value))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.category_id ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((category) => category.children_count > 0) // Only show parent categories
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Only parent categories (categories with subcategories) are
                  shown here
                </p>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory (Optional)
                </label>
                <select
                  value={formData.subcategory_id || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "subcategory_id",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm mt-1">
                  {subcategories.length > 0
                    ? `${subcategories.length} subcategory(ies) available`
                    : "No subcategories available for the selected category"}
                </p>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.ref_no}
                  onChange={(e) => handleInputChange("ref_no", e.target.value)}
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.ref_no ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Auto-generated if empty"
                />
                {errors.ref_no && (
                  <p className="text-red-500 text-sm mt-1">{errors.ref_no}</p>
                )}
              </div>

              {/* Make */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.make ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Toyota, Honda"
                />
                {errors.make && (
                  <p className="text-red-500 text-sm mt-1">{errors.make}</p>
                )}
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.model ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Camry, Civic"
                />
                {errors.model && (
                  <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                )}
              </div>

              {/* Model Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model Code
                </label>
                <input
                  type="text"
                  value={formData.model_code}
                  onChange={(e) =>
                    handleInputChange("model_code", e.target.value)
                  }
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.model_code ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., XV50, FB"
                />
                {errors.model_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.model_code}
                  </p>
                )}
              </div>

              {/* Variant */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Variant
                </label>
                <input
                  type="text"
                  value={formData.variant}
                  onChange={(e) => handleInputChange("variant", e.target.value)}
                  maxLength={128}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.variant ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., SE, EX, Limited"
                />
                {errors.variant && (
                  <p className="text-red-500 text-sm mt-1">{errors.variant}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange("year", parseInt(e.target.value))
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.year ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                )}
              </div>

              {/* Registration Year/Month */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Year/Month
                </label>
                <input
                  type="month"
                  value={formData.reg_year_month}
                  onChange={(e) =>
                    handleInputChange("reg_year_month", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.reg_year_month ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="YYYY-MM"
                />
                {errors.reg_year_month && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reg_year_month}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Transmission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transmission
                </label>
                <input
                  type="text"
                  value={formData.transmission}
                  onChange={(e) =>
                    handleInputChange("transmission", e.target.value)
                  }
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.transmission ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Automatic, Manual, CVT"
                />
                {errors.transmission && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.transmission}
                  </p>
                )}
              </div>

              {/* Drive */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drive Type
                </label>
                <input
                  type="text"
                  value={formData.drive}
                  onChange={(e) => handleInputChange("drive", e.target.value)}
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.drive ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., FWD, RWD, AWD, 4WD"
                />
                {errors.drive && (
                  <p className="text-red-500 text-sm mt-1">{errors.drive}</p>
                )}
              </div>

              {/* Steering */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Steering
                </label>
                <input
                  type="text"
                  value={formData.steering}
                  onChange={(e) =>
                    handleInputChange("steering", e.target.value)
                  }
                  maxLength={16}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.steering ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., LHD, RHD"
                />
                {errors.steering && (
                  <p className="text-red-500 text-sm mt-1">{errors.steering}</p>
                )}
              </div>

              {/* Fuel */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Type
                </label>
                <input
                  type="text"
                  value={formData.fuel}
                  onChange={(e) => handleInputChange("fuel", e.target.value)}
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.fuel ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Gasoline, Diesel, Electric, Hybrid"
                />
                {errors.fuel && (
                  <p className="text-red-500 text-sm mt-1">{errors.fuel}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.color ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Red, Blue, Silver, Black"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">{errors.color}</p>
                )}
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={formData.mileage_km || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "mileage_km",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.mileage_km ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., 50000"
                />
                {errors.mileage_km && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mileage_km}
                  </p>
                )}
              </div>

              {/* Engine CC */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Engine CC
                </label>
                <input
                  type="number"
                  value={formData.engine_cc || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "engine_cc",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.engine_cc ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., 2000"
                />
                {errors.engine_cc && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.engine_cc}
                  </p>
                )}
              </div>

              {/* Seats */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seats
                </label>
                <input
                  type="number"
                  value={formData.seats || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "seats",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  min="1"
                  max="20"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.seats ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., 5"
                />
                {errors.seats && (
                  <p className="text-red-500 text-sm mt-1">{errors.seats}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Amount
                </label>
                <input
                  type="number"
                  value={formData.price_amount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "price_amount",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.price_amount ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., 25000.00"
                />
                {errors.price_amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price_amount}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.price_currency}
                  onChange={(e) =>
                    handleInputChange("price_currency", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.price_currency ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
                {errors.price_currency && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price_currency}
                  </p>
                )}
              </div>

              {/* Price Basis */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Basis
                </label>
                <input
                  type="text"
                  value={formData.price_basis}
                  onChange={(e) =>
                    handleInputChange("price_basis", e.target.value)
                  }
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.price_basis ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., FOB, CIF"
                />
                {errors.price_basis && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price_basis}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Grading Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-emerald-600" />
              Grading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Overall Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Overall Grade (0-10)
                </label>
                <input
                  type="number"
                  value={formData.grade_overall || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "grade_overall",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min="0"
                  max="10"
                  step="0.1"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.grade_overall ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., 8.5"
                />
                {errors.grade_overall && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.grade_overall}
                  </p>
                )}
              </div>

              {/* Exterior Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exterior Grade
                </label>
                <input
                  type="text"
                  value={formData.grade_exterior}
                  onChange={(e) =>
                    handleInputChange("grade_exterior", e.target.value)
                  }
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., A, B, C, D or Excellent, Good, Fair, Poor"
                />
              </div>

              {/* Interior Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interior Grade
                </label>
                <input
                  type="text"
                  value={formData.grade_interior}
                  onChange={(e) =>
                    handleInputChange("grade_interior", e.target.value)
                  }
                  maxLength={16}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., A, B, C, D or Excellent, Good, Fair, Poor"
                />
              </div>
            </div>
          </div>

          {/* Location & Status Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Location & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Chassis Number (Masked) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chassis Number (Masked)
                </label>
                <input
                  type="text"
                  value={formData.chassis_no_masked}
                  onChange={(e) =>
                    handleInputChange("chassis_no_masked", e.target.value)
                  }
                  maxLength={32}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.chassis_no_masked
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                  placeholder="e.g., ABC123******XYZ789"
                />
                {errors.chassis_no_masked && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.chassis_no_masked}
                  </p>
                )}
              </div>

              {/* Chassis Number (Full) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chassis Number (Full)
                </label>
                <input
                  type="text"
                  value={formData.chassis_no_full}
                  onChange={(e) =>
                    handleInputChange("chassis_no_full", e.target.value)
                  }
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.chassis_no_full
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                  placeholder="Complete chassis number"
                />
                {errors.chassis_no_full && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.chassis_no_full}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  maxLength={128}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.location ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Tokyo, Japan"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              {/* Country Origin */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country of Origin
                </label>
                <input
                  type="text"
                  value={formData.country_origin}
                  onChange={(e) =>
                    handleInputChange("country_origin", e.target.value)
                  }
                  maxLength={64}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.country_origin ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="e.g., Japan, Germany, USA, UK"
                />
                {errors.country_origin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country_origin}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.status ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                  <option value="in_transit">In Transit</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Additional notes about the car..."
                />
              </div>
            </div>
          </div>

          {/* Car Details Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Car Details
              </h3>
              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
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

          {/* Photos Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-emerald-600" />
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
                      onChange={(e) =>
                        handlePhotoChange(index, "url", e.target.value)
                      }
                      placeholder="Photo URL"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={photo.is_primary}
                        onChange={(e) =>
                          handlePhotoChange(
                            index,
                            "is_primary",
                            e.target.checked
                          )
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Primary</span>
                    </label>
                    <input
                      type="number"
                      value={photo.sort_order}
                      onChange={(e) =>
                        handlePhotoChange(
                          index,
                          "sort_order",
                          parseInt(e.target.value)
                        )
                      }
                      placeholder="Order"
                      className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-center"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhoto}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Photo
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </div>
              ) : isEditMode ? (
                "Update Car"
              ) : (
                "Create Car"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarModal;
