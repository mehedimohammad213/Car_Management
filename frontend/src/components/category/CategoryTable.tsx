import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Category } from "../../services/categoryApi";
import CategoryTableRow from "./CategoryTableRow";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onRefresh: () => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">ID {getSortIcon("id")}</div>
              </th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                onClick={() => onSort("name")}
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
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Children</th>
              <th className="px-6 py-4 text-left font-semibold">Cars</th>
              <th
                className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-indigo-600 transition-colors"
                onClick={() => onSort("created_at")}
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
                      onClick={onRefresh}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
