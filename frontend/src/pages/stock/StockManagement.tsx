"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const generatePDF = async () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      console.log("Generating PDF... Fetching all stocks...");

      // Fetch all stocks with current filters (no pagination)
      const response = await stockApi.getStocks({
        search: searchTerm || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 10000, // Large number to get all stocks
        page: 1,
      });

      let allStocks: Stock[] = [];

      if (response.success && response.data) {
        allStocks = response.data;

        // If there are more pages, fetch them all
        const totalPages = response.last_page || 1;
        if (totalPages > 1) {
          console.log(`Fetching ${totalPages - 1} additional pages...`);
          const additionalPages = [];
          for (let page = 2; page <= totalPages; page++) {
            additionalPages.push(
              stockApi.getStocks({
                search: searchTerm || undefined,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: 10000,
                page: page,
              })
            );
          }
          const additionalResponses = await Promise.all(additionalPages);
          additionalResponses.forEach((resp) => {
            if (resp.success && resp.data) {
              allStocks = [...allStocks, ...resp.data];
            }
          });
        }
      } else {
        console.error("Failed to fetch stocks for PDF:", response);
        alert("Failed to fetch stock data. Please try again.");
        setIsGeneratingPDF(false);
        return;
      }

      if (allStocks.length === 0) {
        alert("No stocks to export. Please ensure some stocks are available.");
        setIsGeneratingPDF(false);
        return;
      }

      console.log(`Generating PDF with ${allStocks.length} stocks`);

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Stock Management Report", 14, 22);

      // Add date and total count
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Stocks: ${allStocks.length}`, 14, 36);

      // Prepare table data
      const tableColumns = [
        "Car Information",
        "Quantity",
        "Status",
        "Mileage",
        "Engine",
        "Color",
        "Grade",
        "Price",
      ];

      const tableData = allStocks.map((stock) => {
        try {
          const car = stock.car;
          if (!car) {
            return [
              "N/A",
              stock.quantity.toString(),
              stock.status,
              "N/A",
              "N/A",
              "N/A",
              "N/A",
              "N/A",
            ];
          }

          const carInfo = `${car.year || "N/A"} ${car.make || "N/A"} ${car.model || "N/A"}${car.variant ? ` - ${car.variant}` : ""}\nRef: ${car.ref_no || "N/A"}\nChassis: ${car.chassis_no_full || car.chassis_no_masked || "N/A"}`;

          const grade = [];
          if (car.grade_overall) grade.push(`Overall: ${car.grade_overall}`);
          if (car.grade_exterior) grade.push(`Ext: ${car.grade_exterior}`);
          if (car.grade_interior) grade.push(`Int: ${car.grade_interior}`);

          return [
            carInfo,
            stock.quantity.toString(),
            stock.status.charAt(0).toUpperCase() + stock.status.slice(1),
            car.mileage_km ? `${car.mileage_km.toLocaleString()} km` : "N/A",
            car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : "N/A",
            car.color || "N/A",
            grade.length > 0 ? grade.join(", ") : "N/A",
            car.price_amount
              ? `BDT ${typeof car.price_amount === "string" ? parseFloat(car.price_amount).toLocaleString() : car.price_amount.toLocaleString()}`
              : "Price on request",
          ];
        } catch (error) {
          console.error("Error processing stock data:", error, stock);
          return [
            "Error",
            stock.quantity.toString(),
            stock.status,
            "Error",
            "Error",
            "Error",
            "Error",
            "Error",
          ];
        }
      });

      // Add table
      try {
        autoTable(doc, {
          head: [tableColumns],
          body: tableData,
          startY: 45,
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 20 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 25 },
            5: { cellWidth: 20 },
            6: { cellWidth: 30 },
            7: { cellWidth: 30 },
          },
          didDrawPage: function (data: any) {
            // Add page numbers
            const pageCount = doc.getNumberOfPages();
            const currentPage = data.pageNumber;
            doc.setFontSize(8);
            doc.text(
              `Page ${currentPage} of ${pageCount}`,
              14,
              doc.internal.pageSize.height - 10
            );
          },
        });
      } catch (tableError) {
        console.error("Error creating table:", tableError);
        // Fallback: Add simple text list
        let yPosition = 40;
        doc.setFontSize(10);
        tableData.forEach((row, index) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${index + 1}. ${row[0]}`, 14, yPosition);
          yPosition += 10;
        });
      }

      // Save the PDF
      doc.save(`stock-report-${new Date().toISOString().split("T")[0]}.pdf`);
      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
        <StockHeader
          onCreateStock={handleCreateStock}
          onGeneratePDF={generatePDF}
          isGeneratingPDF={isGeneratingPDF}
        />

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
