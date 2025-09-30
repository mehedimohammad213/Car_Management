import React, { useState, useRef } from "react";
import { Upload, File, Image, X, Download, Eye } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";

interface AttachedFileSectionProps {
  formData: CreateCarData;
  errors: Record<string, string>;
  isViewMode: boolean;
  onInputChange: (field: keyof CreateCarData, value: any) => void;
}

const AttachedFileSection: React.FC<AttachedFileSectionProps> = ({
  formData,
  errors,
  isViewMode,
  onInputChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image (JPG, PNG, GIF, WebP) or PDF file.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    onInputChange('attached_file', file);

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onInputChange('attached_file', null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File | string) => {
    if (typeof file === 'string') {
      // For existing files, determine type from URL
      if (file.includes('imgbb.com') || file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return <Image className="w-5 h-5 text-green-600" />;
      } else if (file.match(/\.pdf$/i)) {
        return <File className="w-5 h-5 text-red-600" />;
      }
      return <File className="w-5 h-5 text-gray-600" />;
    }
    
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-green-600" />;
    } else if (file.type === 'application/pdf') {
      return <File className="w-5 h-5 text-red-600" />;
    }
    return <File className="w-5 h-5 text-gray-600" />;
  };

  const formatFileSize = (file: File | string) => {
    if (typeof file === 'string') {
      return 'Existing file';
    }
    
    const bytes = file.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileName = (file: File | string) => {
    if (typeof file === 'string') {
      return file.split('/').pop() || 'Unknown file';
    }
    return file.name;
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600" />
        Attached File
      </h3>
      
      <div className="space-y-4">
        {!isViewMode && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop a file here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Supports: JPG, PNG, GIF, WebP, PDF (Max 10MB)
              </p>
            </div>
          </div>
        )}

        {formData.attached_file && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(formData.attached_file)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getFileName(formData.attached_file)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(formData.attached_file)}
                  </p>
                </div>
              </div>
              
              {!isViewMode && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        )}

        {errors.attached_file && (
          <p className="text-sm text-red-600">{errors.attached_file}</p>
        )}
      </div>
    </div>
  );
};

export default AttachedFileSection;
