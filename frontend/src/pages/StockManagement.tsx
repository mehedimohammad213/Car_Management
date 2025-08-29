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
} from "lucide-react";
import { Car } from "../types";
import { mockApi } from "../services/mockData";

interface StockItem {
  id: string;
  car: Car;
  currentQuantity: number;
  availableStock: number;
  reservedStock: number;
  lastUpdated: string;
}

interface StockHistory {
  id: string;
  carId: string;
  type: "in" | "out";
  quantity: number;
  date: string;
  notes?: string;
}

const StockManagement: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const cars = await mockApi.getCars();
      const stockData: StockItem[] = cars.map((car) => ({
        id: car.id,
        car,
        currentQuantity: car.stock,
        availableStock: car.stock - Math.floor(car.stock * 0.1), // 10% reserved
        reservedStock: Math.floor(car.stock * 0.1),
        lastUpdated: new Date().toISOString(),
      }));
      setStockItems(stockData);

      // Mock stock history
      const history: StockHistory[] = stockData
        .slice(0, 5)
        .map((item, index) => ({
          id: `history-${index}`,
          carId: item.car.id,
          type: index % 2 === 0 ? "in" : "out",
          quantity: Math.floor(Math.random() * 10) + 1,
          date: new Date(
            Date.now() - index * 24 * 60 * 60 * 1000
          ).toISOString(),
          notes: index % 2 === 0 ? "Stock replenishment" : "Sale transaction",
        }));
      setStockHistory(history);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStockItems = stockItems.filter((item) => {
    const matchesSearch =
      item.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !filterBrand || item.car.brand === filterBrand;
    const matchesCategory =
      !filterCategory || item.car.category === filterCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleExportCSV = () => {
    const csvContent = [
      [
        "Car Model",
        "Brand",
        "Category",
        "Current Stock",
        "Available",
        "Reserved",
        "Last Updated",
      ],
      ...filteredStockItems.map((item) => [
        item.car.model,
        item.car.brand,
        item.car.category,
        item.currentQuantity.toString(),
        item.availableStock.toString(),
        item.reservedStock.toString(),
        new Date(item.lastUpdated).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStockStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage < 20)
      return { color: "text-red-600", bg: "bg-red-100", text: "Low Stock" };
    if (percentage < 50)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: "Medium Stock",
      };
    return { color: "text-green-600", bg: "bg-green-100", text: "Good Stock" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>

        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddStockModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Stock
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand
            </label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Brands</option>
              {Array.from(
                new Set(stockItems.map((item) => item.car.brand))
              ).map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {Array.from(
                new Set(stockItems.map((item) => item.car.category))
              ).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterBrand("");
                setFilterCategory("");
              }}
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reserved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStockItems.map((item) => {
                const status = getStockStatus(
                  item.availableStock,
                  item.currentQuantity
                );
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={item.car.image}
                          alt={item.car.model}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.car.model}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.car.brand} • {item.car.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.currentQuantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.availableStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.reservedStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCar(item.car);
                            setShowHistoryModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View History"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCar(item.car);
                            setShowAddStockModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Add Stock"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Stock
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Car
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">Select a car</option>
                  {stockItems.map((item) => (
                    <option key={item.car.id} value={item.car.id}>
                      {item.car.brand} {item.car.model} ({item.car.year})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Optional notes about this stock addition"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {showHistoryModal && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Stock History - {selectedCar.brand} {selectedCar.model}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {stockHistory
                .filter((history) => history.carId === selectedCar.id)
                .map((history) => (
                  <div
                    key={history.id}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        history.type === "in"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                      }`}
                    >
                      {history.type === "in" ? (
                        <TrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <TrendingDownIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {history.type === "in"
                          ? "Stock Added"
                          : "Stock Removed"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {history.quantity} •{" "}
                        {new Date(history.date).toLocaleDateString()}
                      </div>
                      {history.notes && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {history.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
