import React from "react";
import { TagIcon, PlusIcon } from "lucide-react";

interface CategoryHeaderProps {
  onCreateCategory: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  onCreateCategory,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
            <TagIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your vehicle categories and subcategories
            </p>
          </div>
        </div>

        <button
          onClick={onCreateCategory}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;
