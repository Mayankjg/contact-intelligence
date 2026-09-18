import Link from 'next/link';

import {
  ArrowLeft,
  Mail,
  Phone,
} from 'lucide-react';
  
import { Contact } from '@/types/contact';

import { getInitials } from '@/lib/utils';

interface ContactHeaderProps {
  contact: Contact;
}

export default function ContactHeader({
  contact,
}: ContactHeaderProps) {
  const statusClass =
    contact.status === 'INACTIVE'
      ? 'bg-red-50 text-red-700'
      : contact.status === 'BLOCKED'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-emerald-50 text-emerald-700';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href="/contacts"
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            {getInitials(
              contact.firstName,
              contact.lastName,
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {contact.firstName}{' '}
              {contact.lastName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {contact.company ||
                'Individual Customer'}
            </p>
 
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {contact.phone}
              </span>

              {contact.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {contact.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${statusClass}`}
        >
          {contact.status}
        </span>
      </div>
    </div>
  );
}
