import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Download,
  ShoppingBag,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Star,
  Award,
  Shield,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { orderApi, Order } from "../services/orderApi";
import { InvoiceService } from "../services/invoiceService";
import { toast } from "react-toastify";

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getUserOrders();
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

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await orderApi.cancelOrder(orderId);
      if (response.success) {
        toast.success("Order canceled successfully");
        loadOrders();
        setSelectedOrder(null);
        setShowCancelPopup(false);
        setOrderToCancel(null);
      } else {
        toast.error(response.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const openCancelPopup = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    setShowCancelPopup(false);
    setOrderToCancel(null);
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
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "canceled":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.items.some((item) =>
        `${item.car.make} ${item.car.model}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "total_amount":
        aValue = a.total_amount;
        bValue = b.total_amount;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "created_at":
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ShoppingBag className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Discover our premium collection
              of vehicles and start your journey with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cars"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Cars
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
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
              📦 My Orders
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Track and manage your vehicle orders
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, vehicles..."
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

          {/* Clear Filters */}
          <button
            onClick={() => {
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
        {sortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {statusFilter === "all"
                ? "No orders match your search criteria."
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
                    <th
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Order ID {getSortIcon("id")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Items</th>
                    <th
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort("total_amount")}
                    >
                      <div className="flex items-center">
                        Total Amount {getSortIcon("total_amount")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Date {getSortIcon("created_at")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        #{order.id}
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
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {(order.status === "approved" ||
                            order.status === "shipped" ||
                            order.status === "delivered") && (
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Download Invoice"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {sortedOrders.map((order) => (
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
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {(order.status === "approved" ||
                        order.status === "shipped" ||
                        order.status === "delivered") && (
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Professional Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Order #{selectedOrder.id}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {formatDate(selectedOrder.created_at)} •{" "}
                      {selectedOrder.items.length} item
                      {selectedOrder.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="p-6 space-y-6">
                {/* Order Status & Quick Actions */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(selectedOrder.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order Status
                          </h3>
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status.charAt(0).toUpperCase() +
                              selectedOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${selectedOrder.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Order Items
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {selectedOrder.items.map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                            >
                              <div className="relative">
                                <img
                                  src={
                                    item.car.image_url || "/placeholder-car.jpg"
                                  }
                                  alt={`${item.car.make} ${item.car.model}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                  {item.car.make} {item.car.model}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Year: {item.car.year} • Model:{" "}
                                  {item.car.model}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Unit Price:{" "}
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      ${item.price.toLocaleString()}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                  $
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Subtotal
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline & Actions */}
                  <div className="space-y-6">
                    {/* Order Timeline */}
                    <div className="bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Order Timeline
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Order Placed
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(selectedOrder.created_at)}
                              </p>
                            </div>
                          </div>
                          {selectedOrder.status === "approved" && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Order Approved
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Processing your order
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedOrder.status === "shipped" && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Order Shipped
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  On its way to you
                                </p>
                              </div>
                            </div>
                          )}
                          {selectedOrder.status === "delivered" && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Order Delivered
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Successfully delivered
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-500">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Quick Actions
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        {(selectedOrder.status === "approved" ||
                          selectedOrder.status === "shipped" ||
                          selectedOrder.status === "delivered") && (
                          <button
                            onClick={() => handleDownloadInvoice(selectedOrder)}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
                          >
                            <Download className="w-5 h-5" />
                            Download Invoice
                          </button>
                        )}
                        {selectedOrder.status === "pending" && (
                          <button
                            onClick={() => openCancelPopup(selectedOrder)}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                          >
                            <XCircle className="w-5 h-5" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Popup */}
      {showCancelPopup && orderToCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Cancel Order</h2>
                  <p className="text-red-100 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to cancel this order?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{orderToCancel.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {orderToCancel.items.length} item
                        {orderToCancel.items.length !== 1 ? "s" : ""} • $
                        {orderToCancel.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      • Order placed on {formatDate(orderToCancel.created_at)}
                    </p>
                    <p>
                      • Status:{" "}
                      <span className="capitalize font-medium">
                        {orderToCancel.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeCancelPopup}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-medium"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleCancelOrder(orderToCancel.id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
