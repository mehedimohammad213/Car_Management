import React from "react";
import { Package } from "lucide-react";

interface OrderManagementHeaderProps {
  onCreateOrder?: () => void;
}

export const OrderManagementHeader: React.FC<OrderManagementHeaderProps> = ({
  onCreateOrder,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary-600" />
            Order Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all customer orders
          </p>
        </div>
        {onCreateOrder && (
          <button
            onClick={onCreateOrder}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <span>Add Order</span>
          </button>
        )}
      </div>
    </div>
  );
};
