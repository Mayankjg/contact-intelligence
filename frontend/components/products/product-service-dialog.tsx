'use client';

import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import {
  CreateProductServicePayload,
} from '@/services/product.service';

interface ProductServiceDialogProps {
  initialData?: Partial<CreateProductServicePayload>;

  onSubmit: (
    data: CreateProductServicePayload,
  ) => Promise<void>;

  onClose: () => void;
}

export default function ProductServiceDialog({
  initialData,
  onSubmit,
  onClose,
}: ProductServiceDialogProps) {
  const [name, setName] =
    useState(
      initialData?.name || '',
    );

  const [description, setDescription] =
    useState(
      initialData?.description || '',
    );

  const [
    daysAfterPurchase,
    setDaysAfterPurchase,
  ] = useState(
    initialData?.daysAfterPurchase ||
      0,
  );

  const [durationMinutes, setDurationMinutes] =
    useState(
      initialData?.durationMinutes ||
        30,
    );

  const [loading, setLoading] =
    useState(false);

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit({
        name,
        description,
        daysAfterPurchase,
        durationMinutes,
        isActive: true,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-semibold">
            {initialData
              ? 'Edit Service'
              : 'Add Service'}
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
          <input
            required
            placeholder="Service name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value,
              )
            }
            className="w-full rounded-xl border px-4 py-3"
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Days After Purchase
            </label>

            <input
              required
              type="number"
              min={0}
              value={daysAfterPurchase}
              onChange={(e) =>
                setDaysAfterPurchase(
                  Number(e.target.value),
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />

            {/* <p className="mt-1 text-xs text-slate-500">
              Example: 30 = service after 30 days.
            </p> */}
          </div>

          {/* <div>
            <label className="mb-2 block text-sm font-medium">
              Duration (minutes)
            </label>

            <input
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(
                  Number(e.target.value),
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div> */}

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
                : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}