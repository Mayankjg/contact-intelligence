import { apiRequest } from '@/lib/api';

export type StockMovementType = 'INWARD' | 'OUTWARD';
export type StockOutwardPurpose = 'SALE' | 'INSTALLATION' | 'SERVICE_REPLACEMENT' | 'DEALER_TRANSFER' | 'DAMAGED' | 'SAMPLE' | 'INTERNAL_TRANSFER' | 'OTHER';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  status: 'RECEIVED' | 'DELIVERED';
  documentNo: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  notes?: string | null;
  supplier?: string | null;
  customer?: string | null;
  purpose?: StockOutwardPurpose | null;
  invoiceNo?: string | null;
  unitPrice?: number | string | null;
  batchNo?: string | null;
  warehouse: string;
  occurredAt: string;
  product: {
    id: string;
    name: string;
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

export interface StockDailyReportRow {
  date: string;
  productId: string;
  productName: string;
  opening: number;
  inward: number;
  outward: number;
  closing: number;
}

export interface StockClosureResponse {
  success: boolean;
  alreadyClosed: boolean;
  data: {
    id: string;
    startDate: string;
    endDate: string;
    lines: Array<{ productId: string; productName: string; opening: number; inward: number; outward: number; closing: number }>;
  };
}

export const stockService = {
  async getDailyReport(params: { productId: string; startDate: string; endDate: string }) {
    const query = new URLSearchParams(params);
    return apiRequest<{
      success: boolean;
      product: { id: string; name: string; stock: number };
      data: StockDailyReportRow[];
    }>(`/stock/daily-report?${query.toString()}`);
  },

  async getMovements(params: {
    page: number;
    limit: number;
    type?: StockMovementType | '';
    productId?: string;
  }) {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.type) query.set('type', params.type);
    if (params.productId) query.set('productId', params.productId);
    return apiRequest<StockMovementListResponse>(`/stock/movements?${query.toString()}`);
  },

  async createMovement(data: {
      productId: string;
      type: StockMovementType;
      quantity: number;
      supplier?: string;
      customer?: string;
      purpose?: StockOutwardPurpose;
      invoiceNo?: string;
      unitPrice?: number;
      batchNo?: string;
      warehouse?: string;
      occurredAt?: string;
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

  async closePeriod(data: { startDate: string; endDate: string }) {
    return apiRequest<StockClosureResponse>('/stock/closures', { method: 'POST', body: JSON.stringify(data) });
  },

  async previewPeriod(data: { startDate: string; endDate: string }) {
    return apiRequest<StockClosureResponse>('/stock/closures/preview', { method: 'POST', body: JSON.stringify(data) });
  },

  async reopenPeriod(date: string) {
    return apiRequest<{ success: boolean; reopened: boolean }>(
      '/stock/closures/reopen',
      { method: 'POST', body: JSON.stringify({ date }) },
    );
  },
};
