"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import {
  StockHeader,
  StockFilters,
  StockTable,
  StockPagination,
  MessageDisplay,
  StockDrawer,
  StockDrawerForm,
} from "../../components/stock";
import { InvoiceCreationModal } from "../../components/stock/InvoiceCreationModal";
import AvailableCarsTable from "../../components/stock/AvailableCarsTable";
import TotalStockTable from "../../components/stock/TotalStockTable";
import { useStockManagement } from "../../hooks/useStockManagement";
import { useNavigate } from "react-router-dom";
import { stockApi, Stock } from "../../services/stockApi";

const StockManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"current" | "before" | "total">("current");

  const {
    stocks,
    availableCars,
    isLoading,
    isLoadingAvailableCars,
    searchTerm,
    setSearchTerm,
    yearFilter,
    setYearFilter,
    makeFilter,
    setMakeFilter,
    modelFilter,
    setModelFilter,
    colorFilter,
    setColorFilter,
    fuelFilter,
    setFuelFilter,
    sortBy,
    sortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    perPage,
    filterOptions,
    isGeneratingPDF,
    showDrawer,
    setShowDrawer,
    drawerMode,
    setDrawerMode,
    selectedStock,
    setSelectedStock,
    showDeleteModal,
    isDeleting,
    setShowDeleteModal,
    showInvoiceModal,
    message,
    handleCreateStock,
    handleEditStock,
    handleDeleteStock,
    confirmDelete,
    handleDrawerSubmit,
    handleDrawerClose,
    handleSort,
    handleClearFilters,
    generatePDF,
    handleCreateInvoice,
    setShowInvoiceModal,
    fetchStocks,
    fetchAvailableCars,
    showMessage,
  } = useStockManagement();

  useEffect(() => {
    if (activeTab === "before") {
      fetchAvailableCars();
    }
  }, [activeTab, fetchAvailableCars]);

  const handleCreateStockFromCar = async (car: any) => {
    try {
      const stockData = {
        car_id: car.id,
        quantity: 1,
        price: car.price_amount ? (typeof car.price_amount === "string" ? parseFloat(car.price_amount) : car.price_amount) : 0,
        status: "available" as const,
        notes: "",
      };

      const response = await stockApi.createStock(stockData);

      if (response.success) {
        showMessage("success", "Stock added successfully");
        fetchStocks();
        fetchAvailableCars();
      } else {
        showMessage("error", response.message || "Failed to add stock");
      }
    } catch (error: any) {
      console.error("Error creating stock:", error);
      showMessage("error", error?.message || "Failed to add stock");
    }
  };

  const handleViewCar = (item: Stock | any) => {
    // For Stock items, the car data is nested in 'car' property
    // For AvailableCar items, the item itself is the car
    const carId = item.car ? item.car.id : item.id;
    navigate(`/car-view/${carId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
        <StockHeader onCreateInvoice={() => setShowInvoiceModal(true)} />

        <MessageDisplay message={message} />

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === "current"
                ? "bg-blue-600 text-white border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <span className="hidden sm:inline">Current Stock</span>
              <span className="sm:hidden">Current Stock</span>
            </button>
            <button
              onClick={() => setActiveTab("before")}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === "before"
                ? "bg-green-600 text-white border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <span className="hidden sm:inline">Available Cars</span>
              <span className="sm:hidden">Available Cars</span>
            </button>
            <button
              onClick={() => setActiveTab("total")}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === "total"
                ? "bg-purple-600 text-white border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <span className="hidden sm:inline">Total Stock</span>
              <span className="sm:hidden">Total Stock</span>
            </button>
          </div>
        </div>

        {activeTab === "current" ? (
          <>
            <StockFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClearFilters={handleClearFilters}
              yearFilter={yearFilter}
              onYearFilterChange={setYearFilter}
              makeFilter={makeFilter}
              onMakeFilterChange={setMakeFilter}
              modelFilter={modelFilter}
              onModelFilterChange={setModelFilter}
              colorFilter={colorFilter}
              onColorFilterChange={setColorFilter}
              fuelFilter={fuelFilter}
              onFuelFilterChange={setFuelFilter}
              isGeneratingPDF={isGeneratingPDF}
              onGeneratePDF={generatePDF}
              onCreateInvoice={() => setShowInvoiceModal(true)}
              onCreateStock={handleCreateStock}
              filterOptions={filterOptions}
            />

            <StockTable
              stocks={stocks}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEditStock}
              onDelete={handleDeleteStock}
              onView={handleViewCar}
              onRefresh={fetchStocks}
            />

            <StockPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              perPage={perPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : activeTab === "before" ? (
          <AvailableCarsTable
            cars={availableCars}
            isLoading={isLoadingAvailableCars}
            onCreateStock={handleCreateStockFromCar}
            onView={handleViewCar}
            onRefresh={fetchAvailableCars}
          />
        ) : (
          <TotalStockTable />
        )}

        {/* Add Stock Popup - Commented out */}
        {/* <StockDrawer
          isOpen={showDrawer}
          onClose={handleDrawerClose}
          title={drawerMode === "create" ? "Create New Stock" : "Edit Stock"}
          size="md"
          showActions={false}
        >
          <StockDrawerForm
            stock={selectedStock}
            onSubmit={handleDrawerSubmit}
            onCancel={handleDrawerClose}
            isLoading={false}
            onError={(error) => showMessage("error", error)}
          />
        </StockDrawer> */}

        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Stock"
          message={`Are you sure you want to delete this stock item? This action cannot be undone.`}
          isLoading={isDeleting}
        />

        <InvoiceCreationModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          onCreateInvoice={handleCreateInvoice}
        />
      </div>
    </div>
  );
};

export default StockManagement;
