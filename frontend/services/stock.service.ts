import { apiRequest } from '@/lib/api';

export type StockMovementType = 'INWARD' | 'OUTWARD';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  notes?: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface StockMovementListResponse {
  success: boolean;
  data: StockMovement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const stockService = {
  async getMovements(params: {
    page: number;
    limit: number;
    type?: StockMovementType | '';
  }) {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.type) query.set('type', params.type);
    return apiRequest<StockMovementListResponse>(`/stock/movements?${query.toString()}`);
  },

  async createMovement(data: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    notes?: string;
  }) {
    return apiRequest<{
      success: boolean;
      data: StockMovement;
      currentStock: number;
    }>('/stock/movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
