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
