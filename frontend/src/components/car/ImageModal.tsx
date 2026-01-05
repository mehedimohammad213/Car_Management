import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  hasMultipleImages: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  alt,
  hasMultipleImages,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-6 md:right-6 z-10 text-red-500 hover:text-red-400 p-3 md:p-4 transition-colors"
          aria-label="Close image"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-6xl w-full h-full md:h-[85vh] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {hasMultipleImages && (
          <>
            {/* Desktop: side arrows */}
            <button
              onClick={onPrev}
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 items-center justify-center text-red-500 hover:text-red-400 p-3 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={onNext}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center text-red-500 hover:text-red-400 p-3 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Mobile: bottom arrows */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 md:hidden">
              <button
                onClick={onPrev}
                className="text-red-500 hover:text-red-400 p-3 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={onNext}
                className="text-red-500 hover:text-red-400 p-3 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
