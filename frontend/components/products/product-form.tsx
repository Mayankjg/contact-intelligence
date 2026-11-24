'use client';

import { useState } from 'react';
import { Package, Plus, Trash2, X } from 'lucide-react';
import { CreateProductPayload } from '@/services/product.service';
import { stockService } from '@/services/stock.service';

const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

type ProductRow = {
  id: number;
  name: string;
  purchaseDate: string;
  stock: string;
  unitCost: string;
};

interface ProductFormProps {
  initialData?: Partial<CreateProductPayload>;
  presentation?: 'modal' | 'page';
  onSubmit: (data: CreateProductPayload | CreateProductPayload[]) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const inputClass = 'mt-1 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10';

export default function ProductForm({ initialData, presentation = 'modal', onSubmit, onClose, loading }: ProductFormProps) {
  const editing = Boolean(initialData);
  const isPage = presentation === 'page';
  const [supplierName, setSupplierName] = useState(initialData?.supplierName ?? '');
  const [status, setStatus] = useState<CreateProductPayload['status']>(initialData?.status ?? 'ACTIVE');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [rows, setRows] = useState<ProductRow[]>([{
    id: 1,
    name: initialData?.name ?? '',
    purchaseDate: initialData?.purchaseDate?.slice(0, 10) || localToday(),
    stock: '0',
    unitCost: String(initialData?.unitCost ?? 0),
  }]);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRow = (id: number, key: keyof Omit<ProductRow, 'id'>, value: string) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  };

  const addRow = () => setRows((current) => [...current, {
    id: Date.now() + Math.random(), name: '', purchaseDate: localToday(), stock: '0', unitCost: '0',
  }]);

  const save = async (payload: CreateProductPayload | CreateProductPayload[]) => {
    try {
      await onSubmit(payload);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Unable to save these products.';
      if (!message.toLowerCase().includes('belongs to a closed period')) throw cause;
      const payloads = Array.isArray(payload) ? payload : [payload];
      let reopenedAnyPeriod = false;
      for (const date of [...new Set(payloads.filter((item) => item.stock > 0).map((item) => item.purchaseDate))]) {
        const reopened = await stockService.reopenPeriod(date);
        reopenedAnyPeriod ||= reopened.reopened;
      }
      if (!reopenedAnyPeriod) throw cause;
      await onSubmit(payload);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    const payloads = rows.map((row): CreateProductPayload => ({
      name: row.name.trim(),
      supplierName: supplierName.trim(),
      purchaseDate: row.purchaseDate,
      unitCost: Number(row.unitCost),
      price: Number(initialData?.price ?? 0),
      stock: Number(row.stock),
      status,
      description: description || undefined,
      category: initialData?.category ?? undefined,
    }));
    try {
      await save(editing ? payloads[0] : payloads);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Unable to save these products.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const busy = loading || isSubmitting;

  return (
    <div className={isPage ? 'w-full' : 'product-form-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6'}>
      <section aria-labelledby="product-form-title" role={isPage ? undefined : 'dialog'} aria-modal={isPage ? undefined : true} className={`flex w-full flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-38px_rgba(15,23,42,.32)] ${isPage ? 'mx-auto max-w-5xl' : 'max-h-[92vh] max-w-4xl border-white/70 shadow-2xl'}`}>
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-cyan-50 via-white to-indigo-50 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-700/20"><Package className="h-5 w-5" /></span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-700">Inventory catalog</p>
              <h2 id="product-form-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-950">{editing ? 'Edit product' : 'Add products'}</h2>
              {/* {!editing && <p className="mt-0.5 text-xs text-slate-500">Group products from one supplier in a single save.</p>} */}
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close product form" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className={`space-y-5 p-5 sm:p-7 ${isPage ? '' : 'overflow-y-auto'}`}>
            {submitError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Supplier name
              <input required minLength={1} maxLength={200} autoFocus={!editing} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} placeholder="Supplier name" className={`${inputClass} mt-2 h-11 max-w-xl`} />
            </label>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Products</h3>
                  {/* <p className="text-xs text-slate-500">Enter the details for each product.</p> */}
                </div>
                {!editing && <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><Plus className="h-4 w-4" /> Add product</button>}
              </div>

              {rows.map((row, index) => (
                <div key={row.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Product {String(index + 1).padStart(2, '0')}</p>
                    {!editing && rows.length > 1 && <button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} aria-label={`Remove product ${index + 1}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="space-y-1.5 text-xs font-medium text-slate-600 sm:col-span-2 lg:col-span-1">Product name
                      <input required minLength={2} maxLength={150} value={row.name} onChange={(event) => updateRow(row.id, 'name', event.target.value)} placeholder="Product name" className={inputClass} />
                    </label>
                    <label className="space-y-1.5 text-xs font-medium text-slate-600">Purchase date
                      <input required type="date" value={row.purchaseDate} onChange={(event) => updateRow(row.id, 'purchaseDate', event.target.value)} className={inputClass} />
                    </label>
                    <label className="space-y-1.5 text-xs font-medium text-slate-600">Quantity
                      <input required type="number" min={0} step={1} value={row.stock} onChange={(event) => updateRow(row.id, 'stock', event.target.value)} className={inputClass} />
                    </label>
                    <label className="space-y-1.5 text-xs font-medium text-slate-600">Unit cost
                      <input required type="number" min={0} step="0.01" value={row.unitCost} onChange={(event) => updateRow(row.id, 'unitCost', event.target.value)} className={inputClass} />
                    </label>
                  </div>
                </div>
              ))}
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium text-slate-700">Status
                <select value={status} onChange={(event) => setStatus(event.target.value as CreateProductPayload['status'])} className={inputClass}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-700">Description <span className="font-normal text-slate-400">(optional, shared)</span>
                <input value={description ?? ''} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className={inputClass} />
              </label>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-7">
            <p className="hidden text-xs text-slate-400 sm:block">{editing ? 'Your changes are saved to the catalog.' : `${rows.length} product${rows.length === 1 ? '' : 's'} ready to add`}</p>
            <div className="ml-auto flex gap-2.5">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
            <button disabled={busy} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/15 transition hover:bg-indigo-700 disabled:opacity-50">
              {busy ? 'Saving…' : editing ? 'Save Product' : `Save ${rows.length} Product${rows.length === 1 ? '' : 's'}`}
            </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
