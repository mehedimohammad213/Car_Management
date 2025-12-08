import React, { useState } from "react";
import {
  Package,
  FileText,
  Download,
} from "lucide-react";
import { InvoiceCreationModal } from "./InvoiceCreationModal";

interface InvoiceItem {
  car: any;
  quantity: number;
  price: number;
}

interface StockHeaderProps {
  onGeneratePDF?: () => void;
  isGeneratingPDF?: boolean;
  onCreateInvoice?: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({
  onGeneratePDF,
  isGeneratingPDF = false,
  onCreateInvoice,
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your vehicle inventory stock levels
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {onGeneratePDF && (
              <button
                onClick={onGeneratePDF}
                disabled={isGeneratingPDF}
                className={`flex items-center justify-center transition-colors font-medium shadow-sm ${isGeneratingPDF
                    ? "w-auto px-4 py-2 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed gap-2"
                    : "w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700"
                  }`}
                title="Download PDF"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={() => onCreateInvoice ? onCreateInvoice() : setShowInvoiceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              <span>Create Invoice</span>
            </button>
          </div>
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
