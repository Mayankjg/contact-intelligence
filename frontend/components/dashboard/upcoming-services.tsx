import {
  CalendarClock,
} from 'lucide-react';

import { formatDate } from '@/lib/utils';
import type { CustomerService } from '@/services/service.service';

interface UpcomingServicesProps {
  services: CustomerService[];
}

export default function UpcomingServices({
  services,
}: UpcomingServicesProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
            <CalendarClock className="h-5 w-5 text-slate-700" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Upcoming Services
            </h2>

            <p className="text-xs text-slate-500">
              Services that need attention
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {services.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No upcoming services.
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="px-6 py-4"
            >
              <p className="text-sm font-semibold text-slate-900">
                {service.serviceName}
              </p>

              {service.contact && (
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {service.contact.firstName}{' '}
                  {service.contact.lastName}
                </p>
              )}

              <p className="mt-1 text-xs text-slate-500">
                {formatDate(
                  service.scheduledDate,
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
