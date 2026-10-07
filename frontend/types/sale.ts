export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  product: {
    id: string;
    name: string;
  };
}

export interface Sale {
  id: string;
  purchaseNumber: string;
  contactId: string;
  purchaseDate: string;
  subtotal: number | string;
  discount: number | string;
  totalAmount: number | string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID';
  notes?: string | null;
  contact?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
  items: SaleItem[];
  services?: unknown[];
  followUps?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleListResponse {
  success: boolean;
  data: Sale[];
  summary?: {
    totalAmount: number | string;
  };
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSaleItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalePayload {
  contactId: string;
  items: CreateSaleItemPayload[];
  saleDate?: string;
  discount?: number;
  notes?: string;
  paymentStatus: 'PAID' | 'UNPAID';
}
