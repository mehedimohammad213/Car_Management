import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon } from "lucide-react";
// Removed mockData import
import { Car } from "../../types";
import { useCart } from "../../contexts/CartContext";

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isCarLoading } = useCart();

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        // Placeholder - no mock data
        setCar(null);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleAddToCart = () => {
    if (car) {
      addToCart(car, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Car not found.</p>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Car Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
            {!car.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Car Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {car.brand} {car.model}
              </h1>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  (4.8)
                </span>
              </div>
            </div>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-bold">
              ${car.price.toLocaleString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {car.year} • {car.mileage.toLocaleString()} miles
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Category
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {car.category}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fuel Type
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {car.fuelType}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transmission
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {car.transmission}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Stock</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {car.stock} units
              </p>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              >
                {Array.from(
                  { length: Math.min(10, car.stock) },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total: ${(car.price * quantity).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!car.isAvailable || isCarLoading(car.id)}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCarLoading(car.id) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Warranty
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              3-year comprehensive warranty included
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Financing
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Available financing options with competitive rates
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Delivery
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Free delivery within 50 miles, additional charges apply beyond
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
