// 'use client';

// import Link from 'next/link';

// import { Product } from '../../types/product';
// import { formatCurrency } from '../../lib/utils';

// interface ProductTableProps {
//   products: Product[];
//   onDelete: (product: Product) => void;
// }

// export default function ProductTable({
//   products,
//   onDelete,
// }: ProductTableProps) {
//   if (products.length === 0) {
//     return (
//       <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
//         No products found.
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="border-b bg-slate-50">
//             <tr>
//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 Product
//               </th>

//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 SKU
//               </th>

//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 Category
//               </th>

//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 Price
//               </th>

//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 Stock
//               </th>

//               <th className="px-5 py-4 text-left text-sm font-semibold">
//                 Status
//               </th>

//               <th className="px-5 py-4 text-right text-sm font-semibold">
//                 Action
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((product) => (
//               <tr
//                 key={product.id}
//                 className="border-b last:border-b-0"
//               >
//                 <td className="px-5 py-4">
//                   <Link
//                     href={`/products/${product.id}`}
//                     className="font-medium text-slate-900 hover:underline"
//                   >
//                     {product.name}
//                   </Link>
//                 </td>

//                 <td className="px-5 py-4 text-sm text-slate-600">
//                   {product.sku}
//                 </td>

//                 <td className="px-5 py-4 text-sm text-slate-600">
//                   {product.category || '-'}
//                 </td>

//                 <td className="px-5 py-4 text-sm">
//                   {formatCurrency(product.price)}
//                 </td>

//                 <td className="px-5 py-4 text-sm">
//                   {product.stock}
//                 </td>

//                 <td className="px-5 py-4">
//                   <span
//                     className={`rounded-full px-3 py-1 text-xs font-medium ${
//                       product.status === 'ACTIVE'
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-slate-100 text-slate-600'
//                     }`}
//                   >
//                     {product.status}
//                   </span>
//                 </td>

//                 <td className="px-5 py-4 text-right">
//                   <button
//                     onClick={() => onDelete(product)}
//                     className="text-sm font-medium text-red-600 hover:underline"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



'use client';

import Link from 'next/link';

import {
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Product } from '@/types/product';

import { formatCurrency } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];

  onEdit?: (product: Product) => void;

  onDelete?: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                SKU
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Price
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const status =
                product.stock > 0
                  ? 'ACTIVE'
                  : 'INACTIVE';

              return (
                <tr
                key={product.id}
                className="border-b last:border-0 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {product.sku}
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  {formatCurrency(
                    product.price,
                  )}
                </td>

                <td className="px-6 py-4 text-sm">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      status === 'INACTIVE'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {onEdit && (
                      <button
                        onClick={() =>
                          onEdit(product)
                        }
                        className="rounded-lg p-2 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() =>
                          onDelete(product)
                        }
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
