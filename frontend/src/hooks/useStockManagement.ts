"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  stockApi,
  Stock,
  CreateStockData,
  UpdateStockData,
} from "../services/stockApi";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

type FilterOptions = {
  years?: number[];
  colors?: string[];
  fuels?: string[];
};

const PER_PAGE = 10;

export const useStockManagement = () => {
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const fetchStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await stockApi.getStocks({
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 10000,
        page: 1,
      });

      if (response.success && response.data) {
        setAllStocks(response.data);
      } else {
        setAllStocks([]);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      showMessage("error", "Failed to fetch stocks");
      setAllStocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [showMessage, sortBy, sortOrder]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, colorFilter, fuelFilter]);

  const derivedData = useMemo(() => {
    if (allStocks.length === 0) {
      return {
        stocks: [] as Stock[],
        totalPages: 1,
        totalItems: 0,
        filterOptions: {} as FilterOptions,
      };
    }

    let filtered = [...allStocks];

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

    if (yearFilter) {
      filtered = filtered.filter(
        (stock) => stock.car?.year?.toString() === yearFilter
      );
    }

    if (colorFilter) {
      filtered = filtered.filter(
        (stock) =>
          stock.car?.color?.toLowerCase() === colorFilter.toLowerCase()
      );
    }

    if (fuelFilter) {
      filtered = filtered.filter(
        (stock) => stock.car?.fuel?.toLowerCase() === fuelFilter.toLowerCase()
      );
    }

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

    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;
    const paginatedStocks = filtered.slice(startIndex, endIndex);

    const years = new Set<number>();
    const colors = new Set<string>();
    const fuels = new Set<string>();

    allStocks.forEach((stock) => {
      if (stock.car?.year) years.add(stock.car.year);
      if (stock.car?.color) colors.add(stock.car.color);
      if (stock.car?.fuel) fuels.add(stock.car.fuel);
    });

    return {
      stocks: paginatedStocks,
      totalPages: Math.max(Math.ceil(filtered.length / PER_PAGE), 1),
      totalItems: filtered.length,
      filterOptions: {
        years: Array.from(years).sort((a, b) => b - a),
        colors: Array.from(colors).sort(),
        fuels: Array.from(fuels).sort(),
      },
    };
  }, [
    allStocks,
    colorFilter,
    currentPage,
    fuelFilter,
    searchTerm,
    sortBy,
    sortOrder,
    yearFilter,
  ]);

  const handleCreateStock = useCallback(() => {
    setSelectedStock(null);
    setDrawerMode("create");
    setShowDrawer(true);
  }, []);

  const handleEditStock = useCallback((stock: Stock) => {
    setSelectedStock(stock);
    setDrawerMode("edit");
    setShowDrawer(true);
  }, []);

  const handleDeleteStock = useCallback((stock: Stock) => {
    setStockToDelete(stock);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!stockToDelete) return;

    setIsDeleting(true);
    try {
      await stockApi.deleteStock(stockToDelete.id);
      setAllStocks((prev) => prev.filter((stock) => stock.id !== stockToDelete.id));
      setShowDeleteModal(false);
      setStockToDelete(null);
      showMessage("success", "Stock deleted successfully");
    } catch (error) {
      console.error("Error deleting stock:", error);
      showMessage("error", "Failed to delete stock");
    } finally {
      setIsDeleting(false);
    }
  }, [showMessage, stockToDelete]);

  const handleDrawerSubmit = useCallback(
    async (data: CreateStockData | UpdateStockData) => {
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
          error?.message ||
          (selectedStock ? "Failed to update stock" : "Failed to create stock");
        showMessage("error", errorMessage);
      }
    },
    [fetchStocks, selectedStock, showMessage]
  );

  const handleDrawerClose = useCallback(() => {
    setShowDrawer(false);
    setSelectedStock(null);
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
      setCurrentPage(1);
    },
    [sortBy, sortOrder]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setYearFilter("");
    setColorFilter("");
    setFuelFilter("");
    setCurrentPage(1);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const generatePDF = useCallback(async () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      const response = await stockApi.getStocks({
        search: searchTerm || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 10000,
        page: 1,
      });

      let allPdfStocks: Stock[] = [];

      if (response.success && response.data) {
        allPdfStocks = response.data;
        const totalPages = response.last_page || 1;
        if (totalPages > 1) {
          const additionalPages = [];
          for (let page = 2; page <= totalPages; page++) {
            additionalPages.push(
              stockApi.getStocks({
                search: searchTerm || undefined,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: 10000,
                page,
              })
            );
          }
          const additionalResponses = await Promise.all(additionalPages);
          additionalResponses.forEach((resp) => {
            if (resp.success && resp.data) {
              allPdfStocks = [...allPdfStocks, ...resp.data];
            }
          });
        }
      } else {
        alert("Failed to fetch stock data. Please try again.");
        setIsGeneratingPDF(false);
        return;
      }

      if (allPdfStocks.length === 0) {
        alert("No stocks to export. Please ensure some stocks are available.");
        setIsGeneratingPDF(false);
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("DREAM AGENT CAR VISION", pageWidth / 2, 20, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "57, Purana Palton Line, VIP Road, Dhaka-1000.    Contact No : 01714211956",
        pageWidth / 2,
        26,
        { align: "center" }
      );

      const tableLeftMargin = 14;
      const tableWidth = 8 + 45 + 15 + 18 + 20 + 40 + 20 + 24;
      const tableRightEdge = tableLeftMargin + tableWidth;

      const currentDate = new Date();
      const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ];
      const dateStr = `DATE: ${currentDate.getDate()} ${
        months[currentDate.getMonth()]
      } ${currentDate.getFullYear()}`;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("STOCK LIST", pageWidth / 2, 38, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(dateStr, tableRightEdge, 38, { align: "right" });

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

      const viewLinkMap: Map<number, string> = new Map();

      const tableData = allPdfStocks.map((stock, index) => {
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

          const refNo =
            car.ref_no ||
            `#F${car.year?.toString().slice(-2) || "24"}TCR.SX2V-${String(
              index + 1
            ).padStart(2, "0")}`;
          const packageText = car.package ? `${car.package} ` : "";
          const fuelType = car.fuel ? `-${car.fuel.toUpperCase()}` : "";
          const carName = `Ref: ${refNo}\n${car.year || "N/A"} ${
            car.make || "N/A"
          } ${car.model || "N/A"} ${packageText}${fuelType}\nChassis No: ${
            car.chassis_no_full || car.chassis_no_masked || "N/A"
          }`;

          const grade = car.grade_overall || "N/A";
          const mileage = car.mileage_km
            ? `${car.mileage_km.toLocaleString()} Km`
            : "N/A";
          const color = car.color ? car.color.toUpperCase() : "N/A";
          const cc = car.engine_cc ? `${car.engine_cc.toLocaleString()} CC` : "";
          const colorCC = cc ? `${color}\n${cc}` : color;
          const keyFeatures = car.keys_feature
            ? car.keys_feature
                .split(",")
                .map((f: string) => f.trim())
                .join(", ")
            : "N/A";
          const price = car.price_amount
            ? `৳ ${
                typeof car.price_amount === "string"
                  ? parseFloat(car.price_amount).toLocaleString("en-IN")
                  : (car.price_amount as number).toLocaleString("en-IN")
              }`
            : "Price on request";
          const location = car.location || "N/A";
          const status =
            stock.status === "available" && stock.quantity > 0
              ? "Available"
              : stock.status?.charAt(0).toUpperCase() +
                  stock.status?.slice(1) || "N/A";

          const viewLabel = "View Cars";
          const viewText = `${viewLabel}\nLocation: ${location}\nStatus: ${status}`;

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

      try {
        autoTable(doc, {
          head: [tableColumns],
          body: tableData,
          startY: 44,
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
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 45, halign: "left" },
            2: { cellWidth: 15, halign: "center" },
            3: { cellWidth: 18, halign: "center" },
            4: { cellWidth: 20, halign: "left" },
            5: { cellWidth: 40, halign: "left" },
            6: { cellWidth: 20, halign: "right" },
            7: { cellWidth: 24, halign: "left" },
          },
          didParseCell: function (data: any) {
            if (data.column.index === 7 && data.row.index >= 0) {
              const rowIndex = data.row.index;
              const viewUrl = viewLinkMap.get(rowIndex);
              if (viewUrl) {
                data.cell.viewUrl = viewUrl;
              }
            }
          },
          didDrawCell: function (data: any) {
            if (data.column.index === 7 && data.cell.viewUrl) {
              const cellX = data.cell.x;
              const cellY = data.cell.y;
              const cellWidth = data.cell.width;
              const lineHeight = 8;

              try {
                doc.link(cellX, cellY, cellWidth, lineHeight, {
                  url: data.cell.viewUrl,
                });
              } catch (linkError) {
                console.warn(
                  `Could not add link for row ${data.row.index}`,
                  linkError
                );
              }
            }
          },
          didDrawPage: function (data: any) {
            const pageCount = doc.getNumberOfPages();
            const currentPageNumber = data.pageNumber;
            doc.setFontSize(8);
            doc.text(
              `Page ${currentPageNumber} of ${pageCount}`,
              pageWidth / 2,
              doc.internal.pageSize.height - 10,
              { align: "center" }
            );
          },
        });
      } catch (tableError) {
        console.error("Error creating table:", tableError);
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

      doc.save(`stock-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [isGeneratingPDF, searchTerm, sortBy, sortOrder]);

  const handleCreateInvoice = useCallback(
    async (items: any[]) => {
      try {
        const { StockInvoiceService } = await import(
          "../services/stockInvoiceService"
        );
        const stockInvoiceItems = items.map((item) => ({
          car: {
            id: item.car.id.toString(),
            make: item.car.make,
            model: item.car.model,
            year: item.car.year,
            price:
              item.price ||
              (typeof item.car.price_amount === "string"
                ? parseFloat(item.car.price_amount)
                : item.car.price_amount || 0),
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
    },
    [showMessage]
  );

  return {
    stocks: derivedData.stocks,
    totalPages: derivedData.totalPages,
    totalItems: derivedData.totalItems,
    filterOptions: derivedData.filterOptions,
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
    perPage: PER_PAGE,
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
  };
};
