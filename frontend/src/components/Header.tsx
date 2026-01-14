import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { usePendingOrders } from "../hooks/usePendingOrders";
import {
  HomeIcon,
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  BarChartIcon,
  CogIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  PackageIcon,
  UsersIcon,
  SettingsIcon,
  ChevronDownIcon,
  FolderIcon,
  CreditCard,
} from "lucide-react";

type NavItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const BdtIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-flex items-center justify-center font-extrabold leading-none text-lg text-current ${
      className ?? ""
    }`}
  >
    ৳
  </span>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems, clearCart } = useCart();
  const { pendingCount } = usePendingOrders();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Handle clicking outside dropdowns and escape key
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (profileDropdownOpen && !target.closest(".profile-dropdown")) {
        setProfileDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (profileDropdownOpen) setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [profileDropdownOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      clearCart();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      setModalVisible(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems: NavItem[] = [
    { path: "/admin", label: "Dashboard", icon: BarChartIcon },
    { path: "/admin/cars", label: "Car", icon: CarIcon },
    {
      path: "/admin/purchase-history",
      label: "Purchase",
      icon: BdtIcon,
    },
    {
      path: "/admin/payment-history",
      label: "Payment",
      icon: CreditCard,
    },
    { path: "/admin/stock", label: "Stock", icon: PackageIcon },
    { path: "/admin/orders", label: "Order", icon: ShoppingCartIcon },
    { path: "/admin/users", label: "User", icon: UsersIcon },
  ];

  const userNavItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: BarChartIcon },
    { path: "/cars", label: "Cars", icon: CarIcon },
    { path: "/cart", label: "Cart", icon: ShoppingCartIcon },
    { path: "/orders", label: "Orders", icon: UserIcon },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="relative flex items-center justify-between h-16 gap-3">
            {/* Logo - Left side */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center space-x-2"
              >
                <CarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  Dream Car
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActiveRoute = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-blue-200"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.path === "/cart" && getTotalItems() > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions - Right side */}
            <div className="flex items-center justify-end flex-shrink-0 ml-auto">
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block max-w-[8rem] truncate">
                    {user.name}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to={user.role === "admin" ? "/admin/profile" : "/profile"}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setModalVisible(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition"
              >
                {mobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-3 sm:px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActiveRoute = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActiveRoute
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-blue-200"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.path === "/cart" && getTotalItems() > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Professional Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 sm:p-6 transition-opacity duration-300 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
              modalVisible
                ? "scale-100 translate-y-0"
                : "scale-95 translate-y-4"
            }`}
          >
            {/* Header Section */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <LogOutIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Confirm Logout
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    You're about to sign out of your account
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-5 sm:px-6 pb-6">
              <div className="bg-status-warning-50 dark:bg-status-warning-900/20 border border-status-warning-200 dark:border-status-warning-800 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-status-warning-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-status-warning-800 dark:text-status-warning-200 mb-1">
                      Important Notice
                    </p>
                    <p className="text-sm text-status-warning-700 dark:text-status-warning-300">
                      Any unsaved changes will be lost. Make sure to save your
                      work before logging out.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 rounded-full text-xs font-medium">
                    {user?.role?.charAt(0)?.toUpperCase() +
                      user?.role?.slice(1) || "User"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    setModalVisible(false);
                  }}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isLoggingOut ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <LogOutIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
