'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Contact } from '@/types/contact';
import { Product } from '@/types/product';
import { CreateSalePayload } from '@/types/sale';
import { formatCurrency } from '@/lib/utils';

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function SaleForm({ contacts, products, onSubmit, submitting }: { contacts: Contact[]; products: Product[]; onSubmit: (data: CreateSalePayload) => Promise<void>; submitting?: boolean }) {
  const [contactId, setContactId] = useState('');
  const [saleDate, setSaleDate] = useState(todayLocal);
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'UNPAID'>('UNPAID');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);

  const subtotal = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const addItem = () => setItems((current) => [...current, { productId: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => setItems((current) => current.filter((_, i) => i !== index));

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSubmit({ contactId, saleDate, paymentStatus, discount, notes, items }); }} className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Customer & Sale</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Customer<select required value={contactId} onChange={(e) => setContactId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="">Select customer</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.phone}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Sale date<input required type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Payment status<select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as 'PAID' | 'UNPAID')} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"><option value="UNPAID">Unpaid</option><option value="PAID">Paid</option></select></label>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Products</h2><button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"><Plus className="h-4 w-4" /> Add Product</button></div>
        <div className="mt-5 space-y-3">
          {items.map((item, index) => <div key={index} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_110px_130px_140px_40px]">
            <select required value={item.productId} onChange={(e) => setItems((current) => current.map((x, i) => i === index ? { ...x, productId: e.target.value, unitPrice: Number(products.find((p) => p.id === e.target.value)?.price || 0) } : x))} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="">Select product</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>)}</select>
            <input aria-label="Quantity" placeholder="Quantity" required min={1} type="number" value={item.quantity} onChange={(e) => setItems((current) => current.map((x, i) => i === index ? { ...x, quantity: Number(e.target.value) } : x))} className="rounded-xl border border-slate-200 px-3 py-2.5" />
            <input aria-label="Rate" placeholder="Rate" required min={0} step="0.01" type="number" value={item.unitPrice} onChange={(e) => setItems((current) => current.map((x, i) => i === index ? { ...x, unitPrice: Number(e.target.value) } : x))} className="rounded-xl border border-slate-200 px-3 py-2.5" />
            <div aria-label="Total amount" className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">{formatCurrency(item.unitPrice * item.quantity)}</div>
            <button type="button" disabled={items.length === 1} onClick={() => removeItem(index)} className="rounded-xl border text-red-600 disabled:opacity-30"><Trash2 className="mx-auto h-4 w-4" /></button>
          </div>)}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Discount<input min={0} type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="mt-2 w-full rounded-xl border px-3 py-2.5" /></label><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Estimated total</p><p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(Math.max(0, subtotal - discount))}</p></div></div>
        <label className="mt-4 block text-sm font-medium text-slate-700">Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border px-3 py-2.5" /></label>
        <button disabled={submitting} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Creating...' : 'Create Sale'}</button>
      </section>
    </form>
  );
}
