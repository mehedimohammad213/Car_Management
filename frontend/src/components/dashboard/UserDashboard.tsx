import React from "react";
import { Link } from "react-router-dom";
import {
    ShoppingCartIcon,
    PackageIcon,
    ArrowUpRightIcon,
    EyeIcon,
    CarIcon,
    CalendarIcon,
    CheckCircleIcon,
    TruckIcon,
    ClockIcon,
} from "lucide-react";
import { Order } from "../../services/orderApi";

export const BdtIcon: React.FC<{ className?: string }> = ({ className }) => (
    <span
        className={`inline-flex items-center justify-center font-extrabold leading-none text-lg text-current ${className ?? ""
            }`}
    >
        ৳
    </span>
);

interface UserDashboardProps {
    totalCartItems: number;
    recentOrders: Order[];
    loadingOrders: boolean;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
    totalCartItems,
    recentOrders,
    loadingOrders,
}) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                    {totalCartItems}
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
                            {loadingOrders ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <PackageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600 dark:text-gray-400">
                                        No recent orders
                                    </p>
                                </div>
                            ) : (
                                recentOrders.map((order) => {
                                    const firstCar =
                                        order.items && order.items.length > 0
                                            ? order.items[0].car
                                            : null;
                                    const carName = firstCar
                                        ? `${firstCar.make} ${firstCar.model} ${firstCar.year || ""
                                        }`
                                        : `Order #${order.id}`;
                                    const carCount = order.items?.length || 0;
                                    const orderDate = new Date(
                                        order.created_at
                                    ).toLocaleDateString();

                                    return (
                                        <div
                                            key={order.id}
                                            className="group p-5 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-slate-200 dark:border-gray-600 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex-shrink-0">
                                                        <CarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg leading-snug">
                                                            {carName}
                                                            {carCount > 1 && ` + ${carCount - 1} more`}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-600 dark:text-gray-400">
                                                            <span>Order #{order.id}</span>
                                                            <span className="hidden sm:inline text-slate-400">•</span>
                                                            <span className="flex items-center gap-1">
                                                                <CalendarIcon className="w-3 h-3" />
                                                                {orderDate}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 sm:items-end text-left sm:text-right">
                                                    <div className="flex items-center gap-2">
                                                        <BdtIcon className="text-green-600 text-base" />
                                                        <p className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                                                            BDT {order.total_amount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${order.status === "delivered"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                                : order.status === "shipped"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                                                    : order.status === "approved"
                                                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                                                                        : order.status === "canceled"
                                                                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                                            }`}
                                                    >
                                                        {order.status === "delivered" ? (
                                                            <CheckCircleIcon className="w-3 h-3" />
                                                        ) : order.status === "shipped" ||
                                                            order.status === "approved" ? (
                                                            <TruckIcon className="w-3 h-3" />
                                                        ) : (
                                                            <ClockIcon className="w-3 h-3" />
                                                        )}
                                                        {order.status.charAt(0).toUpperCase() +
                                                            order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
