'use client';

import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import {
  Product,
} from '@/types/product';

import {
  CreatePurchasePayload,
} from '@/services/purchase.service';

interface PurchaseDialogProps {
  contactId: string;

  products: Product[];

  onSubmit: (
    data: CreatePurchasePayload,
  ) => Promise<void>;

  onClose: () => void;
}

export default function PurchaseDialog({
  contactId,
  products,
  onSubmit,
  onClose,
}: PurchaseDialogProps) {
  const [productId, setProductId] =
    useState('');

  const [quantity, setQuantity] =
    useState(1);

  const [purchaseDate, setPurchaseDate] =
    useState(
      new Date()
        .toISOString()
        .split('T')[0],
    );

  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState('');
  const selectedProduct = products.find(
    (product) => product.id === productId,
  );

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!productId) {
      return;
    }

    if (!selectedProduct || selectedProduct.stock < quantity) {
      setError(
        `${selectedProduct?.name || 'This product'} has only ${selectedProduct?.stock || 0} items in stock.`,
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      await onSubmit({
        contactId,
        items: [
          {
            productId,
            quantity,
          },
        ],
        purchaseDate,
      });

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to save this purchase. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Record Purchase
            </h2>

            <p className="text-xs text-slate-500">
              Add a product purchased by this customer.
            </p>
          </div>

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
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product
            </label>

            <select
              required
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setError('');
              }}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="">
                Select product
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} - ₹
                  {product.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantity
            </label>

            <input
              type="number"
              min={1}
              max={selectedProduct?.stock || undefined}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Number(e.target.value),
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
            {selectedProduct && (
              <p className="mt-2 text-xs text-slate-500">
                Available stock: {selectedProduct.stock}
              </p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Purchase Date
            </label>

            <input
              type="date"
              value={purchaseDate}
              onChange={(e) =>
                setPurchaseDate(
                  e.target.value,
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm text-white disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : 'Save Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
