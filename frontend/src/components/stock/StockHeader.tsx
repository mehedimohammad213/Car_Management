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

      // Import and use the StockInvoiceService
      const { StockInvoiceService } = await import(
        "../../services/stockInvoiceService"
      );
      StockInvoiceService.generateStockInvoice(items);

      console.log("Invoice created successfully with items:", items);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Stock Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            View and manage your vehicle inventory stock levels
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <FileTextIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </button>
          <button
            onClick={onCreateStock}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
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
