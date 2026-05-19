import React, { useState } from "react";
import { InvoiceCreationModal } from "./InvoiceCreationModal";
import type { Car } from "../../services/carApi";
import type { StockInvoiceItem } from "../../services/stockInvoiceService";

interface InvoiceItem {
  car: Car;
  quantity: number;
  price: number;
  code?: string;
  fob_value_usd?: number;
  freight_usd?: number;
}

export type StockPageTab = "all" | "before" | "current" | "available" | "soldout";

export type StockTabCounts = {
  all: number;
  pending: number;
  available: number;
  current: number;
  soldout: number;
};

interface StockHeaderProps {
  activeTab: StockPageTab;
  onTabChange: (tab: StockPageTab) => void;
  /** Live row counts per tab (updates when lists change). */
  tabCounts: StockTabCounts;
  /** Which tabs to show (defaults to all, before, current). */
  visibleTabs?: StockPageTab[];
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

const DEFAULT_VISIBLE_TABS: StockPageTab[] = ["all", "current"];

export const StockHeader: React.FC<StockHeaderProps> = ({
  activeTab,
  onTabChange,
  tabCounts,
  visibleTabs = DEFAULT_VISIBLE_TABS,
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleCreateInvoice = async (items: InvoiceItem[]) => {
    try {
      // Import and use the StockInvoiceService
      const { StockInvoiceService } = await import(
        "../../services/stockInvoiceService"
      );

      const stockInvoiceItems: StockInvoiceItem[] = items.map((item) => ({
        car: {
          id: item.car.id.toString(),
          make: item.car.make,
          model: item.car.model,
          year: item.car.year,
          price: item.price,
          image_url: item.car.photos?.[0]?.url,
          mileage_km: item.car.mileage_km,
        },
        quantity: item.quantity,
        price: item.price,
        code: item.code,
        fob_value_usd: item.fob_value_usd,
        freight_usd: item.freight_usd,
      }));

      StockInvoiceService.generateStockInvoice(stockInvoiceItems);

      console.log("Invoice created successfully with items:", items);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  return (
    <>
      <div className="p-0 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">
              Stocks / Stock List
            </h1>
          </div>
          {/* Tab Selection - right side of header */}
          <div className="flex flex-wrap gap-1">
            {visibleTabs.includes("all") && (
              <button
                onClick={() => onTabChange("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "all"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                All Stock
                <TabDataCount n={tabCounts.all} active={activeTab === "all"} />
              </button>
            )}
            {/* {visibleTabs.includes("before") && (
              <button
                onClick={() => onTabChange("before")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "before"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Reserved
                <TabDataCount n={tabCounts.pending} active={activeTab === "before"} />
              </button>
            )} */}
            {visibleTabs.includes("current") && (
              <button
                onClick={() => onTabChange("current")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "current"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Current Stock
                <TabDataCount n={tabCounts.current} active={activeTab === "current"} />
              </button>
            )}
            {/* Available / Sold out tabs — commented out (see Sidebar)
            <button
              onClick={() => onTabChange("available")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "available"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              Available
              <TabDataCount
                n={tabCounts.available}
                active={activeTab === "available"}
              />
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
            */}
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
