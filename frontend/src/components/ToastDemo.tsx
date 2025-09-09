import React from 'react';
import { toast } from 'react-toastify';

const ToastDemo: React.FC = () => {
  const showSuccessToast = () => {
    toast.success('🚗 BMW X5 added to cart successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = () => {
    toast.error('Failed to add item to cart. Please try again.', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showInfoToast = () => {
    toast.info('Item removed from cart', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showWarningToast = () => {
    toast.warning('Only 2 units remaining for this car', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Toast Notifications Demo</h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Success Toast
        </button>
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Error Toast
        </button>
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Info Toast
        </button>
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Warning Toast
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;