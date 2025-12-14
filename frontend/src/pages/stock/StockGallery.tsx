"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Image as ImageIcon,
  MapPin,
  Gauge,
  Calendar,
  Palette,
  Hash,
  Tag,
} from "lucide-react";
import { stockApi, Stock } from "../../services/stockApi";
import { formatPrice, getStatusColor } from "../../utils/carUtils";

const StockGallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchStock = async () => {
      if (!id) {
        setError("Missing stock id");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await stockApi.getStock(parseInt(id, 10));
        if (response.success && response.data) {
          setStock(response.data);
          setCurrentImageIndex(0);
        } else {
          setError("Stock not found");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load stock");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStock();
  }, [id]);

  const photos = useMemo(() => {
    if (!stock?.car?.photos) return [];
    return stock.car.photos.filter((photo) => !photo.is_hidden && photo.url);
  }, [stock]);

  const car = stock?.car;
  const priceAmount =
    car?.price_amount !== undefined && car?.price_amount !== null
      ? typeof car.price_amount === "string"
        ? parseFloat(car.price_amount)
        : car.price_amount
      : undefined;

  const handleThumbClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !stock || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg text-center border border-gray-100">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested stock could not be located."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-6">
      <div className="w-full max-w-screen-2xl mx-auto space-y-3 sm:space-y-4 md:space-y-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-md border border-gray-100 hover:-translate-y-0.5 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-gray-500">Stock Gallery</p>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight truncate">
              {car.year} {car.make} {car.model}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {photos.length > 0 ? (
                  <img
                    src={photos[currentImageIndex].url}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                    <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    <span className="text-sm sm:text-base">No photos available</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
                  <span
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border ${getStatusColor(
                      stock.status
                    )}`}
                  >
                    {stock.status.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/80 backdrop-blur border border-gray-200 text-gray-800">
                    Qty: {stock.quantity}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                  {photos.length > 0
                    ? `${currentImageIndex + 1} / ${photos.length}`
                    : "0 / 0"}
                </div>
              </div>

              {photos.length > 1 && (
                <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-white border-t border-gray-100">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {photos.map((photo, index) => (
                      <button
                        key={photo.id || index}
                        onClick={() => handleThumbClick(index)}
                        className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border transition-all ${
                          currentImageIndex === index
                            ? "border-blue-600 shadow-lg"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-500">Reference</p>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-all">
                    {car.ref_no || `AA${car.id.toString().padStart(6, "0")}`}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500">Price</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {priceAmount && !isNaN(priceAmount)
                      ? formatPrice(priceAmount, car.price_currency)
                      : "Price on request"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Year:</span>
                  <span className="truncate">{car.year || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Mileage:</span>
                  <span className="truncate">
                    {car.mileage_km
                      ? `${car.mileage_km.toLocaleString()} km`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Color:</span>
                  <span className="capitalize truncate">{car.color || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Engine:</span>
                  <span className="truncate">
                    {car.engine_cc
                      ? `${car.engine_cc.toLocaleString()} cc`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 sm:gap-2 text-gray-700 sm:col-span-2">
                  <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold">Chassis:</span>
                    <span className="break-all block">
                      {car.chassis_no_full ||
                        car.chassis_no_masked ||
                        "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Package:</span>
                  <span className="truncate">{car.package || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Location:</span>
                  <span className="truncate">{car.location || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                  <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Photos:</span>
                  <span>{photos.length}</span>
                </div>
              </div>

              {car.keys_feature && (
                <div className="bg-slate-50 rounded-xl p-2 sm:p-3 border border-slate-100">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Key Features
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {car.keys_feature
                      .split(",")
                      .map((feature) => feature.trim())
                      .filter(Boolean)
                      .map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white border border-gray-200 text-gray-700 text-[10px] sm:text-xs font-medium rounded-full shadow-sm"
                        >
                          {feature}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockGallery;
