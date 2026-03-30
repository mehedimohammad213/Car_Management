import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChartIcon,
  ChevronLeft,
  ChevronRight,
  CarIcon,
  ShoppingCartIcon,
  UserIcon,
  PackageIcon,
  UsersIcon,
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

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const adminNavItems: NavItem[] = [
    { path: "/admin", label: "Dashboard", icon: BarChartIcon },
    { path: "/admin/stock", label: "Stock", icon: PackageIcon },
    { path: "/admin/purchase-history", label: "Purchase", icon: BdtIcon },
    { path: "/admin/payment-history", label: "Payment", icon: CreditCard },
    { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
    { path: "/admin/users", label: "Users", icon: UsersIcon },
  ];

  const userNavItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: BarChartIcon },
    { path: "/cars", label: "Cars", icon: CarIcon },
    { path: "/cart", label: "Cart", icon: ShoppingCartIcon },
    { path: "/orders", label: "Orders", icon: UserIcon },
  ];

  const navItems = user.role === "admin" ? adminNavItems : userNavItems;

  return (
    <aside
      className={`hidden lg:block relative shrink-0 overflow-y-auto no-vertical-scrollbar rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm ${
        collapsed ? "w-16" : "w-64"
      }`}
      aria-label="Sidebar navigation"
    >
      <div
        className={`h-[calc(100vh-2rem)] py-4 ${
          collapsed ? "px-2" : "px-3"
        } flex flex-col`}
      >
        {/* Toolbar */}
        <div
          className={`relative pb-4 mb-4 ${
            collapsed ? "px-1" : "px-2"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
              <CarIcon className="h-5 w-5 text-white" />
            </div>

            {!collapsed && (
              <div className="text-xs font-medium tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap">
                DREAM AGENT CAR VISION
              </div>
            )}
          </div>
        </div>

        {/* Card-edge collapse handle (centered between sidebar and header cards) */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-14 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <nav className="flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-full transition-colors py-2 rounded-none ${
                  collapsed
                    ? "justify-center px-0 border-l-0"
                    : "justify-start gap-3 px-3 border-l-4 border-transparent"
                } ${
                  isActive
                    ? collapsed
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-blue-200"
                      : "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-blue-200 border-primary-500"
                    : collapsed
                      ? "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className={`truncate ${collapsed ? "hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`pt-4 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          <div className="px-2">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </div>
          </div>
        </div>

        {/* Sidebar footer card image */}
        <div
          className={`pt-2 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          <div className="p-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src="/sidebar-footer.png"
                alt="Sidebar footer"
                className="w-full h-28 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
