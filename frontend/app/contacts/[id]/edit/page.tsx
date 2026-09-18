// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import ContactForm from '@/components/contacts/contact-form';

// import {
//   contactService,
// } from '@/services/contact.service';

// import {
//   Contact,
// } from '@/types/contact';
// import { getErrorMessage } from '@/lib/error-message';

// interface PageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

import { redirect } from 'next/navigation';

export default function EditContactPage() {
  redirect('/contacts');
}

// export default function EditContactPage({
//   params,
// }: PageProps) {
//   const [contact, setContact] =
//     useState<Contact | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState('');

//   useEffect(() => {
//     async function loadContact() {
//       try {
//         const { id } =
//           await params;

//         const response =
//           await contactService.getContact(
//             id,
//           );

//         setContact(
//           response.data,
//         );
//       } catch (err: unknown) {
//         setError(
//           getErrorMessage(
//             err,
//             'Contact not found',
//           ),
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadContact();
//   }, [params]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <div className="mx-auto max-w-5xl text-center">
//           Loading contact...
//         </div>
//       </main>
//     );
//   }

//   if (error || !contact) {
//     return (
//       <main className="min-h-screen bg-slate-50 p-6">
//         <div className="mx-auto max-w-5xl">

//           <Link
//             href="/contacts"
//             className="text-indigo-600"
//           >
//             ← Back to Contacts
//           </Link>

//           <div className="mt-6 rounded-xl bg-red-50 p-6 text-red-600">
//             {error ||
//               'Contact not found'}
//           </div>

//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-5xl">

//         <div className="mb-6">
//           <Link
//             href={`/contacts/${contact.id}`}
//             className="text-sm text-indigo-600 hover:underline"
//           >
//             ← Back to Contact
//           </Link>

//           <h1 className="mt-3 text-2xl font-bold">
//             Edit Contact
//           </h1>
//         </div>

//         <ContactForm
//           mode="edit"
//           contact={contact}
//         />

//       </div>
//     </main>
//   );
// }
