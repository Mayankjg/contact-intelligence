// import Link from 'next/link';

// import ContactForm from '@/components/contacts/contact-form';

// export default function NewContactPage() {
//   return (
//     <main className="min-h-screen bg-slate-50 p-6">
//       <div className="mx-auto max-w-5xl">

//         <div className="mb-6">
//           <Link
//             href="/contacts"
//             className="text-sm text-indigo-600 hover:underline"
//           >
//             ← Back to Contacts
//           </Link>

//           <h1 className="mt-3 text-2xl font-bold text-slate-900">
//             Add Contact
//           </h1>

//           <p className="mt-1 text-sm text-slate-500">
//             Create a new customer contact.
//           </p>
//         </div>

//         <ContactForm mode="create" />

//       </div>
//     </main>
//   );
// }

import { redirect } from 'next/navigation';

export default function NewContactPage() {
  redirect('/contacts');
}
