import React, { useState, useEffect } from "react";
import { userApi, User, UsersParams } from "../../services/userApi";
import { Search, Users, Mail, User as UserIcon, Calendar, Shield } from "lucide-react";
import Pagination from "../../components/common/Pagination";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch users data
  const fetchUsers = async (params: UsersParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userApi.getAllUsers({
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        ...params,
      });

      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.last_page);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border border-red-200";
      case "user":
        return "bg-blue-100 text-primary-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-primary-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view all system users
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {totalItems} users
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => fetchUsers()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No users found matching your search"
                    : "No users found"}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Professional Table Header with Gradient */}
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 shadow-lg">
                  <div className="grid grid-cols-12 gap-4 p-5 text-sm font-bold text-white uppercase tracking-wider">
                    <div className="col-span-3 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>User Information</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Username</span>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Role</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined Date</span>
                    </div>
                  </div>
                </div>

                {/* Table Body with Enhanced Styling */}
                <div className="divide-y divide-gray-100 bg-gray-50/30">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-indigo-50/30 transition-all duration-300 cursor-pointer group border-l-4 border-transparent hover:border-primary-500"
                    >
                      {/* User Information */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          <span className="text-white text-base font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>

                      {/* Username */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm font-semibold text-gray-900">
                          @{user.username}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="col-span-3 flex items-center">
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {user.email}
                        </span>
                      </div>

                      {/* Role */}
                      <div className="col-span-2 flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>

                      {/* Joined Date */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-xs font-medium text-gray-600">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
