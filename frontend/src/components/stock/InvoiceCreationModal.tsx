import React, { useState, useEffect } from "react";
import { X, Search, Plus, Minus, FileText } from "lucide-react";
import { Car } from "../../services/carApi";
import { carApi } from "../../services/carApi";

interface InvoiceItem {
  car: Car;
  quantity: number;
  price: number;
}

interface InvoiceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (items: InvoiceItem[]) => void;
}

export const InvoiceCreationModal: React.FC<InvoiceCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice,
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCars, setSelectedCars] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCars();
    }
  }, [isOpen]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await carApi.getCars({ per_page: 1000 });
      if (response.success && response.data.data) {
        setCars(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.ref_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCarToInvoice = (car: Car) => {
    const existingItem = selectedCars.find((item) => item.car.id === car.id);
    if (existingItem) {
      setSelectedCars(
        selectedCars.map((item) =>
          item.car.id === car.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedCars([
        ...selectedCars,
        {
          car,
          quantity: 1,
          price: car.price || 0,
        },
      ]);
    }
  };

  const updateQuantity = (carId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedCars(selectedCars.filter((item) => item.car.id !== carId));
    } else {
      setSelectedCars(
        selectedCars.map((item) =>
          item.car.id === carId ? { ...item, quantity } : item
        )
      );
    }
  };

  const updatePrice = (carId: number, price: number) => {
    setSelectedCars(
      selectedCars.map((item) =>
        item.car.id === carId ? { ...item, price } : item
      )
    );
  };

  const removeCarFromInvoice = (carId: number) => {
    setSelectedCars(selectedCars.filter((item) => item.car.id !== carId));
  };

  const calculateTotal = () => {
    return selectedCars.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmit = async () => {
    if (selectedCars.length === 0) {
      alert("Please select at least one car for the invoice.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateInvoice(selectedCars);
      onClose();
      setSelectedCars([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCars([]);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Create Invoice</h2>
                <p className="text-blue-100 mt-1">
                  Select cars and quantities for your invoice
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Car Selection */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars by make, model, or ref no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCars.map((car) => (
                    <div
                      key={car.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-900">
                              {car.make} {car.model}
                            </h3>
                            {car.ref_no && (
                              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {car.ref_no}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>Year: {car.year}</span>
                            {car.engine_cc && (
                              <span className="ml-3">
                                Engine: {car.engine_cc}cc
                              </span>
                            )}
                            {car.transmission && (
                              <span className="ml-3">
                                Trans: {car.transmission}
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-bold text-blue-600 mt-2">
                            ${car.price?.toLocaleString() || "N/A"}
                          </div>
                        </div>
                        <button
                          onClick={() => addCarToInvoice(car)}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredCars.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-gray-500">
                      No cars found matching your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Invoice Items */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Invoice Items ({selectedCars.length})
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedCars.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No items selected</p>
                  <p className="text-sm">
                    Add cars from the left panel to create an invoice
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCars.map((item) => (
                    <div
                      key={item.car.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.car.make} {item.car.model}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.car.ref_no && `Ref: ${item.car.ref_no}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeCarFromInvoice(item.car.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.car.id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.car.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="flex-1 px-2 py-2 text-center border-0 focus:ring-0"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.car.id, item.quantity + 1)
                              }
                              className="p-2 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit Price ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              updatePrice(
                                item.car.id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total
                          </label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-right font-semibold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Actions */}
            {selectedCars.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
