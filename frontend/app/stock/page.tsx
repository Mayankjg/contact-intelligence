'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { productService } from '@/services/product.service';
import { stockService, StockMovementType, StockOutwardPurpose } from '@/services/stock.service';
import { Product } from '@/types/product';

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const purposeOptions: Array<{ value: StockOutwardPurpose; label: string }> = [
  { value: 'SALE', label: 'Sale' },
  { value: 'INSTALLATION', label: 'Installation' },
  { value: 'SERVICE_REPLACEMENT', label: 'Service / replacement' },
  { value: 'DEALER_TRANSFER', label: 'Dealer transfer' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'SAMPLE', label: 'Sample' },
  { value: 'INTERNAL_TRANSFER', label: 'Internal transfer' },
  { value: 'OTHER', label: 'Other' },
];

const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5';

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [type, setType] = useState<StockMovementType>('INWARD');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [customer, setCustomer] = useState('');
  const [purpose, setPurpose] = useState<StockOutwardPurpose>('SALE');
  const [movementDate, setMovementDate] = useState(today());
  const [closureStart, setClosureStart] = useState(`${today().slice(0, 7)}-01`);
  const [closureEnd, setClosureEnd] = useState(today());
  const [closure, setClosure] = useState<Awaited<ReturnType<typeof stockService.closePeriod>>['data'] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canReopenMovementDate, setCanReopenMovementDate] = useState(false);

  const selectedProduct = useMemo(() => products.find((product) => product.id === productId), [products, productId]);
  const totals = useMemo(() => closure?.lines.reduce((result, line) => ({
    opening: result.opening + line.opening,
    inward: result.inward + line.inward,
    outward: result.outward + line.outward,
    closing: result.closing + line.closing,
  }), { opening: 0, inward: 0, outward: 0, closing: 0 }) ?? { opening: 0, inward: 0, outward: 0, closing: 0 }, [closure]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const first = await productService.getProducts({ page: 1, limit: 100 });
      const allProducts = [...first.data];
      for (let nextPage = 2; nextPage <= first.meta.totalPages; nextPage += 1) {
        const response = await productService.getProducts({ page: nextPage, limit: 100 });
        allProducts.push(...response.data);
      }
      setProducts(allProducts);
      setProductId((current) => current || allProducts[0]?.id || '');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const submitMovement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) { setError('Select a product first.'); return; }
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await stockService.createMovement({
        productId,
        type,
        quantity: Number(quantity),
        supplier: type === 'INWARD' ? supplier.trim() : undefined,
        customer: type === 'OUTWARD' ? customer.trim() : undefined,
        purpose: type === 'OUTWARD' ? purpose : undefined,
        occurredAt: new Date(`${movementDate}T12:00:00`).toISOString(),
      });
      setSuccess(`${type === 'INWARD' ? 'Inward' : 'Outward'} saved. Closing stock for ${selectedProduct?.name}: ${response.currentStock}.`);
      setQuantity('');
      setSupplier('');
      setCustomer('');
      setClosure(null);
      await loadProducts();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to save stock.';
      setError(message);
      setCanReopenMovementDate(message.toLowerCase().includes('belongs to a closed period'));
    } finally {
      setSubmitting(false);
    }
  };

  const reopenMovementDate = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await stockService.reopenPeriod(movementDate);
      setClosure(null);
      setCanReopenMovementDate(false);
      setSuccess(response.reopened
        ? 'Date reopened. Save the stock entry again, then create a new closing report when the period is finished.'
        : 'No closed period was found for this date.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to reopen this date.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitClosure = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const isTodayPreview = closureEnd === today();
      const response = isTodayPreview
        ? await stockService.previewPeriod({ startDate: closureStart, endDate: closureEnd })
        : await stockService.closePeriod({ startDate: closureStart, endDate: closureEnd });
      setClosure(response.data);
      setSuccess(isTodayPreview
        ? 'Live closing shown for today. It updates when you create a new preview and does not lock today.'
        : response.alreadyClosed ? 'Closing for this date range is already saved.' : 'Closing report saved.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to calculate closing stock.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Stock</h1>
        <p className="mt-1 text-sm text-slate-500">Record stock coming in or going out, and check what is left.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex gap-2">
          <button type="button" onClick={() => { setType('INWARD'); setError(''); setSuccess(''); }} aria-pressed={type === 'INWARD'} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${type === 'INWARD' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700'}`}><ArrowDownToLine className="h-4 w-4" /> Inward</button>
          <button type="button" onClick={() => { setType('OUTWARD'); setError(''); setSuccess(''); }} aria-pressed={type === 'OUTWARD'} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${type === 'OUTWARD' ? 'bg-amber-600 text-white' : 'border border-slate-200 text-slate-700'}`}><ArrowUpFromLine className="h-4 w-4" /> Outward</button>
        </div>

        <form onSubmit={submitMovement} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Product<select required value={productId} onChange={(event) => setProductId(event.target.value)} className={fieldClass}><option value="">Select product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · Current closing: {product.stock}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Quantity<input required type="number" min={1} step={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></label>
          <label className="text-sm font-medium text-slate-700">Date<input required type="date" value={movementDate} onChange={(event) => { setMovementDate(event.target.value); setCanReopenMovementDate(false); setError(''); }} className={fieldClass} /></label>
          {type === 'INWARD' ? <label className="text-sm font-medium text-slate-700">Supplier<input required maxLength={200} value={supplier} onChange={(event) => setSupplier(event.target.value)} className={fieldClass} /></label> : <>
            <label className="text-sm font-medium text-slate-700">Customer / recipient<input required maxLength={200} value={customer} onChange={(event) => setCustomer(event.target.value)} className={fieldClass} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Reason<select required value={purpose} onChange={(event) => setPurpose(event.target.value as StockOutwardPurpose)} className={fieldClass}>{purposeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          </>}
          <button disabled={submitting || loadingProducts || products.length === 0} className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${type === 'INWARD' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>{submitting ? 'Saving…' : `Save ${type === 'INWARD' ? 'Inward' : 'Outward'}`}</button>
        </form>
        {loadingProducts && <p className="mt-3 text-sm text-slate-500">Loading products…</p>}
        {!loadingProducts && products.length === 0 && <p className="mt-3 text-sm text-slate-500">No products found. Add a product before recording stock.</p>}
        {selectedProduct && <p className="mt-3 text-sm text-slate-600">Current closing for {selectedProduct.name}: <strong className="text-slate-900">{selectedProduct.stock}</strong></p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Closing</h2>
        <p className="mt-1 text-sm text-slate-500">Choose a date range to see Inward, Outward, and Closing. Today shows a live preview and stays open for stock entries.</p>
        <form onSubmit={submitClosure} className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm font-medium text-slate-700">From<input required type="date" max={today()} value={closureStart} onChange={(event) => { setClosureStart(event.target.value); setClosure(null); setSuccess(''); }} className="mt-1 block rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">To<input required type="date" min={closureStart} max={today()} value={closureEnd} onChange={(event) => { setClosureEnd(event.target.value); setClosure(null); setSuccess(''); }} className="mt-1 block rounded-xl border border-slate-200 px-3 py-2.5" /></label>
          <button disabled={submitting} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Preparing closing…' : closureEnd === today() ? 'Show today’s closing' : 'Close period'}</button>
        </form>
        {closure && <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-700">Opening</p><p className="mt-1 text-2xl font-bold text-slate-900">{totals.opening}</p></div>
            <div className="rounded-xl bg-emerald-50 p-4"><p className="text-sm text-emerald-800">Inward</p><p className="mt-1 text-2xl font-bold text-emerald-900">{totals.inward}</p></div>
            <div className="rounded-xl bg-amber-50 p-4"><p className="text-sm text-amber-800">Outward</p><p className="mt-1 text-2xl font-bold text-amber-900">{totals.outward}</p></div>
            <div className="rounded-xl bg-indigo-50 p-4"><p className="text-sm text-indigo-800">Closing</p><p className="mt-1 text-2xl font-bold text-indigo-900">{totals.closing}</p></div>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Product', 'Opening', 'Inward', 'Outward', 'Closing'].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{closure.lines.map((line) => <tr key={line.productId}><td className="px-4 py-3 font-medium text-slate-900">{line.productName}</td><td className="px-4 py-3 text-slate-700">{line.opening}</td><td className="px-4 py-3 text-emerald-700">{line.inward}</td><td className="px-4 py-3 text-amber-700">{line.outward}</td><td className="px-4 py-3 font-bold text-slate-900">{line.closing}</td></tr>)}</tbody></table></div>
        </>}
      </section>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700"><p role="alert">{error}</p>{canReopenMovementDate && <button type="button" disabled={submitting} onClick={reopenMovementDate} className="mt-2 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold text-red-700 disabled:opacity-50">{submitting ? 'Reopening…' : `Reopen ${movementDate}`}</button>}</div>}
      {success && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
    </div>
  );
}
