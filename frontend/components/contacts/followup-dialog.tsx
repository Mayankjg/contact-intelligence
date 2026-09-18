'use client';

import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import {
  CreateFollowUpPayload,
} from '@/services/followup.service';

interface FollowUpDialogProps {
  contactId: string;

  onSubmit: (
    data: CreateFollowUpPayload,
  ) => Promise<void>;

  onClose: () => void;
}

export default function FollowUpDialog({
  contactId,
  onSubmit,
  onClose,
}: FollowUpDialogProps) {
  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [followUpDate, setFollowUpDate] =
    useState('');

  const [reminderDate, setReminderDate] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const submit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit({
        contactId,
        title,
        description,
        followUpDate,
        reminderDate,
        type: 'PRODUCT_PURCHASE',
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
          <h2 className="font-semibold text-slate-900">
            Add Product Follow-up
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
            placeholder="Follow-up title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
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
              Follow-up Date
            </label>

            <input
              required
              type="date"
              value={followUpDate}
              onChange={(e) =>
                setFollowUpDate(
                  e.target.value,
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Reminder Date
            </label>

            <input
              type="date"
              value={reminderDate}
              onChange={(e) =>
                setReminderDate(
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
                : 'Create Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}