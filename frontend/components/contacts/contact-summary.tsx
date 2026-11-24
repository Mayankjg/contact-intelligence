import {
  BellRing,
  Package,
  ShoppingBag,
} from 'lucide-react';

interface ContactSummaryProps {
  totalPurchases: number;
  totalProducts: number;
  pendingFollowUps: number;
}

export default function ContactSummary({
  totalPurchases,
  totalProducts,
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
      title: 'Follow-ups',
      value: pendingFollowUps,
      icon: BellRing,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[20px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_-12px_rgba(15,23,42,.22)] transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {card.title}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
