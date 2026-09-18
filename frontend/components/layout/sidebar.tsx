// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// const menuSections = [
// //   {
// //     title: 'OVERVIEW',
// //     items: [
// //       {
// //         label: 'Dashboard',
// //         href: '/',
// //         icon: '▦',
// //       },
// //     ],
// //   },
//   {
//     title: 'CUSTOMERS',
//     items: [
//       {
//         label: 'Contacts',
//         href: '/contacts',
//         icon: '◎',
//       },
//     //   {
//     //     label: 'Companies',
//     //     href: '/companies',
//     //     icon: '▣',
//     //   },
//     ],
//   },
//   {
//     title: 'SALES',
//     items: [
//       {
//         label: 'Products',
//         href: '/products',
//         icon: '◇',
//       },
//       {
//         label: 'Orders',
//         href: '/orders',
//         icon: '◈',
//       },
//     //   {
//     //     label: 'Payments',
//     //     href: '/payments',
//     //     icon: '₹',
//     //   },
//     //   {
//     //     label: 'Deliveries',
//     //     href: '/deliveries',
//     //     icon: '◇',
//     //   },
//     ],
//   },
// //   {
// //     title: 'ENGAGEMENT',
// //     items: [
// //       {
// //         label: 'Reminders',
// //         href: '/reminders',
// //         icon: '◷',
// //       },
// //       {
// //         label: 'Activities',
// //         href: '/activities',
// //         icon: '✓',
// //       },
// //     ],
// //   },
// //   {
// //     title: 'INSIGHTS',
// //     items: [
// //       {
// //         label: 'Analytics',
// //         href: '/analytics',
// //         icon: '◒',
// //       },
// //       {
// //         label: 'AI Assistant',
// //         href: '/ai-assistant',
// //         icon: '✦',
// //       },
// //     ],
// //   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] border-r border-slate-800 bg-[#0b1220] text-white lg:block">
//       <div className="flex h-full flex-col">

//         {/* Logo */}
//         <div className="flex h-[72px] items-center border-b border-white/10 px-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-500/20">
//               ✦
//             </div>

//             <div>
//               <h1 className="text-[17px] font-bold tracking-tight">
//                 ContactIQ
//               </h1>

//               <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">
//                 Customer Intelligence
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex-1 overflow-y-auto px-3 py-5">
//           {menuSections.map((section) => (
//             <div
//               key={section.title}
//               className="mb-6"
//             >
//               <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-500">
//                 {section.title}
//               </p>

//               <nav className="space-y-1">
//                 {section.items.map((item) => {
//                   const active =
//                     pathname === item.href ||
//                     (item.href !== '/' &&
//                       pathname.startsWith(
//                         item.href,
//                       ));

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
//                         active
//                           ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/30'
//                           : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
//                       }`}
//                     >
//                       {active && (
//                         <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-indigo-300" />
//                       )}

//                       <span
//                         className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
//                           active
//                             ? 'bg-white/15'
//                             : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
//                         }`}
//                       >
//                         {item.icon}
//                       </span>

//                       <span>
//                         {item.label}
//                       </span>

//                       {item.label ===
//                         'AI Assistant' && (
//                         <span className="ml-auto rounded-full bg-indigo-400/20 px-2 py-0.5 text-[9px] font-semibold text-indigo-300">
//                           AI
//                         </span>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </nav>
//             </div>
//           ))}
//         </div>

//         {/* Bottom */}
//         <div className="border-t border-white/10 p-3">

//           <Link
//             href="/settings"
//             className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
//           >
//             <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
//               ⚙
//             </span>

//             Settings
//           </Link>

//           <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
//               M
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-xs font-semibold text-white">
//                 Mayank
//               </p>

//               <p className="truncate text-[10px] text-slate-500">
//                 Administrator
//               </p>
//             </div>

//             <span className="ml-auto text-slate-500">
//               •••
//             </span>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }



'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  Package,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Contacts',
    href: '/contacts',
    icon: Users,
  },
  {
    label: 'Products',
    href: '/products',
    icon: Package,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              CI
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                ContactIQ
              </h1>

              <p className="text-xs text-slate-500">
                Customer Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== '/' &&
                  pathname.startsWith(
                    item.href,
                  ));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />

                    {item.label}
                  </span>

                  {active && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-900">
              Customer Intelligence
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage customers, products,
              services and follow-ups.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}