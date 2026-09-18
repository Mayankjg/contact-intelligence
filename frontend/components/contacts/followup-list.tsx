'use client';

import {
  BellRing,
  CheckCircle2,
} from 'lucide-react';

import { FollowUp } from '@/types/followup';

import { formatDate } from '@/lib/utils';

interface FollowUpListProps {
  followUps: FollowUp[];

  onComplete: (
    followUp: FollowUp,
  ) => void;
}

export default function FollowUpList({
  followUps,
  onComplete,
}: FollowUpListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <BellRing className="h-5 w-5 text-slate-700" />

          <div>
            <h2 className="font-semibold text-slate-900">
              Product Follow-ups
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Reminders for future purchases
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {followUps.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No follow-ups scheduled.
          </div>
        ) : (
          followUps.map((followUp) => (
            <div
              key={followUp.id}
              className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {followUp.title}
                </p>

                {followUp.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {followUp.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                  Follow-up:{' '}
                  {formatDate(
                    followUp.followUpDate,
                  )}
                </p>
              </div>

              {followUp.status ===
              'PENDING' ? (
                <button
                  onClick={() =>
                    onComplete(followUp)
                  }
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </button>
              ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {followUp.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}