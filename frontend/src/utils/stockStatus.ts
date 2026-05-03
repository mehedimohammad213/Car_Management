import type { Stock } from "../services/stockApi";

const STOCK_STATUSES = new Set([
  "available",
  "sold",
  "reserved",
  "damaged",
  "lost",
  "stolen",
]);

/**
 * Merges car.status and stock.status when they drift (e.g. car marked sold via car edit
 * but stocks row still "available").
 */
export function getEffectiveStockStatus(stock: Stock): string {
  const stockSt = String(stock.status || "available").toLowerCase();
  const carSt = stock.car?.status
    ? String(stock.car.status).toLowerCase()
    : "";

  if (stockSt === "sold" || carSt === "sold") {
    return "sold";
  }

  if (STOCK_STATUSES.has(stockSt)) {
    return stockSt;
  }
  if (carSt && STOCK_STATUSES.has(carSt)) {
    return carSt;
  }

  return "available";
}

export function isStockRowSold(stock: Stock): boolean {
  return getEffectiveStockStatus(stock) === "sold";
}

/** Cars in the “no stock row yet” pool still carry `car.status` (e.g. sold after stock was removed). */
export function isCarStatusSold(car: { status?: string } | null | undefined): boolean {
  return String(car?.status ?? "").toLowerCase() === "sold";
}

/**
 * Stock “Pending” tab + unified All Stock pending block: cars with no stock row yet.
 * Includes `sold` so a previously sold vehicle can be restocked (new stock uses `available`
 * and syncs car status from the API).
 */
export function isCarEligibleForPendingStockTab(
  car: { status?: string } | null | undefined
): boolean {
  const s = String(car?.status ?? "").toLowerCase().trim();
  return (
    s === "pending" ||
    s === "available" ||
    s === "sold" ||
    s === ""
  );
}

/** Order for “status-wise” lists: in-stock first, then issues, sold last */
const STATUS_LIST_ORDER = [
  "available",
  "reserved",
  "damaged",
  "lost",
  "stolen",
  "sold",
] as const;

export function getStatusSortRank(status: string): number {
  const idx = STATUS_LIST_ORDER.indexOf(
    status as (typeof STATUS_LIST_ORDER)[number]
  );
  return idx === -1 ? STATUS_LIST_ORDER.length : idx;
}

export const STATUS_SECTION_LABELS: Record<string, string> = {
  pending: "Pending",
  available: "Available",
  reserved: "Reserved",
  damaged: "Damaged",
  lost: "Lost",
  stolen: "Stolen",
  sold: "Sold",
};
