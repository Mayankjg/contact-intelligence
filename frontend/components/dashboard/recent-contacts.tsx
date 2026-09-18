import Link from 'next/link';

import {
  Users,
} from 'lucide-react';

import { Contact } from '@/types/contact';

interface RecentContactsProps {
  contacts: Contact[];
}

export default function RecentContacts({
  contacts,
}: RecentContactsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="font-semibold text-slate-900">
            Recent Contacts
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Recently added customers
          </p>
        </div>

        <Link
          href="/contacts"
          className="text-sm font-medium text-slate-700 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No contacts found.
          </div>
        ) : (
          contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts/${contact.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                {contact.firstName.charAt(
                  0,
                )}
                {contact.lastName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {contact.firstName}{' '}
                  {contact.lastName}
                </p>

                <p className="text-xs text-slate-500">
                  {contact.phone}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}