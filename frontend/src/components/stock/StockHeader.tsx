import React, { useState } from "react";
import { InvoiceCreationModal } from "./InvoiceCreationModal";

interface InvoiceItem {
  car: any;
  quantity: number;
  price: number;
}

export type StockPageTab = "current" | "before" | "soldout";

export type StockTabCounts = {
  pending: number;
  current: number;
  soldout: number;
};

interface StockHeaderProps {
  onCreateInvoice?: () => void;
  activeTab: StockPageTab;
  onTabChange: (tab: StockPageTab) => void;
  /** Live row counts per tab (updates when lists change). */
  tabCounts: StockTabCounts;
}

function TabDataCount({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={`ml-1.5 inline-flex min-w-[1.35rem] items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${active
          ? "bg-white/25 text-white"
          : "bg-gray-200/90 text-gray-600"
        }`}
    >
      {n}
    </span>
  );
}

export const StockHeader: React.FC<StockHeaderProps> = ({
  onCreateInvoice,
  activeTab,
  onTabChange,
  tabCounts,
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
      <div className="p-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">
              Stocks / Stock List
            </h1>
          </div>
          {/* Tab Selection - right side of header */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onTabChange("before")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "before"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Pending
              <TabDataCount n={tabCounts.pending} active={activeTab === "before"} />
            </button>
            <button
              onClick={() => onTabChange("current")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "current"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Current
              <TabDataCount n={tabCounts.current} active={activeTab === "current"} />
            </button>
            <button
              onClick={() => onTabChange("soldout")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "soldout"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Sold out
              <TabDataCount n={tabCounts.soldout} active={activeTab === "soldout"} />
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
