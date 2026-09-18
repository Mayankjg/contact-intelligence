// interface ProductStatusBadgeProps {
//   status: 'ACTIVE' | 'INACTIVE';
// }

// export default function ProductStatusBadge({
//   status,
// }: ProductStatusBadgeProps) {
//   return (
//     <span
//       className={`rounded-full px-3 py-1 text-xs font-semibold ${
//         status === 'ACTIVE'
//           ? 'bg-green-100 text-green-700'
//           : 'bg-slate-100 text-slate-600'
//       }`}
//     >
//       {status}
//     </span>
//   );
// }



'use client';

import {
  Clock3,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  ProductServiceTemplate,
} from '@/types/product';

interface ProductServiceListProps {
  services: ProductServiceTemplate[];

  onEdit?: (
    service: ProductServiceTemplate,
  ) => void;

  onDelete?: (
    service: ProductServiceTemplate,
  ) => void;
}

export default function ProductServiceList({
  services,
  onEdit,
  onDelete,
}: ProductServiceListProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="font-semibold text-slate-900">
          Service Templates
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Services automatically scheduled after purchase
        </p>
      </div>

      <div className="divide-y">
        {services.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No services configured for this product.
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    {service.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {service.daysAfterPurchase}{' '}
                    days after purchase
                  </p>

                  {service.description && (
                    <p className="mt-1 text-xs text-slate-400">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() =>
                      onEdit(service)
                    }
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() =>
                      onDelete(service)
                    }
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}