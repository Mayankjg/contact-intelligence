'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  productService,
  CreateProductPayload,
} from '@/services/product.service';

import { Product } from '@/types/product';

export function useProducts(params?: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await productService.getProducts(
            params,
          );

        setProducts(response.data);
        setMeta(response.meta);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load products',
        );
      } finally {
        setLoading(false);
      }
    }, [
      params?.search,
      params?.category,
      params?.status,
      params?.page,
      params?.limit,
    ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (
    data: CreateProductPayload,
  ) => {
    const response =
      await productService.createProduct(
        data,
      );

    await fetchProducts();

    return response.data;
  };

  const updateProduct = async (
    id: string,
    data: Partial<CreateProductPayload>,
  ) => {
    const response =
      await productService.updateProduct(
        id,
        data,
      );

    await fetchProducts();

    return response.data;
  };

  const deleteProduct = async (
    id: string,
  ) => {
    await productService.deleteProduct(id);

    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    meta,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}