import React from "react";
import { Package, User, Eye, Download, Trash2, ShoppingCart, Calendar, DollarSign, Tag } from "lucide-react";
import { Order } from "../../services/orderApi";

interface OrderTableProps {
  orders: Order[];
  isLoading: boolean;
  onView: (order: Order) => void;
  onDownloadInvoice: (order: Order) => void;
  onDelete: (order: Order) => void;
  onRefresh: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  formatDate: (dateString: string) => string;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  isLoading,
  onView,
  onDownloadInvoice,
  onDelete,
  onRefresh,
  getStatusColor,
  getStatusIcon,
  formatDate,
}) => {
  const handleRowClick = (order: Order) => {
    onView(order);
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-12 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-4">
            No orders have been placed yet. Orders will appear here once
            customers start making purchases.
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
              <div className="col-span-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Order ID</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Customer</span>
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Items</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Amount</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Status</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body with Enhanced Styling */}
          <div className="divide-y divide-gray-100 bg-gray-50/30">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleRowClick(order)}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-blue-500"
              >
                {/* Order ID */}
                <div className="col-span-1 flex items-center">
                  <span className="text-sm font-semibold text-gray-900">
                    #{order.id}
                  </span>
                </div>

                {/* Customer */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {order.user?.name || "Unknown User"}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ID: {order.user_id}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="col-span-4 flex items-center">
                  <div className="flex flex-wrap gap-2 max-w-full">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                      >
                        {item.car.image_url ? (
                          <img
                            src={item.car.image_url}
                            alt={`${item.car.make} ${item.car.model}`}
                            className="w-12 h-8 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-900 truncate">
                            {item.car.make} {item.car.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Amount */}
                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(order.total_amount)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1 flex items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-1 flex items-center">
                  <span className="text-xs font-medium text-gray-600">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                {/* Actions */}
                <div
                  className="col-span-2 flex items-center justify-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onView(order)}
                    className="p-2.5 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 group/btn"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  {(order.status === "approved" ||
                    order.status === "shipped" ||
                    order.status === "delivered") && (
                    <button
                      onClick={() => onDownloadInvoice(order)}
                      className="p-2.5 text-green-600 hover:text-green-700 rounded-lg transition-all duration-200 group/btn"
                      title="Download Invoice"
                    >
                      <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(order)}
                    className="p-2.5 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 group/btn"
                    title="Delete Order"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
