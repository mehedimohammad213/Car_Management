import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSignIcon,
  ShoppingCartIcon,
  CarIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { dashboardApi, DashboardData } from "../services/dashboardApi";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardApi.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center text-slate-500">
        {error || "Failed to load dashboard data"}
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400">
          Overview of your car management system
        </p>
      </div>

      {/* Stats Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSignIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Total Stock Value
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${dashboardData.totalStockValue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+12.5%</span>
              <span className="text-slate-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Cars Sold
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardData.soldCars}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+8.2%</span>
              <span className="text-slate-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Available Cars
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardData.availableCars}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-red-600 dark:text-red-400">-3.1%</span>
              <span className="text-slate-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Categories
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dashboardData.totalCategories}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 dark:text-green-400">+15.3%</span>
              <span className="text-slate-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Monthly Sales
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    "Sales",
                  ]}
                  labelStyle={{ color: "#374151" }}
                />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cars by Brand */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Cars by Brand
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.carsByBrand}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ brand, count }) => `${brand}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData.carsByBrand.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}`, "Cars"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Cars Table */}
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Cars Added
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.recentCars.map((car, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={car.primary_photo_url || "/placeholder-car.jpg"}
                          alt={car.model}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {car.model}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {car.variant || car.model_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {car.make}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {car.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {car.price_formatted ||
                        `$${car.price_amount?.toLocaleString() || "N/A"}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          car.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
