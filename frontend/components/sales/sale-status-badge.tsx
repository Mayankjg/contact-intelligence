interface Props {
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function SaleStatusBadge({ status }: Props) {
  const styles = {
    ACTIVE: 'bg-blue-50 text-blue-700',
    COMPLETED: 'bg-emerald-50 text-emerald-700',
    CANCELLED: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}
