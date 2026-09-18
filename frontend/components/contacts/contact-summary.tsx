import {
  BellRing,
  CalendarClock,
  Package,
  ShoppingBag,
} from 'lucide-react';

interface ContactSummaryProps {
  totalPurchases: number;
  totalProducts: number;
  upcomingServices: number;
  pendingFollowUps: number;
}

export default function ContactSummary({
  totalPurchases,
  totalProducts,
  upcomingServices,
  pendingFollowUps,
}: ContactSummaryProps) {
  const cards = [
    {
      title: 'Purchases',
      value: totalPurchases,
      icon: ShoppingBag,
    },
    {
      title: 'Products',
      value: totalProducts,
      icon: Package,
    },
    {
      title: 'Upcoming Services',
      value: upcomingServices,
      icon: CalendarClock,
    },
    {
      title: 'Follow-ups',
      value: pendingFollowUps,
      icon: BellRing,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}