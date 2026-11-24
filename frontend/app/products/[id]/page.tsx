// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import {
//   ArrowLeft,
//   Pencil,
//   Package,
//   Warehouse,
// } from 'lucide-react';

// import { productService } from '@/services/product.service';

// import { Product } from '@/types/product';

// import ProductStatusBadge from '@/components/products/product-service-list';

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default function ProductDetailsPage({
//   params,
// }: PageProps) {
//   const [product, setProduct] =
//     useState<Product | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState('');

//   useEffect(() => {
//     async function load() {
//       try {
//         const { id } =
//           await params;

//         const response =
//           await productService.getProduct(
//             id,
//           );

//         setProduct(response.data);
//       } catch (error) {
//         setError(
//           error instanceof Error
//             ? error.message
//             : 'Product not found',
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [params]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <div className="py-20 text-center">
//           Loading product...
//         </div>
//       </main>
//     );
//   }

//   if (!product) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <Link
//           href="/products"
//           className="text-indigo-600"
//         >
//           ← Back to Products
//         </Link>

//         <div className="mt-6 rounded-xl bg-red-50 p-5 text-red-600">
//           {error || 'Product not found'}
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <Link
//               href="/products"
//               className="flex items-center gap-2 text-sm text-indigo-600"
//             >
//               <ArrowLeft size={16} />
//               Back to Products
//             </Link>

//             <h1 className="mt-3 text-2xl font-bold">
//               {product.name}
//             </h1>
//           </div>

//           <Link
//             href={`/products/${product.id}/edit`}
//             className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
//           >
//             <Pencil size={16} />
//             Edit Product
//           </Link>
//         </div>

//         <section className="rounded-xl bg-white p-6 shadow-sm">
//           <div className="flex items-start gap-5">
//             <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
//               <Package size={30} />
//             </div>

//             <div>
//               <div className="flex items-center gap-3">
//                 <h2 className="text-xl font-semibold">
//                   {product.name}
//                 </h2>

//                 <ProductStatusBadge
//                   status={product.status}
//                 />
//               </div>

//               <p className="mt-1 text-sm text-slate-500">
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 grid gap-6 md:grid-cols-3">
//             <Info
//               label="Price"
//               value={`₹${Number(
//                 product.price,
//               ).toLocaleString('en-IN')}`}
//             />

//             <Info
//               label="Stock"
//               value={String(product.stock)}
//             />

//             <Info
//               label="Category"
//               value={
//                 product.category || '-'
//               }
//             />
//           </div>

//           <div className="mt-8">
//             <h3 className="font-semibold">
//               Description
//             </h3>

//             <p className="mt-2 text-sm text-slate-600">
//               {product.description ||
//                 'No description available.'}
//             </p>
//           </div>
//         </section>

//         <div className="mt-6 grid gap-4 md:grid-cols-2">
//           <div className="rounded-xl bg-white p-5 shadow-sm">
//             <Warehouse
//               className="mb-3 text-indigo-600"
//               size={22}
//             />

//             <h3 className="font-semibold">
//               Inventory
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Current stock: {product.stock}
//             </p>
//           </div>

//           <div className="rounded-xl bg-white p-5 shadow-sm">
//             <Package
//               className="mb-3 text-indigo-600"
//               size={22}
//             />

//             <h3 className="font-semibold">
//               Orders
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Product order history will appear here.
//             </p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// function Info({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div>
//       <p className="text-xs uppercase text-slate-400">
//         {label}
//       </p>

//       <p className="mt-1 font-semibold">
//         {value}
//       </p>
//     </div>
//   );
// }


'use client';

import {
  use,
  useEffect,
  useState,
} from 'react';

import {
  productService,
} from '@/services/product.service';

import { Product } from '@/types/product';

import ProductHeader from '@/components/products/product-header';

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const productResponse = await productService.getProduct(id);

      setProduct(
        productResponse.data,
      );

    } catch (error) {
      console.error(
        'Product error:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductHeader
        product={product}
      />

    </div>
  );
}
