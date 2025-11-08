import React from "react";
import {
  Car,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import { Car as CarType } from "../../services/carApi";
import { Stock } from "../../services/stockApi";

interface CarModalProps {
  selectedCar: CarType | null;
  showCarModal: boolean;
  onClose: () => void;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onThumbnailClick: (index: number) => void;
  onDownloadPdf: (pdfUrl: string, fileName: string, carId?: number) => void;
  pdfFiles: Map<number, Array<{ name: string; url: string }>>;
  pdfLoading: Map<number, boolean>;
  stockData: Map<number, Stock>;
  getStatusColor: (status: string) => string;
  getStockStatusColor: (quantity: number, status: string) => string;
  getStockStatusTextColor: (quantity: number, status: string) => string;
}

const CarModal: React.FC<CarModalProps> = ({
  selectedCar,
  showCarModal,
  onClose,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onThumbnailClick,
  onDownloadPdf,
  pdfFiles,
  pdfLoading,
  stockData,
  getStatusColor,
  getStockStatusColor,
  getStockStatusTextColor,
}) => {
  if (!showCarModal || !selectedCar) return null;

  const specificationItems: Array<{
    label: string;
    value: React.ReactNode;
  }> = [
    {
      label: "Mileage",
      value: selectedCar.mileage_km
        ? `${selectedCar.mileage_km.toLocaleString()} km`
        : "N/A",
    },
    {
      label: "Year",
      value: selectedCar.year || "N/A",
    },
    {
      label: "Engine",
      value: selectedCar.engine_cc
        ? `${selectedCar.engine_cc.toLocaleString()} cc`
        : "N/A",
    },
    {
      label: "Transmission",
      value: selectedCar.transmission || "N/A",
    },
    {
      label: "Drivetrain",
      value:
        (selectedCar as any).drive_type ||
        (selectedCar as any).drivetrain ||
        "N/A",
    },
    {
      label: "Steering",
      value: selectedCar.steering || "N/A",
    },
    {
      label: "Fuel",
      value: selectedCar.fuel || "N/A",
    },
    {
      label: "Reference No.",
      value:
        selectedCar.ref_no || `AA${selectedCar.id.toString().padStart(6, "0")}`,
    },
    {
      label: "Registration Year",
      value: selectedCar.year || "N/A",
    },
    {
      label: "Exterior Color",
      value: selectedCar.color || "N/A",
    },
    {
      label: "Seating Capacity",
      value: selectedCar.seats || "N/A",
    },
    {
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            selectedCar.status
          )}`}
        >
          {selectedCar.status
            ? selectedCar.status.charAt(0).toUpperCase() +
              selectedCar.status.slice(1)
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
            onClick={onClose}
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
                      onClick={onPrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={onNextImage}
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
                        onClick={() => onThumbnailClick(index)}
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

                  {/* Auction Sheet at the end of the row */}
                  {!pdfLoading.get(selectedCar.id) &&
                    pdfFiles.get(selectedCar.id) &&
                    pdfFiles.get(selectedCar.id)!.length > 0 && (
                      <>
                        {pdfFiles.get(selectedCar.id)!.map((pdf, index) => (
                          <div
                            key={`pdf-${index}`}
                            className="w-20 h-16 bg-red-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-red-200 transition-colors group ml-auto"
                            onClick={() =>
                              onDownloadPdf(pdf.url, pdf.name, selectedCar.id)
                            }
                            title="Download Auction Sheet"
                          >
                            <Download className="w-4 h-4 text-red-600 group-hover:text-red-700 mb-1" />
                            <span className="text-xs text-red-600 font-medium">
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
                  {/* Refined Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {specificationItems.map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 px-4 py-3 shadow-sm"
                      >
                        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {label}
                        </span>
                        <div className="mt-2 text-sm font-semibold text-gray-900">
                          {value}
                        </div>
                      </div>
                    ))}
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
  );
};

export default CarModal;
