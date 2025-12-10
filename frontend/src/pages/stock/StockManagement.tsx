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
import { InvoiceCreationModal } from "../../components/stock/InvoiceCreationModal";

const StockManagement: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [allStocks, setAllStocks] = useState<Stock[]>([]); // For filtering
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    years?: number[];
    colors?: string[];
    fuels?: string[];
  }>({});

  // Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Success/Error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchStocks();
  }, [sortBy, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, colorFilter, fuelFilter]);

  // Filter stocks on frontend for car properties
  useEffect(() => {
    if (allStocks.length === 0) {
      setStocks([]);
      setTotalPages(1);
      setTotalItems(0);
      return;
    }

    let filtered = [...allStocks];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((stock) => {
        const car = stock.car;
        if (!car) return false;
        return (
          car.make?.toLowerCase().includes(searchLower) ||
          car.model?.toLowerCase().includes(searchLower) ||
          car.year?.toString().includes(searchLower) ||
          car.chassis_no_full?.toLowerCase().includes(searchLower) ||
          car.chassis_no_masked?.toLowerCase().includes(searchLower) ||
          car.ref_no?.toLowerCase().includes(searchLower) ||
          car.variant?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by year
    if (yearFilter) {
      filtered = filtered.filter(
        (stock) => stock.car?.year?.toString() === yearFilter
      );
    }

    // Filter by color
    if (colorFilter) {
      filtered = filtered.filter(
        (stock) => stock.car?.color?.toLowerCase() === colorFilter.toLowerCase()
      );
    }

    // Filter by fuel
    if (fuelFilter) {
      filtered = filtered.filter(
        (stock) => stock.car?.fuel?.toLowerCase() === fuelFilter.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortBy === "created_at") {
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
        } else if (sortBy.startsWith("car.")) {
          const field = sortBy.replace("car.", "");
          aValue = (a.car as any)?.[field];
          bValue = (b.car as any)?.[field];
        } else {
          aValue = (a as any)[sortBy];
          bValue = (b as any)[sortBy];
        }

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedStocks = filtered.slice(startIndex, endIndex);

    setStocks(paginatedStocks);
    setTotalPages(Math.ceil(filtered.length / perPage));
    setTotalItems(filtered.length);

    // Extract filter options from all stocks
    const years = new Set<number>();
    const colors = new Set<string>();
    const fuels = new Set<string>();

    allStocks.forEach((stock) => {
      if (stock.car?.year) years.add(stock.car.year);
      if (stock.car?.color) colors.add(stock.car.color);
      if (stock.car?.fuel) fuels.add(stock.car.fuel);
    });

    setFilterOptions({
      years: Array.from(years).sort((a, b) => b - a),
      colors: Array.from(colors).sort(),
      fuels: Array.from(fuels).sort(),
    });
  }, [allStocks, searchTerm, yearFilter, colorFilter, fuelFilter, currentPage, perPage, sortBy, sortOrder]);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      // Fetch all stocks without pagination for frontend filtering
      const response = await stockApi.getStocks({
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 10000, // Large number to get all stocks
        page: 1,
      });

      if (response.success && response.data) {
        console.log("Setting all stocks:", response.data.length);
        // Store all stocks for frontend filtering
        setAllStocks(response.data);
      } else {
        console.log("No stocks found, setting empty array");
        setAllStocks([]);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      showMessage("error", "Failed to fetch stocks");
      setAllStocks([]);
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
    setYearFilter("");
    setColorFilter("");
    setFuelFilter("");
    setCurrentPage(1);
    // Reset sorting to default
    setSortBy("created_at");
    setSortOrder("desc");
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
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header - Title (centered)
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("DREAM AGENT CAR VISION", pageWidth / 2, 20, { align: "center" });

      // Header - Address (centered)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("57, Purana Palton Line, VIP Road, Dhaka-1000.", pageWidth / 2, 26, { align: "center" });

      // Header - Date (right aligned with "DATE: " prefix, positioned under address)
      // Calculate table right edge: left margin (14) + sum of column widths (8+45+15+18+20+40+20+24=190)
      const tableLeftMargin = 14;
      const tableWidth = 8 + 45 + 15 + 18 + 20 + 40 + 20 + 24; // Sum of all column widths
      const tableRightEdge = tableLeftMargin + tableWidth;

      const currentDate = new Date();
      const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
      const dateStr = `DATE: ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      doc.setFontSize(10);
      doc.text(dateStr, tableRightEdge, 32, { align: "right" });

      // Prepare table data
      const tableColumns = [
        "Sl.",
        "Car Name",
        "Grade",
        "Mileage",
        "Color/CC",
        "Key Features",
        "Price",
        "View",
      ];

      // Store view links for creating clickable links
      const viewLinkMap: Map<number, string> = new Map();

      const tableData = allStocks.map((stock, index) => {
        try {
          const car = stock.car;
          if (!car) {
            return [
              (index + 1).toString(),
              "N/A",
              "N/A",
              "N/A",
              "N/A",
              "N/A",
              "N/A",
              `Location: N/A\nStatus: ${stock.status || "N/A"}`,
            ];
          }

          // Car Name: Ref: #XXX, YEAR MAKE MODEL PACKAGE -FUEL TYPE, Chassis No: XXX
          const refNo = car.ref_no || `#F${car.year?.toString().slice(-2) || "24"}TCR.SX2V-${String(index + 1).padStart(2, "0")}`;
          const packageText = car.package ? `${car.package} ` : "";
          const fuelType = car.fuel ? `-${car.fuel.toUpperCase()}` : "";
          const carName = `Ref: ${refNo}\n${car.year || "N/A"} ${car.make || "N/A"} ${car.model || "N/A"} ${packageText}${fuelType}\nChassis No: ${car.chassis_no_full || car.chassis_no_masked || "N/A"}`;

          // Grade
          const grade = car.grade_overall || "N/A";

          // Mileage
          const mileage = car.mileage_km ? `${car.mileage_km.toLocaleString()} Km` : "N/A";

          // Color/CC
          const color = car.color ? car.color.toUpperCase() : "N/A";
          const cc = car.engine_cc ? `${car.engine_cc.toLocaleString()} CC` : "";
          const colorCC = cc ? `${color}\n${cc}` : color;

          // Key Features
          const keyFeatures = car.keys_feature
            ? car.keys_feature.split(",").map((f: string) => f.trim()).join(", ")
            : "N/A";

          // Price
          const price = car.price_amount
            ? `৳ ${typeof car.price_amount === "string" ? parseFloat(car.price_amount).toLocaleString("en-IN") : (car.price_amount as number).toLocaleString("en-IN")}`
            : "Price on request";

          // View: CTA text, Location, Status
          const location = car.location || "N/A";
          const status = stock.status === "available" && stock.quantity > 0 ? "Available" : (stock.status?.charAt(0).toUpperCase() + stock.status?.slice(1) || "N/A");

          const viewLabel = "View Cars";
          const viewText = `${viewLabel}\nLocation: ${location}\nStatus: ${status}`;

          // Build link to stock view page
          const baseUrl =
            typeof window !== "undefined" && window.location?.origin
              ? window.location.origin
              : "";
          const viewUrl = `${baseUrl}/stock-gallery/${stock.id}`;
          viewLinkMap.set(index, viewUrl);

          return [
            (index + 1).toString(),
            carName,
            grade,
            mileage,
            colorCC,
            keyFeatures,
            price,
            viewText,
          ];
        } catch (error) {
          console.error("Error processing stock data:", error, stock);
          return [
            (index + 1).toString(),
            "Error",
            "Error",
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
          startY: 35,
          styles: {
            fontSize: 7,
            cellPadding: 2,
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [250, 250, 250],
          },
          columnStyles: {
            0: { cellWidth: 8, halign: "center" }, // Sl.
            1: { cellWidth: 45, halign: "left" }, // Car Name
            2: { cellWidth: 15, halign: "center" }, // Grade
            3: { cellWidth: 18, halign: "center" }, // Mileage
            4: { cellWidth: 20, halign: "left" }, // Color/CC
            5: { cellWidth: 40, halign: "left" }, // Key Features
            6: { cellWidth: 20, halign: "right" }, // Price
            7: { cellWidth: 24, halign: "left" }, // View
          },
          didParseCell: function (data: any) {
            // Store view URL for "View" column (column index 7)
            if (data.column.index === 7 && data.row.index >= 0) {
              const rowIndex = data.row.index;
              const viewUrl = viewLinkMap.get(rowIndex);
              if (viewUrl) {
                data.cell.viewUrl = viewUrl;
              }
            }
          },
          didDrawCell: function (data: any) {
            // Add clickable link to "View" text in "View" column (column index 7)
            if (data.column.index === 7 && data.cell.viewUrl) {
              const cellX = data.cell.x;
              const cellY = data.cell.y;
              const cellWidth = data.cell.width;
              const lineHeight = 8;

              // Link the "View" text (first line) to the stock detail URL
              try {
                doc.link(cellX, cellY, cellWidth, lineHeight, {
                  url: data.cell.viewUrl,
                });
              } catch (linkError) {
                console.warn(`Could not add link for row ${data.row.index}`, linkError);
              }
            }
          },
          didDrawPage: function (data: any) {
            // Add page numbers
            const pageCount = doc.getNumberOfPages();
            const currentPage = data.pageNumber;
            doc.setFontSize(8);
            doc.text(
              `Page ${currentPage} of ${pageCount}`,
              pageWidth / 2,
              doc.internal.pageSize.height - 10,
              { align: "center" }
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
          onCreateInvoice={() => setShowInvoiceModal(true)}
        />

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

        <InvoiceCreationModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          onCreateInvoice={async (items) => {
            try {
              const { StockInvoiceService } = await import(
                "../../services/stockInvoiceService"
              );
              // Convert InvoiceItem to StockInvoiceItem format
              const stockInvoiceItems = items.map((item) => ({
                car: {
                  id: item.car.id.toString(),
                  make: item.car.make,
                  model: item.car.model,
                  year: item.car.year,
                  price: item.price || (typeof item.car.price_amount === "string" ? parseFloat(item.car.price_amount) : item.car.price_amount || 0),
                  image_url: item.car.photos?.[0]?.url,
                  mileage_km: item.car.mileage_km,
                },
                quantity: item.quantity,
                price: item.price,
              }));
              StockInvoiceService.generateStockInvoice(stockInvoiceItems);
              setShowInvoiceModal(false);
              showMessage("success", "Invoice created successfully");
            } catch (error) {
              console.error("Error creating invoice:", error);
              showMessage("error", "Failed to create invoice");
            }
          }}
        />
      </div>
    </div>
  );
};

export default StockManagement;
