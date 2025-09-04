import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface Stock {
  id: number;
  car_id: number;
  quantity: number;
  price?: number;
  status: "available" | "sold" | "reserved" | "damaged" | "lost" | "stolen";
  notes?: string;
  created_at: string;
  updated_at: string;

  // Relationships
  car?: {
    id: number;
    make: string;
    model: string;
    year: number;
    ref_no?: string;
    category?: {
      id: number;
      name: string;
    };
    subcategory?: {
      id: number;
      name: string;
    };
    photos?: Array<{
      id: number;
      url: string;
      is_primary: boolean;
    }>;
  };
}

export interface StockStatistics {
  total_stocks: number;
  total_quantity: number;
  total_value: number;
  by_status: Array<{
    status: string;
    count: number;
  }>;
  by_category: Array<{
    name: string;
    count: number;
  }>;
}

export interface CreateStockData {
  car_id: number;
  quantity: number;
  price?: number;
  status: "available" | "sold" | "reserved" | "damaged" | "lost" | "stolen";
  notes?: string;
}

export interface UpdateStockData {
  quantity?: number;
  price?: number;
  status?: "available" | "sold" | "reserved" | "damaged" | "lost" | "stolen";
  notes?: string;
}

export interface StockFilters {
  status?: string;
  min_price?: number;
  max_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface BulkUpdateStatusData {
  stock_ids: number[];
  status: "available" | "sold" | "reserved" | "damaged" | "lost" | "stolen";
}

class StockApiService {
  private async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await axios({
        url,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      });

      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data || {};
      throw new Error(
        errorData.message || `HTTP error! status: ${error.response?.status}`
      );
    }
  }

  async getStocks(filters: StockFilters = {}): Promise<{
    success: boolean;
    data: Stock[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    message: string;
  }> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/stocks${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint);
  }

  async getStock(id: number): Promise<{
    success: boolean;
    data: Stock;
    message: string;
  }> {
    return this.request(`/stocks/${id}`);
  }

  async createStock(data: CreateStockData): Promise<{
    success: boolean;
    data: Stock;
    message: string;
  }> {
    return this.request("/stocks", {
      method: "POST",
      data: data,
    });
  }

  async updateStock(
    id: number,
    data: UpdateStockData
  ): Promise<{
    success: boolean;
    data: Stock;
    message: string;
  }> {
    return this.request(`/stocks/${id}`, {
      method: "PUT",
      data: data,
    });
  }

  async deleteStock(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/stocks/${id}`, {
      method: "DELETE",
    });
  }

  async getStockStatistics(): Promise<{
    success: boolean;
    data: StockStatistics;
    message: string;
  }> {
    return this.request("/stocks/stats/overview");
  }

  async bulkUpdateStatus(data: BulkUpdateStatusData): Promise<{
    success: boolean;
    message: string;
    updated_count: number;
  }> {
    return this.request("/stocks/bulk/status", {
      method: "PUT",
      data: data,
    });
  }

  async getAvailableCars(): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      make: string;
      model: string;
      year: number;
      ref_no?: string;
      category?: {
        id: number;
        name: string;
      };
      subcategory?: {
        id: number;
        name: string;
      };
      photos?: Array<{
        id: number;
        url: string;
        is_primary: boolean;
      }>;
    }>;
    message: string;
  }> {
    return this.request("/stocks/available/cars");
  }
}

export const stockApi = new StockApiService();
