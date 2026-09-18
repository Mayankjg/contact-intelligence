// 'use client';

// import { useEffect, useState } from 'react';

// import Link from 'next/link';

// import { useRouter } from 'next/navigation';

// import {
//   CreateProductPayload,
//   productService,
// } from '@/services/product.service';

// import { Product } from '@/types/product';

// interface ProductFormProps {
//   mode: 'create' | 'edit';

//   product?: Product;
// }

// export default function ProductForm({
//   mode,
//   product,
// }: ProductFormProps) {
//   const router = useRouter();

//   const [form, setForm] =
//     useState<CreateProductPayload>({
//       name: '',
//       sku: '',
//       description: '',
//       price: 0,
//       stock: 0,
//       status: 'ACTIVE',
//       category: '',
//     });

//   const [loading, setLoading] =
//     useState(false);

//   const [error, setError] =
//     useState('');

//   useEffect(() => {
//     if (!product) return;

//     setForm({
//       name: product.name,
//       sku: product.sku,
//       description:
//         product.description || '',
//       price: Number(product.price),
//       stock: product.stock,
//       status: product.status,
//       category:
//         product.category || '',
//     });
//   }, [product]);

//   const updateField = <
//     K extends keyof CreateProductPayload
//   >(
//     field: K,
//     value: CreateProductPayload[K],
//   ) => {
//     setForm((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const submit = async (
//     event: React.FormEvent,
//   ) => {
//     event.preventDefault();

//     setError('');

//     if (!form.name.trim()) {
//       setError('Product name is required');
//       return;
//     }

//     if (!form.sku.trim()) {
//       setError('SKU is required');
//       return;
//     }

//     if (form.price < 0) {
//       setError('Price cannot be negative');
//       return;
//     }

//     if (form.stock < 0) {
//       setError('Stock cannot be negative');
//       return;
//     }

//     try {
//       setLoading(true);

//       if (mode === 'create') {
//         const response =
//           await productService.createProduct(
//             form,
//           );

//         router.push(
//           `/products/${response.data.id}`,
//         );
//       } else {
//         if (!product) return;

//         const response =
//           await productService.updateProduct(
//             product.id,
//             form,
//           );

//         router.push(
//           `/products/${response.data.id}`,
//         );
//       }
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : 'Something went wrong',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={submit}
//       className="space-y-6"
//     >
//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       <section className="rounded-xl bg-white p-6 shadow-sm">
//         <h2 className="mb-5 text-lg font-semibold">
//           Product Information
//         </h2>

//         <div className="grid gap-5 md:grid-cols-2">
//           <Input
//             label="Product Name"
//             required
//             value={form.name}
//             onChange={(value) =>
//               updateField('name', value)
//             }
//           />

//           <Input
//             label="SKU"
//             required
//             value={form.sku}
//             onChange={(value) =>
//               updateField('sku', value)
//             }
//           />

//           <Input
//             label="Category"
//             value={form.category || ''}
//             onChange={(value) =>
//               updateField('category', value)
//             }
//           />

//           <Input
//             label="Price"
//             type="number"
//             min="0"
//             value={String(form.price)}
//             onChange={(value) =>
//               updateField(
//                 'price',
//                 Number(value),
//               )
//             }
//           />

//           <Input
//             label="Stock"
//             type="number"
//             min="0"
//             value={String(form.stock)}
//             onChange={(value) =>
//               updateField(
//                 'stock',
//                 Number(value),
//               )
//             }
//           />

//           <div>
//             <label className="mb-2 block text-sm font-medium text-slate-700">
//               Status
//             </label>

//             <select
//               value={form.status}
//               onChange={(event) =>
//                 updateField(
//                   'status',
//                   event.target.value as
//                     | 'ACTIVE'
//                     | 'INACTIVE',
//                 )
//               }
//               className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
//             >
//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>
//             </select>
//           </div>
//         </div>
//       </section>

//       <section className="rounded-xl bg-white p-6 shadow-sm">
//         <label className="mb-2 block text-sm font-medium text-slate-700">
//           Description
//         </label>

//         <textarea
//           rows={5}
//           value={form.description || ''}
//           onChange={(event) =>
//             updateField(
//               'description',
//               event.target.value,
//             )
//           }
//           placeholder="Enter product description..."
//           className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-indigo-500"
//         />
//       </section>

//       <div className="flex justify-end gap-3">
//         <Link
//           href="/products"
//           className="rounded-lg border border-slate-200 px-5 py-2.5"
//         >
//           Cancel
//         </Link>

//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {loading
//             ? 'Saving...'
//             : mode === 'create'
//               ? 'Create Product'
//               : 'Update Product'}
//         </button>
//       </div>
//     </form>
//   );
// }

// function Input({
//   label,
//   value,
//   onChange,
//   type = 'text',
//   min,
//   required = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   type?: string;
//   min?: string;
//   required?: boolean;
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-medium text-slate-700">
//         {label}

//         {required && (
//           <span className="ml-1 text-red-500">
//             *
//           </span>
//         )}
//       </label>

//       <input
//         type={type}
//         min={min}
//         value={value}
//         required={required}
//         onChange={(event) =>
//           onChange(event.target.value)
//         }
//         className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
//       />
//     </div>
//   );
// }




'use client';

import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import {
  CreateProductPayload,
} from '@/services/product.service';

interface ProductFormProps {
  initialData?: Partial<CreateProductPayload>;

  onSubmit: (
    data: CreateProductPayload,
  ) => Promise<void>;

  onClose: () => void;

  loading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onClose,
  loading,
}: ProductFormProps) {
  const [form, setForm] =
    useState<CreateProductPayload>({
      name:
        initialData?.name || '',
      sku:
        initialData?.sku || '',
      description:
        initialData?.description || '',
      price:
        initialData?.price || 0,
      stock:
        initialData?.stock || 0,
      status:
        initialData?.status ||
        'ACTIVE',
      category:
        initialData?.category || '',
    });

  const update = (
    key: keyof CreateProductPayload,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-semibold">
            {initialData
              ? 'Edit Product'
              : 'Add Product'}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              placeholder="Product name"
              value={form.name}
              onChange={(e) =>
                update(
                  'name',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3"
            />

            <input
              required
              placeholder="SKU"
              value={form.sku}
              onChange={(e) =>
                update(
                  'sku',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3"
            />

            <input
              required
              type="number"
              min={0}
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                update(
                  'price',
                  Number(e.target.value),
                )
              }
              className="rounded-xl border px-4 py-3"
            />

            <input
              required
              type="number"
              min={0}
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                update(
                  'stock',
                  Number(e.target.value),
                )
              }
              className="rounded-xl border px-4 py-3"
            />

            <input
              placeholder="Category"
              value={form.category ?? ''}
              onChange={(e) =>
                update(
                  'category',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3"
            />

            <select
              value={form.status}
              onChange={(e) =>
                update(
                  'status',
                  e.target.value,
                )
              }
              className="rounded-xl border px-4 py-3"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          <textarea
            rows={4}
            placeholder="Description"
            value={form.description ?? ''}
            onChange={(e) =>
              update(
                'description',
                e.target.value,
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-white"
            >
              {loading
                ? 'Saving...'
                : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
