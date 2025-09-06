import React from "react";

interface SelectOption {
  value: any;
  label: string;
}

interface SelectFieldProps {
  label: string;
  field: string;
  options: SelectOption[];
  required?: boolean;
  placeholder?: string;
  value: any;
  error?: string;
  isViewMode?: boolean;
  onChange: (value: any) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  field,
  options,
  required = false,
  placeholder = "Select...",
  value,
  error,
  isViewMode = false,
  onChange,
}) => {
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
          onChange(
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

export default SelectField;
