import { formatCurrency } from '@/lib/utils';
import { Sale } from '@/types/sale';

export default function SaleSummary({ sale }: { sale: Sale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border bg-white p-5">
        <p className="text-xs font-medium text-slate-500">Subtotal</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(sale.subtotal)}</p>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <p className="text-xs font-medium text-slate-500">Discount</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(sale.discount)}</p>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <p className="text-xs font-medium text-slate-500">Total</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(sale.totalAmount)}</p>
      </div>
    </div>
  );
}
