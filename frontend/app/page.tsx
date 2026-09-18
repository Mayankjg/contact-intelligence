// import Link from 'next/link';

// const stats = [
//   {
//     title: 'Total Contacts',
//     value: '1,248',
//     change: '+12.5%',
//     description: 'vs last month',
//     icon: '◎',
//   },
//   {
//     title: 'Total Orders',
//     value: '384',
//     change: '+8.2%',
//     description: 'vs last month',
//     icon: '◈',
//   },
//   {
//     title: 'Total Revenue',
//     value: '₹2,48,500',
//     change: '+18.4%',
//     description: 'vs last month',
//     icon: '₹',
//   },
//   {
//     title: 'Pending Payments',
//     value: '₹34,200',
//     change: '18',
//     description: 'customers pending',
//     icon: '◷',
//   },
// ];

// const recentOrders = [
//   {
//     id: 'ORD-10231',
//     customer: 'Mayank Jagla',
//     amount: '₹4,500',
//     status: 'Delivered',
//   },
//   {
//     id: 'ORD-10230',
//     customer: 'Rahul Patel',
//     amount: '₹2,200',
//     status: 'Processing',
//   },
//   {
//     id: 'ORD-10229',
//     customer: 'Amit Shah',
//     amount: '₹8,900',
//     status: 'Pending',
//   },
//   {
//     id: 'ORD-10228',
//     customer: 'Priya Patel',
//     amount: '₹1,200',
//     status: 'Delivered',
//   },
// ];

// const recentContacts = [
//   {
//     name: 'Mayank Jagla',
//     phone: '9723567627',
//     status: 'Active',
//     avatar: 'M',
//   },
//   {
//     name: 'Rahul Patel',
//     phone: '9876543210',
//     status: 'Active',
//     avatar: 'R',
//   },
//   {
//     name: 'Amit Shah',
//     phone: '9823456789',
//     status: 'Active',
//     avatar: 'A',
//   },
//   {
//     name: 'Priya Patel',
//     phone: '9876541230',
//     status: 'Pending',
//     avatar: 'P',
//   },
// ];

// function statusClass(
//   status: string,
// ) {
//   switch (status) {
//     case 'Delivered':
//     case 'Active':
//       return 'bg-emerald-50 text-emerald-700';

//     case 'Processing':
//       return 'bg-blue-50 text-blue-700';

//     case 'Pending':
//       return 'bg-amber-50 text-amber-700';

//     default:
//       return 'bg-slate-100 text-slate-600';
//   }
// }

// export default function HomePage() {
//   return (
//     <div className="mx-auto max-w-[1600px]">

//       {/* Header */}
//       <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

//         <div>
//           <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
//             <span>Overview</span>
//             <span>/</span>
//             <span className="text-indigo-500">
//               Dashboard
//             </span>
//           </div>

//           <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
//             Good evening, Mayank 👋
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Here's what's happening with your customers today.
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
//             Last 7 days ▾
//           </button>

//           <Link
//             href="/contacts/new"
//             className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
//           >
//             + Add Contact
//           </Link>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.title}
//             className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//           >
//             <div className="mb-5 flex items-start justify-between">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
//                 {stat.icon}
//               </div>

//               <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
//                 {stat.change}
//               </span>
//             </div>

//             <p className="text-xs font-medium text-slate-500">
//               {stat.title}
//             </p>

//             <div className="mt-1 flex items-end gap-2">
//               <h2 className="text-2xl font-bold tracking-tight text-slate-950">
//                 {stat.value}
//               </h2>
//             </div>

//             <p className="mt-1 text-[11px] text-slate-400">
//               {stat.description}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Main analytics */}
//       <div className="mb-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">

//         {/* Revenue */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h2 className="text-base font-bold text-slate-950">
//                 Revenue Overview
//               </h2>

//               <p className="mt-1 text-xs text-slate-400">
//                 Revenue performance over the last 7 days
//               </p>
//             </div>

//             <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
//               Weekly ▾
//             </button>
//           </div>

//           <div className="flex h-[270px] items-end gap-3 border-b border-l border-slate-100 px-4 pb-0 pt-8 sm:gap-5">
//             {[
//               45,
//               62,
//               52,
//               78,
//               68,
//               91,
//               74,
//             ].map((height, index) => (
//               <div
//                 key={index}
//                 className="group flex h-full flex-1 flex-col justify-end"
//               >
//                 <div
//                   className="relative rounded-t-lg bg-indigo-500 transition-all group-hover:bg-indigo-600"
//                   style={{
//                     height: `${height}%`,
//                   }}
//                 >
//                   <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[9px] text-white group-hover:block">
//                     ₹{height}K
//                   </span>
//                 </div>

//                 <span className="mt-3 text-center text-[10px] text-slate-400">
//                   {
//                     [
//                       'Mon',
//                       'Tue',
//                       'Wed',
//                       'Thu',
//                       'Fri',
//                       'Sat',
//                       'Sun',
//                     ][index]
//                   }
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Order status */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-6">
//             <h2 className="text-base font-bold text-slate-950">
//               Order Status
//             </h2>

//             <p className="mt-1 text-xs text-slate-400">
//               Current order distribution
//             </p>
//           </div>

//           <div className="space-y-5">
//             {[
//               {
//                 label: 'Delivered',
//                 value: 62,
//               },
//               {
//                 label: 'Processing',
//                 value: 18,
//               },
//               {
//                 label: 'Pending',
//                 value: 12,
//               },
//               {
//                 label: 'Cancelled',
//                 value: 8,
//               },
//             ].map((item) => (
//               <div key={item.label}>
//                 <div className="mb-2 flex justify-between text-xs">
//                   <span className="font-medium text-slate-600">
//                     {item.label}
//                   </span>

//                   <span className="font-semibold text-slate-900">
//                     {item.value}%
//                   </span>
//                 </div>

//                 <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                   <div
//                     className="h-full rounded-full bg-indigo-500"
//                     style={{
//                       width: `${item.value}%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 rounded-xl bg-slate-50 p-4">
//             <p className="text-xs text-slate-400">
//               Total orders
//             </p>

//             <p className="mt-1 text-xl font-bold text-slate-900">
//               384
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Customer intelligence */}
//       <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
//         <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
//                 ✦
//               </span>

//               <h2 className="text-base font-bold text-slate-950">
//                 Customer Intelligence
//               </h2>
//             </div>

//             <p className="max-w-xl text-sm text-slate-500">
//               Search a phone number to instantly see customer orders,
//               payments, deliveries and follow-ups.
//             </p>
//           </div>

//           <div className="flex w-full max-w-xl gap-2">
//             <input
//               type="text"
//               placeholder="Enter customer phone number..."
//               className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
//             />

//             <button className="rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tables */}
//       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

//         {/* Recent Orders */}
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//             <div>
//               <h2 className="text-base font-bold text-slate-950">
//                 Recent Orders
//               </h2>

//               <p className="mt-1 text-xs text-slate-400">
//                 Latest customer orders
//               </p>
//             </div>

//             <Link
//               href="/orders"
//               className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
//             >
//               View all →
//             </Link>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[600px]">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                     Order
//                   </th>

//                   <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                     Customer
//                   </th>

//                   <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                     Amount
//                   </th>

//                   <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                     Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {recentOrders.map((order) => (
//                   <tr
//                     key={order.id}
//                     className="border-t border-slate-100 transition hover:bg-slate-50"
//                   >
//                     <td className="px-6 py-4 text-xs font-semibold text-indigo-600">
//                       {order.id}
//                     </td>

//                     <td className="px-6 py-4 text-xs font-medium text-slate-700">
//                       {order.customer}
//                     </td>

//                     <td className="px-6 py-4 text-xs font-semibold text-slate-900">
//                       {order.amount}
//                     </td>

//                     <td className="px-6 py-4">
//                       <span
//                         className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass(
//                           order.status,
//                         )}`}
//                       >
//                         {order.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Contacts */}
//         <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
//             <div>
//               <h2 className="text-base font-bold text-slate-950">
//                 Recent Contacts
//               </h2>

//               <p className="mt-1 text-xs text-slate-400">
//                 Recently added customers
//               </p>
//             </div>

//             <Link
//               href="/contacts"
//               className="text-xs font-semibold text-indigo-600"
//             >
//               View all →
//             </Link>
//           </div>

//           <div className="divide-y divide-slate-100">
//             {recentContacts.map(
//               (contact) => (
//                 <div
//                   key={contact.phone}
//                   className="flex items-center gap-3 px-6 py-4 transition hover:bg-slate-50"
//                 >
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
//                     {contact.avatar}
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-xs font-semibold text-slate-800">
//                       {contact.name}
//                     </p>

//                     <p className="mt-0.5 text-[10px] text-slate-400">
//                       {contact.phone}
//                     </p>
//                   </div>

//                   <span
//                     className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
//                       contact.status,
//                     )}`}
//                   >
//                     {contact.status}
//                   </span>
//                 </div>
//               ),
//             )}
//           </div>
//         </div>
//       </div>

//       {/* AI Card */}
//       <div className="mt-6 overflow-hidden rounded-2xl bg-[#0b1220] p-6 text-white shadow-xl">
//         <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

//           <div className="flex items-start gap-4">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-xl shadow-lg shadow-indigo-500/20">
//               ✦
//             </div>

//             <div>
//               <div className="mb-1 flex items-center gap-2">
//                 <h2 className="font-bold">
//                   AI Customer Assistant
//                 </h2>

//                 <span className="rounded-full bg-indigo-400/20 px-2 py-0.5 text-[9px] font-semibold text-indigo-300">
//                   BETA
//                 </span>
//               </div>

//               <p className="max-w-2xl text-xs leading-5 text-slate-400">
//                 Ask questions about your customers, orders,
//                 payments and deliveries using natural language.
//               </p>
//             </div>
//           </div>

//           <Link
//             href="/ai-assistant"
//             className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
//           >
//             Open AI Assistant →
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }





'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Users,
  Package,
  CalendarClock,
  BellRing,
} from 'lucide-react';

import Link from 'next/link';

import { contactService } from '@/services/contact.service';

import { serviceService } from '@/services/service.service';

import { followupService } from '@/services/followup.service';
import { productService } from '@/services/product.service';
import {
  getUpcomingFollowUps,
  getUpcomingServices,
} from '@/lib/notifications';

import RecentContacts from '@/components/dashboard/recent-contacts';

import UpcomingServices from '@/components/dashboard/upcoming-services';

import UpcomingFollowUps from '@/components/dashboard/upcoming-followups';

import StatCard from '@/components/dashboard/stat-card';

export default function DashboardPage() {
  const [contacts, setContacts] =
    useState<any[]>([]);

  const [services, setServices] =
    useState<any[]>([]);

  const [followUps, setFollowUps] =
    useState<any[]>([]);

  const [contactCount, setContactCount] =
    useState(0);
  const [productCount, setProductCount] =
    useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const results = await Promise.allSettled([
          contactService.getContacts({
            page: 1,
            limit: 5,
          }),

          serviceService.getServices({
            page: 1,
            limit: 100,
          }),

          followupService.getFollowUps({
            status: 'PENDING',
            page: 1,
            limit: 100,
          }),

          productService.getProducts({
            page: 1,
            limit: 1,
          }),

        ]);

        const [
          contactResult,
          serviceResult,
          followUpResult,
          productResult,
        ] = results;

        if (contactResult.status === 'fulfilled') {
          setContacts(contactResult.value.data);
          setContactCount(contactResult.value.meta.total);
        }

        if (serviceResult.status === 'fulfilled') {
          setServices(
            getUpcomingServices(
              serviceResult.value.data,
            ),
          );
        }

        if (followUpResult.status === 'fulfilled') {
          setFollowUps(
            getUpcomingFollowUps(
              followUpResult.value.data,
            ),
          );
        }

        if (productResult.status === 'fulfilled') {
          setProductCount(productResult.value.meta.total);
        }

      } catch (error) {
        console.error(
          'Dashboard error:',
          error,
        );
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your customers, products,
            services and follow-ups.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/contacts"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            View Contacts
          </Link>

          <Link
            href="/products"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Products
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={contactCount}
          description="Customers in your system"
          icon={Users}
        />

        <StatCard
          title="Products"
          value={productCount}
          description="Manage your product catalog"
          icon={Package}
        />

        <StatCard
          title="Upcoming Services"
          value={services.length}
          description="Services requiring attention"
          icon={CalendarClock}
        />

        <StatCard
          title="Pending Follow-ups"
          value={followUps.length}
          description="Future customer purchases"
          icon={BellRing}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentContacts
          contacts={contacts}
        />

        <UpcomingServices
          services={services}
        />
      </div>

      <UpcomingFollowUps
        followUps={followUps}
      />
    </div>
  );
}
