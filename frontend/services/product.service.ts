// import { apiRequest } from '../lib/api';

// import {
//   Product,
//   ProductListResponse,
// } from '@/types/product';

// export interface CreateProductPayload {
//   name: string;

//   sku: string;

//   description?: string;

//   price: number;

//   stock: number;

//   status?:
//     | 'ACTIVE'
//     | 'INACTIVE';

//   category?: string;
// }

// export interface ProductQuery {
//   search?: string;

//   category?: string;

//   status?: string;

//   page?: number;

//   limit?: number;
// }

// export const productService = {
//   // GET PRODUCTS
//   async getProducts(
//     params?: ProductQuery,
//   ) {
//     const query =
//       new URLSearchParams();

//     if (params?.search) {
//       query.set(
//         'search',
//         params.search,
//       );
//     }

//     if (params?.category) {
//       query.set(
//         'category',
//         params.category,
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

//     return apiRequest<ProductListResponse>(
//       `/products${
//         queryString
//           ? `?${queryString}`
//           : ''
//       }`,
//     );
//   },

//   // GET PRODUCT BY ID
//   async getProduct(
//     id: string,
//   ) {
//     return apiRequest<{
//       success: boolean;

//       data: Product;
//     }>(
//       `/products/${id}`,
//     );
//   },

//   // CREATE PRODUCT
//   async createProduct(
//     data: CreateProductPayload,
//   ) {
//     return apiRequest<{
//       success: boolean;

//       data: Product;
//     }>(
//       '/products',
//       {
//         method: 'POST',

//         body: JSON.stringify(data),
//       },
//     );
//   },

//   // UPDATE PRODUCT
//   async updateProduct(
//     id: string,

//     data: Partial<CreateProductPayload>,
//   ) {
//     return apiRequest<{
//       success: boolean;

//       data: Product;
//     }>(
//       `/products/${id}`,
//       {
//         method: 'PATCH',

//         body: JSON.stringify(data),
//       },
//     );
//   },

//   // DELETE PRODUCT
//   async deleteProduct(
//     id: string,
//   ) {
//     return apiRequest<{
//       success: boolean;

//       message: string;
//     }>(
//       `/products/${id}`,
//       {
//         method: 'DELETE',
//       },
//     );
//   },
// };



import { apiRequest } from '@/lib/api';

export interface ProductServiceTemplate {
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

  services?: ProductServiceTemplate[];

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

export interface ProductResponse {
  success: boolean;

  data: Product;
}

export interface CreateProductPayload {
  name: string;

  sku: string;

  description?: string | null;

  price: number;

  stock: number;

  status?:
    | 'ACTIVE'
    | 'INACTIVE';

  category?: string | null;
}

export interface ProductQuery {
  search?: string;

  category?: string;

  status?: string;

  page?: number;

  limit?: number;
}

export interface CreateProductServicePayload {
  name: string;

  description?: string | null;

  daysAfterPurchase: number;

  durationMinutes?: number;

  isActive?: boolean;
}

export const productService = {
  async getProducts(
    params?: ProductQuery,
  ) {
    const query =
      new URLSearchParams();

    if (params?.search) {
      query.set(
        'search',
        params.search,
      );
    }

    if (params?.category) {
      query.set(
        'category',
        params.category,
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

    return apiRequest<ProductListResponse>(
      `/products${
        queryString
          ? `?${queryString}`
          : ''
      }`,
    );
  },

  async getProduct(
    id: string,
  ) {
    return apiRequest<ProductResponse>(
      `/products/${id}`,
    );
  },

  async createProduct(
    data: CreateProductPayload,
  ) {
    return apiRequest<ProductResponse>(
      '/products',
      {
        method: 'POST',

        body: JSON.stringify(data),
      },
    );
  },

  async updateProduct(
    id: string,
    data: Partial<CreateProductPayload>,
  ) {
    return apiRequest<ProductResponse>(
      `/products/${id}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async deleteProduct(
    id: string,
  ) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(
      `/products/${id}`,
      {
        method: 'DELETE',
      },
    );
  },

  async getProductServices(
    productId: string,
  ) {
    return apiRequest<{
      success: boolean;
      data: ProductServiceTemplate[];
    }>(
      `/products/${productId}/services`,
    );
  },

  async createProductService(
    productId: string,
    data: CreateProductServicePayload,
  ) {
    return apiRequest<{
      success: boolean;
      data: ProductServiceTemplate;
    }>(
      `/products/${productId}/services`,
      {
        method: 'POST',

        body: JSON.stringify(data),
      },
    );
  },

  async updateProductService(
    productId: string,
    serviceId: string,
    data: Partial<CreateProductServicePayload>,
  ) {
    return apiRequest<{
      success: boolean;
      data: ProductServiceTemplate;
    }>(
      `/products/${productId}/services/${serviceId}`,
      {
        method: 'PATCH',

        body: JSON.stringify(data),
      },
    );
  },

  async deleteProductService(
    productId: string,
    serviceId: string,
  ) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(
      `/products/${productId}/services/${serviceId}`,
      {
        method: 'DELETE',
      },
    );
  },
};
