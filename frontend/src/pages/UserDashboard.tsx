import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  ClockIcon,
  StarIcon,
  TrendingUpIcon,
  PackageIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  EyeIcon,
  CalendarIcon,
  DollarSignIcon,
  CheckCircleIcon,
  TruckIcon,
  HeartIcon,
  BellIcon,
  SettingsIcon,
} from "lucide-react";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "1",
      car: "Toyota Camry 2023",
      status: "Delivered",
      date: "2024-01-15",
      amount: 25000,
    },
    {
      id: "2",
      car: "Honda Civic 2022",
      status: "In Transit",
      date: "2024-01-10",
      amount: 22000,
    },
  ]);

  const [recentViews, setRecentViews] = useState([
    {
      id: "1",
      car: "Audi A4 2023",
      price: 45000,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "2",
      car: "Volkswagen Golf 2022",
      price: 28000,
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-primary-100 text-lg">
                Here's what's happening with your car shopping experience
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cart Items */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <ShoppingCartIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+2</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Cart Items
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {getTotalItems()}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                  ready to checkout
                </p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                  <PackageIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+1</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {recentOrders.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                  all time orders
                </p>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                  <EyeIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+3</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                  Recently Viewed
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {recentViews.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                  cars this week
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl border border-pink-200 dark:border-pink-800 p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-500 rounded-xl shadow-lg">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-semibold">+1</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">
                  Wishlist
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  5
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                  saved cars
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <PackageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recent Orders
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    Track your order history and status
                  </p>
                </div>
              </div>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="group p-5 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                        <CarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-lg">
                          {order.car}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-600 dark:text-gray-400">
                            Order #{order.id}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600 dark:text-gray-400 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {order.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSignIcon className="w-4 h-4 text-green-600" />
                        <p className="font-bold text-slate-900 dark:text-white text-lg">
                          ${order.amount.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}
                      >
                        {order.status === "Delivered" ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <TruckIcon className="w-3 h-3" />
                        )}
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Recently Viewed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <EyeIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recently Viewed
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    Continue browsing your favorite cars
                  </p>
                </div>
              </div>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <CarIcon className="w-4 h-4" />
                Browse All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentViews.map((item) => (
                <div
                  key={item.id}
                  className="group p-5 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.car}
                        className="w-20 h-16 object-cover rounded-xl shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md">
                        <HeartIcon className="w-3 h-3 text-red-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                        {item.car}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSignIcon className="w-4 h-4 text-green-600" />
                        <p className="font-bold text-slate-900 dark:text-white">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          4.8 (24 reviews)
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/car/${item.id}`}
                      className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors group-hover:scale-110"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
