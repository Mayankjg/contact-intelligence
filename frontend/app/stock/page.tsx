'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Boxes, RefreshCw } from 'lucide-react';
import { productService } from '@/services/product.service';
import { stockService, StockMovement, StockMovementType } from '@/services/stock.service';
import { Product } from '@/types/product';
import { formatDateTime } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [type, setType] = useState<StockMovementType>('INWARD');
  const [filterType, setFilterType] = useState<StockMovementType | ''>('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId],
  );

  const loadProducts = useCallback(async () => {
    const first = await productService.getProducts({ page: 1, limit: 100 });
    const allProducts = [...first.data];
    for (let nextPage = 2; nextPage <= first.meta.totalPages; nextPage += 1) {
      const response = await productService.getProducts({ page: nextPage, limit: 100 });
      allProducts.push(...response.data);
    }
    setProducts(allProducts);
    setProductId((current) => current || allProducts[0]?.id || '');
  }, []);

  const loadMovements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await stockService.getMovements({ page, limit: PAGE_SIZE, type: filterType });
      setMovements(response.data);
      setTotal(response.meta.total);
      setTotalPages(Math.max(1, response.meta.totalPages));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load stock movements.');
    } finally {
      setLoading(false);
    }
  }, [filterType, page]);

  useEffect(() => {
    loadProducts().catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load products.'));
  }, [loadProducts]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const submitMovement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) {
      setError('Add a product before recording stock.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await stockService.createMovement({
        productId,
        type,
        quantity: Number(quantity),
        notes: notes.trim() || undefined,
      });
      setSuccess(`${type === 'INWARD' ? 'Inward' : 'Outward'} recorded. Current stock: ${response.currentStock}.`);
      setQuantity('');
      setNotes('');
      setPage(1);
      await Promise.all([loadProducts(), loadMovements()]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to record stock movement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600">Inventory</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Stock</h1>
        <p className="mt-1 text-sm text-slate-500">Record stock received and stock issued, and review the movement history.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setType('INWARD')} aria-pressed={type === 'INWARD'} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${type === 'INWARD' ? 'bg-emerald-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <ArrowDownToLine className="h-4 w-4" /> Inward
          </button>
          <button type="button" onClick={() => setType('OUTWARD')} aria-pressed={type === 'OUTWARD'} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${type === 'OUTWARD' ? 'bg-amber-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
            <ArrowUpFromLine className="h-4 w-4" /> Outward
          </button>
        </div>

        <form onSubmit={submitMovement} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(130px,0.5fr)_minmax(0,1.5fr)_auto] xl:items-end">
          <label className="text-sm font-medium text-slate-700">Product
            <select required value={productId} onChange={(event) => setProductId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="">Select product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku} · Stock: {product.stock}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">Quantity
            <input required type="number" min={1} step={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-slate-700">{type === 'INWARD' ? 'Supplier / Reference (optional)' : 'Reason (required)'}
            <input type="text" maxLength={500} required={type === 'OUTWARD'} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={type === 'INWARD' ? 'Supplier or reference' : 'e.g. Damaged, sample, internal use'} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </label>
          <button disabled={submitting || products.length === 0} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${type === 'INWARD' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
            {type === 'INWARD' ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
            {submitting ? 'Saving…' : `Record ${type === 'INWARD' ? 'Inward' : 'Outward'}`}
          </button>
        </form>
        {selectedProduct && <p className="mt-3 text-xs text-slate-500">Current stock for {selectedProduct.name}: <strong className="text-slate-700">{selectedProduct.stock}</strong></p>}
        {products.length === 0 && <p className="mt-3 text-sm text-amber-700">No products found. Add a product before recording stock.</p>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><Boxes className="h-5 w-5 text-slate-500" /><h2 className="font-bold text-slate-900">Movement History</h2><span className="text-sm text-slate-500">({total})</span></div>
          <div className="flex gap-2">
            <select aria-label="Filter movement type" value={filterType} onChange={(event) => { setFilterType(event.target.value as StockMovementType | ''); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">All movements</option><option value="INWARD">Inward</option><option value="OUTWARD">Outward</option>
            </select>
            <button type="button" onClick={() => { loadProducts(); loadMovements(); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /> Refresh</button>
          </div>
        </div>
        {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading stock history…</div> : movements.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">No stock movements recorded yet.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Product</th><th className="px-5 py-3">Movement</th><th className="px-5 py-3">Quantity</th><th className="px-5 py-3">Stock Before</th><th className="px-5 py-3">Stock After</th><th className="px-5 py-3">Reason / Reference</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map((movement) => <tr key={movement.id}>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDateTime(movement.createdAt)}</td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900">{movement.product.name}</p><p className="mt-0.5 text-xs text-slate-500">{movement.product.sku}</p></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${movement.type === 'INWARD' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{movement.type}</span></td>
                  <td className={`px-5 py-4 font-semibold ${movement.type === 'INWARD' ? 'text-emerald-700' : 'text-amber-700'}`}>{movement.type === 'INWARD' ? '+' : '−'}{movement.quantity}</td>
                  <td className="px-5 py-4 text-slate-600">{movement.stockBefore}</td><td className="px-5 py-4 font-semibold text-slate-900">{movement.stockAfter}</td><td className="max-w-[220px] truncate px-5 py-4 text-slate-600" title={movement.notes || ''}>{movement.notes || '—'}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2"><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Previous</button><button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Next</button></div>
        </div>
      </section>
    </div>
  );
}
