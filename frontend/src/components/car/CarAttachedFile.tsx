import React from "react";
import { Eye, Download, File, Image } from "lucide-react";

interface CarAttachedFileProps {
  attachedFileInfo: {
    url: string;
    type: 'image' | 'pdf';
    filename: string;
  };
  isLoadingFile: boolean;
  onViewFile: () => void;
  onDownloadFile: () => void;
}

const CarAttachedFile: React.FC<CarAttachedFileProps> = ({
  attachedFileInfo,
  isLoadingFile,
  onViewFile,
  onDownloadFile,
}) => {
  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        {attachedFileInfo.type === 'image' ? (
          <Image className="w-5 h-5 text-green-600" />
        ) : (
          <File className="w-5 h-5 text-red-600" />
        )}
        Attached File
      </h3>
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-3">
          {attachedFileInfo.type === 'image' ? (
            <Image className="w-8 h-8 text-green-600" />
          ) : (
            <File className="w-8 h-8 text-red-600" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{attachedFileInfo.filename}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{attachedFileInfo.type} file</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewFile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={onDownloadFile}
            disabled={isLoadingFile}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isLoadingFile ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarAttachedFile;
