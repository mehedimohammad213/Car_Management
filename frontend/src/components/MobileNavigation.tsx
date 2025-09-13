import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { usePendingOrders } from "../hooks/usePendingOrders";
import {
  HomeIcon,
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  BarChartIcon,
  PackageIcon,
  FolderIcon,
  SettingsIcon,
} from "lucide-react";

const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const { pendingCount } = usePendingOrders();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems = [
    { path: "/admin", label: "Dashboard", icon: BarChartIcon },
    { path: "/admin/cars", label: "Cars", icon: CarIcon },
    { path: "/admin/categories", label: "Categories", icon: FolderIcon },
    { path: "/admin/stock", label: "Stock", icon: PackageIcon },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
    { path: "/admin/settings", label: "Settings", icon: SettingsIcon },
  ];

  const userNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: BarChartIcon },
    { path: "/cars", label: "Cars", icon: CarIcon },
    { path: "/cart", label: "Cart", icon: ShoppingCartIcon },
    { path: "/orders", label: "Orders", icon: UserIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActiveRoute = isActive(item.path);
          const isCart = item.path === "/cart";
          const isAdminOrders =
            item.path === "/admin/orders" && user?.role === "admin";
          const cartCount = isCart ? getTotalItems() : 0;
          const ordersCount = isAdminOrders ? pendingCount : 0;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 relative ${
                isActiveRoute
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
                {isAdminOrders && ordersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {ordersCount > 9 ? "9+" : ordersCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
