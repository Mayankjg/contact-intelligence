'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/products/product-form';
import { productService, CreateProductPayload } from '@/services/product.service';

export default function NewProductPage() {
  const router = useRouter();

  const createProducts = async (payload: CreateProductPayload | CreateProductPayload[]) => {
    if (Array.isArray(payload)) {
      const [first, ...rest] = payload;
      if (!first) return;
      await productService.createProducts({
        supplierName: first.supplierName,
        products: [first, ...rest].map(({ supplierName: _supplierName, ...product }) => product),
      });
    } else {
      await productService.createProduct(payload);
    }
    router.push('/products');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <div className="pb-1">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-cyan-700">Inventory catalog</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Add products</h1>
        {/* <p className="mt-2 text-sm text-slate-500">Enter supplier and stock details to add products to your catalog.</p> */}
      </div>
      <ProductForm presentation="page" onSubmit={createProducts} onClose={() => router.push('/products')} />
    </div>
  );
}
