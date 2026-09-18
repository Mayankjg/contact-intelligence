// 'use client';

// import {
//   useCallback,
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import {
//   Eye,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
// } from 'lucide-react';

// import {
//   contactService,
// } from '@/services/contact.service';

// import {
//   Contact,
// } from '@/types/contact';
// import { getErrorMessage } from '@/lib/error-message';

// export default function ContactsPage() {
//   const [
//     contacts,
//     setContacts,
//   ] = useState<Contact[]>([]);

//   const [
//     search,
//     setSearch,
//   ] = useState('');

//   const [
//     status,
//     setStatus,
//   ] = useState('');

//   const [
//     page,
//     setPage,
//   ] = useState(1);

//   const [
//     totalPages,
//     setTotalPages,
//   ] = useState(1);

//   const [
//     total,
//     setTotal,
//   ] = useState(0);

//   const [
//     loading,
//     setLoading,
//   ] = useState(true);

//   const [
//     error,
//     setError,
//   ] = useState('');

//   const loadContacts =
//     useCallback(
//       async () => {
//         try {
//           setLoading(true);

//           setError('');

//           const response =
//             await contactService.getContacts(
//               {
//                 search:
//                   search.trim() ||
//                   undefined,

//                 status:
//                   status ||
//                   undefined,

//                 page,

//                 limit: 10,
//               },
//             );

//           setContacts(
//             response.data,
//           );

//           setTotal(
//             response.meta.total,
//           );

//           setTotalPages(
//             response.meta.totalPages,
//           );
//         } catch (err: unknown) {
//           setError(
//             getErrorMessage(
//               err,
//               'Unable to load contacts',
//             ),
//           );
//         } finally {
//           setLoading(false);
//         }
//       },
//       [
//         search,
//         status,
//         page,
//       ],
//     );

//   useEffect(() => {
//     loadContacts();
//   }, [loadContacts]);

//   const deleteContact =
//     async (
//       id: string,
//     ) => {
//       const confirmed =
//         window.confirm(
//           'Are you sure you want to delete this contact?',
//         );

//       if (!confirmed) {
//         return;
//       }

//       try {
//         await contactService.deleteContact(
//           id,
//         );

//         await loadContacts();
//       } catch (err: unknown) {
//         alert(
//           getErrorMessage(
//             err,
//             'Unable to delete contact',
//           ),
//         );
//       }
//     };

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">

//       <div className="mx-auto max-w-7xl">

//         {/* Header */}

//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Contacts
//             </h1>

//             <p className="mt-1 text-sm text-slate-600">
//               Manage all your customer contacts.
//             </p>
//           </div>

//           <Link
//             href="/contacts/new"
//             className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             <Plus size={18} />

//             Add Contact
//           </Link>

//         </div>

//         {/* Search */}

//         <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">

//           <div className="flex flex-col gap-3 md:flex-row">

//             <div className="relative flex-1">

//               <Search
//                 size={18}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               />

//               <input
//                 value={search}
//                 onChange={(
//                   event,
//                 ) => {
//                   setSearch(
//                     event.target.value,
//                   );

//                   setPage(1);
//                 }}
//                 placeholder="Search name, phone, email or company..."
//                 className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//               />

//             </div>

//             <select
//               value={status}
//               onChange={(
//                 event,
//               ) => {
//                 setStatus(
//                   event.target.value,
//                 );

//                 setPage(1);
//               }}
//               className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
//             >
//               <option value="">
//                 All Status
//               </option>

//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>

//               <option value="BLOCKED">
//                 Blocked
//               </option>
//             </select>

//             <button
//               onClick={() => {
//                 setPage(1);
//                 loadContacts();
//               }}
//               className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
//             >
//               Search
//             </button>

//           </div>

//         </div>

//         {/* Error */}

//         {error && (
//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {/* Table */}

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm">

//           {loading ? (
//             <div className="p-12 text-center text-slate-500">
//               Loading contacts...
//             </div>
//           ) : contacts.length === 0 ? (
//             <div className="p-12 text-center">

//               <div className="text-lg font-semibold">
//                 No contacts found
//               </div>

//               <p className="mt-1 text-sm text-slate-500">
//                 Try another search or create a new contact.
//               </p>

//             </div>
//           ) : (
//             <div className="overflow-x-auto">

//               <table className="w-full">

//                 <thead className="border-b border-slate-200 bg-slate-100">

//                   <tr>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Contact
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Phone
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Email
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Type
//                     </th>

//                     <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Status
//                     </th>

//                     <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-700">
//                       Actions
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody className="divide-y divide-slate-200">

//                   {contacts.map(
//                     (
//                       contact,
//                     ) => (
//                       <tr
//                         key={
//                           contact.id
//                         }
//                         className="hover:bg-slate-50"
//                       >

//                         <td className="px-6 py-4">

//                           <div className="flex items-center gap-3">

//                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
//                               {
//                                 contact.firstName[0]
//                               }
//                               {
//                                 contact.lastName[0]
//                               }
//                             </div>

//                             <div>

//                               <div className="font-medium text-slate-900">
//                                 {
//                                   contact.firstName
//                                 }{' '}
//                                 {
//                                   contact.lastName
//                                 }
//                               </div>

//                               {contact.company && (
//                                 <div className="text-xs text-slate-500">
//                                   {
//                                     contact.company
//                                   }
//                                 </div>
//                               )}

//                             </div>

//                           </div>

//                         </td>

//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           {
//                             contact.phone
//                           }
//                         </td>

//                         <td className="px-6 py-4 text-sm text-slate-600">
//                           {
//                             contact.email ||
//                             '-'
//                           }
//                         </td>

//                         <td className="px-6 py-4 text-sm font-medium text-slate-700">
//                           {
//                             contact.customerType
//                           }
//                         </td>

//                         <td className="px-6 py-4">

//                           <StatusBadge
//                             status={
//                               contact.status
//                             }
//                           />

//                         </td>

//                         <td className="px-6 py-4">

//                           <div className="flex justify-end gap-1">

//                             <Link
//                               href={`/contacts/${contact.id}`}
//                               className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//                             >
//                               <Eye size={17} />
//                             </Link>

//                             <Link
//                               href={`/contacts/${contact.id}/edit`}
//                               className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//                             >
//                               <Pencil size={17} />
//                             </Link>

//                             <button
//                               onClick={() =>
//                                 deleteContact(
//                                   contact.id,
//                                 )
//                               }
//                               className="rounded-lg p-2 text-red-500 hover:bg-red-50"
//                             >
//                               <Trash2
//                                 size={17}
//                               />
//                             </button>

//                           </div>

//                         </td>

//                       </tr>
//                     ),
//                   )}

//                 </tbody>

//               </table>

//             </div>
//           )}

//         </div>

//         {/* Pagination */}

//         {!loading &&
//           totalPages > 0 && (
//             <div className="mt-5 flex items-center justify-between">

//               <p className="text-sm font-medium text-slate-600">
//                 Total contacts:{' '}
//                 {total}
//               </p>

//               <div className="flex items-center gap-2">

//                 <button
//                   disabled={
//                     page === 1
//                   }
//                   onClick={() =>
//                     setPage(
//                       (current) =>
//                         current - 1,
//                     )
//                   }
//                   className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                 >
//                   Previous
//                 </button>

//                 <span className="px-3 text-sm font-medium text-slate-700">
//                   Page {page} of{' '}
//                   {totalPages}
//                 </span>

//                 <button
//                   disabled={
//                     page >=
//                     totalPages
//                   }
//                   onClick={() =>
//                     setPage(
//                       (current) =>
//                         current + 1,
//                     )
//                   }
//                   className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                 >
//                   Next
//                 </button>

//               </div>

//             </div>
//           )}

//       </div>
//     </main>
//   );
// }

// function StatusBadge({
//   status,
// }: {
//   status: string;
// }) {
//   const classes: Record<
//     string,
//     string
//   > = {
//     ACTIVE:
//       'bg-green-100 text-green-700',

//     INACTIVE:
//       'bg-slate-100 text-slate-600',

//     BLOCKED:
//       'bg-red-100 text-red-700',
//   };

//   return (
//     <span
//       className={`rounded-full px-3 py-1 text-xs font-medium ${
//         classes[status] ||
//         'bg-slate-100 text-slate-600'
//       }`}
//     >
//       {status}
//     </span>
//   );
// }




'use client';

import {
  useState,
} from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import ContactTable from '@/components/contacts/contact-table';

import ContactForm from '@/components/contacts/contact-form';

import { useContacts } from '@/hooks/use-contacts';

import {
  Contact,
} from '@/types/contact';

export default function ContactsPage() {
  const [search, setSearch] =
    useState('');

  const [showForm, setShowForm] =
    useState(false);

  const [editingContact, setEditingContact] =
    useState<Contact | null>(null);

  const {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts({
    search,
    page: 1,
    limit: 20,
  });

  const handleSubmit = async (
    data: any,
  ) => {
    if (editingContact) {
      await updateContact(
        editingContact.id,
        data,
      );
    } else {
      await createContact(data);
    }

    setShowForm(false);
    setEditingContact(null);
  };

  const handleDelete = async (
    contact: Contact,
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${contact.firstName} ${contact.lastName}?`,
      );

    if (!confirmed) {
      return;
    }

    await deleteContact(contact.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Contacts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customers and view their complete history.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingContact(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by name or phone..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
          Loading contacts...
        </div>
      ) : (
        <ContactTable
          contacts={contacts}
          onEdit={(contact) => {
            setEditingContact(contact);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ContactForm
          initialData={
            editingContact || undefined
          }
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
}