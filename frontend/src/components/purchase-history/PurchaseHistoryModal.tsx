import React, { useState, useEffect } from "react";
import { X, Upload, FileText } from "lucide-react";
import {
  PurchaseHistory,
  CreatePurchaseHistoryData,
  UpdatePurchaseHistoryData,
} from "../../services/purchaseHistoryApi";
import { carApi, Car } from "../../services/carApi";

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  mode: "create" | "update";
  purchaseHistory?: PurchaseHistory | null;
  onClose: () => void;
  onSubmit: (
    data: CreatePurchaseHistoryData | UpdatePurchaseHistoryData
  ) => void;
}

const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
  isOpen,
  mode,
  purchaseHistory,
  onClose,
  onSubmit,
}) => {
  const toInputDate = (value: string | null | undefined): string | null => {
    if (!value) return null;
    // Try to parse and normalize to YYYY-MM-DD for <input type="date">
    // Handles values like 'YYYY-MM-DD', ISO strings, or other parseable formats
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    // Fallback: if already looks like YYYY-MM-DD or starts with that, slice it
    if (typeof value === "string" && value.length >= 10) {
      const maybe = value.slice(0, 10);
      // simple check
      if (/^\d{4}-\d{2}-\d{2}$/.test(maybe)) return maybe;
    }
    return null;
  };

  const [formData, setFormData] = useState<CreatePurchaseHistoryData>({
    car_id: null,
    purchase_date: null,
    purchase_amount: null,
    govt_duty: null,
    cnf_amount: null,
    miscellaneous: null,
    lc_date: null,
    lc_number: null,
    lc_bank_name: null,
    lc_bank_branch_name: null,
    lc_bank_branch_address: null,
    total_units_per_lc: null,
    bill_of_lading: null,
    invoice_number: null,
    export_certificate: null,
    export_certificate_translated: null,
    bill_of_exchange_amount: null,
    custom_duty_copy_3pages: null,
    cheque_copy: null,
    certificate: null,
    custom_one: null,
    custom_two: null,
    custom_three: null,
  });

  // Separate fields for foreign currency and BDT amounts
  const [foreignAmount, setForeignAmount] = useState<string>("");
  const [bdtAmount, setBdtAmount] = useState<string>("");
  const [currencyType, setCurrencyType] = useState<"dollar" | "yen">("dollar");
  const [existingFiles, setExistingFiles] = useState<Record<string, string>>(
    {}
  );
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const response = await carApi.getCars({ per_page: 1000 });
      const carList = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data?.cars)
        ? response.data.cars
        : [];
      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoadingCars(false);
    }
  };

  useEffect(() => {
    if (purchaseHistory && mode === "update") {
      // Calculate dollar and BDT from purchase_amount if available
      // Prefill from backend fields if present
      setForeignAmount(
        purchaseHistory.foreign_amount != null
          ? String(purchaseHistory.foreign_amount)
          : ""
      );
      setBdtAmount(
        purchaseHistory.bdt_amount != null
          ? String(purchaseHistory.bdt_amount)
          : ""
      );

      setFormData({
        car_id: purchaseHistory.car_id ?? null,
        purchase_date: toInputDate(purchaseHistory.purchase_date),
        purchase_amount: purchaseHistory.purchase_amount,
        foreign_amount:
          purchaseHistory.foreign_amount != null
            ? purchaseHistory.foreign_amount
            : null,
        bdt_amount:
          purchaseHistory.bdt_amount != null ? purchaseHistory.bdt_amount : null,
        govt_duty: purchaseHistory.govt_duty || null,
        cnf_amount: purchaseHistory.cnf_amount || null,
        miscellaneous: purchaseHistory.miscellaneous || null,
        lc_date: toInputDate(purchaseHistory.lc_date),
        lc_number: purchaseHistory.lc_number || null,
        lc_bank_name: purchaseHistory.lc_bank_name || null,
        lc_bank_branch_name: purchaseHistory.lc_bank_branch_name || null,
        lc_bank_branch_address: purchaseHistory.lc_bank_branch_address || null,
        total_units_per_lc: purchaseHistory.total_units_per_lc || null,
        bill_of_lading: null,
        invoice_number: null,
        export_certificate: null,
        export_certificate_translated: null,
        bill_of_exchange_amount: null,
        custom_duty_copy_3pages: null,
        cheque_copy: null,
        certificate: null,
        custom_one: null,
        custom_two: null,
        custom_three: null,
      });

      // Store existing file paths
      const pdfFields = [
        "bill_of_lading",
        "invoice_number",
        "export_certificate",
        "export_certificate_translated",
        "bill_of_exchange_amount",
        "custom_duty_copy_3pages",
        "cheque_copy",
        "certificate",
        "custom_one",
        "custom_two",
        "custom_three",
      ];

      const files: Record<string, string> = {};
      pdfFields.forEach((field) => {
        const value = purchaseHistory[field as keyof PurchaseHistory] as
          | string
          | null;
        if (value) files[field] = value;
      });
      setExistingFiles(files);
    } else {
      // Reset form for create mode
      setFormData({
        car_id: null,
        purchase_date: null,
        purchase_amount: null,
        foreign_amount: null,
        bdt_amount: null,
        govt_duty: null,
        cnf_amount: null,
        miscellaneous: null,
        lc_date: null,
        lc_number: null,
        lc_bank_name: null,
        lc_bank_branch_name: null,
        lc_bank_branch_address: null,
        total_units_per_lc: null,
        bill_of_lading: null,
        invoice_number: null,
        export_certificate: null,
        export_certificate_translated: null,
        bill_of_exchange_amount: null,
        custom_duty_copy_3pages: null,
        cheque_copy: null,
        certificate: null,
        custom_one: null,
        custom_two: null,
        custom_three: null,
      });
      setForeignAmount("");
      setBdtAmount("");
      setExistingFiles({});
    }
  }, [purchaseHistory, mode, isOpen]);

  // Calculate purchase_amount when dollar or BDT changes
  useEffect(() => {
    const foreign = parseFloat(foreignAmount) || 0;
    const bdt = parseFloat(bdtAmount) || 0;
    const calculated = foreign * bdt;
    setFormData((prev) => ({
      ...prev,
      purchase_amount: calculated > 0 ? calculated : null,
      foreign_amount:
        !Number.isNaN(foreign) && foreignAmount !== "" ? foreign : null,
      bdt_amount: !Number.isNaN(bdt) && bdtAmount !== "" ? bdt : null,
    }));
  }, [foreignAmount, bdtAmount]);

  const handleInputChange = (
    field: keyof CreatePurchaseHistoryData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPdfUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    // @ts-ignore
    const baseUrl =
      (import.meta as any).env?.VITE_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${baseUrl}${path}`;
  };

  if (!isOpen) return null;

  const pdfFields = [
    { key: "bill_of_lading", label: "Bill of Lading" },
    { key: "invoice_number", label: "Invoice Number" },
    { key: "export_certificate", label: "Export Certificate" },
    {
      key: "export_certificate_translated",
      label: "Export Certificate (Translated)",
    },
    { key: "bill_of_exchange_amount", label: "Bill of Exchange Amount" },
    { key: "custom_duty_copy_3pages", label: "Custom Duty Copy (3 Pages)" },
    { key: "cheque_copy", label: "Cheque Copy" },
    { key: "certificate", label: "Certificate" },
    { key: "custom_one", label: "Custom One" },
    { key: "custom_two", label: "Custom Two" },
    { key: "custom_three", label: "Custom Three" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {mode === "create"
                ? "Create Purchase History"
                : "Update Purchase History"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(95vh-120px)]"
        >
          <div className="p-6 space-y-6">
            {/* Car Selection */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Car Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    value={formData.car_id || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "car_id",
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                    disabled={loadingCars}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">
                      {loadingCars ? "Loading cars..." : "Select a car"}
                    </option>
                    {cars.map((car) => {
                      const chassisNo = car.chassis_no_full || car.chassis_no_masked;
                      return (
                        <option key={car.id} value={car.id}>
                          {car.make} {car.model}
                          {chassisNo ? ` (${chassisNo})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchase_date || ""}
                  onChange={(e) =>
                    handleInputChange("purchase_date", e.target.value || null)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LC Date
                </label>
                <input
                  type="date"
                  value={formData.lc_date || ""}
                  onChange={(e) =>
                    handleInputChange("lc_date", e.target.value || null)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Purchase Amount Calculation */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Purchase Amount Calculation
              </h3>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Select Currency:
                </span>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={currencyType === "dollar"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCurrencyType("dollar");
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Dollar
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={currencyType === "yen"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCurrencyType("yen");
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Yen
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currencyType === "dollar"
                      ? "Dollar Amount (USD)"
                      : "Yen Amount (JPY)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={foreignAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForeignAmount(val);
                      setFormData((prev) => ({
                        ...prev,
                        foreign_amount:
                          val === "" ? null : parseFloat(val) || 0,
                      }));
                    }}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BDT Amount (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bdtAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBdtAmount(val);
                      setFormData((prev) => ({
                        ...prev,
                        bdt_amount: val === "" ? null : parseFloat(val) || 0,
                      }));
                    }}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calculated Purchase Amount
                  </label>
                  <input
                    type="number"
                    value={formData.purchase_amount || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated:{" "}
                    {currencyType === "dollar" ? "Dollar" : "Yen"} × BDT
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Govt Duty
                </label>
                <input
                  type="text"
                  value={formData.govt_duty || ""}
                  onChange={(e) =>
                    handleInputChange("govt_duty", e.target.value || null)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNF Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cnf_amount || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "cnf_amount",
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miscellaneous
                </label>
                <input
                  type="text"
                  value={formData.miscellaneous || ""}
                  onChange={(e) =>
                    handleInputChange("miscellaneous", e.target.value || null)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* LC Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                LC Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Units per LC
                  </label>
                  <input
                    type="text"
                    value={formData.total_units_per_lc || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "total_units_per_lc",
                        e.target.value || null
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LC Number
                  </label>
                  <input
                    type="text"
                    value={formData.lc_number || ""}
                    onChange={(e) =>
                      handleInputChange("lc_number", e.target.value || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LC Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.lc_bank_name || ""}
                    onChange={(e) =>
                      handleInputChange("lc_bank_name", e.target.value || null)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LC Bank Branch Name
                  </label>
                  <input
                    type="text"
                    value={formData.lc_bank_branch_name || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "lc_bank_branch_name",
                        e.target.value || null
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LC Bank Branch Address
                  </label>
                  <textarea
                    value={formData.lc_bank_branch_address || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "lc_bank_branch_address",
                        e.target.value || null
                      )
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* PDF Uploads */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                PDF Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pdfFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {existingFiles[field.key] && (
                      <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <a
                          href={getPdfUrl(existingFiles[field.key]) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex-1 truncate"
                        >
                          Current file
                        </a>
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {formData[
                            field.key as keyof CreatePurchaseHistoryData
                          ]
                            ? "File selected"
                            : "Click to upload PDF"}
                        </p>
                        {formData[
                          field.key as keyof CreatePurchaseHistoryData
                        ] && (
                          <p className="text-xs text-gray-400 mt-1">
                            {
                              (
                                formData[
                                  field.key as keyof CreatePurchaseHistoryData
                                ] as File
                              )?.name
                            }
                          </p>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange(field.key, file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;
