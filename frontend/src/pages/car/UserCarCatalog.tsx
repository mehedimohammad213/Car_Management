import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState<CarType[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [filterOptions, setFilterOptions] = useState<CarFilterOptions | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize state from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [makeFilter, setMakeFilter] = useState(searchParams.get("make") || "");
  const [yearFilter, setYearFilter] = useState(searchParams.get("year") || "");
  const [transmissionFilter, setTransmissionFilter] = useState(searchParams.get("transmission") || "");
  const [fuelFilter, setFuelFilter] = useState(searchParams.get("fuel") || "");
  const [colorFilter, setColorFilter] = useState(searchParams.get("color") || "");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("priceMin") || "",
    max: searchParams.get("priceMax") || ""
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "price_amount");
  const [sortDirection, setSortDirection] = useState(searchParams.get("sortDirection") || "desc");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [stockData, setStockData] = useState<Map<number, Stock>>(new Map());
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<CarType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToCart, isCarLoading } = useCart();

  // Update URL parameters when state changes
  useEffect(() => {
    const params: any = {};

    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (makeFilter) params.make = makeFilter;
    if (yearFilter) params.year = yearFilter;
    if (transmissionFilter) params.transmission = transmissionFilter;
    if (fuelFilter) params.fuel = fuelFilter;
    if (colorFilter) params.color = colorFilter;
    if (priceRange.min) params.priceMin = priceRange.min;
    if (priceRange.max) params.priceMax = priceRange.max;
    if (sortBy !== "price_amount") params.sortBy = sortBy;
    if (sortDirection !== "desc") params.sortDirection = sortDirection;
    if (currentPage !== 1) params.page = currentPage.toString();

    setSearchParams(params, { replace: true });
  }, [
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
    currentPage,
    setSearchParams,
  ]);

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
        const processedCars = [...response.data.data];
        if (sortBy === "price_amount") {
          processedCars.sort((a, b) => {
            const priceA = Number((a as any).price_amount) || 0;
            const priceB = Number((b as any).price_amount) || 0;
            return sortDirection === "asc" ? priceA - priceB : priceB - priceA;
          });
        }
        // Sort by model alphabetically
        processedCars.sort((a, b) => {
          const modelA = (a.model || "").toLowerCase();
          const modelB = (b.model || "").toLowerCase();
          return modelA.localeCompare(modelB);
        });
        setCars(processedCars);
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

  const handleViewCar = (car: CarType) => {
    // Preserve current URL params when navigating
    navigate(`/car-view/${car.id}?${searchParams.toString()}`);
  };

  // Admin view handler - redirect to view page
  const handleViewCarAdmin = (car: CarType) => {
    // Preserve current URL params when navigating
    navigate(`/view-car/${car.id}?${searchParams.toString()}`);
  };

  const handleAddToCart = (car: CarType) => {
    addToCart(car);
  };

  // Admin button handlers
  const handleAddCar = () => {
    navigate("/create-car");
  };

  const handleEditCar = (car: CarType) => {
    // Preserve current URL params when navigating
    navigate(`/update-car/${car.id}?${searchParams.toString()}`);
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


  const generatePDF = async () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      console.log("Generating PDF... Fetching all cars...");

      // Fetch all available cars with current filters (no pagination)
      const response = await carApi.getCars({
        search: searchTerm || undefined,
        status: "available", // Only available cars
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
        per_page: 10000, // Large number to get all cars
        page: 1,
      });

      let allCars: CarType[] = [];

      if (response.success && response.data.data) {
        allCars = response.data.data;

        // If there are more pages, fetch them all
        const totalPages = response.data.last_page || 1;
        if (totalPages > 1) {
          console.log(`Fetching ${totalPages - 1} additional pages...`);
          const additionalPages = [];
          for (let page = 2; page <= totalPages; page++) {
            additionalPages.push(
              carApi.getCars({
                search: searchTerm || undefined,
                status: "available",
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
                per_page: 10000,
                page: page,
              })
            );
          }
          const additionalResponses = await Promise.all(additionalPages);
          additionalResponses.forEach((resp) => {
            if (resp.success && resp.data.data) {
              allCars = [...allCars, ...resp.data.data];
            }
          });
        }

        // Sort by model alphabetically
        allCars.sort((a, b) => {
          const modelA = (a.model || "").toLowerCase();
          const modelB = (b.model || "").toLowerCase();
          return modelA.localeCompare(modelB);
        });
      } else {
        console.error("Failed to fetch cars for PDF:", response);
        alert("Failed to fetch car data. Please try again.");
        setIsGeneratingPDF(false);
        return;
      }

      if (allCars.length === 0) {
        alert("No available cars to export. Please ensure some cars are marked as available.");
        setIsGeneratingPDF(false);
        return;
      }

      console.log(`Generating PDF with ${allCars.length} cars`);

      const availableCars = allCars;

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Car Catalog Report", 14, 22);

      // Add date and total count
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Cars: ${availableCars.length}`, 14, 36);

      // Prepare table data
      const tableColumns = [
        "Car Info",
        "Image",
        "Mileage",
        "Engine",
        "Color",
        "AA Score",
        "Key Features",
        "Price",
      ];

      // Store all image URLs for each car (array of arrays)
      const allImageUrls: string[][] = [];

      const tableData = availableCars.map((car) => {
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

          const reference = car.ref_no || "N/A";
          const chassis =
            car.chassis_no_full || car.chassis_no_masked || "N/A";

          // Get all photos
          const photos = car.photos || [];
          const imageUrls = photos.map((p) => p.url).filter((url) => url);
          allImageUrls.push(imageUrls);

          // Create image links text as a horizontal list
          let imageLinksText = "N/A";
          if (imageUrls.length > 0) {
            imageLinksText = imageUrls.map((_, index) => `${index + 1}`).join(", ");
          }

          return [
            `${car.year || "N/A"} ${car.make || "N/A"} ${car.model || "N/A"}${car.variant ? ` - ${car.variant}` : ""
            }\nRef: ${reference}${chassis && chassis !== "N/A" ? ` | Chassis: ${chassis}` : ""
            }`,
            imageLinksText,
            car.mileage_km ? `${car.mileage_km.toLocaleString()} km` : "N/A",
            car.engine_cc ? `${car.engine_cc.toLocaleString()} cc` : "N/A",
            car.color || "N/A",
            aaScore.length > 0 ? aaScore.join(" ") : "N/A",
            keyFeatures.length > 0 ? keyFeatures.join(", ") : "N/A",
            car.price_amount
              ? `BDT ${car.price_amount.toLocaleString()}`
              : "Price on request",
          ];
        } catch (error) {
          console.error("Error processing car data:", error, car);
          allImageUrls.push([]);
          return [
            "Error",
            "N/A",
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
            0: { cellWidth: 40 },
            1: { cellWidth: 30, cellPadding: { top: 2, bottom: 2, left: 3, right: 3 } },
            2: { cellWidth: 18 },
            3: { cellWidth: 18 },
            4: { cellWidth: 15 },
            5: { cellWidth: 18 },
            6: { cellWidth: 25 },
            7: { cellWidth: 25 },
          },
          didParseCell: function (data: any) {
            // Add clickable links to Image column (column index 1)
            if (data.column.index === 1 && data.cell.text && data.cell.text[0] !== "N/A") {
              const rowIndex = data.row.index;
              if (rowIndex >= 0 && rowIndex < allImageUrls.length) {
                const carImageUrls = allImageUrls[rowIndex];
                if (carImageUrls && carImageUrls.length > 0) {
                  // Store all image URLs for this car
                  data.cell.imageUrls = carImageUrls;
                  // Enable word wrap for multiple lines
                  data.cell.styles.cellPadding = { top: 2, bottom: 2, left: 3, right: 3 };
                }
              }
            }
          },
          didDrawCell: function (data: any) {
            // Add clickable links to Image column
            if (data.column.index === 1 && data.cell.imageUrls && data.cell.imageUrls.length > 0) {
              const cellX = data.cell.x;
              const cellY = data.cell.y;
              const cellWidth = data.cell.width;
              const cellHeight = data.cell.height;

              // Calculate approximate width per number (including comma and space)
              // Font size 8, approximate width: "1, " = ~8-10 points
              const numberWidth = 10;
              const lineHeight = 10;

              // Calculate how many numbers fit per line
              const numbersPerLine = Math.floor(cellWidth / numberWidth);

              // Add link annotation for each image (horizontal with wrapping)
              data.cell.imageUrls.forEach((imageUrl: string, index: number) => {
                const lineNumber = Math.floor(index / numbersPerLine);
                const positionInLine = index % numbersPerLine;

                const linkX = cellX + (positionInLine * numberWidth);
                const linkY = cellY + (lineNumber * lineHeight);

                doc.link(linkX, linkY, numberWidth, lineHeight, {
                  url: imageUrl,
                });
              });
            }
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


  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setMakeFilter("");
    setYearFilter("");
    setTransmissionFilter("");
    setFuelFilter("");
    setColorFilter("");
    setPriceRange({ min: "", max: "" });
    setSortBy("price_amount");
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
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-4 pb-6">
        {/* Search Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          makeFilter={makeFilter}
          setMakeFilter={setMakeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
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
              onViewCarAdmin: handleViewCarAdmin,
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
          totalItems={totalItems}
          perPage={perPage}
          onPageChange={setCurrentPage}
        />
      </div>

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
