import React, { useState } from "react";
import {
  PackageIcon,
  TrendingUpIcon,
  PlusIcon,
  FileTextIcon,
} from "lucide-react";
import { InvoiceCreationModal } from "./InvoiceCreationModal";

interface InvoiceItem {
  car: any;
  quantity: number;
  price: number;
}

interface StockHeaderProps {
  onCreateStock: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ onCreateStock }) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleCreateInvoice = async (items: InvoiceItem[]) => {
    try {
      // Create a mock order object for the invoice service
      const mockOrder = {
        id: Date.now(), // Generate a temporary ID
        user_id: 1,
        user: {
          id: 1,
          name: "Customer",
          email: "customer@example.com",
        },
        shipping_address: "123 Main St, City, State 12345",
        status: "pending" as const,
        total_amount: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: items.map((item, index) => ({
          id: index + 1,
          order_id: Date.now(),
          car_id: item.car.id,
          quantity: item.quantity,
          price: item.price,
          car: {
            id: item.car.id.toString(),
            make: item.car.make,
            model: item.car.model,
            year: item.car.year,
            price: item.price,
            image_url: item.car.photos?.[0]?.url,
          },
        })),
      };

      // Import and use the InvoiceService
      const { InvoiceService } = await import("../../services/invoiceService");
      InvoiceService.generateInvoice(mockOrder);

      console.log("Invoice created successfully with items:", items);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
            <PackageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your vehicle inventory stock levels
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <FileTextIcon className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
          <button
            onClick={onCreateStock}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Stock
          </button>
        </div>
      </div>

      <InvoiceCreationModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};
