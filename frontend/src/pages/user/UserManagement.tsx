import React, { useState, useEffect } from "react";
import { userApi, User, UsersParams } from "../../services/userApi";
import { Search, Users, Mail, User as UserIcon, Calendar, Shield, X } from "lucide-react";
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
        return "bg-primary-100 text-primary-700 border border-primary-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-4 pb-6">
        {/* Header matching SearchFilters style */}
        <div className="p-0 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">
                Users / User List
              </h1>
            </div>
          </div>
        </div>

        {/* Search and Filters matching SearchFilters style */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
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
                className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                title="Clear Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Users Table matching CarTable style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                {/* Clean Professional Table Header */}
                <div className="bg-gray-200 border-b border-gray-300 text-gray-700">
                  <div className="grid grid-cols-12 gap-4 p-4 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-3">User Information</div>
                    <div className="col-span-2">Username</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Joined Date</div>
                  </div>
                </div>

                {/* Table Body matching CarTable style */}
                <div className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-white hover:shadow-md hover:scale-[1.002] transition-all duration-200 cursor-pointer group relative z-0 hover:z-10"
                    >
                      {/* Left Side Highlight Stick */}
                      <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary-600 rounded-r-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0" />

                      {/* User Information */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          <span className="text-white text-sm font-bold">
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
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
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
