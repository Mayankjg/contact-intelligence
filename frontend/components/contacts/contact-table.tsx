'use client';

import Link from 'next/link';

import {
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Contact } from '@/types/contact';

interface ContactTableProps {
  contacts: Contact[];

  onEdit?: (contact: Contact) => void;

  onDelete?: (contact: Contact) => void;
}

export default function ContactTable({
  contacts,
  onEdit,
  onDelete,
}: ContactTableProps) {
  function getStatusClass(
    status: Contact['status'],
  ) {
    if (status === 'INACTIVE') {
      return 'bg-red-50 text-red-700';
    }

    if (status === 'BLOCKED') {
      return 'bg-slate-100 text-slate-600';
    }

    return 'bg-emerald-50 text-emerald-700';
  }

  if (!contacts.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        No contacts found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b last:border-0 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {contact.firstName.charAt(
                        0,
                      )}
                      {contact.lastName.charAt(
                        0,
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-900" title={`${contact.firstName} ${contact.lastName}${contact.email ? ` · ${contact.email}` : ''}`}>
                        {contact.firstName} {contact.lastName}{contact.email && <span className="font-normal text-slate-400"> · {contact.email}</span>}
                      </p>
                    </div>
                  </Link>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {contact.phone}
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {contact.company || '-'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(contact.status)}`}
                  >
                    {contact.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/contacts/${contact.id}`}
                      aria-label={`View ${contact.firstName} ${contact.lastName}`}
                      title="View contact"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(contact)
                        }
                        aria-label={`Edit ${contact.firstName} ${contact.lastName}`}
                        title="Edit contact"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(contact)
                        }
                        aria-label={`Remove ${contact.firstName} ${contact.lastName}`}
                        title="Remove contact"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
