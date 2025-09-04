"use client";

import React from "react";
import { X } from "lucide-react";

interface StockDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  onSave?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

const StockDrawer: React.FC<StockDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  onSave,
  onCancel,
  showActions = true,
}) => {
  const sizeClasses = {
    sm: "h-1/3",
    md: "h-1/2",
    lg: "h-2/3",
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${sizeClasses[size]} bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out`}
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {children}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={onCancel || onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StockDrawer;
