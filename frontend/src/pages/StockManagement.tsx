"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  DownloadIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  PackageIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  XIcon,
  FilterIcon,
  SearchIcon,
  BarChart3Icon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  HashIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  stockApi,
  Stock,
  StockStatistics,
  CreateStockData,
  UpdateStockData,
} from "../services/stockApi";

const StockManagement: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [statistics, setStatistics] = useState<StockStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    min_price: undefined as number | undefined,
    max_price: undefined as number | undefined,
    min_quantity: undefined as number | undefined,
    max_quantity: undefined as number | undefined,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStocks, setSelectedStocks] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("available");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    show: boolean;
  } | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateStockData>({
    car_id: 0,
    quantity: 1,
    price: 0,
    status: "available",
    notes: "",
  });

  useEffect(() => {
    fetchStocks();
    fetchStatistics();
    fetchAvailableCars();
  }, [currentPage, sortBy, sortOrder, filters]);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const response = await stockApi.getStocks({
        ...filters,
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 15,
      });

      if (response.success) {
        setStocks(response.data);
        setTotalPages(response.last_page);
        setCurrentPage(response.current_page);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      setIsLoadingStats(true);
      const response = await stockApi.getStockStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchAvailableCars = async () => {
    try {
      const response = await stockApi.getAvailableCars();
      if (response.success) {
        setAvailableCars(response.data);
      }
    } catch (error) {
      console.error("Error fetching available cars:", error);
    }
  };

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await stockApi.createStock(formData);
      if (response.success) {
        setShowAddStockModal(false);
        setFormData({
          car_id: 0,
          quantity: 1,
          price: 0,
          status: "available",
          notes: "",
        });
        fetchStocks();
        fetchStatistics();
        fetchAvailableCars();
        setNotification({
          type: "success",
          message: "Stock created successfully!",
          show: true,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error: any) {
      console.error("Error creating stock:", error);
      setNotification({
        type: "error",
        message: error.message || "Failed to create stock",
        show: true,
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    try {
      const response = await stockApi.updateStock(selectedStock.id, formData);
      if (response.success) {
        setShowEditStockModal(false);
        setSelectedStock(null);
        setFormData({
          car_id: 0,
          quantity: 1,
          price: 0,
          status: "available",
          notes: "",
        });
        fetchStocks();
        fetchStatistics();
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDeleteStock = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        await stockApi.deleteStock(id);
        fetchStocks();
        fetchStatistics();
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };

  const handleBulkUpdateStatus = async () => {
    if (selectedStocks.length === 0) return;

    try {
      await stockApi.bulkUpdateStatus({
        stock_ids: selectedStocks,
        status: bulkStatus as any,
      });
      setShowBulkUpdateModal(false);
      setSelectedStocks([]);
      setBulkStatus("available");
      fetchStocks();
      fetchStatistics();
    } catch (error) {
      console.error("Error bulk updating status:", error);
    }
  };

  const openEditModal = (stock: Stock) => {
    setSelectedStock(stock);
    setFormData({
      car_id: stock.car_id,
      quantity: stock.quantity,
      price: stock.price || 0,
      status: stock.status,
      notes: stock.notes || "",
    });
    setShowEditStockModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-emerald-100 text-emerald-800 border-emerald-200",
      sold: "bg-blue-100 text-blue-800 border-blue-200",
      reserved: "bg-amber-100 text-amber-800 border-amber-200",
      damaged: "bg-orange-100 text-orange-800 border-orange-200",
      lost: "bg-gray-100 text-gray-800 border-gray-200",
      stolen: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      available: <CheckCircleIcon className="w-4 h-4" />,
      sold: <DollarSignIcon className="w-4 h-4" />,
      reserved: <ClockIcon className="w-4 h-4" />,
      damaged: <AlertTriangleIcon className="w-4 h-4" />,
      lost: <PackageIcon className="w-4 h-4" />,
      stolen: <AlertTriangleIcon className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || icons.available;
  };

  const filteredStocks = stocks.filter((stock) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const car = stock.car;
      if (!car) return false;

      return (
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        (car.ref_no && car.ref_no.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-purple-500 to-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Stock Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your vehicle inventory, track stock levels, and monitor
          availability
        </p>
      </div>

      {/* Header with Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Stocks</p>
              <p className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="animate-pulse bg-blue-400 h-8 w-16 rounded"></div>
                ) : (
                  statistics?.total_stocks || 0
                )}
              </p>
            </div>
            <PackageIcon className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Total Quantity
              </p>
              <p className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="animate-pulse bg-emerald-400 h-8 w-16 rounded"></div>
                ) : (
                  statistics?.total_quantity || 0
                )}
              </p>
            </div>
            <HashIcon className="w-8 h-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Value</p>
              <p className="text-3xl font-bold">
                {isLoadingStats ? (
                  <div className="animate-pulse bg-purple-400 h-8 w-16 rounded"></div>
                ) : (
                  `$${
                    statistics?.total_value
                      ? (statistics.total_value / 1000).toFixed(1) + "K"
                      : "0"
                  }`
                )}
              </p>
            </div>
            <DollarSignIcon className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold">
                {stocks.filter((s) => s.status === "available").length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
              <option value="stolen">Stolen</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created_at">Date</option>
              <option value="quantity">Quantity</option>
              <option value="price">Price</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddStockModal(true)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusIcon className="w-4 h-4 mr-2 inline" />
              Add Stock
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min price"
              value={filters.min_price || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  min_price: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max price"
              value={filters.max_price || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  max_price: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Quantity
            </label>
            <input
              type="number"
              placeholder="Min quantity"
              value={filters.min_quantity || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  min_quantity: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Quantity
            </label>
            <input
              type="number"
              placeholder="Max quantity"
              value={filters.max_quantity || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  max_quantity: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowBulkUpdateModal(true)}
            disabled={selectedStocks.length === 0}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Bulk Update ({selectedStocks.length})
          </button>

          <button
            onClick={fetchStocks}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2 inline" />
            Refresh
          </button>

          <button
            onClick={() => {
              setFilters({
                status: "",
                min_price: undefined,
                max_price: undefined,
                min_quantity: undefined,
                max_quantity: undefined,
              });
              setSearchTerm("");
              setSortBy("created_at");
              setSortOrder("desc");
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Status Distribution Chart */}
      {statistics && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Stock Status Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statistics.by_status.map((statusItem) => (
              <div key={statusItem.status} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 ${
                    statusItem.status === "available"
                      ? "bg-emerald-500"
                      : statusItem.status === "sold"
                      ? "bg-blue-500"
                      : statusItem.status === "reserved"
                      ? "bg-amber-500"
                      : statusItem.status === "damaged"
                      ? "bg-orange-500"
                      : statusItem.status === "lost"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                >
                  {statusItem.count}
                </div>
                <div className="text-sm font-medium text-gray-700 capitalize">
                  {statusItem.status}
                </div>
                <div className="text-xs text-gray-500">
                  {statusItem.count} items
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Stock Inventory
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {stocks.length} stocks found • Page {currentPage} of {totalPages}
          </p>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="animate-pulse bg-gray-200 rounded-lg h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStocks(stocks.map((s) => s.id));
                        } else {
                          setSelectedStocks([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Car Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks.map((stock) => (
                  <tr
                    key={stock.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStocks.includes(stock.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStocks([...selectedStocks, stock.id]);
                          } else {
                            setSelectedStocks(
                              selectedStocks.filter((id) => id !== stock.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {stock.car && (
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <PackageIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {stock.car.make} {stock.car.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.car.year} • {stock.car.ref_no || "N/A"}
                            </div>
                            {stock.car.category && (
                              <div className="text-xs text-gray-400">
                                {stock.car.category.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {stock.price
                          ? `$${stock.price.toLocaleString()}`
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          stock.status
                        )}`}
                      >
                        {getStatusIcon(stock.status)}
                        <span className="ml-1 capitalize">{stock.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(stock.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(stock)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Stock"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(stock.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Stock"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-semibold">Add New Stock</h3>
              <p className="text-blue-100 mt-1">
                Create a new stock entry for a car
              </p>
            </div>

            <form onSubmit={handleCreateStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Car *
                </label>
                <select
                  required
                  value={formData.car_id}
                  onChange={(e) =>
                    setFormData({ ...formData, car_id: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Choose a car</option>
                  {availableCars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.make} {car.model} ({car.year}) -{" "}
                      {car.ref_no || "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost</option>
                  <option value="stolen">Stolen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional notes about this stock..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Create Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {showEditStockModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-semibold">Edit Stock</h3>
              <p className="text-emerald-100 mt-1">Update stock information</p>
            </div>

            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost</option>
                  <option value="stolen">Stolen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Optional notes about this stock..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditStockModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-semibold">Bulk Update Status</h3>
              <p className="text-purple-100 mt-1">
                Update status for {selectedStocks.length} selected stocks
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status *
                </label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="damaged">Damaged</option>
                  <option value="lost">Lost</option>
                  <option value="stolen">Stolen</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkUpdateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpdateStatus}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Update {selectedStocks.length} Stocks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
