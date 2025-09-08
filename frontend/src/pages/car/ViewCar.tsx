import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  CarIcon,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Users,
  DollarSign,
  Settings,
  Star,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { carApi, Car } from "../../services/carApi";
import { categoryApi, Category } from "../../services/categoryApi";

const ViewCar: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [carData, categoriesData] = await Promise.all([
          carApi.getCar(parseInt(id)),
          categoryApi.getCategories(),
        ]);
        // Extract car from response - handle both single car and paginated responses
        let car: Car | null = null;
        if (carData.data.car) {
          car = carData.data.car;
        } else if (
          Array.isArray(carData.data.data) &&
          carData.data.data.length > 0
        ) {
          car = carData.data.data[0];
        } else if (carData.data && "id" in carData.data) {
          car = carData.data as Car;
        }
        setCar(car);
        setCategories(categoriesData.data.categories || []);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!car) return;

    setIsDeleting(true);
    try {
      await carApi.deleteCar(car.id);
      navigate("/admin/cars", {
        state: { message: "Car deleted successfully!" },
      });
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Image gallery functions
  const nextImage = () => {
    if (!car?.photos) return;
    setCurrentImageIndex((prev) =>
      prev === car.photos!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!car?.photos) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.photos!.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (amount?: number, currency?: string) => {
    if (!amount) return "Price on request";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return "Not specified";
    return new Intl.NumberFormat("en-US").format(mileage) + " km";
  };

  const getCurrentImage = () => {
    if (!car?.photos || car.photos.length === 0) return null;
    return car.photos[currentImageIndex];
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
            onClick={() => navigate("/admin/cars")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Car Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/cars")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {car.make} {car.model}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {car.year} • {car.category?.name} • ID: {car.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  car.status
                )}`}
              >
                {car.status.replace("_", " ").toUpperCase()}
              </span>
              <button
                onClick={() => navigate(`/update-car/${car.id}`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative aspect-video bg-gray-100">
                {getCurrentImage() ? (
                  <img
                    src={getCurrentImage()?.url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setShowImageModal(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}

                {/* Image Navigation */}
                {car.photos && car.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {car.photos.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {car.photos && car.photos.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Gallery
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {car.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`${car.make} ${car.model} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.is_primary && (
                        <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                          ★
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Key Specifications Only */}
          <div>
            {/* Key Specifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Key Specifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Year</span>
                  </div>
                  <span className="font-semibold">{car.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gauge className="w-4 h-4" />
                    <span>Mileage</span>
                  </div>
                  <span className="font-semibold">
                    {formatMileage(car.mileage_km)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Fuel className="w-4 h-4" />
                    <span>Fuel</span>
                  </div>
                  <span className="font-semibold">
                    {car.fuel || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Settings className="w-4 h-4" />
                    <span>Transmission</span>
                  </div>
                  <span className="font-semibold">
                    {car.transmission || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Palette className="w-4 h-4" />
                    <span>Color</span>
                  </div>
                  <span className="font-semibold">
                    {car.color || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Seats</span>
                  </div>
                  <span className="font-semibold">
                    {car.seats || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {formatPrice(car.price_amount, car.price_currency)}
              </h3>
              {car.price_basis && (
                <p className="text-gray-600 text-sm">{car.price_basis}</p>
              )}
            </div>
          </div>

          {/* Location & Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location & Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-semibold">
                  {car.location || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Country</span>
                <span className="font-semibold">
                  {car.country_origin || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    car.status
                  )}`}
                >
                  {car.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Grading */}
          {car.grade_overall && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Grading
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overall Grade</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(car.grade_overall || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">
                      {car.grade_overall}/10
                    </span>
                  </div>
                </div>
                {car.grade_exterior && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Exterior</span>
                    <span className="font-semibold">{car.grade_exterior}</span>
                  </div>
                )}
                {car.grade_interior && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Interior</span>
                    <span className="font-semibold">{car.grade_interior}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technical Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Technical Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Engine
                </label>
                <p className="text-gray-900">
                  {car.engine_cc ? `${car.engine_cc} cc` : "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Drive
                </label>
                <p className="text-gray-900">{car.drive || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Steering
                </label>
                <p className="text-gray-900">
                  {car.steering || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Model Code
                </label>
                <p className="text-gray-900">
                  {car.model_code || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Variant
                </label>
                <p className="text-gray-900">
                  {car.variant || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Registration
                </label>
                <p className="text-gray-900">
                  {car.reg_year_month || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Identification
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Reference Number
                </label>
                <p className="text-gray-900 font-mono">
                  {car.ref_no || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Chassis (Masked)
                </label>
                <p className="text-gray-900 font-mono">
                  {car.chassis_no_masked || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Chassis (Full)
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-mono flex-1">
                    {car.chassis_no_full
                      ? "••••••••••••••••••••"
                      : "Not specified"}
                  </p>
                  {car.chassis_no_full && (
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {car.notes && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Additional Notes
            </h3>
            <p className="text-gray-700 leading-relaxed">{car.notes}</p>
          </div>
        )}

        {/* Car Details */}
        {car.details && car.details.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Detailed Information
            </h3>
            <div className="space-y-8">
              {car.details.map((detail, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {detail.short_title || `Detail Section ${index + 1}`}
                  </h4>
                  {detail.full_title && (
                    <h5 className="text-md font-medium text-gray-700 mb-3">
                      {detail.full_title}
                    </h5>
                  )}
                  {detail.description && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {detail.description}
                    </p>
                  )}
                  {/* Sub Details */}
                  {detail.sub_details && detail.sub_details.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-semibold text-gray-700 mb-2">
                        Sub Details:
                      </h6>
                      <div className="space-y-2">
                        {detail.sub_details.map((subDetail, subIndex) => (
                          <div
                            key={subIndex}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                          >
                            <div className="space-y-1">
                              {subDetail.title && (
                                <div>
                                  <span className="text-xs font-medium text-gray-600">
                                    Title:{" "}
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {subDetail.title}
                                  </span>
                                </div>
                              )}
                              {subDetail.description && (
                                <div>
                                  <span className="text-xs font-medium text-gray-600">
                                    Description:{" "}
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {subDetail.description}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detail.images && detail.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {detail.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`Detail ${index + 1} - Image ${imgIndex + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && getCurrentImage() && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <EyeOff className="w-6 h-6" />
            </button>
            <img
              src={getCurrentImage()?.url}
              alt={`${car.make} ${car.model}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {car.photos && car.photos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Car"
        message="Are you sure you want to delete"
        itemName={car ? `${car.make} ${car.model}` : ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ViewCar;
