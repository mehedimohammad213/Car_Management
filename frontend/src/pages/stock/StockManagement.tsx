"use client";

import React, { useState, useEffect, useMemo } from "react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import {
  StockHeader,
  StockFilters,
  StockTable,
  MessageDisplay,
  StockDrawer,
  StockDrawerForm,
} from "../../components/stock";
import Pagination from "../../components/car/Pagination";
import { InvoiceCreationModal } from "../../components/stock/InvoiceCreationModal";
import AvailableCarsTable from "../../components/stock/AvailableCarsTable";
import { useStockManagement } from "../../hooks/useStockManagement";
import { usePendingCarsFilters } from "../../hooks/usePendingCarsFilters";
import type { StockPageTab } from "../../components/stock/StockHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { stockApi, Stock } from "../../services/stockApi";
import { carApi } from "../../services/carApi";
import { getEffectiveStockStatus, isStockRowSold } from "../../utils/stockStatus";

const StockManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const allowedTabs: StockPageTab[] = ["before", "current", "available", "soldout"];
  const queryTab = searchParams.get("tab");
  const initialTab: StockPageTab =
    (queryTab && allowedTabs.includes(queryTab as StockPageTab) ? (queryTab as StockPageTab) : "before");

  const [activeTab, setActiveTab] = useState<StockPageTab>(initialTab);
  const [showPendingCarDeleteModal, setShowPendingCarDeleteModal] =
    useState(false);
  const [pendingCarToDelete, setPendingCarToDelete] = useState<{
    id: number;
    make?: string;
    model?: string;
  } | null>(null);
  const [isDeletingPendingCar, setIsDeletingPendingCar] = useState(false);

  const stockScope = activeTab === "soldout" ? "sold" : activeTab === "available" ? "available" : "all";

  const {
    stocks,
    allStocks,
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
    scopedStocks,
    statusTotals,
  } = useStockManagement(stockScope);

  const pendingFilters = usePendingCarsFilters(availableCars);

  const stockTabCounts = useMemo(
    () => ({
      pending: pendingFilters.sourceCount,
      current: allStocks.length,
      available: allStocks.filter((s) => getEffectiveStockStatus(s) === "available").length,
      soldout: allStocks.filter((s) => isStockRowSold(s)).length,
    }),
    [pendingFilters.sourceCount, allStocks]
  );

  useEffect(() => {
    fetchAvailableCars();
  }, [fetchAvailableCars]);

  useEffect(() => {
    if (activeTab === "before") {
      fetchAvailableCars();
    }
  }, [activeTab, fetchAvailableCars]);

  // Sync tab state from URL query param (`/admin/stock?tab=current|available|soldout|before`).
  useEffect(() => {
    const t = searchParams.get("tab") as StockPageTab | null;
    if (!t) return;
    if (!allowedTabs.includes(t)) return;
    setActiveTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleCreateStockFromCar = async (car: any) => {
    try {
      console.log("Creating stock from car:", car);
      const stockData = {
        car_id: car.id,
        quantity: 1,
        price: car.price_amount ? (typeof car.price_amount === "string" ? parseFloat(car.price_amount) : car.price_amount) : 0,
        status: "available" as const,
        notes: "",
      };

      console.log("Stock data to send:", stockData);
      const response = await stockApi.createStock(stockData);
      console.log("Create stock response:", response);

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

  const handleEditCar = (stock: Stock) => {
    if (stock.car?.id) {
      navigate(`/update-car/${stock.car.id}`, {
        state: { returnStockTab: activeTab },
      });
    }
  };

  const handleEditPendingCar = (car: { id: number }) => {
    navigate(`/update-car/${car.id}`, {
      state: { returnStockTab: "before" as const },
    });
  };

  const handleDeletePendingCar = (car: {
    id: number;
    make?: string;
    model?: string;
  }) => {
    setPendingCarToDelete(car);
    setShowPendingCarDeleteModal(true);
  };

  const confirmDeletePendingCar = async () => {
    if (!pendingCarToDelete) return;
    setIsDeletingPendingCar(true);
    try {
      await carApi.deleteCar(pendingCarToDelete.id);
      setShowPendingCarDeleteModal(false);
      setPendingCarToDelete(null);
      showMessage("success", "Car deleted successfully");
      await fetchAvailableCars();
      await fetchStocks();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to delete car";
      showMessage("error", msg);
    } finally {
      setIsDeletingPendingCar(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-4 pb-6">
        <StockHeader
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("tab", tab);
              return next;
            });
          }}
          tabCounts={stockTabCounts}
        />

        <MessageDisplay message={message} />

        {activeTab === "current" || activeTab === "available" || activeTab === "soldout" ? (
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
              isGeneratingPDF={
                activeTab === "current" ? isGeneratingPDF : false
              }
              onGeneratePDF={
                activeTab === "current" ? generatePDF : undefined
              }
              onCreateInvoice={() => setShowInvoiceModal(true)}
              onCreateStock={handleCreateStock}
              filterOptions={filterOptions}
            />

            <StockTable
              stocks={stocks}
              allStocks={scopedStocks}
              isLoading={isLoading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEditCar}
              onDelete={handleDeleteStock}
              onView={handleViewCar}
              onRefresh={fetchStocks}
              emptyStateVariant={activeTab === "soldout" ? "soldout" : "default"}
              showStatusGroups={activeTab === "current"}
              statusTotals={statusTotals}
              showDelete={activeTab !== "soldout" && activeTab !== "available"}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              perPage={perPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : activeTab === "before" ? (
          <>
            <StockFilters
              searchTerm={pendingFilters.searchTerm}
              onSearchChange={pendingFilters.setSearchTerm}
              onClearFilters={pendingFilters.handleClearFilters}
              yearFilter={pendingFilters.yearFilter}
              onYearFilterChange={pendingFilters.setYearFilter}
              makeFilter={pendingFilters.makeFilter}
              onMakeFilterChange={pendingFilters.setMakeFilter}
              modelFilter={pendingFilters.modelFilter}
              onModelFilterChange={pendingFilters.setModelFilter}
              colorFilter={pendingFilters.colorFilter}
              onColorFilterChange={pendingFilters.setColorFilter}
              fuelFilter={pendingFilters.fuelFilter}
              onFuelFilterChange={pendingFilters.setFuelFilter}
              isGeneratingPDF={false}
              filterOptions={pendingFilters.filterOptions}
              searchPlaceholder="Search pending cars by make, model, year, ref no, chassis…"
              onAddCar={() =>
                navigate("/create-car", {
                  state: { returnStockTab: "before" as const },
                })
              }
            />
            <AvailableCarsTable
              cars={pendingFilters.paginatedCars as any[]}
              filteredAllCars={pendingFilters.filteredAllCars as any[]}
              apiHasCars={
                !isLoadingAvailableCars && availableCars.length > 0
              }
              sourceCount={pendingFilters.sourceCount}
              isLoading={isLoadingAvailableCars}
              onCreateStock={handleCreateStockFromCar}
              onView={handleViewCar}
              onEdit={handleEditPendingCar}
              onDelete={handleDeletePendingCar}
              onRefresh={fetchAvailableCars}
            />
            <Pagination
              currentPage={pendingFilters.currentPage}
              totalPages={pendingFilters.totalPages}
              totalItems={pendingFilters.totalItems}
              perPage={pendingFilters.perPage}
              onPageChange={(page) => pendingFilters.setCurrentPage(page)}
            />
          </>
        ) : null}

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

        <DeleteConfirmationModal
          isOpen={showPendingCarDeleteModal}
          onClose={() => {
            setShowPendingCarDeleteModal(false);
            setPendingCarToDelete(null);
          }}
          onConfirm={confirmDeletePendingCar}
          title="Delete Car"
          message={
            pendingCarToDelete
              ? `Are you sure you want to delete ${[
                  pendingCarToDelete.make,
                  pendingCarToDelete.model,
                ]
                  .filter(Boolean)
                  .join(" ") || `car #${pendingCarToDelete.id}`}? This action cannot be undone.`
              : "Are you sure you want to delete this car? This action cannot be undone."
          }
          isLoading={isDeletingPendingCar}
        />

        {/* <InvoiceCreationModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          onCreateInvoice={handleCreateInvoice}
        /> */}
      </div>
    </div>
  );
};

export default StockManagement;
