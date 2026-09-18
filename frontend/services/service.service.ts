import { apiRequest } from '@/lib/api';

export type ServiceStatus =
  | 'PENDING'
  | 'UPCOMING'
  | 'DUE'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED';

export interface CustomerService {
  id: string;

  contactId: string;

  purchaseId: string;

  productServiceId?: string | null;

  serviceName: string;

  scheduledDate: string;

  completedDate?: string | null;

  status: ServiceStatus;

  notes?: string | null;

  contact?: {
    id: string;

    firstName: string;

    lastName: string;

    phone: string;
  };

  productService?: {
    name: string;

    product?: {
      id: string;

      name: string;

      sku: string;
    };
  };
}

export interface ServiceListResponse {
  success: boolean;

  data: CustomerService[];

  meta?: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;
  };
}

export const serviceService = {
  async createService(data: {
    contactId: string;
    purchaseId: string;
    productServiceId?: string;
    serviceName: string;
    scheduledDate: string;
    status?: ServiceStatus;
    notes?: string;
  }) {
    return apiRequest<{ success: boolean; data: CustomerService }>(
      '/customer-services',
      { method: 'POST', body: JSON.stringify(data) },
    );
  },

  async getServices(
    params?: {
      contactId?: string;

      purchaseId?: string;

      status?: string;

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

    if (params?.purchaseId) {
      query.set(
        'purchaseId',
        params.purchaseId,
      );
    }

    if (params?.status) {
      query.set(
        'status',
        params.status,
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

    return apiRequest<ServiceListResponse>(
      `/services${
        queryString
          ? `?${queryString}`
          : ''
      }`,
    );
  },

  async getService(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;

      data: CustomerService;
    }>(
      `/services/${id}`,
    );
  },

  async updateService(
    id: string,
    data: {
      status?: ServiceStatus;

      completedDate?: string;

      notes?: string;

      scheduledDate?: string;
    },
  ) {
    return apiRequest<{
      success: boolean;

      data: CustomerService;
    }>(
      `/services/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async completeService(
    id: string,
    notes?: string,
  ) {
    return apiRequest<{
      success: boolean;

      data: CustomerService;
    }>(
      `/services/${id}/complete`,
      {
        method: 'PATCH',

        body: JSON.stringify({
          notes,
        }),
      },
    );
  },
};
