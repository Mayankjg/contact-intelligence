import { apiRequest } from '@/lib/api';

export interface PurchaseItem {
  id: string;

  productId: string;

  quantity: number;

  unitPrice: number | string;

  totalPrice: number | string;

  product: {
    id: string;

    name: string;

    sku: string;
  };
}

export interface Purchase {
  id: string;

  purchaseNumber: string;

  contactId: string;

  purchaseDate: string;

  subtotal: number | string;

  discount: number | string;

  totalAmount: number | string;

  status:
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';

  notes?: string | null;

  items: PurchaseItem[];

  services?: any[];

  createdAt: string;

  updatedAt: string;
}

export interface PurchaseListResponse {
  success: boolean;
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePurchaseItemPayload {
  productId: string;

  quantity: number;
}

export interface CreatePurchasePayload {
  contactId: string;

  items: CreatePurchaseItemPayload[];

  purchaseDate?: string;

  discount?: number;

  notes?: string;
}

export const purchaseService = {
  async getPurchases(
    params?: {
      contactId?: string;

      search?: string;

      page?: number;

      limit?: number;
    },
  ) {
    const query =
      new URLSearchParams();

    if (params?.contactId) {
      query.set(
        'contactId',
        params.contactId,
      );
    }

    if (params?.search) {
      query.set(
        'search',
        params.search,
      );
    }

    if (params?.page) {
      query.set(
        'page',
        String(params.page),
      );
    }

    if (params?.limit) {
      query.set(
        'limit',
        String(params.limit),
      );
    }

    const queryString =
      query.toString();

    return apiRequest<PurchaseListResponse>(
      `/purchases${
        queryString
          ? `?${queryString}`
          : ''
      }`,
    );
  },

  async getPurchase(
    id: string,
  ) {
    return apiRequest(
      `/purchases/${id}`,
    );
  },

  async createPurchase(
    data: CreatePurchasePayload,
  ) {
    return apiRequest(
      '/purchases',
      {
        method: 'POST',

        body: JSON.stringify(data),
      },
    );
  },

  async updatePurchase(
    id: string,
    data: {
      status?: string;

      notes?: string;

      purchaseDate?: string;
    },
  ) {
    return apiRequest(
      `/purchases/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async deletePurchase(id: string) {
    return apiRequest<{ success: boolean; message: string }>(
      `/purchases/${id}`,
      { method: 'DELETE' },
    );
  },
};
