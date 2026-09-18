// 'use client';

// import {
//   FormEvent,
//   useState,
// } from 'react';

// import Link from 'next/link';

// import {
//   ArrowRight,
//   Mail,
//   MapPin,
//   Phone,
//   Search,
//   User,
// } from 'lucide-react';

// import {
//   contactService,
// } from '@/services/contact.service';

// import {
//   Contact,
// } from '@/types/contact';
// import { getErrorMessage } from '@/lib/error-message';

// export default function ContactSearchPage() {
//   const [
//     phone,
//     setPhone,
//   ] = useState('');

//   const [
//     contact,
//     setContact,
//   ] = useState<Contact | null>(
//     null,
//   );

//   const [
//     loading,
//     setLoading,
//   ] = useState(false);

//   const [
//     error,
//     setError,
//   ] = useState('');

//   const search = async (
//     event: FormEvent,
//   ) => {
//     event.preventDefault();

//     if (!phone.trim()) {
//       setError(
//         'Please enter a phone number',
//       );

//       return;
//     }

//     try {
//       setLoading(true);

//       setError('');

//       setContact(null);

//       const response =
//         await contactService.searchByPhone(
//           phone.trim(),
//         );

//       setContact(
//         response.data,
//       );
//     } catch (err: unknown) {
//       setError(
//         getErrorMessage(
//           err,
//           'No contact found',
//         ),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-950 p-6">

//       <div className="mx-auto max-w-5xl">

//         {/* Header */}

//         <div className="mb-8 text-center">

//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
//             <Search size={26} />
//           </div>

//           <h1 className="text-3xl font-bold text-white">
//             Contact Intelligence
//           </h1>

//           <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
//             Search your authorized customer records by phone number and view the information available in your system.
//           </p>

//         </div>

//         {/* Search */}

//         <form
//           onSubmit={search}
//           className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
//         >

//           <div className="flex flex-col gap-3 sm:flex-row">

//             <div className="relative flex-1">

//               <Phone
//                 size={19}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
//               />

//               <input
//                 value={phone}
//                 onChange={(event) =>
//                   setPhone(
//                     event.target.value,
//                   )
//                 }
//                 placeholder="+91 9876543210"
//                 className="w-full rounded-xl border border-white/10 bg-white/10 py-3.5 pl-11 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
//               />

//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-xl bg-indigo-600 px-7 py-3.5 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
//             >
//               {loading
//                 ? 'Searching...'
//                 : 'Search Contact'}
//             </button>

//           </div>

//         </form>

//         {/* Error */}

//         {error && (
//           <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
//             {error}
//           </div>
//         )}

//         {/* Result */}

//         {contact && (
//           <div className="mt-6 space-y-5">

//             <section className="rounded-2xl bg-white p-6 text-slate-900">

//               <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

//                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
//                   {
//                     contact.firstName[0]
//                   }
//                   {
//                     contact.lastName[0]
//                   }
//                 </div>

//                 <div className="flex-1">

//                   <div className="flex flex-wrap items-center gap-3">

//                     <h2 className="text-xl font-bold text-slate-900">
//                       {
//                         contact.firstName
//                       }{' '}
//                       {
//                         contact.lastName
//                       }
//                     </h2>

//                     <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
//                       {
//                         contact.status
//                       }
//                     </span>

//                   </div>

//                   <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">

//                     <span className="flex items-center gap-1.5">
//                       <Phone
//                         size={15}
//                       />
//                       {
//                         contact.phone
//                       }
//                     </span>

//                     {contact.email && (
//                       <span className="flex items-center gap-1.5">
//                         <Mail
//                           size={15}
//                         />
//                         {
//                           contact.email
//                         }
//                       </span>
//                     )}

//                   </div>

//                 </div>

//                 <Link
//                   href={`/contacts/${contact.id}`}
//                   className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
//                 >
//                   View Profile
//                   <ArrowRight
//                     size={16}
//                   />
//                 </Link>

//               </div>

//             </section>

//             {/* Contact summary */}

//             <div className="grid gap-4 md:grid-cols-3">

//               <InfoCard
//                 icon={
//                   <User
//                     size={19}
//                   />
//                 }
//                 title="Customer Type"
//                 value={
//                   contact.customerType
//                 }
//               />

//               <InfoCard
//                 icon={
//                   <MapPin
//                     size={19}
//                   />
//                 }
//                 title="Location"
//                 value={[
//                   contact.city,
//                   contact.state,
//                 ]
//                   .filter(
//                     Boolean,
//                   )
//                   .join(', ') ||
//                   '-'}
//               />

//               <InfoCard
//                 icon={
//                   <Phone
//                     size={19}
//                   />
//                 }
//                 title="Phone"
//                 value={
//                   contact.phone
//                 }
//               />

//             </div>

//             {/* Future data */}

//             <section className="rounded-2xl bg-white p-6 text-slate-900">

//               <h2 className="text-lg font-semibold text-slate-900">
//                 Customer Intelligence
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Additional information will appear here as Orders, Payments, Deliveries, Tasks and Activities are connected.
//               </p>

//               <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                 <FutureCard
//                   title="Orders"
//                   value="Phase 3"
//                 />

//                 <FutureCard
//                   title="Payments"
//                   value="Phase 4"
//                 />

//                 <FutureCard
//                   title="Deliveries"
//                   value="Phase 5"
//                 />

//                 <FutureCard
//                   title="Tasks"
//                   value="Phase 6"
//                 />

//               </div>

//             </section>

//           </div>
//         )}

//       </div>

//     </main>
//   );
// }

import { redirect } from 'next/navigation';

export default function ContactSearchPage() {
  redirect('/contacts');
}

// function InfoCard({
//   icon,
//   title,
//   value,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl bg-white p-5 text-slate-900">

//       <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
//         {icon}
//       </div>

//       <p className="text-xs font-semibold uppercase text-slate-600">
//         {title}
//       </p>

//       <p className="mt-1 font-semibold text-slate-900">
//         {value}
//       </p>

//     </div>
//   );
// }

// function FutureCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-dashed border-slate-200 p-4">

//       <p className="text-sm font-semibold text-slate-900">
//         {title}
//       </p>

//       <p className="mt-1 text-xs text-slate-500">
//         Coming in {value}
//       </p>

//     </div>
//   );
// }
