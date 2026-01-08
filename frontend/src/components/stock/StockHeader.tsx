import React, { useState } from "react";
import {
  Package,
} from "lucide-react";
import { InvoiceCreationModal } from "./InvoiceCreationModal";

interface InvoiceItem {
  car: any;
  quantity: number;
  price: number;
}

interface StockHeaderProps {
  onCreateInvoice?: () => void;
  activeTab: "current" | "before";
  onTabChange: (tab: "current" | "before") => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({
  onCreateInvoice,
  activeTab,
  onTabChange,
}) => {
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
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your vehicle inventory stock levels
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-100">
          <button
            onClick={() => onTabChange("current")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 relative ${activeTab === "current"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Current Stock
            {activeTab === "current" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => onTabChange("before")}
            className={`pb-4 px-2 text-sm font-semibold transition-all duration-200 relative ${activeTab === "before"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Pending Stock
            {activeTab === "before" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <InvoiceCreationModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onCreateInvoice={handleCreateInvoice}
      />
    </>
  );
};
