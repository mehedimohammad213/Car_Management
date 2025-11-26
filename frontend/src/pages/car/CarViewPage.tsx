import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import { carApi, Car as CarType } from "../../services/carApi";
import { stockApi, Stock } from "../../services/stockApi";
import {
  getStatusColor,
  getStockStatusColor,
  getStockStatusTextColor,
} from "../../utils/carUtils";

const CarViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [car, setCar] = useState<CarType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [pdfFiles, setPdfFiles] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const carResponse = await carApi.getCar(parseInt(id));

        // Extract car from response
        let carData: CarType | null = null;
        if (carResponse.data.car) {
          carData = carResponse.data.car;
        } else if (
          Array.isArray(carResponse.data.data) &&
          carResponse.data.data.length > 0
        ) {
          carData = carResponse.data.data[0];
        } else if (carResponse.data && "id" in carResponse.data) {
          carData = carResponse.data as CarType;
        }

        if (carData) {
          setCar(carData);

          // Fetch stock data
          try {
            const stockResponse = await stockApi.getStocks({ per_page: 1000 });
            if (stockResponse.success && stockResponse.data) {
              const stock = stockResponse.data.find(
                (s: Stock) =>
                  (typeof s.car_id === "string"
                    ? parseInt(s.car_id)
                    : s.car_id) === carData.id
              );
              if (stock) {
                setStockData(stock);
              }
            }
          } catch (error) {
            console.error("Error fetching stock data:", error);
          }

          // Fetch PDF files
          await fetchPdfFiles(carData);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, [id]);

  const fetchPdfFiles = async (car: CarType) => {
    try {
      setPdfLoading(true);
      if (car.attached_file) {
        try {
          const fileInfo = await carApi.getAttachedFile(car.id);
          if (fileInfo.success && fileInfo.data) {
            setPdfFiles([
              {
                name: fileInfo.data.filename,
                url: fileInfo.data.url,
              },
            ]);
          }
        } catch (apiError) {
          console.log("API call failed, using direct file path:", apiError);
          const fileName =
            car.attached_file.split("/").pop() || "Vehicle Document.pdf";
          const baseUrl = "http://localhost:8000";
          const pdfUrl = car.attached_file.startsWith("http")
            ? car.attached_file
            : `${baseUrl}${car.attached_file}`;

          setPdfFiles([
            {
              name: fileName,
              url: pdfUrl,
            },
          ]);
        }
      } else {
        setPdfFiles([]);
      }
    } catch (error) {
      console.error("Error processing PDF files:", error);
      setPdfFiles([]);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPdf = (pdfUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNextImage = () => {
    if (!car?.photos) return;
    setCurrentImageIndex((prev) =>
      prev === car.photos!.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!car?.photos) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.photos!.length - 1 : prev - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Car not found
          </h2>
          <button
            onClick={() => navigate(`/cars?${searchParams.toString()}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const specificationItems: Array<{
    label: string;
    value: React.ReactNode;
  }> = [
    {
      label: "Mileage",
      value: car.mileage_km
        ? `${car.mileage_km.toLocaleString()} km`
        : "N/A",
    },
    {
      label: "Year",
      value: car.year || "N/A",
    },
    {
      label: "Engine",
      value: car.engine_cc
        ? `${car.engine_cc.toLocaleString()} cc`
        : "N/A",
    },
    {
      label: "Transmission",
      value: car.transmission || "N/A",
    },
    {
      label: "Drivetrain",
      value:
        (car as any).drive_type || (car as any).drivetrain || "N/A",
    },
    {
      label: "Steering",
      value: car.steering || "N/A",
    },
    {
      label: "Fuel",
      value: car.fuel || "N/A",
    },
    {
      label: "Reference No.",
      value: car.ref_no || `AA${car.id.toString().padStart(6, "0")}`,
    },
    {
      label: "Registration Year",
      value: car.year || "N/A",
    },
    {
      label: "Exterior Color",
      value: car.color || "N/A",
    },
    {
      label: "Seating Capacity",
      value: car.seats || "N/A",
    },
    {
      label: "Overall Grade",
      value:
        car.grade_overall !== undefined && car.grade_overall !== null
          ? car.grade_overall
          : "N/A",
    },
    {
      label: "Engine No.",
      value: car.engine_number || "N/A",
    },
    {
      label: "Chassis No.",
      value: car.chassis_no_full || car.chassis_no_masked || "N/A",
    },
    {
      label: "No. of Keys",
      value:
        car.number_of_keys !== undefined && car.number_of_keys !== null
          ? car.number_of_keys
          : "N/A",
    },
    {
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            car.status
          )}`}
        >
          {car.status
            ? car.status.charAt(0).toUpperCase() + car.status.slice(1)
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(`/cars?${searchParams.toString()}`)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Catalog</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {car.year} {car.make} {car.model}
                {car.variant && ` - ${car.variant}`}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
          <div className="p-2 sm:p-4 lg:p-6 xl:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Photos (2/3 width) */}
              <div className="lg:col-span-2">
                {/* Main Photo */}
                <div className="relative mb-4">
                  {car.photos && car.photos.length > 0 ? (
                    <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <img
                        src={car.photos[currentImageIndex].url}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <Car className="w-24 h-24 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400 ml-4 text-lg">
                        No photos available
                      </p>
                    </div>
                  )}

                  {/* Photo Navigation Arrows */}
                  {car.photos && car.photos.length > 1 && (
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
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {car.photos.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {car.photos && car.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                    {car.photos.slice(0, 6).map((photo: any, index: number) => (
                      <img
                        key={index}
                        src={photo.url}
                        alt={`${car.make} ${car.model} thumbnail ${index + 1}`}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-md cursor-pointer transition-all flex-shrink-0 ${
                          currentImageIndex === index
                            ? "ring-2 ring-blue-500 opacity-100"
                            : "hover:opacity-80 opacity-70"
                        }`}
                      />
                    ))}
                    {car.photos.length > 6 && (
                      <div className="w-24 h-20 sm:w-28 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                        +{car.photos.length - 6} more
                      </div>
                    )}

                    {/* Auction Sheet at the end of the row */}
                    {!pdfLoading && pdfFiles.length > 0 && (
                      <>
                        {pdfFiles.map((pdf, index) => (
                          <div
                            key={`pdf-${index}`}
                            className="w-20 h-16 bg-red-100 dark:bg-red-900/30 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors group ml-auto"
                            onClick={() => handleDownloadPdf(pdf.url, pdf.name)}
                            title="Download Auction Sheet"
                          >
                            <Download className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 mb-1" />
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                              Auction Sheet
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Details (1/3 width) */}
              <div className="space-y-4 sm:space-y-6">
                {/* Specifications Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Specifications
                    </h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {/* Refined Specifications Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                      {specificationItems.map(({ label, value }) => (
                        <div
                          key={label}
                          className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-4 py-3 shadow-sm"
                        >
                          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {label}
                          </span>
                          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stock Information - Full Width */}
                    {stockData && (
                      <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-sm font-medium ${getStockStatusColor(
                              stockData.quantity,
                              stockData.status
                            )}`}
                          >
                            {stockData.quantity}
                          </span>
                          <span
                            className={`text-xs ${getStockStatusTextColor(
                              stockData.quantity,
                              stockData.status
                            )}`}
                          >
                            {stockData.status}
                          </span>
                          {stockData.price && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Stock Price: ${typeof stockData.price === "string" ? parseFloat(stockData.price).toLocaleString() : stockData.price.toLocaleString()}
                            </span>
                          )}
                          {stockData.notes && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {stockData.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Chassis Number with View Button */}
                    {(car as any).chassis_no && (
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Chassis No.:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {(car as any).chassis_no}
                          </span>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium">
                            View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                {car.detail && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
                      Additional Details
                    </h3>
                    {car.detail.short_title && (
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {car.detail.short_title}
                      </p>
                    )}
                    {car.detail.full_title && (
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {car.detail.full_title}
                      </p>
                    )}
                    {car.detail.description && (
                      <p className="text-gray-700 dark:text-gray-300">
                        {car.detail.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Location */}
                {(car.location || car.country_origin || (car as any).port) && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
                      Location
                    </h3>
                    <div className="space-y-2">
                      {(car as any).port && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>Port: {(car as any).port}</span>
                        </div>
                      )}
                      {car.location && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>Location: {car.location}</span>
                        </div>
                      )}
                      {car.country_origin && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>Country: {car.country_origin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {car.notes && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
                      Notes
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{car.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarViewPage;
