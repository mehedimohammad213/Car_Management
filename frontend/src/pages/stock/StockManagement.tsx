"use client";

import React from "react";
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
import { useStockManagement } from "../../hooks/useStockManagement";

const StockManagement: React.FC = () => {
  const {
    stocks,
    isLoading,
    searchTerm,
    setSearchTerm,
    yearFilter,
    setYearFilter,
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
    drawerMode,
    selectedStock,
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
    showMessage,
  } = useStockManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
        <StockHeader onCreateInvoice={() => setShowInvoiceModal(true)} />

        <MessageDisplay message={message} />

        <StockFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={handleClearFilters}
          yearFilter={yearFilter}
          onYearFilterChange={setYearFilter}
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
          onRefresh={fetchStocks}
        />

        <StockPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={perPage}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <StockDrawer
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
        </StockDrawer>

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
