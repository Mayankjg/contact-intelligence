// 'use client';

// import {
//   useCallback,
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import {
//   Eye,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
// } from 'lucide-react';

// import { productService } from '@/services/product.service';

// import { Product } from '@/types/product';

// import ProductStatusBadge from '@/components/products/product-service-list';

// export default function ProductsPage() {
//   const [products, setProducts] =
//     useState<Product[]>([]);

//   const [search, setSearch] =
//     useState('');

//   const [status, setStatus] =
//     useState('');

//   const [page, setPage] =
//     useState(1);

//   const [totalPages, setTotalPages] =
//     useState(1);

//   const [total, setTotal] =
//     useState(0);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState('');

//   const loadProducts =
//     useCallback(async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const response =
//           await productService.getProducts({
//             search:
//               search.trim() || undefined,

//             status:
//               status || undefined,

//             page,

//             limit: 10,
//           });

//         setProducts(response.data);

//         setTotal(response.meta.total);

//         setTotalPages(
//           response.meta.totalPages,
//         );
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : 'Unable to load products',
//         );
//       } finally {
//         setLoading(false);
//       }
//     }, [search, status, page]);

//   useEffect(() => {
//     loadProducts();
//   }, [loadProducts]);

//   const deleteProduct = async (
//     id: string,
//   ) => {
//     const confirmed =
//       window.confirm(
//         'Are you sure you want to delete this product?',
//       );

//     if (!confirmed) return;

//     try {
//       await productService.deleteProduct(
//         id,
//       );

//       await loadProducts();
//     } catch (error) {
//       alert(
//         error instanceof Error
//           ? error.message
//           : 'Unable to delete product',
//       );
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Products
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Manage products, pricing and inventory.
//             </p>
//           </div>

//           <Link
//             href="/products/new"
//             className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             <Plus size={18} />
//             Add Product
//           </Link>
//         </div>

//         <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
//           <div className="flex flex-col gap-3 md:flex-row">
//             <div className="relative flex-1">
//               <Search
//                 size={18}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 value={search}
//                 onChange={(event) => {
//                   setSearch(
//                     event.target.value,
//                   );
//                   setPage(1);
//                 }}
//                 placeholder="Search product or SKU..."
//                 className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500"
//               />
//             </div>

//             <select
//               value={status}
//               onChange={(event) => {
//                 setStatus(
//                   event.target.value,
//                 );
//                 setPage(1);
//               }}
//               className="rounded-lg border border-slate-200 px-4 py-2.5"
//             >
//               <option value="">
//                 All Status
//               </option>

//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>
//             </select>

//             <button
//               onClick={() => {
//                 setPage(1);
//                 loadProducts();
//               }}
//               className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="overflow-hidden rounded-xl bg-white shadow-sm">
//           {loading ? (
//             <div className="p-12 text-center text-slate-500">
//               Loading products...
//             </div>
//           ) : products.length === 0 ? (
//             <div className="p-12 text-center">
//               <h2 className="font-semibold">
//                 No products found
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Create your first product.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="border-b bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       Product
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       SKU
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       Category
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       Price
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       Stock
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
//                       Status
//                     </th>

//                     <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y">
//                   {products.map(
//                     (product) => (
//                       <tr
//                         key={product.id}
//                         className="hover:bg-slate-50"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="font-medium text-slate-900">
//                             {product.name}
//                           </div>

//                           {product.description && (
//                             <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
//                               {
//                                 product.description
//                               }
//                             </div>
//                           )}
//                         </td>

//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           {product.sku}
//                         </td>

//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           {product.category ||
//                             '-'}
//                         </td>

//                         <td className="px-6 py-4 text-sm font-medium">
//                           ₹
//                           {Number(
//                             product.price,
//                           ).toLocaleString(
//                             'en-IN',
//                           )}
//                         </td>

//                         <td className="px-6 py-4">
//                           <span
//                             className={
//                               product.stock ===
//                               0
//                                 ? 'font-semibold text-red-600'
//                                 : product.stock <
//                                     10
//                                   ? 'font-semibold text-orange-600'
//                                   : 'text-slate-600'
//                             }
//                           >
//                             {product.stock}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4">
//                           <ProductStatusBadge
//                             status={
//                               product.status
//                             }
//                           />
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="flex justify-end gap-1">
//                             <Link
//                               href={`/products/${product.id}`}
//                               className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//                             >
//                               <Eye
//                                 size={17}
//                               />
//                             </Link>

//                             <Link
//                               href={`/products/${product.id}/edit`}
//                               className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//                             >
//                               <Pencil
//                                 size={17}
//                               />
//                             </Link>

//                             <button
//                               onClick={() =>
//                                 deleteProduct(
//                                   product.id,
//                                 )
//                               }
//                               className="rounded-lg p-2 text-red-500 hover:bg-red-50"
//                             >
//                               <Trash2
//                                 size={17}
//                               />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ),
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="mt-5 flex items-center justify-between">
//           <p className="text-sm text-slate-500">
//             Total products: {total}
//           </p>

//           <div className="flex items-center gap-3">
//             <button
//               disabled={page === 1}
//               onClick={() =>
//                 setPage(
//                   (current) =>
//                     current - 1,
//                 )
//               }
//               className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
//             >
//               Previous
//             </button>

//             <span className="text-sm">
//               Page {page} of{' '}
//               {totalPages}
//             </span>

//             <button
//               disabled={
//                 page >= totalPages
//               }
//               onClick={() =>
//                 setPage(
//                   (current) =>
//                     current + 1,
//                 )
//               }
//               className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



'use client';

import {
  useState,
} from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import ProductTable from '@/components/products/product-table';

import ProductForm from '@/components/products/product-form';

import { useProducts } from '@/hooks/use-products';

import { Product } from '@/types/product';

export default function ProductsPage() {
  const [search, setSearch] =
    useState('');

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts({
    search,
    page: 1,
    limit: 50,
  });

  const submit = async (
    data: any,
  ) => {
    if (editingProduct) {
      await updateProduct(
        editingProduct.id,
        data,
      );
    } else {
      await createProduct(data);
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const remove = async (
    product: Product,
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${product.name}?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteProduct(product.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage products and their service schedules.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products or SKU..."
            className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
          Loading products...
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setShowForm(true);
          }}
          onDelete={remove}
        />
      )}

      {showForm && (
        <ProductForm
          initialData={
            editingProduct
              ? {
                  ...editingProduct,
                  price: Number(editingProduct.price),
                }
              : undefined
          }
          onSubmit={submit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
