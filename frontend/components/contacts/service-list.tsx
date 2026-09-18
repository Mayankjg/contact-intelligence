'use client';

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
} from 'lucide-react';

import { CustomerService } from '@/types/service';

import { formatDate } from '@/lib/utils';

interface ServiceListProps {
  services: CustomerService[];

  onComplete: (
    service: CustomerService,
  ) => void;
}

export default function ServiceList({
  services,
  onComplete,
}: ServiceListProps) {
  const getStatusClass = (
    status: string,
  ) => {
    if (status === 'COMPLETED') {
      return 'bg-emerald-50 text-emerald-700';
    }

    if (
      status === 'DUE' ||
      status === 'MISSED'
    ) {
      return 'bg-red-50 text-red-700';
    }

    return 'bg-amber-50 text-amber-700';
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-semibold text-slate-900">
          Service Schedule
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Services related to purchased products
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {services.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No services scheduled.
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  {service.status ===
                  'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : service.status ===
                    'DUE' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Clock3 className="h-5 w-5 text-slate-600" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    {service.serviceName}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Scheduled:{' '}
                    {formatDate(
                      service.scheduledDate,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    service.status,
                  )}`}
                >
                  {service.status}
                </span>

                {service.status !==
                  'COMPLETED' &&
                  service.status !==
                    'CANCELLED' && (
                    <button
                      onClick={() =>
                        onComplete(service)
                      }
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white"
                    >
                      Complete
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}