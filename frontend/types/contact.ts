// export type ContactStatus =
//   | 'ACTIVE'
//   | 'INACTIVE'
//   | 'BLOCKED';

// export type CustomerType =
//   | 'INDIVIDUAL'
//   | 'BUSINESS';

// export interface Contact {
//   id: string;

//   firstName: string;

//   lastName: string;

//   phone: string;

//   email?: string | null;

//   alternatePhone?: string | null;

//   company?: string | null;

//   customerType: CustomerType;

//   status: ContactStatus;

//   address?: string | null;

//   city?: string | null;

//   state?: string | null;

//   country?: string | null;

//   postalCode?: string | null;

//   notes?: string | null;

//   ownerId?: string | null;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface ContactListResponse {
//   success: boolean;

//   data: Contact[];

//   meta: {
//     total: number;

//     page: number;

//     limit: number;

//     totalPages: number;
//   };
// }

// export interface ContactResponse {
//   success: boolean;

//   data: Contact;
// }


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
