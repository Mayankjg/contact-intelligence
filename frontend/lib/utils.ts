// import {
//   clsx,
//   type ClassValue,
// } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// export function cn(
//   ...inputs: ClassValue[]
// ) {
//   return twMerge(
//     clsx(inputs),
//   );
// }


//   ------------------------------------------------------------



// export function formatCurrency(
//   value: string | number,
// ): string {
//   const amount =
//     typeof value === 'string'
//       ? Number(value)
//       : value;

//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// export function formatDate(
//   value: string,
// ): string {
//   return new Intl.DateTimeFormat('en-IN', {
//     dateStyle: 'medium',
//   }).format(new Date(value));
// }



export function formatCurrency(
  value: number | string | null | undefined,
): string {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    },
  ).format(Number(value || 0));
}

export function formatDate(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value));
}

export function formatDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value));
}

export function getInitials(
  firstName?: string,
  lastName?: string,
): string {
  const first =
    firstName?.charAt(0) || '';

  const last =
    lastName?.charAt(0) || '';

  return `${first}${last}`.toUpperCase();
}

export function cn(
  ...classes: Array<
    string | false | null | undefined
  >
): string {
  return classes
    .filter(Boolean)
    .join(' ');
}