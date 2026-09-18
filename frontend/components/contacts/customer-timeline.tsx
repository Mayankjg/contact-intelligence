import {
  Calendar,
  CheckCircle2,
  Package,
  Wrench,
} from 'lucide-react';

import { formatDate } from '@/lib/utils';

interface TimelineItem {
  id: string;

  type:
    | 'PURCHASE'
    | 'SERVICE'
    | 'FOLLOWUP';

  title: string;

  description?: string;

  date: string;
}

interface CustomerTimelineProps {
  items: TimelineItem[];
}

export default function CustomerTimeline({
  items,
}: CustomerTimelineProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-slate-900">
        Customer Timeline
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Complete customer activity history
      </p>

      <div className="mt-6 space-y-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No activity yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="relative flex gap-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                {item.type ===
                'PURCHASE' ? (
                  <Package className="h-4 w-4" />
                ) : item.type ===
                  'SERVICE' ? (
                  <Wrench className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>

                {item.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}