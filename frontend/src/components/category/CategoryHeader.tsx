import React from "react";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
  onCreateCategory: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  onCreateCategory,
}) => {
  return (
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
          onClick={onCreateCategory}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;
