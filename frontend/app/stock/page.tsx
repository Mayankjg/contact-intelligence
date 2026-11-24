'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [error, setError] = useState('');
  const newestFirstReport = [...(dailyReport ?? [])].sort((left, right) => right.date.localeCompare(left.date));

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

  useEffect(() => {
    if (!reportProductId || !startDate || !endDate || startDate > endDate) {
      setDailyReport(null);
      return;
    }
    setError('');
    let cancelled = false;
    void stockService.getDailyReport({ productId: reportProductId, startDate, endDate })
      .then((report) => { if (!cancelled) setDailyReport(report.data); })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'Unable to load the stock table.');
          setDailyReport(null);
        }
      });
    return () => { cancelled = true; };
  }, [reportProductId, startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.16em] text-indigo-600">Inventory</p>
          <h1 className="text-[32px] font-bold text-slate-950 sm:text-4xl">Stock overview</h1>
          <p className="mt-2 text-sm text-slate-500">Follow daily product movement and closing balances.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live inventory</div>
      </div>
      <div className="flex flex-wrap items-end gap-4 rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_32px_-24px_rgba(15,23,42,.32)] sm:p-6">
        <div className="w-full pb-1">
          <h2 className="text-sm font-semibold text-slate-800">Report filters</h2>
          <p className="mt-1 text-xs text-slate-500">Choose a product and date range to view daily stock.</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          Product
          <select required value={reportProductId} onChange={(event) => setReportProductId(event.target.value)} disabled={loadingProducts} className={`${fieldClass} min-w-56`}>
            <option value="">Select product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Date from
          <input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Date to
          <input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={fieldClass} />
        </label>
      </div>

      {dailyReport && (
        <div className="overflow-x-auto rounded-[22px] border border-slate-200/80 bg-white shadow-[0_10px_32px_-24px_rgba(15,23,42,.32)]">
          <table className="w-full min-w-[680px] table-fixed text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{['Date', 'Product', 'Opening', 'Inward', 'Outward', 'Closing'].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newestFirstReport.map((row) => (
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
    </div>
  );
}
