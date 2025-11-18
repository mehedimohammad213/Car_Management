import React, { useMemo } from "react";
import { Car } from "lucide-react";
import { CreateCarData, CarFilterOptions } from "../../../services/carApi";
import { Category } from "../../../services/categoryApi";
import FormField from "./FormField";
import SelectField from "./SelectField";

interface BasicInfoSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  categories: Category[];
  filterOptions?: CarFilterOptions | null;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

// Make to Models mapping
const makeToModels: Record<string, string[]> = {
  Toyota: [
    "Camry",
    "Corolla",
    "Prius",
    "RAV4",
    "Highlander",
    "4Runner",
    "Sienna",
    "Tacoma",
    "Tundra",
    "Land Cruiser",
    "Yaris",
    "C-HR",
    "Avalon",
    "Venza",
    "Sequoia",
  ],
  Honda: [
    "Civic",
    "Accord",
    "CR-V",
    "Pilot",
    "Odyssey",
    "Ridgeline",
    "HR-V",
    "Passport",
    "Insight",
    "Fit",
    "Clarity",
  ],
  Nissan: [
    "Altima",
    "Sentra",
    "Maxima",
    "Rogue",
    "Pathfinder",
    "Armada",
    "Murano",
    "Frontier",
    "Titan",
    "370Z",
    "GT-R",
    "Leaf",
    "Versa",
    "Kicks",
  ],
  Mazda: [
    "Mazda3",
    "Mazda6",
    "CX-3",
    "CX-5",
    "CX-9",
    "MX-5 Miata",
    "CX-30",
  ],
  Subaru: [
    "Outback",
    "Forester",
    "Crosstrek",
    "Legacy",
    "Impreza",
    "Ascent",
    "WRX",
    "BRZ",
  ],
  Mitsubishi: [
    "Outlander",
    "Eclipse Cross",
    "Mirage",
    "Lancer",
    "Montero",
  ],
  Suzuki: [
    "Swift",
    "Vitara",
    "SX4",
    "Jimny",
  ],
  Daihatsu: [],
  Isuzu: [],
  Lexus: [
    "ES",
    "IS",
    "LS",
    "GS",
    "RX",
    "NX",
    "GX",
    "LX",
    "UX",
    "LC",
    "RC",
  ],
  Acura: [
    "TLX",
    "ILX",
    "RLX",
    "RDX",
    "MDX",
    "NSX",
  ],
  BMW: [
    "3 Series",
    "5 Series",
    "7 Series",
    "X1",
    "X3",
    "X5",
    "X7",
    "Z4",
    "i3",
    "i8",
  ],
  "Mercedes-Benz": [
    "C-Class",
    "E-Class",
    "S-Class",
    "A-Class",
    "GLA",
    "GLC",
    "GLE",
    "GLS",
    "CLA",
    "G-Class",
  ],
  Audi: [
    "A3",
    "A4",
    "A6",
    "A8",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "TT",
    "R8",
  ],
  Volkswagen: [
    "Jetta",
    "Passat",
    "Tiguan",
    "Atlas",
    "Golf",
    "Beetle",
    "Arteon",
  ],
  Porsche: [
    "911",
    "Cayenne",
    "Macan",
    "Panamera",
    "Boxster",
    "Cayman",
  ],
  Volvo: [
    "XC60",
    "XC90",
    "S60",
    "S90",
    "V60",
    "V90",
  ],
  Ford: [
    "F-150",
    "Mustang",
    "Explorer",
    "Escape",
    "Edge",
    "Expedition",
    "Focus",
    "Fusion",
    "Bronco",
    "Ranger",
  ],
  Chevrolet: [
    "Silverado",
    "Equinox",
    "Tahoe",
    "Suburban",
    "Traverse",
    "Malibu",
    "Cruze",
    "Camaro",
    "Corvette",
    "Trax",
  ],
  Jeep: [
    "Wrangler",
    "Grand Cherokee",
    "Cherokee",
    "Compass",
    "Renegade",
  ],
  Dodge: [
    "Challenger",
    "Charger",
    "Durango",
    "Journey",
  ],
  Ram: [
    "1500",
    "2500",
    "3500",
  ],
  Chrysler: [],
  Cadillac: [
    "Escalade",
    "XTS",
    "CT6",
    "XT5",
    "XT4",
  ],
  Buick: [
    "Enclave",
    "Encore",
    "LaCrosse",
  ],
  Lincoln: [
    "Navigator",
    "Aviator",
    "MKZ",
  ],
  GMC: [
    "Sierra",
    "Yukon",
    "Acadia",
  ],
  Hyundai: [
    "Tucson",
    "Santa Fe",
    "Elantra",
    "Sonata",
    "Kona",
    "Palisade",
  ],
  Kia: [
    "Sorento",
    "Sportage",
    "Telluride",
    "Optima",
    "Forte",
  ],
  Genesis: [
    "G70",
    "G80",
    "G90",
    "GV70",
    "GV80",
  ],
  Tesla: [
    "Model 3",
    "Model S",
    "Model X",
    "Model Y",
  ],
  Jaguar: [],
  "Land Rover": [],
  Mini: [],
  Fiat: [],
  "Alfa Romeo": [],
  Maserati: [],
  Bentley: [],
  "Rolls-Royce": [],
  Ferrari: [],
  Lamborghini: [],
  McLaren: [],
  "Aston Martin": [],
  Infiniti: [
    "Q50",
    "Q60",
    "QX50",
    "QX60",
    "QX80",
  ],
  Scion: [],
  Smart: [],
  Saturn: [],
  Pontiac: [],
  Hummer: [],
  Other: [],
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  categories,
  filterOptions,
  isViewMode,
  onInputChange,
}) => {
  // Common body types
  const bodyTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Wagon",
    "Pickup Truck",
    "Van",
    "Minivan",
    "Crossover",
    "Sports Car",
    "Luxury",
  ];

  // Common car makes - use filterOptions if available, otherwise use hardcoded list
  const makes = useMemo(() => {
    if (filterOptions?.makes && filterOptions.makes.length > 0) {
      // Combine filterOptions makes with hardcoded makes, removing duplicates
      const allMakes = new Set([
        ...filterOptions.makes,
        ...Object.keys(makeToModels),
      ]);
      return Array.from(allMakes).sort();
    }
    return Object.keys(makeToModels).sort();
  }, [filterOptions]);

  // Get filtered models based on selected make
  const availableModels = useMemo(() => {
    if (!formData.make) {
      // If no make is selected, return all models or empty array
      return filterOptions?.models || [];
    }

    // Get models for the selected make from the mapping
    const mappedModels = makeToModels[formData.make] || [];

    // If there's a current model that's not in the mapped list, include it
    // This is useful for edit mode where the model might not be in our hardcoded list
    const modelsList = [...mappedModels];
    if (formData.model && !modelsList.includes(formData.model)) {
      modelsList.push(formData.model);
    }

    // If we have filterOptions, also filter those models by the selected make
    // by checking if they exist in cars with that make
    if (filterOptions?.models && filterOptions.models.length > 0) {
      // For now, use the mapped models if available, otherwise use filterOptions
      // In a real scenario, you might want to query the API for models by make
      if (modelsList.length > 0) {
        return modelsList;
      }
      // Fallback: return all models from filterOptions (not ideal, but better than nothing)
      return filterOptions.models;
    }

    // Use mapped models or add "Other" option
    return modelsList.length > 0 ? modelsList : ["Other"];
  }, [formData.make, formData.model, filterOptions]);

  // Handle make change - reset model when make changes
  const handleMakeChange = (value: string) => {
    // Get models for the new make
    const newMakeModels = makeToModels[value] || [];
    const currentModel = formData.model;

    // Update make
    onInputChange("make", value);

    // Reset model when make changes (unless the current model is still valid for the new make)
    if (currentModel && !newMakeModels.includes(currentModel)) {
      onInputChange("model", "");
    }
  };

  console.log("BasicInfoSection received categories:", categories);
  console.log(
    "Filtered categories:",
    (categories || []).filter((category) => category.status === "active")
  );

  return (
    <div className="rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Car className="w-5 h-5 text-blue-600" />
        Basic Information
      </h3>
      <div className="space-y-6">
        {/* Basic Information - Only these fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <SelectField
            label="Make"
            field="make"
            options={makes.map((make) => ({
              value: make,
              label: make,
            }))}
            required={true}
            placeholder="Select Make"
            value={formData.make}
            error={errors.make}
            isViewMode={isViewMode}
            onChange={handleMakeChange}
          />
          <SelectField
            label="Model"
            field="model"
            options={availableModels.map((model) => ({
              value: model,
              label: model,
            }))}
            required={true}
            placeholder={formData.make ? "Select Model" : "Select Make first"}
            value={formData.model}
            error={errors.model}
            isViewMode={isViewMode}
            disabled={!formData.make}
            onChange={(value) => onInputChange("model", value)}
          />
          <FormField
            label="Package"
            field="package"
            type="text"
            placeholder="e.g., Premium, Standard"
            required={false}
            maxLength={255}
            value={formData.package}
            error={errors.package}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("package", value)}
          />
          <SelectField
            label="Body Type"
            field="body"
            options={bodyTypes.map((bodyType) => ({
              value: bodyType,
              label: bodyType,
            }))}
            required={false}
            placeholder="Select Body Type"
            value={formData.body}
            error={errors.body}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("body", value)}
          />
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
          <FormField
            label="Color"
            field="color"
            type="text"
            placeholder="e.g., Red, Blue, Silver, Black"
            required={false}
            maxLength={64}
            value={formData.color}
            error={errors.color}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("color", value)}
          />
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

        {/* Commented out fields - can be uncommented if needed */}
        {/*
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <FormField
            label="Serial"
            field="serial"
            type="text"
            placeholder="e.g., SER001"
            required={false}
            maxLength={64}
            value={formData.serial}
            error={errors.serial}
            isViewMode={isViewMode}
            onChange={(value) => onInputChange("serial", value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <div className="w-full">
            <SelectField
              label="Category"
              field="category_id"
              options={(categories || [])
                .filter((category) => category.status === "active")
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
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default BasicInfoSection;
