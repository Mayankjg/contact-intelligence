'use client';

import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import { CustomerService } from '@/types/service';

interface ServiceDialogProps {
  service: CustomerService;

  onSubmit: (
    data: {
      scheduledDate?: string;
      notes?: string;
    },
  ) => Promise<void>;

  onClose: () => void;
}

export default function ServiceDialog({
  service,
  onSubmit,
  onClose,
}: ServiceDialogProps) {
  const [date, setDate] =
    useState(
      service.scheduledDate
        ?.split('T')[0] || '',
    );

  const [notes, setNotes] =
    useState(service.notes || '');

  const [loading, setLoading] =
    useState(false);

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit({
        scheduledDate: date,
        notes,
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
            Edit Service
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
          <div>
            <label className="mb-2 block text-sm font-medium">
              Service Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Notes"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
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
                : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}