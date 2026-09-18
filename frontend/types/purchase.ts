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