import {
  BellRing,
} from 'lucide-react';

import { formatDate } from '@/lib/utils';
import type { FollowUp } from '@/services/followup.service';

interface UpcomingFollowUpsProps {
  followUps: FollowUp[];
}

export default function UpcomingFollowUps({
  followUps,
}: UpcomingFollowUpsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
            <BellRing className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Upcoming Follow-ups
            </h2>

            <p className="text-xs text-slate-500">
              Customer purchase reminders
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {followUps.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No pending follow-ups.
          </div>
        ) : (
          followUps.map((followUp) => (
            <div
              key={followUp.id}
              className="px-6 py-4"
            >
              <p className="text-sm font-semibold text-slate-900">
                {followUp.title}
              </p>

              {followUp.contact && (
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {followUp.contact.firstName}{' '}
                  {followUp.contact.lastName}
                </p>
              )}

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(
                  followUp.followUpDate,
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
