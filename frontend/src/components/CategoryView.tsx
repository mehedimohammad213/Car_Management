import React from "react";
import { Category } from "../services/categoryApi";

interface CategoryViewProps {
  category: Category;
  onEdit: () => void;
  onClose: () => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  onEdit,
  onClose,
}) => {
  return (
    <div className="space-y-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Category Name
        </label>
        <p className="text-lg font-semibold text-gray-900">{category.name}</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Description
        </label>
        <p className="text-gray-900">
          {category.description || "No description provided"}
        </p>
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Type
        </label>
        <p className="text-gray-900">{category.type || "No type specified"}</p>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Image
        </label>
        {category.image ? (
          <div className="flex items-center space-x-3">
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
            />
            <p className="text-gray-900 text-sm break-all">{category.image}</p>
          </div>
        ) : (
          <p className="text-gray-500">No image provided</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Status
        </label>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            category.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {category.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Created Date */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">
          Created Date
        </label>
        <p className="text-gray-900">
          {new Date(category.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          Edit Category
        </button>
      </div>
    </div>
  );
};

export default CategoryView;
