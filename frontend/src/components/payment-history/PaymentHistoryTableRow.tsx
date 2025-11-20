import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { PaymentHistory } from "../../services/paymentHistoryApi";

interface PaymentHistoryTableRowProps {
  paymentHistory: PaymentHistory;
  onEdit: (paymentHistory: PaymentHistory) => void;
  onDelete: (paymentHistory: PaymentHistory) => void;
  onView?: (paymentHistory: PaymentHistory) => void;
}

const PaymentHistoryTableRow: React.FC<PaymentHistoryTableRowProps> = ({
  paymentHistory,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const carDisplay = paymentHistory.car
    ? `${paymentHistory.car.make} ${paymentHistory.car.model}`
    : "N/A";

  const customerDisplay = paymentHistory.contact_number || "N/A";
  const customerEmail = paymentHistory.email || null;

  const installmentsCount = paymentHistory.installments?.length || 0;

  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
      onClick={(e) => {
        // Only navigate if clicking on the row, not on buttons
        if ((e.target as HTMLElement).closest("button")) return;
        if (onView) onView(paymentHistory);
      }}
    >
      {/* Car Details */}
      <div className="col-span-3 flex items-start pt-1">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {carDisplay}
          </div>
          {paymentHistory.car && (paymentHistory.car.chassis_no_full || paymentHistory.car.chassis_no_masked) && (
            <div className="text-xs text-gray-500 mt-0.5">
              Chassis: {paymentHistory.car.chassis_no_full || paymentHistory.car.chassis_no_masked}
            </div>
          )}
        </div>
      </div>

      {/* Showroom Name */}
      <div className="col-span-2 flex items-start pt-1">
        <span className="text-sm text-gray-700 truncate">
          {paymentHistory.showroom_name || "N/A"}
        </span>
      </div>

      {/* Selling Date */}
      <div className="col-span-1 flex items-start pt-1">
        <span className="text-sm text-gray-700">
          {formatDate(paymentHistory.purchase_date)}
        </span>
      </div>

      {/* Selling Amount */}
      <div className="col-span-1 flex items-start pt-1">
        <span className="text-sm text-gray-700">
          {formatCurrency(paymentHistory.purchase_amount)}
        </span>
      </div>

      {/* Customer */}
      <div className="col-span-2 flex items-start pt-1">
        <div className="min-w-0">
          <div className="text-sm text-gray-700">
            {customerDisplay}
          </div>
          {customerEmail && (
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {customerEmail}
            </div>
          )}
        </div>
      </div>

      {/* Installments */}
      <div className="col-span-2 flex items-start py-2">
        <div className="w-full">
          {installmentsCount > 0 ? (
            <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
              {paymentHistory.installments?.map((ins) => (
                <div key={ins.id} className="flex items-start justify-between gap-3 text-sm border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800">
                      {formatDate(ins.installment_date)}
                    </div>
                    {ins.payment_method && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {ins.payment_method}
                        {ins.bank_name && ` - ${ins.bank_name}`}
                      </div>
                    )}
                    {ins.cheque_number && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Cheque: {ins.cheque_number}
                      </div>
                    )}
                  </div>
                  <div className="text-right min-w-[80px] text-gray-900 font-semibold">
                    {formatCurrency(ins.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400">No installments</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="col-span-1 flex items-start justify-center gap-1.5 pt-1"
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <button
            onClick={() => onView(paymentHistory)}
            className="p-2.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 group/btn"
            title="View Payment History"
          >
            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
        <button
          onClick={() => onEdit(paymentHistory)}
          className="p-2.5 text-amber-600 hover:text-amber-700 rounded-lg transition-all duration-200 group/btn"
          title="Edit Payment History"
        >
          <Pencil className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onDelete(paymentHistory)}
          className="p-2.5 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 group/btn"
          title="Delete Payment History"
        >
          <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PaymentHistoryTableRow;
