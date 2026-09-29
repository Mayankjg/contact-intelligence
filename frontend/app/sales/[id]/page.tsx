'use client';

import { use, useEffect, useState } from 'react';
import SaleDetails from '@/components/sales/sale-details';
import { saleService } from '@/services/sale.service';
import { Sale } from '@/types/sale';

export default function SaleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sale, setSale] = useState<Sale | null>(null);
  const [error, setError] = useState('');
  const [savingPaymentStatus, setSavingPaymentStatus] = useState(false);

  useEffect(() => {
    saleService.getSale(id).then((response) => setSale(response.data)).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load sale'));
  }, [id]);

  const updatePaymentStatus = async (paymentStatus: Sale['paymentStatus']) => {
    if (!sale || paymentStatus === sale.paymentStatus) return;
    setSavingPaymentStatus(true);
    setError('');
    try {
      const response = await saleService.updateSale(id, { paymentStatus });
      setSale((current) => current
        ? { ...current, ...response.data, items: current.items ?? [] }
        : current);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update payment status');
    } finally {
      setSavingPaymentStatus(false);
    }
  };

  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  if (!sale) return <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">Loading sale...</div>;

  return <SaleDetails sale={sale} onPaymentStatusChange={updatePaymentStatus} savingPaymentStatus={savingPaymentStatus} />;
}
