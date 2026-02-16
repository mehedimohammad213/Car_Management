import React, { useState, useEffect } from "react";
import { X, Upload, File as FileIcon, Search, Plus, Trash2 } from "lucide-react";
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
    data: CreatePurchaseHistoryData | UpdatePurchaseHistoryData | CreatePurchaseHistoryData[]
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
  const [yenToDollarRate, setYenToDollarRate] = useState<string>("");
  const [dollarToBdtRate, setDollarToBdtRate] = useState<string>("");
  const [currencyType, setCurrencyType] = useState<"dollar" | "yen">("dollar");
  const [existingFiles, setExistingFiles] = useState<Record<string, string>>(
    {}
  );
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carSearchQuery, setCarSearchQuery] = useState("");
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [carEntries, setCarEntries] = useState<CreatePurchaseHistoryData[]>([]);

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
      setDollarToBdtRate(
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
      setYenToDollarRate("");
      setDollarToBdtRate("");
      setCurrencyType("dollar");
      setExistingFiles({});
      setCarEntries([]);
    }
  }, [purchaseHistory, mode, isOpen]);

  // Calculate purchase_amount with two-step conversion for Yen
  useEffect(() => {
    const foreign = parseFloat(foreignAmount) || 0;
    let finalAmount = 0;
    let dollarEquivalent = foreign;

    if (currencyType === "yen") {
      // Step 1: Convert Yen to Dollar
      const yenToDollar = parseFloat(yenToDollarRate) || 0;
      dollarEquivalent = foreign * yenToDollar;

      // Step 2: Convert Dollar to BDT
      const dollarToBdt = parseFloat(dollarToBdtRate) || 0;
      finalAmount = dollarEquivalent * dollarToBdt;
    } else {
      // For Dollar: direct conversion to BDT
      const dollarToBdt = parseFloat(dollarToBdtRate) || 0;
      finalAmount = foreign * dollarToBdt;
    }

    setFormData((prev) => ({
      ...prev,
      purchase_amount: finalAmount > 0 ? finalAmount : null,
      foreign_amount: !Number.isNaN(foreign) && foreignAmount !== "" ? foreign : null,
      bdt_amount: !Number.isNaN(parseFloat(dollarToBdtRate)) && dollarToBdtRate !== "" ? parseFloat(dollarToBdtRate) : null,
      currency_type: currencyType,
    }));
  }, [foreignAmount, yenToDollarRate, dollarToBdtRate, currencyType]);

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

  const handleAddEntry = () => {
    if (!formData.car_id) {
      // alert("Please select a car first");
      return;
    }

    // Check if car already added
    if (carEntries.some(e => e.car_id === formData.car_id)) {
      // alert("Car already added to list");
      return;
    }

    const newEntry: CreatePurchaseHistoryData = {
      car_id: formData.car_id,
      purchase_amount: formData.purchase_amount,
      foreign_amount: formData.foreign_amount,
      bdt_amount: formData.bdt_amount,
      currency_type: currencyType,
      govt_duty: formData.govt_duty,
      cnf_amount: formData.cnf_amount,
      miscellaneous: formData.miscellaneous,
      purchase_date: formData.purchase_date,

      // Add PDF fields
      bill_of_lading: formData.bill_of_lading,
      invoice_number: formData.invoice_number,
      export_certificate: formData.export_certificate,
      export_certificate_translated: formData.export_certificate_translated,
      bill_of_exchange_amount: formData.bill_of_exchange_amount,
      custom_duty_copy_3pages: formData.custom_duty_copy_3pages,
      cheque_copy: formData.cheque_copy,
      certificate: formData.certificate,
      custom_one: formData.custom_one,
      custom_two: formData.custom_two,
      custom_three: formData.custom_three,
    };

    setCarEntries([...carEntries, newEntry]);

    // Clear specific fields
    setFormData(prev => ({
      ...prev,
      car_id: null,
      purchase_amount: null,
      foreign_amount: null,
      bdt_amount: null,
      govt_duty: null,
      cnf_amount: null,
      miscellaneous: null,
      // Clear PDF fields
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
    }));
    setForeignAmount("");
    setYenToDollarRate("");
    setDollarToBdtRate("");
    setExistingFiles({});
  };

  const handleRemoveEntry = (index: number) => {
    setCarEntries(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create' && carEntries.length > 0) {
      // Helper to merge shared data
      const sharedData = {
        lc_date: formData.lc_date,
        lc_number: formData.lc_number,
        lc_bank_name: formData.lc_bank_name,
        lc_bank_branch_name: formData.lc_bank_branch_name,
        lc_bank_branch_address: formData.lc_bank_branch_address,
        total_units_per_lc: formData.total_units_per_lc,
        bill_of_lading: formData.bill_of_lading,
        invoice_number: formData.invoice_number,
        export_certificate: formData.export_certificate,
        export_certificate_translated: formData.export_certificate_translated,
        bill_of_exchange_amount: formData.bill_of_exchange_amount,
        custom_duty_copy_3pages: formData.custom_duty_copy_3pages,
        cheque_copy: formData.cheque_copy,
        certificate: formData.certificate,
        custom_one: formData.custom_one,
        custom_two: formData.custom_two,
        custom_three: formData.custom_three,
      };

      const bulkData: CreatePurchaseHistoryData[] = carEntries.map(entry => ({
        ...sharedData,
        ...entry
      }));

      // @ts-ignore
      onSubmit(bulkData);
    } else {
      onSubmit(formData);
    }
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

            {/* 1. LC Information (Common) - Moved to Top */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                LC Information <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">Shared across all cars</span>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 my-6"></div>

            {/* 3. Added Cars List (Create Mode Only) */}
            {mode === 'create' && carEntries.length > 0 && (
              <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
                <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                  Added Cars ({carEntries.length}) <span className="text-xs font-normal text-primary-600 px-2 py-0.5 bg-white rounded-full border border-primary-100">Ready to submit</span>
                </h3>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Amount</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Duty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CNF</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {carEntries.map((entry, idx) => {
                        const car = cars.find(c => c.id === entry.car_id);
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {car ? `${car.make} ${car.model} (${car.chassis_no_full || car.chassis_no_masked})` : `Car ID: ${entry.car_id}`}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                              {entry.purchase_amount?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                              {entry.govt_duty || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 text-right">
                              {entry.cnf_amount?.toLocaleString() || '-'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveEntry(idx)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Car Entry Form */}
            <div className={`p-6 rounded-2xl border ${mode === 'create' ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' : 'bg-white border-gray-200'}`}>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                {mode === 'create' ? <><Plus className="w-5 h-5 text-blue-600" /> Add Car to Purchase</> : "Car & Financial Details"}
              </h3>

              {/* Car Selection */}
              <div className="border-b border-gray-200 pb-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mode === 'create' ? "Select Car to Add" : "Selected Cars"}
                  </label>

                  {/* Selected Car Display */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.car_id ? [formData.car_id] : (formData.car_ids || [])).map(id => {
                      let car: any = cars.find(c => c.id === id);
                      if (!car && purchaseHistory?.cars) {
                        car = purchaseHistory.cars.find(c => c.id === id);
                      }
                      if (!car) return null;

                      return (
                        <div key={id} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between w-full border border-blue-200">
                          <span>{car.make} {car.model} — <span className="text-gray-500 font-normal">{car.chassis_no_full || car.chassis_no_masked}</span></span>
                          <button
                            type="button"
                            onClick={() => {
                              handleInputChange("car_id", null);
                              handleInputChange("car_ids", []);
                            }}
                            className="text-blue-400 hover:text-blue-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Search Input (Show only if no car selected in create mode, or always in update mode if allowing adding) */}
                  {((mode === 'create' && !formData.car_id) || (mode === 'update')) && (
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
                                  // Check if already in list
                                  const isAlreadyAdded = carEntries.some(e => e.car_id === car.id);
                                  const isSelected = formData.car_id === car.id || (formData.car_ids || []).includes(car.id);

                                  if (isAlreadyAdded) return null; // Hide already added cars in list

                                  return (
                                    <div
                                      key={car.id}
                                      onClick={() => {
                                        handleInputChange("car_id", car.id);
                                        handleInputChange("car_ids", [car.id]); // Keep both for compatibility
                                        setIsCarDropdownOpen(false);
                                        setCarSearchQuery("");
                                      }}
                                      className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-primary-50' : ''}`}
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{car.make} {car.model}</span>
                                        <span className="text-xs text-gray-500">{car.chassis_no_full || car.chassis_no_masked}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              {cars.length === 0 && <div className="p-4 text-center">No cars found</div>}
                            </>
                          )}
                        </div>
                      )}
                      {isCarDropdownOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setIsCarDropdownOpen(false)}></div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Amount Calculation */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Purchase Price
                </h3>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">Currency:</span>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={currencyType === "dollar"}
                      onChange={(e) => e.target.checked && setCurrencyType("dollar")}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Dollar
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={currencyType === "yen"}
                      onChange={(e) => e.target.checked && setCurrencyType("yen")}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Yen
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {currencyType === "dollar" ? "Amount (USD)" : "Amount (JPY)"}
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
                          foreign_amount: val === "" ? null : parseFloat(val) || 0,
                        }));
                      }}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    />
                  </div>

                  {currencyType === "yen" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Yen to Dollar Rate
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={yenToDollarRate}
                        onChange={(e) => setYenToDollarRate(e.target.value)}
                        placeholder="0.0000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Dollar to BDT Rate (৳)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dollarToBdtRate}
                      onChange={(e) => setDollarToBdtRate(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Calculated Total (BDT)
                    </label>
                    <input
                      type="number"
                      value={formData.purchase_amount || ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-200 text-gray-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Basic & Financial Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date || ""}
                    onChange={(e) => handleInputChange("purchase_date", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Govt Duty
                  </label>
                  <input
                    type="text"
                    value={formData.govt_duty || ""}
                    onChange={(e) => handleInputChange("govt_duty", e.target.value || null)}
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
                    onChange={(e) => handleInputChange("cnf_amount", e.target.value ? parseFloat(e.target.value) : null)}
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
                    onChange={(e) => handleInputChange("miscellaneous", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* PDF Documents */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Document Attachments
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
                          <div className="mb-3 bg-white rounded-lg border border-gray-200 p-4">
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
                                <span className="text-xs font-semibold text-green-700 uppercase">New File</span>
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

                        {/* Upload area */}
                        {!newFile && (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-white transition-colors bg-white">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                {existingFile
                                  ? "Replace file"
                                  : "Upload PDF"}
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

              {/* Add Button (Create Mode) */}
              {mode === 'create' && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddEntry}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    Add Car to List
                  </button>
                </div>
              )}
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
                {mode === "create" ? (carEntries.length > 0 ? `Submit All (${carEntries.length} Cars)` : "Create") : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseHistoryModal;
