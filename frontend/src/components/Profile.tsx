import React from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  UserIcon,
  MailIcon,
  ShieldIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react";

const Profile: React.FC = () => {
  const { user } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      case "user":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">
                  {getInitials(user?.name || "")}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {user?.name || "Unknown User"}
                </h2>
                <p className="text-blue-100 text-lg mb-3">
                  {user?.email || "No email provided"}
                </p>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRoleColor(
                      user?.role || ""
                    )}`}
                  >
                    <ShieldIcon className="w-4 h-4 inline mr-2" />
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={user?.name || ""}
                        readOnly
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Information */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <ShieldIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Account Role
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center px-4 py-3 rounded-xl text-lg font-semibold border-2 ${getRoleColor(
                          user?.role || ""
                        )}`}
                      >
                        <ShieldIcon className="w-5 h-5 mr-2" />
                        {user?.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : "User"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {user?.role === "admin"
                        ? "You have full administrative access to the system"
                        : "You have standard user access to the system"}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
