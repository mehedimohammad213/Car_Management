import React from "react";
import { DollarSign } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";
import SelectField from "./SelectField";

interface PricingSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  formData,
  errors,
  isViewMode,
  onInputChange,
}) => {
  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "JPY", label: "JPY" },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-600" />
        Pricing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Amount */}
        <FormField
          label="Price Amount"
          field="price_amount"
          type="number"
          placeholder="e.g., 25000.00"
          required={false}
          value={formData.price_amount}
          error={errors.price_amount}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("price_amount", value)}
        />

        {/* Price Currency */}
        <SelectField
          label="Currency"
          field="price_currency"
          options={currencyOptions}
          required={false}
          placeholder="Select Currency"
          value={formData.price_currency}
          error={errors.price_currency}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("price_currency", value)}
        />

        {/* Price Basis */}
        <FormField
          label="Price Basis"
          field="price_basis"
          type="text"
          placeholder="e.g., FOB, CIF"
          required={false}
          maxLength={32}
          value={formData.price_basis}
          error={errors.price_basis}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("price_basis", value)}
        />
      </div>

      {/* Additional Price Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* FOB Value USD */}
        <FormField
          label="FOB Value (USD)"
          field="fob_value_usd"
          type="number"
          placeholder="e.g., 20000.00"
          required={false}
          value={formData.fob_value_usd}
          error={errors.fob_value_usd}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("fob_value_usd", value)}
        />

        {/* Freight USD */}
        <FormField
          label="Freight (USD)"
          field="freight_usd"
          type="number"
          placeholder="e.g., 5000.00"
          required={false}
          value={formData.freight_usd}
          error={errors.freight_usd}
          isViewMode={isViewMode}
          onChange={(value) => onInputChange("freight_usd", value)}
        />
      </div>
    </div>
  );
};

export default PricingSection;
