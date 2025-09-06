import React from "react";
import { FileText, Plus, X } from "lucide-react";
import { CreateCarData } from "../../../services/carApi";

interface CarDetailsSectionProps {
  formData: CreateCarData;
  isViewMode: boolean;
  onAddDetail: () => void;
  onRemoveDetail: (detailIndex: number) => void;
  onDetailChange: (
    detailIndex: number,
    field: keyof NonNullable<CreateCarData["details"]>[0],
    value: any
  ) => void;
  onAddDetailImage: (detailIndex: number) => void;
  onRemoveDetailImage: (detailIndex: number, imageIndex: number) => void;
  onDetailImageChange: (
    detailIndex: number,
    imageIndex: number,
    value: string
  ) => void;
}

const CarDetailsSection: React.FC<CarDetailsSectionProps> = ({
  formData,
  isViewMode,
  onAddDetail,
  onRemoveDetail,
  onDetailChange,
  onAddDetailImage,
  onRemoveDetailImage,
  onDetailImageChange,
}) => {
  if (isViewMode && formData.details && formData.details.length > 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Car Details
        </h3>
        <div className="space-y-6">
          {formData.details.map((detail, detailIndex) => (
            <div
              key={detailIndex}
              className="border border-gray-200 rounded-xl p-4 bg-white"
            >
              <h4 className="text-md font-semibold text-gray-700 mb-4">
                {detail.short_title || `Detail Section ${detailIndex + 1}`}
              </h4>

              <div className="space-y-4">
                {/* Full Title */}
                {detail.full_title && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Title
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
                      {detail.full_title}
                    </div>
                  </div>
                )}

                {/* Description */}
                {detail.description && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 min-h-[100px]">
                      {detail.description}
                    </div>
                  </div>
                )}

                {/* Detail Images */}
                {detail.images && detail.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detail Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {detail.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="relative">
                          <img
                            src={image}
                            alt={`Detail image ${imageIndex + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Car Details
        </h3>
        <button
          type="button"
          onClick={onAddDetail}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Detail Section
        </button>
      </div>

      <div className="space-y-6">
        {formData.details?.map((detail, detailIndex) => (
          <div
            key={detailIndex}
            className="border border-gray-200 rounded-xl p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-700">
                Detail Section {detailIndex + 1}
              </h4>
              {formData.details && formData.details.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveDetail(detailIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Short Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Title
                </label>
                <input
                  type="text"
                  value={detail.short_title || ""}
                  onChange={(e) =>
                    onDetailChange(detailIndex, "short_title", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief title for the car"
                />
              </div>

              {/* Full Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Title
                </label>
                <input
                  type="text"
                  value={detail.full_title || ""}
                  onChange={(e) =>
                    onDetailChange(detailIndex, "full_title", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Complete title for the car"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={detail.description || ""}
                  onChange={(e) =>
                    onDetailChange(detailIndex, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Detailed description of the car..."
                />
              </div>

              {/* Detail Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detail Images
                </label>
                <div className="space-y-3">
                  {detail.images?.map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={image}
                          onChange={(e) =>
                            onDetailImageChange(
                              detailIndex,
                              imageIndex,
                              e.target.value
                            )
                          }
                          placeholder="Detail image URL"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveDetailImage(detailIndex, imageIndex)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => onAddDetailImage(detailIndex)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Detail Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarDetailsSection;
