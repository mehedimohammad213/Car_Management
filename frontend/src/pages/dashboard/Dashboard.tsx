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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  DollarSignIcon,
  ShoppingCartIcon,
  CarIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PackageIcon,
  ActivityIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  RefreshCwIcon,
  FilterIcon,
  CalendarIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BarChart3Icon,
  PieChartIcon,
  TrendingUp,
  TrendingDown,
  TargetIcon,
  AwardIcon,
  ZapIcon,
  GlobeIcon,
  CreditCardIcon,
  FileTextIcon,
  SettingsIcon,
  BellIcon,
} from "lucide-react";
import { dashboardApi, DashboardData } from "../../services/dashboardApi";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");

  const fetchData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const data = await dashboardApi.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ActivityIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Unable to load dashboard
          </h3>
          <p className="text-slate-600 dark:text-gray-400 mb-4">
            {error || "Failed to load dashboard data"}
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#4f46e5",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your car management
            system.
          </p>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Stock Value */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl border border-primary-200 dark:border-primary-800 p-6 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-500 rounded-xl shadow-lg">
                <DollarSignIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                Total Stock Value
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                ${dashboardData.totalStockValue.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                vs last month
              </p>
            </div>
          </div>
        </div>

        {/* Cars Sold */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-xl border border-secondary-200 dark:border-secondary-800 p-6 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary-500 rounded-xl shadow-lg">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">+8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1">
                Cars Sold
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {dashboardData.soldCars}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                this month
              </p>
            </div>
          </div>
        </div>

        {/* Available Cars */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-accent-orange-50 to-accent-orange-100 dark:from-accent-orange-900/20 dark:to-accent-orange-800/20 rounded-xl border border-accent-orange-200 dark:border-accent-orange-800 p-6 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-orange-500 rounded-xl shadow-lg">
                <CarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRightIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">-3.1%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-accent-orange-600 dark:text-accent-orange-400 mb-1">
                Available Cars
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {dashboardData.availableCars}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                in inventory
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-accent-purple-50 to-accent-purple-100 dark:from-accent-purple-900/20 dark:to-accent-purple-800/20 rounded-xl border border-accent-purple-200 dark:border-accent-purple-800 p-6 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-purple-500 rounded-xl shadow-lg">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRightIcon className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">+15.3%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-accent-purple-600 dark:text-accent-purple-400 mb-1">
                Categories
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {dashboardData.totalCategories}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                active categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Sales Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Sales Performance
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Monthly revenue trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-gray-400">
                Revenue
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dashboardData.monthlySales}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Sales",
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cars by Brand Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Brand Distribution
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Cars by manufacturer
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4 text-slate-600 dark:text-gray-400" />
              <span className="text-sm text-slate-600 dark:text-gray-400">
                {dashboardData.carsByBrand.length} brands
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dashboardData.carsByBrand}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ brand, count, percent }) =>
                  `${brand}: ${count} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="count"
                stroke="#fff"
                strokeWidth={2}
              >
                {dashboardData.carsByBrand.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number, name, props) => [
                  `${value} cars`,
                  props.payload.brand,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Orders Overview
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Order status and performance
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCartIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  24
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +12% this week
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  8
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  -3% this week
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <PackageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Processing
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  5
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  +2% this week
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">
                    Cancelled
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  2
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  -1% this week
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Total Orders
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  39
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Avg. Order Value
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  $28,450
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Stock Overview
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Inventory levels and alerts
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <PackageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">
                    In Stock
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {dashboardData.availableCars}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {Math.round(
                    (dashboardData.availableCars / dashboardData.totalCars) *
                      100
                  )}
                  % of total
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Low Stock
                  </span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  3
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Need restocking
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Total Cars
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboardData.totalCars}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  In inventory
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">
                    Out of Stock
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  2
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Urgent restock
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Stock Value
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  ${dashboardData.totalStockValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600 dark:text-gray-400">
                  Categories
                </span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {dashboardData.totalCategories}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
