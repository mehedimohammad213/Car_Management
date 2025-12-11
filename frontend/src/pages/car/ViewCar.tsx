import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { carApi, Car as CarType } from "../../services/carApi";
import { stockApi, Stock } from "../../services/stockApi";
import { useAuth } from "../../contexts/AuthContext";
import CarViewHeader from "../../components/car/CarViewHeader";
import CarImageGallery from "../../components/car/CarImageGallery";
import CarSpecifications from "../../components/car/CarSpecifications";
import CarDetailsSection from "../../components/car/CarDetailsSection";
import CarAttachedFile from "../../components/car/CarAttachedFile";
import ImageModal from "../../components/car/ImageModal";

const ViewCar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [car, setCar] = useState<CarType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [stockData, setStockData] = useState<Stock | null>(null);
  const [pdfFiles, setPdfFiles] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [attachedFileInfo, setAttachedFileInfo] = useState<{
    url: string;
    type: 'image' | 'pdf';
    filename: string;
  } | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const isAdmin = user?.role === "admin";

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

          // Fetch attached file info if admin and car has attached_file
          if (isAdmin && carData.attached_file) {
            try {
              const fileInfo = await carApi.getAttachedFile(carData.id);
              if (fileInfo.success) {
                setAttachedFileInfo(fileInfo.data);
              }
            } catch (error) {
              console.error("Error fetching attached file info:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, [id, isAdmin]);

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

  const handleViewFile = () => {
    if (attachedFileInfo) {
      window.open(attachedFileInfo.url, '_blank');
    }
  };

  const handleDownloadFile = async () => {
    if (!car || !attachedFileInfo) return;

    try {
      setIsLoadingFile(true);
      const blob = await carApi.downloadAttachedFile(car.id);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachedFileInfo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(attachedFileInfo.url, '_blank');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const getBackRoute = () => {
    return isAdmin ? `/admin/cars?${searchParams.toString()}` : `/cars?${searchParams.toString()}`;
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
            onClick={() => navigate(getBackRoute())}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <CarViewHeader
          car={car}
          isAdmin={isAdmin}
          getBackRoute={getBackRoute}
        />

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
          <div className="p-2 sm:p-4 lg:p-6 xl:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <CarImageGallery
                car={car}
                currentImageIndex={currentImageIndex}
                pdfFiles={pdfFiles}
                pdfLoading={pdfLoading}
                onPrevImage={handlePrevImage}
                onNextImage={handleNextImage}
                onThumbnailClick={handleThumbnailClick}
                onImageClick={() => setShowImageModal(true)}
                onDownloadPdf={handleDownloadPdf}
              />

              <CarSpecifications car={car} stockData={stockData} />
            </div>
          </div>
        </div>

        <CarDetailsSection details={car.details} />

        {/* Attached File - Admin Only */}
        {isAdmin && attachedFileInfo && (
          <CarAttachedFile
            attachedFileInfo={attachedFileInfo}
            isLoadingFile={isLoadingFile}
            onViewFile={handleViewFile}
            onDownloadFile={handleDownloadFile}
          />
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && car.photos && car.photos.length > 0 && (
        <ImageModal
          imageUrl={car.photos[currentImageIndex].url}
          alt={`${car.make} ${car.model}`}
          hasMultipleImages={car.photos.length > 1}
          onClose={() => setShowImageModal(false)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
};

export default ViewCar;
