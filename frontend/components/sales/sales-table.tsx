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
      <div className="overflow-x-hidden">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[19%]" />
            <col className="w-[11%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[15%]" />
            <col className="w-[11%]" />
          </colgroup>
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-3">Sale</th>
              {['Customer', 'Products', 'Total', 'Status', 'Date', 'Action'].map((heading) => (
                <th key={heading} className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0 hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-2 py-4 sm:px-3">
                  <Link href={`/sales/${sale.id}`} className="text-[11px] font-semibold text-slate-900 hover:text-indigo-600 sm:text-sm">{sale.purchaseNumber}</Link>
                </td>
                <td className="px-2 py-4 text-sm text-slate-600 sm:px-3">
                  {sale.contact ? `${sale.contact.firstName} ${sale.contact.lastName}` : sale.contactId}
                </td>
                <td className="px-1 py-4 text-sm text-slate-600 sm:px-2">{sale.items?.length ?? 0}</td>
                <td className="px-2 py-4 text-sm font-semibold text-slate-900 sm:px-3">{formatCurrency(sale.totalAmount)}</td>
                <td className="px-2 py-4 sm:px-3"><SaleStatusBadge status={sale.status} /></td>
                <td className="px-2 py-4 text-sm text-slate-500 sm:px-3">{formatDate(sale.purchaseDate)}</td>
                <td className="px-2 py-4 sm:px-3">
                  {onDelete && <button onClick={() => onDelete(sale)} className="text-sm font-medium text-red-600 hover:underline">Remove</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
