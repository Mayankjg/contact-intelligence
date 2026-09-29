'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SaleForm from '@/components/sales/sale-form';
import { contactService } from '@/services/contact.service';
import { productService } from '@/services/product.service';
import { saleService } from '@/services/sale.service';
import { Contact } from '@/types/contact';
import { Product } from '@/types/product';
import { CreateSalePayload } from '@/types/sale';

export default function NewSalePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      contactService.getContacts({ page: 1, limit: 100 }),
      productService.getProducts({ page: 1, limit: 100, status: 'ACTIVE' }),
    ]).then(([contactsResponse, productsResponse]) => {
      setContacts(contactsResponse.data);
      setProducts(productsResponse.data);
    }).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load data')).finally(() => setLoading(false));
  }, []);

  const createSale = async (data: CreateSalePayload) => {
    try {
      setSubmitting(true);
      setError('');
      const response = await saleService.createSale(data);
      window.location.href = `/sales/${response.data.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create sale');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/sales" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Sales</Link>
      <div><h1 className="text-3xl font-bold text-slate-900">Create Sale</h1><p className="mt-1 text-sm text-slate-500">Create a customer sale using your existing Contacts and Products.</p></div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">Loading customers and products...</div> : <SaleForm contacts={contacts} products={products} onSubmit={createSale} submitting={submitting} />}
    </div>
  );
}
