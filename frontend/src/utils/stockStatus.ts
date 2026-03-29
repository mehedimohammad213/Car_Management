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
