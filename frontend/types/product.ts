// export type ProductStatus =
//   | 'ACTIVE'
//   | 'INACTIVE';

// export interface Product {
//   id: string;

//   name: string;

//   sku: string;

//   description?: string | null;

//   price: string | number;

//   stock: number;

//   status: ProductStatus;

//   category?: string | null;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface ProductListResponse {
//   success: boolean;

//   data: Product[];

//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }

// export interface ProductResponse {
//   success: boolean;

//   data: Product;
// }



export interface ProductService {
  id: string;

  productId: string;

  name: string;

  description?: string | null;

  daysAfterPurchase: number;

  durationMinutes?: number | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;

  name: string;

  sku: string;

  description?: string | null;

  price: number | string;

  stock: number;

  status:
    | 'ACTIVE'
    | 'INACTIVE';

  category?: string | null;

  services?: ProductService[];

  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;

  data: Product[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type ProductServiceTemplate = ProductService;
