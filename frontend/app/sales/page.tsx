'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw } from 'lucide-react';
import { useSales } from '@/hooks/use-sales';
import SalesTable from '@/components/sales/sales-table';
import { formatCurrency } from '@/lib/utils';

export default function SalesPage() {
  const [customerSearch, setCustomerSearch] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const { sales, loading, error, refetch, deleteSale, totalAmount } = useSales({ page: 1, limit: 100, search: customerSearch, date: saleDate });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Sales Management</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Manage customer sales, products, services and follow-ups.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><RefreshCw className="h-4 w-4" /> Refresh</button>
          <Link href="/sales/new" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> New Sale</Link>
        </div>
      </div>
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
          <label className="text-sm font-medium text-slate-700">Search customer<input type="search" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Name or phone number" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Sales date<input type="date" value={saleDate} onChange={(event) => setSaleDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <button type="button" onClick={() => { setCustomerSearch(''); setSaleDate(''); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700">Clear filters</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm text-slate-600">
          <span>{saleDate ? `Sales on ${saleDate}` : 'Matching sales'}: <strong className="text-slate-900">{sales.length}</strong></span>
          <span>{saleDate ? 'Sale amount for selected date' : 'Matching sale amount'}: <strong className="text-slate-900">{formatCurrency(totalAmount)}</strong></span>
        </div>
      </section>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">Loading sales...</div> : <SalesTable sales={sales} onDelete={(sale) => deleteSale(sale.id)} />}
    </div>
  );
}
