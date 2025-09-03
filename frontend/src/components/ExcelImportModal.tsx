import React, { useState } from "react";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    // Check file extension first
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    
    if (!extension || !allowedExtensions.includes(extension)) {
      alert('Please select a valid file type (.xlsx, .xls, or .csv)');
      return;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }
    
    // Also check MIME type if available
    if (file.type && file.type !== 'application/octet-stream') {
      const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/csv'
      ];
      
      if (!allowedMimeTypes.includes(file.type)) {
        console.warn('File MIME type not recognized, but extension is valid:', file.type);
      }
    }
    
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error importing file:", error);
      // Show user-friendly error message
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Import Cars from Excel</h2>
              <p className="text-orange-100 mt-1">Upload an Excel file to import multiple cars at once</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? "border-orange-500 bg-orange-50"
                  : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">File Selected!</h3>
                    <p className="text-gray-600 mt-1">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Drop your Excel file here
                    </h3>
                    <p className="text-gray-600 mt-1">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Supports .xlsx, .xls, and .csv files (max 10MB)
                    </p>
                  </div>
                  <label className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 mr-2" />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileInput}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Import Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure your Excel file has the correct column headers</li>
                <li>• Required columns: make, model, year, category (category name, not ID)</li>
                <li>• Optional columns: ref_no, variant, mileage_km, transmission, drive, steering, fuel, color, seats, grade_overall, grade_exterior, grade_interior, price_amount, price_currency, price_basis, chassis_no_masked, location, country_origin, status, notes</li>
                <li>• Photos and details can be added after import</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="text-center">
              <p className="text-gray-600 mb-2">Don't have a template?</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                onClick={() => {
                  // Create a sample CSV template that matches the backend expectations
                  const csvContent = `category,make,model,year,ref_no,variant,mileage_km,transmission,drive,steering,fuel,color,seats,grade_overall,grade_exterior,grade_interior,price_amount,price_currency,price_basis,chassis_no_masked,location,country_origin,status,notes
Sedan,Toyota,Camry,2020,TOY001,SE,50000,Automatic,FWD,Right,Gasoline,White,5,4.5,A,A,25000,USD,FOB,ABC******123,Tokyo Japan,Japan,available,Excellent condition
SUV,Honda,CR-V,2019,HON001,EX-L,45000,Automatic,AWD,Right,Gasoline,Black,5,4.2,B,A,28000,USD,FOB,DEF******456,Osaka Japan,Japan,available,Good family SUV`;
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'car_import_template.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedFile || isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Importing...
                  </div>
                ) : (
                  "Import Cars"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;
