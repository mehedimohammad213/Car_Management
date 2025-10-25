import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Car, X, Plus, Edit, Trash2 } from "lucide-react";
import {
  carApi,
  Car as CarType,
  CarFilterOptions,
} from "../../services/carApi";
import { categoryApi } from "../../services/categoryApi";
import { stockApi, Stock } from "../../services/stockApi";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import SearchFilters from "../../components/car/SearchFilters";
import CarTable from "../../components/car/CarTable";
import CarModal from "../../components/car/CarModal";
import Pagination from "../../components/car/Pagination";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import {
  formatPrice,
  getStatusColor,
  getGradeColor,
  getStockStatusColor,
  getStockStatusTextColor,
} from "../../utils/carUtils";

const UserCarCatalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<CarType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Admin button handlers
  const handleAddCar = () => {
    navigate("/create-car");
  };

  const handleEditCar = (car: CarType) => {
    navigate(`/update-car/${car.id}`);
  };

  const handleDeleteCar = (car: CarType) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      await carApi.deleteCar(carToDelete.id);
      setCars(cars.filter((car) => car.id !== carToDelete.id));
      setShowDeleteModal(false);
      setCarToDelete(null);
      // You could add a success message here if needed
    } catch (error) {
      console.error("Error deleting car:", error);
      // You could add an error message here if needed
    } finally {
      setIsDeleting(false);
    }
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

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-full mx-auto px-4 py-6">
        {/* Search Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          makeFilter={makeFilter}
          setMakeFilter={setMakeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          transmissionFilter={transmissionFilter}
          setTransmissionFilter={setTransmissionFilter}
          colorFilter={colorFilter}
          setColorFilter={setColorFilter}
          fuelFilter={fuelFilter}
          setFuelFilter={setFuelFilter}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          isGeneratingPDF={isGeneratingPDF}
          onGeneratePDF={generatePDF}
          onClearFilters={clearFilters}
          {...(user?.role === "admin" && {
            onAddCar: handleAddCar,
            isAdmin: true,
          })}
          filterOptions={filterOptions}
          categories={categories}
        />

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
          <CarTable
            cars={cars}
            stockData={stockData}
            onViewCar={handleViewCar}
            onAddToCart={handleAddToCart}
            {...(user?.role === "admin" && {
              onEditCar: handleEditCar,
              onDeleteCar: handleDeleteCar,
            })}
            isCarLoading={isCarLoading}
            getStatusColor={getStatusColor}
            getGradeColor={getGradeColor}
            getStockStatusColor={getStockStatusColor}
            formatPrice={formatPrice}
            isAdmin={user?.role === "admin"}
          />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Enhanced Car Detail Modal */}
      <CarModal
        selectedCar={selectedCar}
        showCarModal={showCarModal}
        onClose={handleCloseCarModal}
        currentImageIndex={currentImageIndex}
        onNextImage={handleNextImage}
        onPrevImage={handlePrevImage}
        onThumbnailClick={handleThumbnailClick}
        onDownloadPdf={handleDownloadPdf}
        pdfFiles={pdfFiles}
        pdfLoading={pdfLoading}
        stockData={stockData}
        getStatusColor={getStatusColor}
        getStockStatusColor={getStockStatusColor}
        getStockStatusTextColor={getStockStatusTextColor}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Car"
        message={`Are you sure you want to delete "${carToDelete?.make} ${carToDelete?.model}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserCarCatalog;
