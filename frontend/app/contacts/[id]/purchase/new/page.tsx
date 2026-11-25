'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import PurchaseDialog from '@/components/contacts/purchase-dialog';
import { productService } from '@/services/product.service';
import { purchaseService } from '@/services/purchase.service';
import { Product } from '@/types/product';

export default function AddContactPurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backHref = `/contacts/${id}`;

  useEffect(() => {
    productService.getProducts({ page: 1, limit: 100, status: 'ACTIVE' })
      .then((response) => setProducts(response.data))
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load products.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> Back to contact
      </Link>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-indigo-600">Contact purchase</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Add purchase</h1>
      </div>
      {loading ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">Loading products...</div>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <PurchaseDialog presentation="page" contactId={id} products={products} onClose={() => router.push(backHref)} onSubmit={async (data) => { await purchaseService.createPurchase(data); }} />
      )}
    </div>
  );
}
