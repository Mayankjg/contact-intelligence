'use client';

import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types/sale';

interface Props {
  sale: Sale;
  onPaymentStatusChange: (paymentStatus: Sale['paymentStatus']) => Promise<void>;
  savingPaymentStatus: boolean;
}

export default function SaleDetails({ sale, onPaymentStatusChange, savingPaymentStatus }: Props) {
  const items = Array.isArray(sale.items) ? sale.items : [];
  const address = [sale.contact?.address, sale.contact?.city, sale.contact?.state, sale.contact?.postalCode]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="no-print flex items-center justify-between gap-4">
        <Link href="/sales" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Sale
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          <Download className="h-4 w-4" /> Download Invoice
        </button>
      </div>

      <article id="purchase-invoice" className="invoice-page rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <header className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-7 sm:flex-row sm:items-start">
          {/* <div className="flex h-20 w-36 items-center justify-center rounded border border-slate-200 text-lg font-bold tracking-tight text-indigo-700">ContactIQ</div> */}
          <div className="text-left sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Invoice</h1>
            <p className="mt-3 text-sm text-slate-600"><span className="font-semibold text-slate-800">Invoice #:</span> {sale.purchaseNumber}</p>
            <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-800">Date:</span> {formatDate(sale.purchaseDate)}</p>
          </div>
        </header>

        <div className="border-b border-slate-200 py-7">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Seller Information</h2>
            <p className="mt-3 text-sm font-semibold text-slate-900">{sale.contact ? `${sale.contact.firstName} ${sale.contact.lastName}` : 'Customer'}</p>
            {address && <p className="mt-1 text-sm text-slate-600">{address}</p>}
            {sale.contact?.phone && <p className="mt-1 text-sm text-slate-600">Phone: {sale.contact.phone}</p>}
            {sale.contact?.email && <p className="mt-1 text-sm text-slate-600">Email: {sale.contact.email}</p>}
            <div className="no-print mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Payment status</span>
              <select aria-label="Payment status" value={sale.paymentStatus || 'UNPAID'} disabled={savingPaymentStatus} onChange={(event) => void onPaymentStatusChange(event.target.value as Sale['paymentStatus'])} className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-800 disabled:opacity-50">
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
              </select>
              {savingPaymentStatus && <span className="text-xs text-slate-500">Saving…</span>}
            </div>
            <div className="payment-status-print mt-3 hidden text-sm"><strong>Payment status:</strong> {sale.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}</div>
          </section>
        </div>

        <section className="pt-7">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Invoice Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead><tr className="bg-slate-50 text-slate-800"><th className="border border-slate-200 px-3 py-3 font-semibold">Description</th><th className="border border-slate-200 px-3 py-3 font-semibold">Quantity</th><th className="border border-slate-200 px-3 py-3 font-semibold">Unit Price</th><th className="border border-slate-200 px-3 py-3 text-right font-semibold">Total</th></tr></thead>
              <tbody>
                {items.length === 0
                  ? <tr><td colSpan={4} className="border border-slate-200 px-3 py-6 text-center text-slate-500">No item details available for this invoice.</td></tr>
                  : items.map((item) => <tr key={item.id} className="text-slate-700"><td className="border border-slate-200 px-3 py-3"><span className="font-medium text-slate-900">{item.product?.name || 'Product'}</span><span className="block text-xs text-slate-500">SKU: {item.product?.sku || '—'}</span></td><td className="border border-slate-200 px-3 py-3">{item.quantity}</td><td className="border border-slate-200 px-3 py-3">{formatCurrency(item.unitPrice)}</td><td className="border border-slate-200 px-3 py-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td></tr>)}
              </tbody>
              <tfoot className="font-semibold text-slate-800">
                <tr><td colSpan={3} className="border border-slate-200 px-3 py-3 text-right">Subtotal</td><td className="border border-slate-200 px-3 py-3 text-right">{formatCurrency(sale.subtotal)}</td></tr>
                {Number(sale.discount) > 0 && <tr><td colSpan={3} className="border border-slate-200 px-3 py-3 text-right">Discount</td><td className="border border-slate-200 px-3 py-3 text-right">−{formatCurrency(sale.discount)}</td></tr>}
                <tr className="bg-slate-50 text-base"><td colSpan={3} className="border border-slate-200 px-3 py-3 text-right">Total Amount</td><td className="border border-slate-200 px-3 py-3 text-right">{formatCurrency(sale.totalAmount)}</td></tr>
              </tfoot>
            </table>
          </div>
        </section>

        {sale.notes && <section className="mt-6 rounded-lg bg-slate-50 p-4"><h2 className="text-sm font-bold text-slate-800">Notes</h2><p className="mt-1 text-sm text-slate-600">{sale.notes}</p></section>}
        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">Thank you for your business.</footer>
      </article>
      <p className="no-print text-center text-xs text-slate-500">Download opens your browser’s print dialog. Choose “Save as PDF” to download the invoice.</p>
    </div>
  );
}
