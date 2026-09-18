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
