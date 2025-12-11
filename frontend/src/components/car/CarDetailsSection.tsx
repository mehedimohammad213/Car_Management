import React from "react";
import { FileText } from "lucide-react";
import { Car as CarType } from "../../services/carApi";

interface CarDetailsSectionProps {
  details: CarType["details"];
}

const CarDetailsSection: React.FC<CarDetailsSectionProps> = ({ details }) => {
  if (!details || details.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Detailed Information
      </h3>
      <div className="space-y-6 sm:space-y-8">
        {details.map((detail, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 sm:pl-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {detail.short_title || `Detail Section ${index + 1}`}
            </h4>
            {detail.full_title && (
              <h5 className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                {detail.full_title}
              </h5>
            )}
            {detail.description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {detail.description}
              </p>
            )}
            {/* Sub Details */}
            {detail.sub_details && detail.sub_details.length > 0 && (
              <div className="mb-4">
                <h6 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Sub Details:
                </h6>
                <div className="space-y-2">
                  {detail.sub_details.map((subDetail, subIndex) => (
                    <div
                      key={subIndex}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                    >
                      <div className="space-y-1">
                        {subDetail.title && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Title:{" "}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {subDetail.title}
                            </span>
                          </div>
                        )}
                        {subDetail.description && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              Description:{" "}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {subDetail.description}
                            </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {detail.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`Detail ${index + 1} - Image ${imgIndex + 1}`}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarDetailsSection;
