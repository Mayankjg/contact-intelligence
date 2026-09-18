// import { apiRequest } from '../lib/api';

// import {
//   ContactListResponse,
//   ContactResponse,
// } from '@/types/contact';

// export interface CreateContactPayload {
//   firstName: string;

//   lastName: string;

//   phone: string;

//   email?: string;

//   alternatePhone?: string;

//   company?: string;

//   customerType?:
//     | 'INDIVIDUAL'
//     | 'BUSINESS';

//   status?:
//     | 'ACTIVE'
//     | 'INACTIVE'
//     | 'BLOCKED';

//   address?: string;

//   city?: string;

//   state?: string;

//   country?: string;

//   postalCode?: string;

//   notes?: string;

//   ownerId?: string;
// }

// export interface ContactQuery {
//   search?: string;

//   status?: string;

//   page?: number;

//   limit?: number;
// }

// export const contactService = {
//   async getContacts(
//     params?: ContactQuery,
//   ) {
//     const query =
//       new URLSearchParams();

//     if (params?.search) {
//       query.set(
//         'search',
//         params.search,
//       );
//     }

//     if (params?.status) {
//       query.set(
//         'status',
//         params.status,
//       );
//     }

//     if (params?.page) {
//       query.set(
//         'page',
//         String(params.page),
//       );
//     }

//     if (params?.limit) {
//       query.set(
//         'limit',
//         String(params.limit),
//       );
//     }

//     const queryString =
//       query.toString();

//     return apiRequest<ContactListResponse>(
//       `/contacts${
//         queryString
//           ? `?${queryString}`
//           : ''
//       }`,
//     );
//   },

//   async getContact(
//     id: string,
//   ) {
//     return apiRequest<ContactResponse>(
//       `/contacts/${id}`,
//     );
//   },

//   async searchByPhone(
//     phone: string,
//   ) {
//     const query =
//       new URLSearchParams({
//         phone,
//       });

//     return apiRequest<ContactResponse>(
//       `/contacts/search/phone?${query.toString()}`,
//     );
//   },

//   async createContact(
//     data: CreateContactPayload,
//   ) {
//     return apiRequest<ContactResponse>(
//       '/contacts',
//       {
//         method: 'POST',

//         body: JSON.stringify(data),
//       },
//     );
//   },

//   async updateContact(
//     id: string,

//     data: Partial<CreateContactPayload>,
//   ) {
//     return apiRequest<ContactResponse>(
//       `/contacts/${id}`,
//       {
//         method: 'PATCH',

//         body: JSON.stringify(data),
//       },
//     );
//   },

//   async deleteContact(
//     id: string,
//   ) {
//     return apiRequest<{
//       success: boolean;
//       message: string;
//     }>(
//       `/contacts/${id}`,
//       {
//         method: 'DELETE',
//       },
//     );
//   },
// };



import { apiRequest } from '@/lib/api';

export interface Contact {
  id: string;

  firstName: string;
  lastName: string;

  phone: string;
  email?: string | null;

  alternatePhone?: string | null;

  company?: string | null;

  customerType?:
    | 'INDIVIDUAL'
    | 'BUSINESS';

  status?:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'BLOCKED';

  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;

  notes?: string | null;

  ownerId?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ContactListResponse {
  success: boolean;

  data: Contact[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactResponse {
  success: boolean;

  data: Contact;
}

export interface ContactDetailsResponse {
  success: boolean;

  data: {
    contact: Contact;

    summary: {
      totalPurchases: number;
      totalProducts: number;
      upcomingServices: number;
      completedServices: number;
      pendingFollowUps: number;
    };

    purchases: any[];

    upcomingServices: any[];

    completedServices: any[];

    followUps: any[];

    timeline: any[];
  };
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  phone: string;

  email?: string | null;

  alternatePhone?: string | null;

  company?: string | null;

  customerType?:
    | 'INDIVIDUAL'
    | 'BUSINESS';

  status?:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'BLOCKED';

  address?: string | null;

  city?: string | null;

  state?: string | null;

  country?: string | null;

  postalCode?: string | null;

  notes?: string | null;

  ownerId?: string | null;
}

export interface ContactQuery {
  search?: string;

  status?: string;

  page?: number;

  limit?: number;
}

export const contactService = {
  async getContacts(
    params?: ContactQuery,
  ) {
    const query =
      new URLSearchParams();

    if (params?.search) {
      query.set(
        'search',
        params.search,
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

    return apiRequest<ContactListResponse>(
      `/contacts${
        queryString
          ? `?${queryString}`
          : ''
      }`,
    );
  },

  async getContact(
    id: string,
  ) {
    return apiRequest<ContactResponse>(
      `/contacts/${id}`,
    );
  },

  async getContactDetails(
    id: string,
  ) {
    return apiRequest<ContactDetailsResponse>(
      `/contacts/${id}/details`,
    );
  },

  async searchByPhone(
    phone: string,
  ) {
    const query =
      new URLSearchParams({
        phone,
      });

    return apiRequest<ContactResponse>(
      `/contacts/search/phone?${query.toString()}`,
    );
  },

  async createContact(
    data: CreateContactPayload,
  ) {
    return apiRequest<ContactResponse>(
      '/contacts',
      {
        method: 'POST',

        body: JSON.stringify(data),
      },
    );
  },

  async updateContact(
    id: string,
    data: Partial<CreateContactPayload>,
  ) {
    return apiRequest<ContactResponse>(
      `/contacts/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async deleteContact(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(
      `/contacts/${id}`,
      {
        method: 'DELETE',
      },
    );
  },
};
