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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400">
          Here's what's happening with your car shopping
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                Cart Items
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {getTotalItems()}
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <PackageIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                Orders
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {recentOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <StarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                Recently Viewed
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {recentViews.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <Link
              to="/orders"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <CarIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.car}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order #{order.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${order.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {order.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Views */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Recently Viewed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recently Viewed
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentViews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.car}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.car}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/car/${item.id}`}
                    className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <CarIcon className="w-5 h-5" />
                  </Link>
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
