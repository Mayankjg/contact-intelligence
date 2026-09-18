import {
  Package,
} from 'lucide-react';

import { formatCurrency, formatDate } from '@/lib/utils';

interface PurchaseHistoryProps {
  purchases: any[];
}

export default function PurchaseHistory({
  purchases,
}: PurchaseHistoryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-semibold text-slate-900">
          Purchase History
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Complete customer purchases
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {purchases.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No purchases yet.
          </div>
        ) : (
          purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {purchase.purchaseNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(
                      purchase.purchaseDate,
                    )}
                  </p>
                </div>

                <p className="font-semibold text-slate-900">
                  {formatCurrency(
                    purchase.totalAmount,
                  )}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {purchase.items?.map(
                  (item: any) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex gap-3">
                        <Package className="h-5 w-5 text-slate-500" />

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {item.product?.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}