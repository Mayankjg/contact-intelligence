import { apiRequest } from '@/lib/api';
import {
  CreateSalePayload,
  Sale,
  SaleListResponse,
} from '@/types/sale';

export const saleService = {
  async getSales(params?: {
    contactId?: string;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();

    if (params?.contactId) query.set('contactId', params.contactId);
    if (params?.search) query.set('search', params.search);
    if (params?.date) query.set('date', params.date);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    return apiRequest<SaleListResponse>(`/sales${qs ? `?${qs}` : ''}`);
  },

  async getSale(id: string) {
    return apiRequest<{ success: boolean; data: Sale }>(`/sales/${id}`);
  },

  async createSale(data: CreateSalePayload) {
    return apiRequest<{ success: boolean; data: Sale }>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSale(
    id: string,
    data: { status?: Sale['status']; paymentStatus?: Sale['paymentStatus']; saleDate?: string; notes?: string },
  ) {
    return apiRequest<{ success: boolean; data: Sale }>(`/sales/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteSale(id: string) {
    return apiRequest<{ success: boolean; message: string }>(`/sales/${id}`, {
      method: 'DELETE',
    });
  },
};
