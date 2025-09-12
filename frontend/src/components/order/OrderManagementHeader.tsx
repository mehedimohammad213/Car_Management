import React from "react";

interface OrderManagementHeaderProps {
  onCreateOrder?: () => void;
}

export const OrderManagementHeader: React.FC<OrderManagementHeaderProps> = ({
  onCreateOrder,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Order Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Monitor and manage all customer orders
          </p>
        </div>
        {onCreateOrder && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onCreateOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>Add Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
