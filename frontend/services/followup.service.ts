import { apiRequest } from '@/lib/api';

export type FollowUpStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED';

export type FollowUpType =
  | 'PRODUCT_PURCHASE'
  | 'GENERAL';

export interface FollowUp {
  id: string;

  contactId: string;

  purchaseId?: string | null;

  productId?: string | null;

  title: string;

  description?: string | null;

  followUpDate: string;

  reminderDate?: string | null;

  status: FollowUpStatus;

  type: FollowUpType;

  contact?: {
    id: string;

    firstName: string;

    lastName: string;

    phone: string;
  };

  product?: {
    id: string;

    name: string;

    sku: string;
  };

  createdAt: string;

  updatedAt: string;
}

export interface FollowUpListResponse {
  success: boolean;

  data: FollowUp[];

  meta?: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;
  };
}

export interface CreateFollowUpPayload {
  contactId: string;

  purchaseId?: string;

  productId?: string;

  title: string;

  description?: string;

  followUpDate: string;

  reminderDate?: string;

  type?:
    | 'PRODUCT_PURCHASE'
    | 'GENERAL';
}

export const followupService = {
  async getFollowUps(
    params?: {
      contactId?: string;

      status?: string;

      type?: string;

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

    if (params?.status) {
      query.set(
        'status',
        params.status,
      );
    }

    if (params?.type) {
      query.set(
        'type',
        params.type,
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

    return apiRequest<FollowUpListResponse>(
      `/followups${
        queryString
          ? `?${queryString}`
          : ''
      }`,
    );
  },

  async getFollowUp(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;

      data: FollowUp;
    }>(
      `/followups/${id}`,
    );
  },

  async createFollowUp(
    data: CreateFollowUpPayload,
  ) {
    return apiRequest<{
      success: boolean;

      data: FollowUp;
    }>(
      '/followups',
      {
        method: 'POST',

        body: JSON.stringify(data),
      },
    );
  },

  async updateFollowUp(
    id: string,
    data: {
      title?: string;

      description?: string;

      followUpDate?: string;

      reminderDate?: string;

      status?: FollowUpStatus;
    },
  ) {
    return apiRequest<{
      success: boolean;

      data: FollowUp;
    }>(
      `/followups/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async completeFollowUp(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;

      data: FollowUp;
    }>(
      `/followups/${id}/complete`,
      {
        method: 'PATCH',
      },
    );
  },

  async deleteFollowUp(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;

      message: string;
    }>(
      `/followups/${id}`,
      {
        method: 'DELETE',
      },
    );
  },
};
