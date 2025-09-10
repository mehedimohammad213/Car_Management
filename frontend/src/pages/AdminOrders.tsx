import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  X,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Trash2,
  Edit,
  Download,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Users,
  ShoppingBag,
} from "lucide-react";
import { orderApi, Order } from "../services/orderApi";
import { InvoiceService } from "../services/invoiceService";
import { toast } from "react-toastify";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      if (response.success) {
        setOrders(response.data?.orders || []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await orderApi.updateOrderStatus(orderId, {
        status: newStatus as any,
      });
      if (response.success) {
        toast.success("Order status updated successfully");
        loadOrders();
        setSelectedOrder(null);
      } else {
        toast.error(response.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await orderApi.deleteOrder(orderId);
      if (response.success) {
        toast.success("Order deleted successfully");
        loadOrders();
        setSelectedOrder(null);
      } else {
        toast.error(response.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    try {
      InvoiceService.generateInvoice(order);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter) {
      const orderDate = new Date(order.created_at);
      const filterDate = new Date(dateFilter);
      matchesDate = orderDate.toDateString() === filterDate.toDateString();
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              📦 Order Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Monitor and manage all customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base"
          />

          {/* Clear Filters */}
          <button
            onClick={() => {
              setDateFilter("");
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium touch-manipulation text-base"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {statusFilter === "all"
                ? "No orders have been placed yet. Orders will appear here once customers start making purchases."
                : `No orders with status "${statusFilter}" found. Try adjusting your filters.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Items</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Total Amount
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.user?.name || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
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
                                src={
                                  item.car.image_url || "/placeholder-car.jpg"
                                }
                                alt={`${item.car.make} ${item.car.model}`}
                                className="w-12 h-8 object-cover rounded border"
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {item.car.make} {item.car.model}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ${order.total_amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
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
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
            <div className="lg:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.name || "Unknown User"} •{" "}
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
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
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.car.make} {item.car.model}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} • $
                            {item.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total: ${order.total_amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order #{selectedOrder.id}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <div className="p-6 space-y-8">
                {/* Order Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Name
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedOrder.user?.name || "Unknown User"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {selectedOrder.user?.email || "No email provided"}
                          </p>
                        </div>
                        {selectedOrder.shipping_address && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Shipping Address
                            </p>
                            <p className="text-gray-900 dark:text-white">
                              {selectedOrder.shipping_address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Order Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Status
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              selectedOrder.status
                            )}`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(selectedOrder.status)}
                              <span className="capitalize">
                                {selectedOrder.status}
                              </span>
                            </div>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total Amount
                          </span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ${selectedOrder.total_amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Items
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedOrder.items.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Update Order Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      "pending",
                      "approved",
                      "shipped",
                      "delivered",
                      "canceled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleUpdateStatus(selectedOrder.id, status)
                        }
                        disabled={
                          isUpdatingStatus || selectedOrder.status === status
                        }
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedOrder.status === status
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize">{status}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <img
                          src={item.car.image_url || "/placeholder-car.jpg"}
                          alt={`${item.car.make} ${item.car.model}`}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {item.car.make} {item.car.model}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Year: {item.car.year}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Quantity:{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              Price:{" "}
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${item.price.toLocaleString()}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Invoice</span>
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
