import { apiClient } from './apiClient';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number | null;
      to: number | null;
    };
  };
}

export interface UsersParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const userApi = {
  /**
   * Get all users with pagination and search
   */
  async getAllUsers(params: UsersParams = {}): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get(`/auth/users?${queryParams.toString()}`);
    return response.data;
  },
};
