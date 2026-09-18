import Link from 'next/link';

import {
  ArrowLeft,
  Package,
} from 'lucide-react';

import { Product } from '@/types/product';

import { formatCurrency } from '@/lib/utils';

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({
  product,
}: ProductHeaderProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <Link
        href="/products"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Package className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Product Price
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(
              product.price,
            )}
          </p>
        </div>
      </div>
    </div>
  );
}