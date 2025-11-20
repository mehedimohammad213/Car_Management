import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { PurchaseHistory } from "../../services/purchaseHistoryApi";

interface PurchaseHistoryTableRowProps {
  purchaseHistory: PurchaseHistory;
  onEdit: (purchaseHistory: PurchaseHistory) => void;
  onDelete: (purchaseHistory: PurchaseHistory) => void;
  onView?: (purchaseHistory: PurchaseHistory) => void;
}

const PurchaseHistoryTableRow: React.FC<PurchaseHistoryTableRowProps> = ({
  purchaseHistory,
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
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const carDisplay = purchaseHistory.car
    ? `${purchaseHistory.car.make} ${purchaseHistory.car.model}`
    : "N/A";

  return (
    <div
      className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
      onClick={(e) => {
        // Only navigate if clicking on the row, not on buttons
        if ((e.target as HTMLElement).closest("button")) return;
        if (onView) onView(purchaseHistory);
      }}
    >
      {/* Car Details */}
      <div className="col-span-3 flex items-center">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {carDisplay}
          </div>
          {purchaseHistory.car && (purchaseHistory.car.chassis_no_full || purchaseHistory.car.chassis_no_masked) && (
            <div className="text-xs text-gray-500 mt-0.5">
              Chassis: {purchaseHistory.car.chassis_no_full || purchaseHistory.car.chassis_no_masked}
            </div>
          )}
        </div>
      </div>

      {/* Purchase Date */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-700">
          {formatDate(purchaseHistory.purchase_date)}
        </span>
      </div>

      {/* Purchase Amount */}
      <div className="col-span-2 flex items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
          {formatCurrency(purchaseHistory.purchase_amount)}
        </span>
      </div>

      {/* LC Number */}
      <div className="col-span-2 flex items-center">
        {purchaseHistory.lc_number ? (
          <span className="text-sm font-mono text-gray-700">
            {purchaseHistory.lc_number}
          </span>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        )}
      </div>

      {/* LC Bank */}
      <div className="col-span-1 flex items-center">
        {purchaseHistory.lc_bank_name ? (
          <span className="text-sm text-gray-700 truncate">
            {purchaseHistory.lc_bank_name}
          </span>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        )}
      </div>

      {/* Actions */}
      <div
        className="col-span-2 flex items-center justify-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {onView && (
          <button
            onClick={() => onView(purchaseHistory)}
            className="p-2.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 group/btn"
            title="View Purchase History"
          >
            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
        <button
          onClick={() => onEdit(purchaseHistory)}
          className="p-2.5 text-amber-600 hover:text-amber-700 rounded-lg transition-all duration-200 group/btn"
          title="Edit Purchase History"
        >
          <Pencil className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => onDelete(purchaseHistory)}
          className="p-2.5 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 group/btn"
          title="Delete Purchase History"
        >
          <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseHistoryTableRow;
