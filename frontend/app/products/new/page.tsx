// import Link from 'next/link';

// import ProductForm from '@/components/products/product-form';

// export default function NewProductPage() {
//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-5xl">
//         <Link
//           href="/products"
//           className="text-sm text-indigo-600 hover:underline"
//         >
//           ← Back to Products
//         </Link>

//         <h1 className="mt-4 text-2xl font-bold">
//           Add Product
//         </h1>

//         <p className="mb-6 mt-1 text-sm text-slate-500">
//           Create a new product.
//         </p>

//         <ProductForm mode="create" />
//       </div>
//     </main>
//   );
// }

import { redirect } from 'next/navigation';

export default function NewProductPage() {
  redirect('/products');
}
