'use client';

import { useCallback, useEffect, useState } from 'react';
import { saleService } from '@/services/sale.service';
import { CreateSalePayload, Sale } from '@/types/sale';

export function useSales(params?: {
  contactId?: string;
  search?: string;
  date?: string;
  page?: number;
  limit?: number;
}) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await saleService.getSales(params);
      setSales(response.data);
      setMeta(response.meta);
      setTotalAmount(Number(response.summary?.totalAmount ?? response.data.reduce((sum, sale) => sum + Number(sale.totalAmount), 0)));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [params?.contactId, params?.search, params?.date, params?.page, params?.limit]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const createSale = async (data: CreateSalePayload) => {
    const response = await saleService.createSale(data);
    await fetchSales();
    return response.data;
  };

  const deleteSale = async (id: string) => {
    await saleService.deleteSale(id);
    await fetchSales();
  };

  return { sales, loading, error, meta, totalAmount, refetch: fetchSales, createSale, deleteSale };
}
