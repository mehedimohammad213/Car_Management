import { carApi, Car } from "./carApi";
import { stockApi, Stock, StockStatistics } from "./stockApi";
import { categoryApi, Category } from "./categoryApi";

export interface DashboardData {
  totalCars: number;
  totalCategories: number;
  totalStock: number;
  totalStockValue: number;
  availableCars: number;
  soldCars: number;
  carsByCategory: Array<{
    category: string;
    count: number;
  }>;
  carsByBrand: Array<{
    brand: string;
    count: number;
  }>;
  recentCars: Car[];
  stockStatistics: StockStatistics;
  topSellingCars: Array<{
    car: Car;
    totalSold: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
}

class DashboardApiService {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch data from all APIs in parallel
      const [
        carsResponse,
        categoriesResponse,
        stocksResponse,
        stockStatsResponse,
        availableCarsResponse,
      ] = await Promise.allSettled([
        carApi.getCars({ per_page: 1000 }), // Get all cars
        categoryApi.getCategories({ per_page: 1000 }), // Get all categories
        stockApi.getStocks({ per_page: 1000 }), // Get all stocks
        stockApi.getStockStatistics(),
        stockApi.getAvailableCars(),
      ]);

      // Handle successful responses
      const cars =
        carsResponse.status === "fulfilled"
          ? carsResponse.value.data.data || carsResponse.value.data.cars || []
          : [];

      const categories =
        categoriesResponse.status === "fulfilled"
          ? categoriesResponse.value.data.categories || []
          : [];

      const stocks =
        stocksResponse.status === "fulfilled"
          ? stocksResponse.value.data || []
          : [];

      const stockStats =
        stockStatsResponse.status === "fulfilled"
          ? stockStatsResponse.value.data
          : {
              total_stocks: 0,
              total_quantity: 0,
              total_value: 0,
              by_status: [],
              by_category: [],
            };

      const availableCars =
        availableCarsResponse.status === "fulfilled"
          ? availableCarsResponse.value.data || []
          : [];

      // Calculate cars by category
      const carsByCategory = this.calculateCarsByCategory(cars, categories);

      // Calculate cars by brand
      const carsByBrand = this.calculateCarsByBrand(cars);

      // Get recent cars (last 10)
      const recentCars = cars
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 10);

      // Calculate top selling cars (mock data for now since we don't have sales data)
      const topSellingCars = this.calculateTopSellingCars(cars, stocks);

      // Generate monthly sales data (mock data for now)
      const monthlySales = this.generateMonthlySalesData();

      // Calculate sold cars from stock data
      const soldCars = stocks.filter((stock) => stock.status === "sold").length;

      return {
        totalCars: cars.length,
        totalCategories: categories.length,
        totalStock: stocks.length,
        totalStockValue: stockStats.total_value || 0,
        availableCars: availableCars.length,
        soldCars,
        carsByCategory,
        carsByBrand,
        recentCars,
        stockStatistics: stockStats,
        topSellingCars,
        monthlySales,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  }

  private calculateCarsByCategory(
    cars: Car[],
    categories: Category[]
  ): Array<{ category: string; count: number }> {
    const categoryMap = new Map<number, string>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.name);
    });

    const categoryCount = new Map<string, number>();

    cars.forEach((car) => {
      const categoryName = categoryMap.get(car.category_id) || "Unknown";
      categoryCount.set(
        categoryName,
        (categoryCount.get(categoryName) || 0) + 1
      );
    });

    return Array.from(categoryCount.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }

  private calculateCarsByBrand(
    cars: Car[]
  ): Array<{ brand: string; count: number }> {
    const brandCount = new Map<string, number>();

    cars.forEach((car) => {
      brandCount.set(car.make, (brandCount.get(car.make) || 0) + 1);
    });

    return Array.from(brandCount.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 brands
  }

  private calculateTopSellingCars(
    cars: Car[],
    stocks: Stock[]
  ): Array<{ car: Car; totalSold: number; revenue: number }> {
    // Create a map of car sales from stock data
    const carSales = new Map<number, { totalSold: number; revenue: number }>();

    stocks.forEach((stock) => {
      if (stock.status === "sold" && stock.car) {
        const carId = stock.car.id;
        const existing = carSales.get(carId) || { totalSold: 0, revenue: 0 };
        const stockPrice =
          typeof stock.price === "string"
            ? parseFloat(stock.price)
            : stock.price || 0;
        carSales.set(carId, {
          totalSold: existing.totalSold + stock.quantity,
          revenue: existing.revenue + stockPrice * stock.quantity,
        });
      }
    });

    // Convert to array and sort by revenue
    return Array.from(carSales.entries())
      .map(([carId, sales]) => {
        const car = cars.find((c) => c.id === carId);
        return car ? { car, ...sales } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.revenue - a!.revenue)
      .slice(0, 10) as Array<{ car: Car; totalSold: number; revenue: number }>;
  }

  private generateMonthlySalesData(): Array<{
    month: string;
    sales: number;
    orders: number;
  }> {
    // Generate mock monthly sales data for the last 12 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentMonth = new Date().getMonth();

    return months.map((month, index) => {
      // Generate realistic sales data with some variation
      const baseSales = 50000;
      const variation = Math.random() * 20000 - 10000; // ±10k variation
      const seasonalFactor =
        Math.sin(((index - currentMonth) * Math.PI) / 6) * 0.3; // Seasonal variation

      const sales = Math.max(
        0,
        baseSales + variation + baseSales * seasonalFactor
      );
      const orders = Math.floor(sales / 25000) + Math.floor(Math.random() * 5); // Roughly 1 order per 25k sales

      return { month, sales: Math.round(sales), orders };
    });
  }
}

export const dashboardApi = new DashboardApiService();
