import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import {
  PaymentHistory,
  CreatePaymentHistoryData,
  UpdatePaymentHistoryData,
  UpdateInstallmentData,
} from "../../services/paymentHistoryApi";
import { carApi, Car } from "../../services/carApi";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  mode: "create" | "update";
  paymentHistory?: PaymentHistory | null;
  onClose: () => void;
  onSubmit: (data: CreatePaymentHistoryData | UpdatePaymentHistoryData) => void;
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  mode,
  paymentHistory,
  onClose,
  onSubmit,
}) => {
  const formatDateForInput = (value: string | null | undefined): string | null => {
    if (!value) return null;
    // If already YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    // Handle common API formats like 'YYYY-MM-DDTHH:mm:ss' or 'YYYY-MM-DD HH:mm:ss'
    return value.substring(0, 10);
  };

  const [formData, setFormData] = useState<CreatePaymentHistoryData>({
    car_id: null,
    showroom_name: null,
    wholesaler_address: null,
    purchase_amount: null,
    purchase_date: null,
    nid_number: null,
    tin_certificate: null,
    customer_address: null,
    contact_number: null,
    email: null,
    installments: [],
  });

  const [installments, setInstallments] = useState<UpdateInstallmentData[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentHistory && mode === "update" && isOpen) {
      setFormData({
        car_id: paymentHistory.car_id,
        showroom_name: paymentHistory.showroom_name,
        wholesaler_address: paymentHistory.wholesaler_address,
        purchase_amount: paymentHistory.purchase_amount,
        purchase_date: formatDateForInput(paymentHistory.purchase_date),
        nid_number: paymentHistory.nid_number,
        tin_certificate: paymentHistory.tin_certificate,
        customer_address: paymentHistory.customer_address,
        contact_number: paymentHistory.contact_number,
        email: paymentHistory.email,
        installments: [],
      });

      // Load installments with their IDs for update
      if (paymentHistory.installments) {
        setInstallments(
          paymentHistory.installments.map((inst) => ({
            id: inst.id,
            installment_date: formatDateForInput(inst.installment_date),
            description: inst.description,
            amount: inst.amount,
            payment_method: inst.payment_method,
            bank_name: inst.bank_name,
            cheque_number: inst.cheque_number,
            balance: inst.balance,
            remarks: inst.remarks,
          }))
        );
      } else {
        setInstallments([]);
      }
    } else if (isOpen) {
      // Reset form for create mode
      setFormData({
        car_id: null,
        showroom_name: null,
        wholesaler_address: null,
        purchase_amount: null,
        purchase_date: null,
        nid_number: null,
        tin_certificate: null,
        customer_address: null,
        contact_number: null,
        email: null,
        installments: [],
      });
      setInstallments([]);
    }
  }, [paymentHistory, mode, isOpen]);

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const response = await carApi.getCars({ per_page: 1000 });
      if (response.success && response.data?.data) {
        setCars(response.data.data);
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

  const handleInputChange = (
    field: keyof CreatePaymentHistoryData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addInstallment = () => {
    setInstallments([
      ...installments,
      {
        installment_date: null,
        description: null,
        amount: null,
        payment_method: null,
        bank_name: null,
        cheque_number: null,
        balance: null,
        remarks: null,
      },
    ]);
  };

  const removeInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const updateInstallment = (index: number, field: keyof UpdateInstallmentData, value: any) => {
    setInstallments(
      installments.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "update") {
      const submitData: UpdatePaymentHistoryData = {
        ...formData,
        installments: installments, // Include IDs for update mode
      };
      onSubmit(submitData);
    } else {
      const submitData: CreatePaymentHistoryData = {
        ...formData,
        installments: installments.map(({ id, ...rest }) => rest), // Remove IDs for create mode
      };
      onSubmit(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {mode === "create" ? "Create Payment History" : "Update Payment History"}
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
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Car Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    value={formData.car_id || ""}
                    onChange={(e) => handleInputChange("car_id", e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingCars}
                  >
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.make} {car.model} {car.ref_no ? `(${car.ref_no})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Wholesaler Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wholesaler Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Showroom Name
                  </label>
                  <input
                    type="text"
                    value={formData.showroom_name || ""}
                    onChange={(e) => handleInputChange("showroom_name", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchase_amount || ""}
                    onChange={(e) => handleInputChange("purchase_amount", e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Date
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date || ""}
                    onChange={(e) => handleInputChange("purchase_date", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wholesaler Address
                  </label>
                  <textarea
                    value={formData.wholesaler_address || ""}
                    onChange={(e) => handleInputChange("wholesaler_address", e.target.value || null)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NID Number
                  </label>
                  <input
                    type="text"
                    value={formData.nid_number || ""}
                    onChange={(e) => handleInputChange("nid_number", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TIN Certificate
                  </label>
                  <input
                    type="text"
                    value={formData.tin_certificate || ""}
                    onChange={(e) => handleInputChange("tin_certificate", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contact_number || ""}
                    onChange={(e) => handleInputChange("contact_number", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Address
                  </label>
                  <textarea
                    value={formData.customer_address || ""}
                    onChange={(e) => handleInputChange("customer_address", e.target.value || null)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Installments */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Installments</h3>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Installment
                </button>
              </div>

              {installments.length === 0 ? (
                <p className="text-gray-500 text-sm">No installments added. Click "Add Installment" to add one.</p>
              ) : (
                <div className="space-y-4">
                  {installments.map((installment, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-700">Installment #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeInstallment(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Installment Date
                          </label>
                          <input
                            type="date"
                            value={installment.installment_date || ""}
                            onChange={(e) => updateInstallment(index, "installment_date", e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={installment.amount || ""}
                            onChange={(e) => updateInstallment(index, "amount", e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Method
                          </label>
                          <select
                            value={installment.payment_method || ""}
                            onChange={(e) => updateInstallment(index, "payment_method", e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select method</option>
                            <option value="Bank">Bank</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Balance
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={installment.balance || ""}
                            onChange={(e) => updateInstallment(index, "balance", e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        {installment.payment_method === "Bank" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name
                              </label>
                              <input
                                type="text"
                                value={installment.bank_name || ""}
                                onChange={(e) => updateInstallment(index, "bank_name", e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cheque Number
                              </label>
                              <input
                                type="text"
                                value={installment.cheque_number || ""}
                                onChange={(e) => updateInstallment(index, "cheque_number", e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </>
                        )}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={installment.description || ""}
                            onChange={(e) => updateInstallment(index, "description", e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                          </label>
                          <textarea
                            value={installment.remarks || ""}
                            onChange={(e) => updateInstallment(index, "remarks", e.target.value || null)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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

export default PaymentHistoryModal;
