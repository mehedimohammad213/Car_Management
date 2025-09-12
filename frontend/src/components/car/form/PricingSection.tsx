import React from "react";
import { DollarSign } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";
import FormField from "./FormField";

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
  return (
    <div className="rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-blue-600" />
        Pricing
      </h3>
      <div className="space-y-6">
        {/* First row - 5 fields */}
        <div className="flex gap-4">
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
            inline={true}
          />
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
            inline={true}
          />
          <FormField
            label="FOB Value"
            field="fob_value_usd"
            type="number"
            placeholder="e.g., 20000.00"
            required={false}
            value={formData.fob_value_usd}
            error={errors.fob_value_usd}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("fob_value_usd", value)}
            inline={true}
          />
          <FormField
            label="Freight"
            field="freight_usd"
            type="number"
            placeholder="e.g., 5000.00"
            required={false}
            value={formData.freight_usd}
            error={errors.freight_usd}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("freight_usd", value)}
            inline={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
