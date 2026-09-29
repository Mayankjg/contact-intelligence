'use client';

import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types/sale';
import SaleStatusBadge from './sale-status-badge';

export default function SalesTable({ sales, onDelete }: { sales: Sale[]; onDelete?: (sale: Sale) => void }) {
  if (!sales.length) {
    return <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">No sales found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="border-b bg-slate-50">
            <tr>
              {['Sale', 'Customer', 'Products', 'Total', 'Status', 'Date', 'Action'].map((heading) => (
                <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0 hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <Link href={`/sales/${sale.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">{sale.purchaseNumber}</Link>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {sale.contact ? `${sale.contact.firstName} ${sale.contact.lastName}` : sale.contactId}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{sale.items?.length ?? 0}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatCurrency(sale.totalAmount)}</td>
                <td className="px-5 py-4"><SaleStatusBadge status={sale.status} /></td>
                <td className="px-5 py-4 text-sm text-slate-500">{formatDate(sale.purchaseDate)}</td>
                <td className="px-5 py-4">
                  {onDelete && <button onClick={() => onDelete(sale)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
