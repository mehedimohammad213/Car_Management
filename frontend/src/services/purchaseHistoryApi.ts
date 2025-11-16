import { apiClient } from "./apiClient";

export interface PurchaseHistoryCar {
  id: number;
  make: string;
  model: string;
  ref_no?: string | null;
  [key: string]: any;
}

export interface PurchaseHistory {
  id: number;
  car_id: number | null;
  purchase_date: string | null;
  purchase_amount: number | null;
  foreign_amount?: number | null;
  bdt_amount?: number | null;
  govt_duty: string | null;
  cnf_amount: number | null;
  miscellaneous: string | null;
  lc_date: string | null;
  lc_number: string | null;
  lc_bank_name: string | null;
  lc_bank_branch_name: string | null;
  lc_bank_branch_address: string | null;
  total_units_per_lc: string | null;
  bill_of_lading: string | null;
  invoice_number: string | null;
  export_certificate: string | null;
  export_certificate_translated: string | null;
  bill_of_exchange_amount: string | null;
  custom_duty_copy_3pages: string | null;
  cheque_copy: string | null;
  certificate: string | null;
  custom_one: string | null;
  custom_two: string | null;
  custom_three: string | null;
  created_at: string;
  updated_at: string;

  // Relationships
  car?: PurchaseHistoryCar | null;
}

export interface CreatePurchaseHistoryData {
  car_id?: number | null;
  purchase_date?: string | null;
  purchase_amount?: number | null;
  foreign_amount?: number | null;
  bdt_amount?: number | null;
  govt_duty?: string | null;
  cnf_amount?: number | null;
  miscellaneous?: string | null;
  lc_date?: string | null;
  lc_number?: string | null;
  lc_bank_name?: string | null;
  lc_bank_branch_name?: string | null;
  lc_bank_branch_address?: string | null;
  total_units_per_lc?: string | null;
  bill_of_lading?: File | null;
  invoice_number?: File | null;
  export_certificate?: File | null;
  export_certificate_translated?: File | null;
  bill_of_exchange_amount?: File | null;
  custom_duty_copy_3pages?: File | null;
  cheque_copy?: File | null;
  certificate?: File | null;
  custom_one?: File | null;
  custom_two?: File | null;
  custom_three?: File | null;
}

export interface UpdatePurchaseHistoryData extends CreatePurchaseHistoryData {}

export interface PurchaseHistoryListResponse {
  data: PurchaseHistory[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

class PurchaseHistoryApi {
  // Get all purchase histories
  async getPurchaseHistories(params?: {
    search?: string;
    purchase_date_from?: string;
    purchase_date_to?: string;
    sort_by?: string;
    sort_order?: string;
    per_page?: number;
    page?: number;
  }): Promise<PurchaseHistoryListResponse> {
    const response = await apiClient.get("/purchase-history", { params });
    // Laravel paginator returns data with nested structure
    const paginator = response.data.data || response.data;
    return {
      data: paginator.data || [],
      current_page: paginator.current_page || 1,
      last_page: paginator.last_page || 1,
      per_page: paginator.per_page || 15,
      total: paginator.total || 0,
    };
  }

  // Get single purchase history
  async getPurchaseHistory(id: number): Promise<ApiResponse<PurchaseHistory>> {
    const response = await apiClient.get(`/purchase-history/${id}`);
    return response.data;
  }

  // Create purchase history
  async createPurchaseHistory(
    data: CreatePurchaseHistoryData
  ): Promise<ApiResponse<PurchaseHistory>> {
    const formData = new FormData();

    // Add text fields
    if (data.car_id !== undefined && data.car_id !== null) {
      formData.append("car_id", data.car_id.toString());
    }
    if (data.purchase_date)
      formData.append("purchase_date", data.purchase_date);
    if (data.purchase_amount !== undefined && data.purchase_amount !== null) {
      formData.append("purchase_amount", data.purchase_amount.toString());
    }
    if (data.foreign_amount !== undefined && data.foreign_amount !== null) {
      formData.append("foreign_amount", data.foreign_amount.toString());
    }
    if (data.bdt_amount !== undefined && data.bdt_amount !== null) {
      formData.append("bdt_amount", data.bdt_amount.toString());
    }
    if (data.govt_duty) formData.append("govt_duty", data.govt_duty);
    if (data.cnf_amount !== undefined && data.cnf_amount !== null) {
      formData.append("cnf_amount", data.cnf_amount.toString());
    }
    if (data.miscellaneous)
      formData.append("miscellaneous", data.miscellaneous);
    if (data.lc_date) formData.append("lc_date", data.lc_date);
    if (data.lc_number) formData.append("lc_number", data.lc_number);
    if (data.lc_bank_name) formData.append("lc_bank_name", data.lc_bank_name);
    if (data.lc_bank_branch_name)
      formData.append("lc_bank_branch_name", data.lc_bank_branch_name);
    if (data.lc_bank_branch_address)
      formData.append("lc_bank_branch_address", data.lc_bank_branch_address);
    if (data.total_units_per_lc)
      formData.append("total_units_per_lc", data.total_units_per_lc);

    // Add PDF files
    const pdfFields = [
      "bill_of_lading",
      "invoice_number",
      "export_certificate",
      "export_certificate_translated",
      "bill_of_exchange_amount",
      "custom_duty_copy_3pages",
      "cheque_copy",
      "certificate",
      "custom_one",
      "custom_two",
      "custom_three",
    ];

    pdfFields.forEach((field) => {
      const file = data[
        field as keyof CreatePurchaseHistoryData
      ] as File | null;
      if (file) {
        formData.append(field, file);
      }
    });

    const response = await apiClient.post("/purchase-history", formData);
    return response.data;
  }

  // Update purchase history
  async updatePurchaseHistory(
    id: number,
    data: UpdatePurchaseHistoryData
  ): Promise<ApiResponse<PurchaseHistory>> {
    const pdfFields: (keyof UpdatePurchaseHistoryData)[] = [
      "bill_of_lading",
      "invoice_number",
      "export_certificate",
      "export_certificate_translated",
      "bill_of_exchange_amount",
      "custom_duty_copy_3pages",
      "cheque_copy",
      "certificate",
      "custom_one",
      "custom_two",
      "custom_three",
    ];

    const hasFileUploads = pdfFields.some((field) => {
      const value = data[field];
      return value instanceof File;
    });

    if (!hasFileUploads) {
      const payload: Record<string, any> = {};

      const baseFields: (keyof UpdatePurchaseHistoryData)[] = [
        "car_id",
        "purchase_date",
        "purchase_amount",
        "foreign_amount",
        "bdt_amount",
        "govt_duty",
        "cnf_amount",
        "miscellaneous",
        "lc_date",
        "lc_number",
        "lc_bank_name",
        "lc_bank_branch_name",
        "lc_bank_branch_address",
        "total_units_per_lc",
      ];

      baseFields.forEach((field) => {
        if (field in data) {
          payload[field] = data[field] === undefined ? null : data[field];
        }
      });

      const response = await apiClient.put(`/purchase-history/${id}`, payload);
      return response.data;
    }

    const formData = new FormData();

    // Add text fields
    if (data.car_id !== undefined) {
      formData.append(
        "car_id",
        data.car_id !== null ? data.car_id.toString() : ""
      );
    }
    if (data.purchase_date !== undefined) {
      formData.append("purchase_date", data.purchase_date || "");
    }
    if (data.purchase_amount !== undefined && data.purchase_amount !== null) {
      formData.append("purchase_amount", data.purchase_amount.toString());
    }
    if (data.foreign_amount !== undefined) {
      formData.append(
        "foreign_amount",
        data.foreign_amount !== null ? data.foreign_amount.toString() : ""
      );
    }
    if (data.bdt_amount !== undefined) {
      formData.append(
        "bdt_amount",
        data.bdt_amount !== null ? data.bdt_amount.toString() : ""
      );
    }
    if (data.govt_duty !== undefined)
      formData.append("govt_duty", data.govt_duty || "");
    if (data.cnf_amount !== undefined && data.cnf_amount !== null) {
      formData.append("cnf_amount", data.cnf_amount.toString());
    }
    if (data.miscellaneous !== undefined)
      formData.append("miscellaneous", data.miscellaneous || "");
    if (data.lc_date !== undefined)
      formData.append("lc_date", data.lc_date || "");
    if (data.lc_number !== undefined)
      formData.append("lc_number", data.lc_number || "");
    if (data.lc_bank_name !== undefined)
      formData.append("lc_bank_name", data.lc_bank_name || "");
    if (data.lc_bank_branch_name !== undefined)
      formData.append("lc_bank_branch_name", data.lc_bank_branch_name || "");
    if (data.lc_bank_branch_address !== undefined)
      formData.append(
        "lc_bank_branch_address",
        data.lc_bank_branch_address || ""
      );
    if (data.total_units_per_lc !== undefined)
      formData.append("total_units_per_lc", data.total_units_per_lc || "");

    // Add PDF files
    pdfFields.forEach((field) => {
      const file = data[
        field as keyof UpdatePurchaseHistoryData
      ] as File | null;
      if (file) {
        formData.append(field, file);
      }
    });

    // IMPORTANT: PHP does not handle file uploads on raw PUT.
    // Use POST with method override so Laravel processes uploaded files.
    formData.append("_method", "PUT");
    const response = await apiClient.post(`/purchase-history/${id}`, formData);
    return response.data;
  }

  // Delete purchase history
  async deletePurchaseHistory(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/purchase-history/${id}`);
    return response.data;
  }
}

export const purchaseHistoryApi = new PurchaseHistoryApi();
