"use client";

import React, { useState, useEffect } from "react";
import {
  stockApi,
  Stock,
  CreateStockData,
  UpdateStockData,
} from "../../services/stockApi";
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

const StockManagement: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success/Error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchStocks();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const response = await stockApi.getStocks({
        search: searchTerm || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: perPage,
        page: currentPage,
      });

      if (response.success && response.data) {
        console.log("Setting stocks:", response.data);
        console.log("Pagination data:", {
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total,
        });

        setStocks(response.data);
        if (response.current_page) {
          setTotalPages(response.last_page);
          setTotalItems(response.total);
        }
      } else {
        console.log("No stocks found, setting empty array");
        setStocks([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      showMessage("error", "Failed to fetch stocks");
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStock = () => {
    setSelectedStock(null);
    setDrawerMode("create");
    setShowDrawer(true);
  };

  const handleEditStock = (stock: Stock) => {
    setSelectedStock(stock);
    setDrawerMode("edit");
    setShowDrawer(true);
  };

  const handleDeleteStock = (stock: Stock) => {
    setStockToDelete(stock);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!stockToDelete) return;

    setIsDeleting(true);
    try {
      await stockApi.deleteStock(stockToDelete.id);
      setStocks(stocks.filter((stock) => stock.id !== stockToDelete.id));
      setShowDeleteModal(false);
      setStockToDelete(null);
      showMessage("success", "Stock deleted successfully");
    } catch (error) {
      console.error("Error deleting stock:", error);
      showMessage("error", "Failed to delete stock");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrawerSubmit = async (
    data: CreateStockData | UpdateStockData
  ) => {
    try {
      if (selectedStock) {
        const response = await stockApi.updateStock(
          selectedStock.id,
          data as UpdateStockData
        );
        if (response.success) {
          showMessage("success", "Stock updated successfully");
          setShowDrawer(false);
          setSelectedStock(null);
          fetchStocks();
        } else {
          showMessage("error", response.message || "Failed to update stock");
        }
      } else {
        const response = await stockApi.createStock(data as CreateStockData);
        if (response.success) {
          showMessage("success", "Stock created successfully");
          setShowDrawer(false);
          setSelectedStock(null);
          fetchStocks();
        } else {
          showMessage("error", response.message || "Failed to create stock");
        }
      }
    } catch (error: any) {
      console.error("Error saving stock:", error);
      const errorMessage =
        error.message ||
        (selectedStock ? "Failed to update stock" : "Failed to create stock");
      showMessage("error", errorMessage);
    }
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setSelectedStock(null);
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
        <StockHeader onCreateStock={handleCreateStock} />

        <MessageDisplay message={message} />

        <StockFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={handleClearFilters}
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
          onPageChange={(page) => {
            console.log("Page changed to:", page);
            setCurrentPage(page);
          }}
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
      </div>
    </div>
  );
};

export default StockManagement;
