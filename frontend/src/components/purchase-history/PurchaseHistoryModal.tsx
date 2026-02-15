import React, { useState, useEffect } from "react";
import { X, Upload, File as FileIcon, Search } from "lucide-react";
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
  const [carSearchQuery, setCarSearchQuery] = useState("");
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const response = await carApi.getCars({ per_page: 1000 });
      if (response.success) {
        // Handle different possible response structures
        const carList = response.data?.data || response.data?.cars || [];
        setCars(Array.isArray(carList) ? carList : []);
      } else {
        setCars([]);
      }
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
      setCurrencyType((purchaseHistory.currency_type as "dollar" | "yen") || "dollar");

      setFormData({
        car_ids: purchaseHistory.cars?.map(c => c.id) || (purchaseHistory.car_id ? [purchaseHistory.car_id] : []),
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
        car_ids: [],
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
      setCurrencyType("dollar");
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
      currency_type: currencyType,
    }));
  }, [foreignAmount, bdtAmount, currencyType]);

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

  const getFileName = (filePath: string | File): string => {
    if (filePath instanceof File) {
      return filePath.name;
    }
    // Extract filename from path
    return filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown file';
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
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 sticky top-0 z-10">
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
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Cars <span className="text-gray-400">(Searchable Multi-select)</span>
                  </label>

                  {/* Selected Cars Tags */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.car_ids || []).map(id => {
                      // Try to find in global cars list first
                      let car: any = cars.find(c => c.id === id);

                      // Fallback to purchaseHistory.cars if available
                      if (!car && purchaseHistory?.cars) {
                        car = purchaseHistory.cars.find(c => c.id === id);
                      }

                      if (!car) return null;

                      return (
                        <div key={id} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 border border-primary-200 shadow-sm">
                          <span>{car.make} {car.model} ({car.chassis_no_full || car.chassis_no_masked})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newIds = (formData.car_ids || []).filter(cid => cid !== id);
                              handleInputChange("car_ids", newIds);
                              if (newIds.length === 0) handleInputChange("car_id", null);
                              else if (id === formData.car_id) handleInputChange("car_id", newIds[0]);
                            }}
                            className="hover:text-primary-900 focus:outline-none"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                    {loadingCars && (formData.car_ids || []).length > 0 &&
                      !(formData.car_ids || []).some(id => cars.find(c => c.id === id) || purchaseHistory?.cars?.find(c => c.id === id)) && (
                        <span className="text-xs text-gray-400 animate-pulse">Loading car details...</span>
                      )}
                  </div>

                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search cars by make, model, chassis..."
                        value={carSearchQuery}
                        onChange={(e) => {
                          setCarSearchQuery(e.target.value);
                          setIsCarDropdownOpen(true);
                        }}
                        onFocus={() => setIsCarDropdownOpen(true)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {isCarDropdownOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {loadingCars ? (
                          <div className="p-4 text-center text-gray-500 text-sm">Loading cars...</div>
                        ) : (
                          <>
                            {cars
                              .filter(car => {
                                const searchStr = `${car.make} ${car.model} ${car.chassis_no_full || ""} ${car.chassis_no_masked || ""}`.toLowerCase();
                                return searchStr.includes(carSearchQuery.toLowerCase());
                              })
                              .map(car => {
                                const isSelected = (formData.car_ids || []).includes(car.id);
                                return (
                                  <div
                                    key={car.id}
                                    onClick={() => {
                                      const currentIds = formData.car_ids || [];
                                      const newIds = isSelected
                                        ? currentIds.filter(id => id !== car.id)
                                        : [...currentIds, car.id];

                                      handleInputChange("car_ids", newIds);
                                      // Also update legacy car_id to the first selected car for backward compatibility
                                      handleInputChange("car_id", newIds.length > 0 ? newIds[0] : null);

                                      if (!isSelected) {
                                        // Optional: setCarSearchQuery("");
                                      }
                                    }}
                                    className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-900">{car.make} {car.model}</span>
                                      <span className="text-xs text-gray-500">{car.chassis_no_full || car.chassis_no_masked}</span>
                                    </div>
                                    {isSelected && (
                                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                    )}
                                  </div>
                                );
                              })}
                            {cars.filter(car => {
                              const searchStr = `${car.make} ${car.model} ${car.chassis_no_full || ""} ${car.chassis_no_masked || ""}`.toLowerCase();
                              return searchStr.includes(carSearchQuery.toLowerCase());
                            }).length === 0 && (
                                <div className="p-4 text-center text-gray-500 text-sm">No cars found</div>
                              )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {isCarDropdownOpen && (
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCarDropdownOpen(false)}
                    ></div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Amount Calculation */}
            <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-200">
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
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* LC Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                LC Information
              </h3>
              <div className="space-y-6">
                {/* First row: 4 fields in same row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {/* Second row: LC Bank Branch Address */}
                <div>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                {pdfFields.map((field) => {
                  const existingFile = existingFiles[field.key];
                  const newFile = formData[field.key as keyof CreatePurchaseHistoryData] instanceof File
                    ? formData[field.key as keyof CreatePurchaseHistoryData] as File
                    : null;

                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>

                      {/* Show existing file if available */}
                      {existingFile && (
                        <div className="mb-3 bg-primary-50 rounded-lg border border-primary-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-primary-700 uppercase">Current File</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newExistingFiles = { ...existingFiles };
                                delete newExistingFiles[field.key];
                                setExistingFiles(newExistingFiles);
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Remove existing file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-red-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {getFileName(existingFile)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Existing file
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show new file if selected */}
                      {newFile && (
                        <div className="mb-3 bg-green-50 rounded-lg border border-green-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-green-700 uppercase">New File (will replace current)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleFileChange(field.key, null);
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Remove new file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-red-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {getFileName(newFile)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(newFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Upload area - show if no existing file or if we want to allow replacement */}
                      {!newFile && (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              {existingFile
                                ? "Drag and drop a new file to replace the current one, or click to browse"
                                : "Click to upload PDF"}
                            </p>
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
                      )}
                    </div>
                  );
                })}
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
                className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
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
