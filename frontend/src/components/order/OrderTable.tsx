import React from "react";
import { Package, User, Eye, Download, Trash2 } from "lucide-react";
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
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Order ID</th>
              <th className="px-6 py-4 text-left font-semibold">Customer</th>
              <th className="px-6 py-4 text-left font-semibold">Items</th>
              <th className="px-6 py-4 text-left font-semibold">
                Total Amount
              </th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {order.user_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={item.car.image_url || "/placeholder-car.jpg"}
                          alt={`${item.car.make} ${item.car.model}`}
                          className="w-12 h-8 object-cover rounded border"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.car.make} {item.car.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${order.total_amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onView(order)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {(order.status === "approved" ||
                      order.status === "shipped" ||
                      order.status === "delivered") && (
                      <button
                        onClick={() => onDownloadInvoice(order)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(order)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  Order #{order.id}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {order.user?.name || "Unknown User"} • $
                {order.total_amount.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(order)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  View
                </button>
                {(order.status === "approved" ||
                  order.status === "shipped" ||
                  order.status === "delivered") && (
                  <button
                    onClick={() => onDownloadInvoice(order)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Invoice
                  </button>
                )}
                <button
                  onClick={() => onDelete(order)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
