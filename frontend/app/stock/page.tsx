'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import { stockService, StockDailyReportRow } from '@/services/stock.service';
import { Product } from '@/types/product';

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const fieldClass = 'mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2.5';

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reportProductId, setReportProductId] = useState('');
  const [startDate, setStartDate] = useState(`${today().slice(0, 7)}-01`);
  const [endDate, setEndDate] = useState(today());
  const [dailyReport, setDailyReport] = useState<StockDailyReportRow[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const first = await productService.getProducts({ page: 1, limit: 100 });
      const allProducts = [...first.data];
      for (let page = 2; page <= first.meta.totalPages; page += 1) {
        const response = await productService.getProducts({ page, limit: 100 });
        allProducts.push(...response.data);
      }
      setProducts(allProducts);
      setReportProductId((current) => current || allProducts[0]?.id || '');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportProductId) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const isTodayPreview = endDate === today();
      if (isTodayPreview) {
        await stockService.previewPeriod({ startDate, endDate });
      } else {
        await stockService.closePeriod({ startDate, endDate });
      }
      const report = await stockService.getDailyReport({
        productId: reportProductId,
        startDate,
        endDate,
      });
      setDailyReport(report.data);
      setSuccess(isTodayPreview
        ? '' // Live stock table updated.
        : 'Stock period closed and table updated.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load the stock table.');
      setDailyReport(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <form onSubmit={submitReport} className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="text-sm font-medium text-slate-700">
          Product
          <select required value={reportProductId} onChange={(event) => { setReportProductId(event.target.value); setDailyReport(null); }} disabled={loadingProducts} className={`${fieldClass} min-w-56`}>
            <option value="">Select product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          From
          <input required type="date" max={today()} value={startDate} onChange={(event) => { setStartDate(event.target.value); setDailyReport(null); }} className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          To
          <input required type="date" min={startDate} max={today()} value={endDate} onChange={(event) => { setEndDate(event.target.value); setDailyReport(null); }} className={fieldClass} />
        </label>
        <button disabled={submitting || loadingProducts || !reportProductId} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {submitting ? 'Loading…' : 'Show table'}
        </button>
      </form>

      {dailyReport && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{['Date', 'Product', 'Opening', 'Inward', 'Outward', 'Closing'].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailyReport.map((row) => (
                <tr key={`${row.productId}-${row.date}`}>
                  <td className="px-4 py-3 text-slate-700">{new Date(`${row.date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.productName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.opening}</td>
                  <td className="px-4 py-3 text-emerald-700">{row.inward}</td>
                  <td className="px-4 py-3 text-amber-700">{row.outward}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{row.closing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}
    </div>
  );
}
