import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types/sale';
import SaleStatusBadge from './sale-status-badge';
import SaleSummary from './sale-summary';

export default function SaleDetails({ sale }: { sale: Sale }) {
  return (
    <div className="space-y-6">
      <Link href="/sales" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Sales
      </Link>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Sale</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{sale.purchaseNumber}</h1>
            <p className="mt-2 text-sm text-slate-500">{formatDate(sale.purchaseDate)}</p>
          </div>
          <SaleStatusBadge status={sale.status} />
        </div>
      </div>

      <SaleSummary sale={sale} />

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Customer</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Name:</span> {sale.contact ? `${sale.contact.firstName} ${sale.contact.lastName}` : '—'}</p>
          <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Phone:</span> {sale.contact?.phone || '—'}</p>
        </div>
      </section>

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4"><h2 className="font-bold text-slate-900">Products</h2></div>
        <div className="divide-y">
          {sale.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div><p className="font-semibold text-slate-900">{item.product.name}</p><p className="text-xs text-slate-500">SKU: {item.product.sku} · Qty: {item.quantity}</p></div>
              <p className="font-semibold text-slate-900">{formatCurrency(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </section>

      {sale.notes && <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="font-bold text-slate-900">Notes</h2><p className="mt-2 text-sm text-slate-600">{sale.notes}</p></section>}
    </div>
  );
}
