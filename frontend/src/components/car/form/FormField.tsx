import React from "react";

interface FormFieldProps {
  label: string;
  field: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  value: any;
  error?: string;
  isViewMode?: boolean;
  onChange: (value: any) => void;
  inline?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  field,
  type = "text",
  placeholder = "",
  required = false,
  maxLength,
  value,
  error,
  isViewMode = false,
  onChange,
  inline = false,
}) => {
  if (isViewMode) {
    return (
      <div className={inline ? "flex-1" : ""}>
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
    <div className={inline ? "flex-1" : ""}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) =>
          onChange(
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

export default FormField;
