export const formatPrice = (amount?: number, currency?: string) => {
  if (!amount) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    case "sold":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "reserved":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    case "in_transit":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

export const getGradeColor = (grade?: string | number) => {
  if (!grade) return "bg-gray-100 text-gray-800";
  const numGrade = typeof grade === "string" ? parseFloat(grade) : grade;
  if (numGrade >= 8) return "bg-green-100 text-green-800";
  if (numGrade >= 6) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export const getStockStatusColor = (quantity: number, status: string) => {
  if (quantity === 0) return "text-red-600";
  if (quantity <= 2) return "text-amber-600";
  return "text-green-600";
};

export const getStockStatusTextColor = (quantity: number, status: string) => {
  if (quantity === 0) return "text-red-500";
  if (quantity <= 2) return "text-amber-500";
  return "text-green-500";
};
