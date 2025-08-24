"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon,
  EyeIcon,
  CarIcon,
} from "lucide-react";
import { Car } from "../types";
import { mockApi } from "../services/mockData";
import { useCart } from "../contexts/CartContext";

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const cars = await mockApi.getCars();
      // Mock wishlist - take first 5 cars
      setWishlistItems(cars.slice(0, 5));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = (carId: string) => {
    setWishlistItems(wishlistItems.filter((car) => car.id !== carId));
  };

  const handleAddToCart = (car: Car) => {
    addToCart(car);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(car.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Save your favorite cars for later
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start browsing cars and add them to your wishlist to see them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CarIcon className="w-4 h-4 mr-2" />
            Browse Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Wishlist
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {wishlistItems.length} car{wishlistItems.length !== 1 ? "s" : ""} in
          your wishlist
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((car) => (
          <div
            key={car.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Car Image */}
            <div className="relative">
              <img
                src={car.image}
                alt={car.model}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => removeFromWishlist(car.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove from wishlist"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              {!car.isAvailable && (
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {car.year} • {car.mileage.toLocaleString()} miles
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${car.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Car Specs */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fuel:</span> {car.fuelType}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Transmission:</span>{" "}
                  {car.transmission}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Category:</span> {car.category}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Stock:</span> {car.stock}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  to={`/car/${car.id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(car)}
                  disabled={!car.isAvailable}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={car.isAvailable ? "Add to cart" : "Out of stock"}
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Wishlist Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Total value: $
              {wishlistItems
                .reduce((sum, car) => sum + car.price, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => {
                wishlistItems.forEach((car) => {
                  if (car.isAvailable) {
                    addToCart(car);
                  }
                });
              }}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCartIcon className="w-4 h-4 mr-2" />
              Add All to Cart
            </button>
            <button
              onClick={() => setWishlistItems([])}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Clear Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
