import React from "react";
import { Calendar, Car, FileText, Building2 } from "lucide-react";
import { PurchaseHistory } from "../../services/purchaseHistoryApi";
import { CurrencyBDTIcon } from "../icons/CurrencyBDTIcon";
import PurchaseHistoryTableRow from "./PurchaseHistoryTableRow";

interface PurchaseHistoryTableProps {
  purchaseHistories: PurchaseHistory[];
  isLoading: boolean;
  onEdit: (purchaseHistory: PurchaseHistory) => void;
  onDelete: (purchaseHistory: PurchaseHistory) => void;
  onView?: (purchaseHistory: PurchaseHistory) => void;
  onRefresh: () => void;
}

const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({
  purchaseHistories,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading purchase histories...</span>
          </div>
        </div>
      </div>
    );
  }

  if (purchaseHistories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No purchase histories found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            {isLoading
              ? "Loading..."
              : "Try refreshing the page or check your connection"}
          </p>
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors font-medium text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Professional Table Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
            <div className="grid grid-cols-12 gap-4 p-5 text-sm font-bold text-white uppercase tracking-wider">
              <div className="col-span-3 flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>Car Details</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Purchase Date</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <CurrencyBDTIcon className="w-4 h-4" />
                <span>Amount</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>LC Number</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>LC Bank</span>
              </div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body with Enhanced Styling */}
          <div className="divide-y divide-gray-100 bg-gray-50/30">
            {purchaseHistories.map((purchaseHistory) => (
              <PurchaseHistoryTableRow
                key={purchaseHistory.id}
                purchaseHistory={purchaseHistory}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryTable;
