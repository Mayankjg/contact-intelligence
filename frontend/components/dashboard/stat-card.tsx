import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;

  value: string | number;

  description?: string;

  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  const accent = title.includes('Contacts')
    ? 'bg-indigo-50 text-indigo-600 ring-indigo-100'
    : title.includes('Products')
      ? 'bg-cyan-50 text-cyan-700 ring-cyan-100'
      : 'bg-amber-50 text-amber-700 ring-amber-100';

  return (
    <div className="group rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_-12px_rgba(15,23,42,.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,.28)] sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-[34px] font-bold leading-none tracking-[-.05em] text-slate-900">
            {value}
          </h3>

          {description && (
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${accent}`}>
          <Icon className="h-[19px] w-[19px]" />
        </div>
      </div>
    </div>
  );
}
