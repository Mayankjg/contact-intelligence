// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import ProductForm from '@/components/products/product-form';

// import { productService } from '@/services/product.service';

// import { Product } from '@/types/product';

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default function EditProductPage({
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
//           Loading...
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

//         <div className="mt-5 rounded-xl bg-red-50 p-5 text-red-600">
//           {error || 'Product not found'}
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href={`/products/${product.id}`}
//           className="text-sm text-indigo-600"
//         >
//           ← Back to Product
//         </Link>

//         <h1 className="mt-4 text-2xl font-bold">
//           Edit Product
//         </h1>

//         <p className="mb-6 mt-1 text-sm text-slate-500">
//           Update product information.
//         </p>

//         <ProductForm
//           mode="edit"
//           product={product}
//         />
//       </div>
//     </main>
//   );
// }

import { redirect } from 'next/navigation';

export default function EditProductPage() {
  redirect('/products');
}
