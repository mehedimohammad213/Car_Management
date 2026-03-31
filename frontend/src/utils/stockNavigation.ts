import type { StockPageTab } from "../components/stock/StockHeader";

const ALLOWED_TABS: StockPageTab[] = ["before", "current", "available", "soldout"];

/** Path back to stock admin with optional tab preserved (`/admin/stock?tab=…`). */
export function stockManagementPath(tab?: StockPageTab | null): string {
  if (tab && ALLOWED_TABS.includes(tab)) {
    return `/admin/stock?tab=${tab}`;
  }
  return "/admin/stock";
}
