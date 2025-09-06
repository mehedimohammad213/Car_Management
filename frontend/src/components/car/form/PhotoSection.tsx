import React from "react";
import { Image, Plus, X } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";

interface PhotoSectionProps {
  formData: CreateCarData;
  isViewMode: boolean;
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  onUpdatePhoto: (index: number, photo: any) => void;
}

const PhotoSection: React.FC<PhotoSectionProps> = ({
  formData,
  isViewMode,
  onAddPhoto,
  onRemovePhoto,
  onUpdatePhoto,
}) => {
  if (isViewMode && formData.photos && formData.photos.length > 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Image className="w-5 h-5 text-blue-600" />
          Photos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo.url}
                alt={`Car photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              {photo.is_primary && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isViewMode) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Image className="w-5 h-5 text-blue-600" />
        Photos
      </h3>
      <div className="space-y-4">
        {formData.photos?.map((photo, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex-1">
              <input
                type="text"
                value={photo.url}
                onChange={(e) => {
                  onUpdatePhoto(index, { ...photo, url: e.target.value });
                }}
                placeholder="Photo URL"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={photo.is_primary}
                  onChange={(e) => {
                    const newPhotos = (formData.photos || []).map((p, i) => ({
                      ...p,
                      is_primary: i === index ? e.target.checked : false,
                    }));
                    onUpdatePhoto(index, {
                      ...photo,
                      is_primary: e.target.checked,
                    });
                  }}
                  className="rounded"
                />
                <span className="text-sm">Primary</span>
              </label>
              <input
                type="number"
                value={photo.sort_order}
                onChange={(e) => {
                  onUpdatePhoto(index, {
                    ...photo,
                    sort_order: parseInt(e.target.value),
                  });
                }}
                placeholder="Order"
                className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-center"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemovePhoto(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddPhoto}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Photo
        </button>
      </div>
    </div>
  );
};

export default PhotoSection;
