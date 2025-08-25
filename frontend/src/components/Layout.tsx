import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
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
  DollarSignIcon,
  UsersIcon,
  HeartIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarMinimized, setSidebarMinimized] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const adminNavItems = [
    { path: "/admin", label: "Dashboard", icon: BarChartIcon },
    { path: "/admin/cars", label: "Cars", icon: CarIcon },
    { path: "/admin/stock", label: "Stock", icon: PackageIcon },
    { path: "/admin/sell", label: "Sell", icon: DollarSignIcon },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
    { path: "/admin/clients", label: "Clients", icon: UsersIcon },

    {
      path: "/admin/settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ];

  const userNavItems = [
    { path: "/", label: "Browse Cars", icon: HomeIcon },
    { path: "/wishlist", label: "Wishlist", icon: HeartIcon },
    { path: "/cart", label: "Cart", icon: ShoppingCartIcon },
    { path: "/orders", label: "My Orders", icon: UserIcon },
    {
      path: "/profile",
      label: "Profile",
      icon: UserIcon,
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Section 1: Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto lg:flex-shrink-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${sidebarMinimized ? "w-16" : "w-64 sm:w-72"}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              {!sidebarMinimized && (
                <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-bold text-white">
                  CarSelling
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-2 sm:px-4 py-4 overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="space-y-1 sm:space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActiveRoute = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActiveRoute
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
                        : "text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title={sidebarMinimized ? item.label : ""}
                  >
                    <div className="relative">
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                          sidebarMinimized ? "mx-auto" : "mr-2 sm:mr-3"
                        } ${
                          isActiveRoute
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 group-hover:text-slate-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                        }`}
                      />
                      {/* Cart badge for minimized view */}
                      {sidebarMinimized &&
                        item.path === "/cart" &&
                        getTotalItems() > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {getTotalItems() > 9 ? "9+" : getTotalItems()}
                          </span>
                        )}
                    </div>
                    {!sidebarMinimized && (
                      <>
                        <span className="flex-1 text-xs sm:text-sm">
                          {item.label}
                        </span>
                        {item.path === "/cart" && getTotalItems() > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[20px] text-center">
                            {getTotalItems()}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarMinimized(!sidebarMinimized)}
          className="hidden lg:flex fixed top-4 z-50 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-r-lg p-2 shadow-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-200"
          style={{
            left: sidebarMinimized ? "4rem" : "18rem",
            transform: "translateX(-50%)",
          }}
          title={sidebarMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {sidebarMinimized ? (
            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 text-slate-600 dark:text-gray-400" />
          )}
        </button>

        {/* Section 2: Main content */}
        <div className="flex-1 min-h-screen">
          {/* Top navigation */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30 h-16">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    {navItems.find((item) => isActive(item.path))?.label ||
                      "CarSelling"}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 py-2 z-50">
                      <hr className="my-2 border-slate-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="bg-slate-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* Close dropdown when clicking outside */}
        {profileDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setProfileDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
