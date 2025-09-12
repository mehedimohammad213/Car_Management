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
  onAddSubDetail: (detailIndex: number) => void;
  onRemoveSubDetail: (detailIndex: number, subDetailIndex: number) => void;
  onSubDetailChange: (
    detailIndex: number,
    subDetailIndex: number,
    field: "title" | "description",
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
  onAddSubDetail,
  onRemoveSubDetail,
  onSubDetailChange,
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

                {/* Sub Details */}
                {detail.sub_details && detail.sub_details.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sub Details
                    </label>
                    <div className="space-y-3">
                      {detail.sub_details.map((subDetail, subDetailIndex) => (
                        <div key={subDetailIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="space-y-2">
                            {subDetail.title && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Title: </span>
                                <span className="text-sm text-gray-900">{subDetail.title}</span>
                              </div>
                            )}
                            {subDetail.description && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Description: </span>
                                <span className="text-sm text-gray-900">{subDetail.description}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
                  Title
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

              {/* Sub Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sub Details
                  </label>
                  <button
                    type="button"
                    onClick={() => onAddSubDetail(detailIndex)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    Add Sub Detail
                  </button>
                </div>
                <div className="space-y-3">
                  {detail.sub_details?.map((subDetail, subDetailIndex) => (
                    <div
                      key={subDetailIndex}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">
                          Sub Detail {subDetailIndex + 1}
                        </h5>
                        {detail.sub_details && detail.sub_details.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveSubDetail(detailIndex, subDetailIndex)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={subDetail.title || ""}
                            onChange={(e) =>
                              onSubDetailChange(
                                detailIndex,
                                subDetailIndex,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Sub detail title"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Description
                          </label>
                          <textarea
                            value={subDetail.description || ""}
                            onChange={(e) =>
                              onSubDetailChange(
                                detailIndex,
                                subDetailIndex,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            placeholder="Sub detail description"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
