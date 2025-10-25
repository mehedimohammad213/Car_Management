import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Search,
  Filter,
  Eye,
  Car,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Users,
  DollarSign,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  ShoppingCart,
  Grid,
  List,
  SlidersHorizontal,
  TrendingUp,
  Award,
  Shield,
  Heart,
  Share2,
  Download,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  carApi,
  Car as CarType,
  CarFilterOptions,
} from "../../services/carApi";
import { categoryApi } from "../../services/categoryApi";
import { stockApi, Stock } from "../../services/stockApi";
import { useCart } from "../../contexts/CartContext";

const UserCarCatalog: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stockData, setStockData] = useState<Map<number, Stock>>(new Map());
  const [pdfFiles, setPdfFiles] = useState<
    Map<number, Array<{ name: string; url: string }>>
  >(new Map());
  const [pdfLoading, setPdfLoading] = useState<Map<number, boolean>>(new Map());
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { addToCart, isCarLoading } = useCart();

  useEffect(() => {
    console.log("UserCarCatalog: Component mounted, fetching data...");
    fetchCars();
    fetchCategories();
    fetchFilterOptions();
    fetchStockData();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    categoryFilter,
    makeFilter,
    yearFilter,
    transmissionFilter,
    fuelFilter,
    colorFilter,
    priceRange,
    sortBy,
    sortDirection,
  ]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching cars with params:", {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter || undefined,
        make: makeFilter || undefined,
        year: yearFilter || undefined,
        transmission: transmissionFilter || undefined,
        fuel: fuelFilter || undefined,
        color: colorFilter || undefined,
        price_from: priceRange.min || undefined,
        price_to: priceRange.max || undefined,
        sort_by: sortBy,
        sort_direction: sortDirection,
        per_page: perPage,
        page: currentPage,
      });

      const response = await carApi.getCars({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter || undefined,
        make: makeFilter || undefined,
        year: yearFilter || undefined,
        transmission: transmissionFilter || undefined,
        fuel: fuelFilter || undefined,
        color: colorFilter || undefined,
        price_from: priceRange.min || undefined,
        price_to: priceRange.max || undefined,
        sort_by: sortBy,
        sort_direction: sortDirection,
        per_page: perPage,
        page: currentPage,
      });

      console.log("Cars API response:", response);

      if (response.success && response.data.data) {
        console.log("Setting cars:", response.data.data);
        setCars(response.data.data);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      } else {
        console.log("No cars found or invalid response structure");
        setCars([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
      setTotalPages(1);
      setTotalItems(0);

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          console.error("Authentication failed - redirecting to login");
          // The API service should handle this automatically
        } else if (
          error.message.includes("Network Error") ||
          error.message.includes("fetch")
        ) {
          console.error("Network error - backend might be down");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories();
      if (response.success && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await carApi.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await stockApi.getStocks({ per_page: 1000 });
      if (response.success && response.data) {
        const stockMap = new Map<number, Stock>();
        response.data.forEach((stock: Stock) => {
          // Convert car_id to number since it comes as string from API
          const carId =
            typeof stock.car_id === "string"
              ? parseInt(stock.car_id)
              : stock.car_id;
          stockMap.set(carId, stock);
        });
        setStockData(stockMap);
        console.log("Stock data loaded:", stockMap.size, "items");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchPdfFiles = async (car: CarType) => {
    try {
      // Set loading state
      setPdfLoading((prev) => {
        const newMap = new Map(prev);
        newMap.set(car.id, true);
        return newMap;
      });

      // Check if car has attached_file
      if (car.attached_file) {
        try {
          // Try to get file info from API first
          const fileInfo = await carApi.getAttachedFile(car.id);

          if (fileInfo.success && fileInfo.data) {
            const pdfFiles = [
              {
                name: fileInfo.data.filename,
                url: fileInfo.data.url,
              },
            ];

            setPdfFiles((prev) => {
              const newMap = new Map(prev);
              newMap.set(car.id, pdfFiles);
              return newMap;
            });
          } else {
            // Fallback to direct file path
            const fileName =
              car.attached_file.split("/").pop() || "Vehicle Document.pdf";
            const baseUrl = "http://localhost:8000";
            const pdfUrl = car.attached_file.startsWith("http")
              ? car.attached_file
              : `${baseUrl}${car.attached_file}`;

            console.log("PDF URL constructed:", pdfUrl);

            const pdfFiles = [
              {
                name: fileName,
                url: pdfUrl,
              },
            ];

            setPdfFiles((prev) => {
              const newMap = new Map(prev);
              newMap.set(car.id, pdfFiles);
              return newMap;
            });
          }
        } catch (apiError) {
          console.log("API call failed, using direct file path:", apiError);

          // Fallback to direct file path
          const fileName =
            car.attached_file.split("/").pop() || "Vehicle Document.pdf";
          const baseUrl = "http://localhost:8000";
          const pdfUrl = car.attached_file.startsWith("http")
            ? car.attached_file
            : `${baseUrl}${car.attached_file}`;

          console.log("PDF URL constructed (fallback):", pdfUrl);

          const pdfFiles = [
            {
              name: fileName,
              url: pdfUrl,
            },
          ];

          setPdfFiles((prev) => {
            const newMap = new Map(prev);
            newMap.set(car.id, pdfFiles);
            return newMap;
          });
        }
      } else {
        // No PDF file attached
        setPdfFiles((prev) => {
          const newMap = new Map(prev);
          newMap.set(car.id, []);
          return newMap;
        });
      }
    } catch (error) {
      console.error("Error processing PDF files:", error);

      // Set empty array on error
      setPdfFiles((prev) => {
        const newMap = new Map(prev);
        newMap.set(car.id, []);
        return newMap;
      });
    } finally {
      // Clear loading state
      setPdfLoading((prev) => {
        const newMap = new Map(prev);
        newMap.set(car.id, false);
        return newMap;
      });
    }
  };

  const handleViewCar = (car: CarType) => {
    setSelectedCar(car);
    setShowCarModal(true);
    fetchPdfFiles(car);
  };

  const handleAddToCart = (car: CarType) => {
    addToCart(car);
  };

  const handleCloseCarModal = () => {
    setShowCarModal(false);
    setSelectedCar(null);
    setCurrentImageIndex(0);
  };

  const generatePDF = () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      console.log("Generating PDF...", { carsCount: cars.length });

      if (cars.length === 0) {
        alert("No cars to export. Please load some cars first.");
        return;
      }

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Car Catalog Report", 14, 22);

      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare table data
      const tableColumns = [
        "Car Info",
        "Mileage",
        "Engine",
        "Color",
        "AA Score",
        "Key Features",
        "Price",
      ];

      const tableData = cars.map((car) => {
        try {
          const keyFeatures = [];
          if (car.fuel) keyFeatures.push(car.fuel);
          if (car.seats) keyFeatures.push(`${car.seats} Seats`);
          if (car.steering) keyFeatures.push(car.steering);
          if ((car as any).drive_type)
            keyFeatures.push((car as any).drive_type);

          const aaScore = [];
          if (car.grade_overall) aaScore.push(car.grade_overall);
          if (car.grade_exterior) aaScore.push(`Ext: ${car.grade_exterior}`);
          if (car.grade_interior) aaScore.push(`Int: ${car.grade_interior}`);

          return [
            `${car.year || "N/A"} ${car.make || "N/A"} ${car.model || "N/A"}${
              car.variant ? ` - ${car.variant}` : ""
            }`,
            car.mileage_km ? `${car.mileage_km.toLocaleString()} km` : "N/A",
            car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : "N/A",
            car.color || "N/A",
            aaScore.length > 0 ? aaScore.join(" ") : "N/A",
            keyFeatures.length > 0 ? keyFeatures.join(", ") : "N/A",
            car.price_amount
              ? `$${car.price_amount.toLocaleString()}`
              : "Price on request",
          ];
        } catch (error) {
          console.error("Error processing car data:", error, car);
          return [
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
          startY: 40,
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
            0: { cellWidth: 40 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 15 },
            4: { cellWidth: 25 },
            5: { cellWidth: 30 },
            6: { cellWidth: 25 },
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
      doc.save(`car-catalog-${new Date().toISOString().split("T")[0]}.pdf`);
      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNextImage = () => {
    if (selectedCar?.photos && selectedCar.photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedCar.photos!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedCar?.photos && selectedCar.photos.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedCar.photos!.length - 1 : prev - 1
      );
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDownloadPdf = async (
    pdfUrl: string,
    fileName: string,
    carId?: number
  ) => {
    try {
      console.log("Attempting to download PDF:", { pdfUrl, fileName, carId });

      // First try: Use the API download method if available
      if (carId && selectedCar) {
        try {
          console.log("Trying API download method...");
          const blob = await carApi.downloadAttachedFile(carId);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log("API download successful");
          return;
        } catch (apiError) {
          console.log("API download failed, trying direct URL:", apiError);
        }
      }

      // Second try: Direct URL download with proper headers
      try {
        console.log("Trying direct URL download...");
        const response = await fetch(pdfUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log("Direct URL download successful");
          return;
        } else {
          console.log("Direct fetch failed, trying simple link...");
        }
      } catch (fetchError) {
        console.log("Direct fetch failed, trying simple link:", fetchError);
      }

      // Third try: Simple link download
      console.log("Trying simple link download...");
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = fileName;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Simple link download attempted");
    } catch (error) {
      console.error("All download methods failed:", error);
      // Final fallback: open in new tab
      console.log("Opening in new tab as fallback...");
      window.open(pdfUrl, "_blank");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("available");
    setCategoryFilter("");
    setMakeFilter("");
    setYearFilter("");
    setTransmissionFilter("");
    setFuelFilter("");
    setColorFilter("");
    setPriceRange({ min: "", max: "" });
    setSortBy("created_at");
    setSortDirection("desc");
    setCurrentPage(1);
    setShowAdvancedFilters(false);
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "Price on request";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "sold":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "reserved":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "in_transit":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const getGradeColor = (grade?: string | number) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
    if (numGrade >= 8) return "bg-green-100 text-green-800";
    if (numGrade >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStockStatusColor = (quantity: number, status: string) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= 2) return "text-amber-600";
    return "text-green-600";
  };

  const getStockStatusTextColor = (quantity: number, status: string) => {
    if (quantity === 0) return "text-red-500";
    if (quantity <= 2) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-full mx-auto px-4 py-6">
        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cars by make, model, year, or any keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Grid with Search Button on Same Line */}
          <div className="flex items-start gap-4 mb-6">
            {/* Filter Grid */}
            <div
              className={`flex-1 transition-all duration-300 ${
                showAdvancedFilters
                  ? "opacity-100 max-h-none"
                  : "opacity-100 max-h-20 overflow-hidden"
              }`}
            >
              {/* First Row - Always Visible */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <select
                  value={makeFilter}
                  onChange={(e) => setMakeFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="">All Makes</option>
                  {filterOptions?.makes?.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-100 text-sm transition-all duration-200">
                  <option value="">Body Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="wagon">Wagon</option>
                  <option value="coupe">Coupe</option>
                </select>

                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200"
                >
                  <option value="">All Years</option>
                  {filterOptions?.years?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200">
                  <option value="">Max Year</option>
                  {filterOptions?.years?.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Rows - Only Visible When Expanded */}
              {showAdvancedFilters && (
                <div className="space-y-4">
                  {/* Second Row */}
                  <div className="grid grid-cols-5 gap-4">
                    <select
                      value={transmissionFilter}
                      onChange={(e) => setTransmissionFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Transmission</option>
                      {filterOptions?.transmissions?.map((transmission) => (
                        <option key={transmission} value={transmission}>
                          {transmission}
                        </option>
                      ))}
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Drivetrain</option>
                      <option value="2wd">2WD</option>
                      <option value="4wd">4WD</option>
                      <option value="awd">AWD</option>
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Steering</option>
                      <option value="left">Left Hand Drive</option>
                      <option value="right">Right Hand Drive</option>
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Min Mileage</option>
                      <option value="0">0 km</option>
                      <option value="10000">10,000 km</option>
                      <option value="50000">50,000 km</option>
                      <option value="100000">100,000 km</option>
                      <option value="200000">200,000 km</option>
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Max Mileage</option>
                      <option value="50000">50,000 km</option>
                      <option value="100000">100,000 km</option>
                      <option value="200000">200,000 km</option>
                      <option value="300000">300,000 km</option>
                      <option value="500000">500,000 km</option>
                    </select>
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-5 gap-4">
                    <select
                      value={colorFilter}
                      onChange={(e) => setColorFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Color</option>
                      {filterOptions?.colors?.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>

                    <select
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Fuel Types</option>
                      {filterOptions?.fuels?.map((fuel) => (
                        <option key={fuel} value={fuel}>
                          {fuel}
                        </option>
                      ))}
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Auction Grade</option>
                      <option value="5">5</option>
                      <option value="4.5">4.5</option>
                      <option value="4">4</option>
                      <option value="3.5">3.5</option>
                      <option value="3">3</option>
                      <option value="2">2</option>
                      <option value="1">1</option>
                      <option value="R">R</option>
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Min Eng.cc</option>
                      <option value="1000">1000cc</option>
                      <option value="1500">1500cc</option>
                      <option value="2000">2000cc</option>
                      <option value="2500">2500cc</option>
                      <option value="3000">3000cc</option>
                    </select>

                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Max Eng.cc</option>
                      <option value="2000">2000cc</option>
                      <option value="2500">2500cc</option>
                      <option value="3000">3000cc</option>
                      <option value="4000">4000cc</option>
                      <option value="5000">5000cc</option>
                    </select>
                  </div>

                  {/* Fourth Row - Removed date inputs */}
                  <div className="grid grid-cols-5 gap-4">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-blue-600 hover:text-blue-800 border border-blue-300 hover:bg-blue-50 rounded-xl font-semibold text-sm transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results Count and Advanced Search */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                {totalItems} Matches Found
              </div>
              {stockData.size > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      In Stock:{" "}
                      {
                        Array.from(stockData.values()).filter(
                          (s) => s.quantity > 0
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Low Stock:{" "}
                      {
                        Array.from(stockData.values()).filter(
                          (s) => s.quantity > 0 && s.quantity <= 2
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Out of Stock:{" "}
                      {
                        Array.from(stockData.values()).filter(
                          (s) => s.quantity === 0
                        ).length
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-3 px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg"
              >
                <span>Advanced Search</span>
                <span className="text-lg">
                  {showAdvancedFilters ? "−" : "+"}
                </span>
              </button>

              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className={`flex items-center gap-3 px-6 py-3 border-2 rounded-xl transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg ${
                  isGeneratingPDF
                    ? "text-gray-400 border-gray-400 cursor-not-allowed"
                    : "text-green-600 border-green-600 hover:bg-green-50"
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cars Table Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-xl font-semibold">
              Loading premium vehicles...
            </p>
            <p className="text-gray-500 mt-2">
              Please wait while we fetch the latest inventory
            </p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Car className="w-20 h-20 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
              We couldn't find any vehicles matching your criteria. Try
              adjusting your filters or search terms to discover more options.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <X className="w-5 h-5" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-200">
              <div className="grid grid-cols-10 gap-3 p-6 text-sm font-bold text-gray-800 uppercase tracking-wide">
                <div className="col-span-3">Car Information</div>
                <div className="col-span-1">Mileage</div>
                <div className="col-span-1">Engine</div>
                <div className="col-span-1">Color</div>
                <div className="col-span-1">AA Score</div>
                <div className="col-span-1">Key Features</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {cars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => handleViewCar(car)}
                  className="grid grid-cols-10 gap-3 p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 cursor-pointer"
                >
                  {/* Car Information */}
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-24 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      {car.photos && car.photos.length > 0 ? (
                        <img
                          src={
                            car.photos.find((p: any) => p.is_primary)?.url ||
                            car.photos[0].url
                          }
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {car.year} {car.make} {car.model}{" "}
                        {car.variant && `- ${car.variant}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        Ref No :{" "}
                        {car.ref_no ||
                          `AA${car.id.toString().padStart(6, "0")}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Chassis No :{" "}
                        {(car as any).chassis_no || (car as any).vin || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status:{" "}
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            car.status
                          )}`}
                        >
                          {car.status?.charAt(0).toUpperCase() +
                            car.status?.slice(1)}
                        </span>
                        {(() => {
                          const stock = stockData.get(car.id);
                          if (stock) {
                            return (
                              <span
                                className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(
                                  stock.quantity,
                                  stock.status
                                )}`}
                              >
                                Stock: {stock.quantity}
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Mileage */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.mileage_km
                        ? `${car.mileage_km.toLocaleString()} km`
                        : "N/A"}
                    </span>
                  </div>

                  {/* Engine */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.engine_cc
                        ? `${car.engine_cc.toLocaleString()} cc`
                        : "N/A"}
                    </span>
                  </div>

                  {/* Color */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.color || "N/A"}
                    </span>
                  </div>

                  {/* AA Score */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col items-center">
                      {car.grade_overall && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(
                              car.grade_overall
                            )}`}
                          >
                            {car.grade_overall}
                          </span>
                        </div>
                      )}
                      {car.grade_exterior && (
                        <span className="text-xs text-gray-600 mt-1">
                          Ext: {car.grade_exterior}
                        </span>
                      )}
                      {car.grade_interior && (
                        <span className="text-xs text-gray-600">
                          Int: {car.grade_interior}
                        </span>
                      )}
                      {!car.grade_overall &&
                        !car.grade_exterior &&
                        !car.grade_interior && (
                          <span className="text-xs text-gray-500">N/A</span>
                        )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-wrap gap-1">
                      {car.fuel && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {car.fuel}
                        </span>
                      )}
                      {car.seats && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {car.seats} Seats
                        </span>
                      )}
                      {car.steering && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {car.steering}
                        </span>
                      )}
                      {(car as any).drive_type && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {(car as any).drive_type}
                        </span>
                      )}
                      {!car.fuel &&
                        !car.seats &&
                        !car.steering &&
                        !(car as any).drive_type && (
                          <span className="text-xs text-gray-500">N/A</span>
                        )}
                    </div>
                  </div>

                  {/* Starting Price */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-900">
                      {car.price_amount
                        ? formatPrice(car.price_amount, car.price_currency)
                        : "Price on request"}
                    </span>
                  </div>

                  {/* Action */}
                  <div
                    className="col-span-1 flex items-center justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleViewCar(car)}
                      className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCart(car)}
                      disabled={isCarLoading(car.id)}
                      className="p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                      title="Add to Cart"
                    >
                      {isCarLoading(car.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                          : "text-gray-600 bg-gray-50 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Car Detail Modal */}
      {showCarModal && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseCarModal}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[98vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCar?.year} {selectedCar?.make} {selectedCar?.model}
                  {selectedCar?.variant && ` - ${selectedCar.variant}`}
                </h2>
              </div>
              <button
                onClick={handleCloseCarModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 group"
                title="Close"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Photos (2/3 width) */}
                <div className="lg:col-span-2">
                  {/* Main Photo */}
                  <div className="relative mb-4">
                    {selectedCar.photos && selectedCar.photos.length > 0 ? (
                      <img
                        src={selectedCar.photos[currentImageIndex].url}
                        alt={`${selectedCar.make} ${selectedCar.model}`}
                        className="w-full h-96 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Car className="w-24 h-24 text-gray-400" />
                        <p className="text-gray-500 ml-4 text-lg">
                          No photos available
                        </p>
                      </div>
                    )}

                    {/* Photo Navigation Arrows */}
                    {selectedCar.photos && selectedCar.photos.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedCar.photos && selectedCar.photos.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {selectedCar.photos
                        .slice(0, 4)
                        .map((photo: any, index: number) => (
                          <img
                            key={index}
                            src={photo.url}
                            alt={`${selectedCar.make} ${
                              selectedCar.model
                            } thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(index)}
                            className={`w-20 h-16 object-cover rounded-md cursor-pointer transition-all ${
                              currentImageIndex === index
                                ? "ring-2 ring-blue-500 opacity-100"
                                : "hover:opacity-80 opacity-70"
                            }`}
                          />
                        ))}
                      {selectedCar.photos.length > 4 && (
                        <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                          +{selectedCar.photos.length - 4} more
                        </div>
                      )}

                      {/* PDF Documents at the end of the row */}
                      {!pdfLoading.get(selectedCar.id) &&
                        pdfFiles.get(selectedCar.id) &&
                        pdfFiles.get(selectedCar.id)!.length > 0 && (
                          <>
                            {pdfFiles.get(selectedCar.id)!.map((pdf, index) => (
                              <div
                                key={`pdf-${index}`}
                                className="w-20 h-16 bg-red-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-red-200 transition-colors group ml-auto"
                                onClick={() =>
                                  handleDownloadPdf(
                                    pdf.url,
                                    pdf.name,
                                    selectedCar.id
                                  )
                                }
                                title="Download PDF Document"
                              >
                                <Download className="w-4 h-4 text-red-600 group-hover:text-red-700 mb-1" />
                                <span className="text-xs text-red-600 font-medium">
                                  Document
                                </span>
                              </div>
                            ))}
                          </>
                        )}
                    </div>
                  )}
                </div>

                {/* Right Column - Details (1/3 width) */}
                <div className="space-y-6">
                  {/* Specifications Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        Specifications
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {/* Two Column Specifications Grid */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {/* Left Column */}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mileage:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.mileage_km
                                ? `${selectedCar.mileage_km.toLocaleString()} km`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Year:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.year || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Engine:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.engine_cc
                                ? `${selectedCar.engine_cc.toLocaleString()} cc`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trans.:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.transmission || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Drivetrain:</span>
                            <span className="font-semibold text-gray-900">
                              {(selectedCar as any).drive_type ||
                                (selectedCar as any).drivetrain ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Steering:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.steering || "-"}
                            </span>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fuel:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.fuel || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ref No.:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.ref_no ||
                                `AA${selectedCar.id
                                  .toString()
                                  .padStart(6, "0")}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Registration:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.year || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Color:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.color || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Seats:</span>
                            <span className="font-semibold text-gray-900">
                              {selectedCar.seats || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                selectedCar.status
                              )}`}
                            >
                              {selectedCar.status?.charAt(0).toUpperCase() +
                                selectedCar.status?.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Information - Full Width */}
                      {(() => {
                        const stock = stockData.get(selectedCar.id);
                        if (stock) {
                          const stockPrice =
                            typeof stock.price === "string"
                              ? parseFloat(stock.price)
                              : stock.price;
                          return (
                            <div className="flex justify-between pt-3 border-t border-gray-200">
                              <span className="text-gray-600">Stock:</span>
                              <div className="flex flex-col items-end">
                                <span
                                  className={`text-sm font-medium ${getStockStatusColor(
                                    stock.quantity,
                                    stock.status
                                  )}`}
                                >
                                  {stock.quantity}
                                </span>
                                <span
                                  className={`text-xs ${getStockStatusTextColor(
                                    stock.quantity,
                                    stock.status
                                  )}`}
                                >
                                  {stock.status}
                                </span>
                                {stockPrice && (
                                  <span className="text-xs text-gray-500">
                                    Stock Price: ${stockPrice.toLocaleString()}
                                  </span>
                                )}
                                {stock.notes && (
                                  <span className="text-xs text-gray-500 italic">
                                    {stock.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {/* Chassis Number with View Button */}
                      {(selectedCar as any).chassis_no && (
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="text-gray-600">Chassis No.:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {(selectedCar as any).chassis_no}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                              View
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  {selectedCar.detail && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Additional Details
                      </h3>
                      {selectedCar.detail.short_title && (
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {selectedCar.detail.short_title}
                        </p>
                      )}
                      {selectedCar.detail.full_title && (
                        <p className="text-gray-600 mb-2">
                          {selectedCar.detail.full_title}
                        </p>
                      )}
                      {selectedCar.detail.description && (
                        <p className="text-gray-700">
                          {selectedCar.detail.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Location */}
                  {(selectedCar.location ||
                    selectedCar.country_origin ||
                    (selectedCar as any).port) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Location
                      </h3>
                      <div className="space-y-2">
                        {(selectedCar as any).port && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Port: {(selectedCar as any).port}</span>
                          </div>
                        )}
                        {selectedCar.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Location: {selectedCar.location}</span>
                          </div>
                        )}
                        {selectedCar.country_origin && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Country: {selectedCar.country_origin}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedCar.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Notes
                      </h3>
                      <p className="text-gray-700">{selectedCar.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCarCatalog;
