import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  categoryApi,
  Category,
  CreateCategoryData,
} from "../services/categoryApi";
import CategoryModal from "../components/CategoryModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Success/Error messages
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    console.log("CategoryManagement component mounted");
    console.log("Current user token:", localStorage.getItem("token"));
    console.log("Current user role:", localStorage.getItem("userRole"));
    console.log("Component state:", { categories, isLoading });

    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      fetchCategories();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching categories with params:", {
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: perPage,
        page: currentPage,
      });

      // First, let's test if the backend is accessible
      try {
        console.log("Testing backend connection...");
        const testResponse = await axios.get(API_ENDPOINTS.CATEGORIES.BASE, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log("Backend test response status:", testResponse.status);
        console.log("Backend test response headers:", testResponse.headers);

        if (testResponse.status !== 200) {
          console.error("Backend error response:", testResponse.data);
          throw new Error(
            `Backend not accessible: ${testResponse.status} - ${testResponse.data}`
          );
        }

        const testData = testResponse.data;
        console.log("Backend test data:", testData);
      } catch (testError) {
        console.error("Backend connection test failed:", testError);
        showMessage(
          "error",
          `Cannot connect to backend server: ${
            testError instanceof Error ? testError.message : "Unknown error"
          }`
        );
        setCategories([]);
        setIsLoading(false);
        return;
      }

      const response = await categoryApi.getCategories({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: perPage,
        page: currentPage,
      });

      console.log("Categories response:", response);

      if (response.success && response.data.categories) {
        setCategories(response.data.categories);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.last_page);
          setTotalItems(response.data.pagination.total);
        }
      } else {
        console.log("Response not successful or no categories data:", response);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showMessage("error", "Failed to fetch categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await categoryApi.deleteCategory(categoryToDelete.id);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      showMessage("success", "Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      showMessage("error", "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (data: CreateCategoryData) => {
    try {
      if (editingCategory) {
        await categoryApi.updateCategory({ id: editingCategory.id, ...data });
        showMessage("success", "Category updated successfully");
      } else {
        await categoryApi.createCategory(data);
        showMessage("success", "Category created successfully");
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      showMessage(
        "error",
        editingCategory
          ? "Failed to update category"
          : "Failed to create category"
      );
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  console.log(
    "CategoryManagement render - categories:",
    categories.length,
    "loading:",
    isLoading
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Category Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your vehicle categories and subcategories
            </p>
          </div>
          <button
            onClick={handleCreateCategory}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Add Category
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl shadow-lg ${
            message.type === "success"
              ? "bg-green-100 border-l-4 border-green-500 text-green-700"
              : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">All Types</option>
            <option value="parent">Parent Categories</option>
            <option value="child">Child Categories</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setTypeFilter("");
              setCurrentPage(1);
            }}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name {getSortIcon("name")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Image</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Parent Category
                </th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {getSortIcon("status")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Children</th>
                <th className="px-6 py-4 text-left font-semibold">Cars</th>
                <th
                  className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center">
                    Created {getSortIcon("created_at")}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-3 text-gray-600">
                        Loading categories...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="space-y-2">
                      <p>No categories found</p>
                      <p className="text-sm text-gray-400">
                        {isLoading
                          ? "Loading..."
                          : "Try refreshing the page or check your connection"}
                      </p>
                      <button
                        onClick={() => {
                          console.log("Manual refresh clicked");
                          fetchCategories();
                        }}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        Refresh Data
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{category.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {category.name}
                        </div>
                        {category.short_des && (
                          <div className="text-sm text-gray-500 mt-1">
                            {category.short_des}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {category.parent_category ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {category.parent_category.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Parent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.status.charAt(0).toUpperCase() +
                          category.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {category.children_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {category.cars_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(category.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, totalItems)} of {totalItems}{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CategoryManagement;
