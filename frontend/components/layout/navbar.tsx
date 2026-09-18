// 'use client';

// import { usePathname } from 'next/navigation';

// const pageNames: Record<
//   string,
//   string
// > = {
//   '/': 'Dashboard',
//   '/contacts': 'Contacts',
//   '/products': 'Products',
//   '/orders': 'Orders',
//   '/payments': 'Payments',
//   '/deliveries': 'Deliveries',
//   '/analytics': 'Analytics',
//   '/reminders': 'Reminders',
//   '/activities': 'Activities',
//   '/ai-assistant': 'AI Assistant',
//   '/settings': 'Settings',
// };

// export default function Navbar() {
//   const pathname = usePathname();

//   const pageName =
//     Object.keys(pageNames).find(
//       (path) =>
//         path === '/'
//           ? pathname === '/'
//           : pathname.startsWith(path),
//     ) || '/';

//   return (
//     <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200/80 bg-white/95 backdrop-blur">
//       <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

//         {/* Left */}
//         <div className="flex min-w-0 items-center gap-4">

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
//           >
//             ☰
//           </button>

//           <div>
//             <p className="hidden text-[30px] font-medium uppercase tracking-wider text-slate-400 sm:block">
//               System Management
//             </p>

//             {/* <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
//               {pageNames[pageName]}
//             </h2> */}
//           </div>
//         </div>

//         {/* Center Search */}
//         {/* <div className="mx-6 hidden max-w-xl flex-1 md:block">
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
//               ⌕
//             </span>

//             <input
//               type="text"
//               placeholder="Search contacts, orders, products..."
//               className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
//             />

//             <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-400 lg:block">
//               Ctrl K
//             </span>
//           </div>
//         </div> */}

//         {/* Right */}
//         <div className="flex items-center gap-2">

//           {/* Search mobile */}
//           {/* <button
//             type="button"
//             className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-500 hover:bg-slate-100 md:hidden"
//           >
//             ⌕
//           </button> */}

//           {/* Notification */}
//           {/* <button
//             type="button"
//             className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
//           >
//             🔔

//             <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//           </button> */}

//           {/* Help */}
//           {/* <button
//             type="button"
//             className="hidden h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:flex"
//           >
//             ?
//           </button> */}

//           {/* <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" /> */}

//           {/* User */}
//           {/* <button
//             type="button"
//             className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
//               M
//             </div>

//             <div className="hidden text-left lg:block">
//               <p className="text-xs font-semibold text-slate-900">
//                 Mayank
//               </p>

//               <p className="text-[10px] text-slate-400">
//                 Admin
//               </p>
//             </div>

//             <span className="hidden text-xs text-slate-400 lg:block">
//               ▾
//             </span>
//           </button> */}
//         </div>
//       </div>
//     </header>
//   );
// }



'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Bell,
  Search,
  CalendarClock,
  BellRing,
  MessageSquareMore,
  Package,
  Users,
  CheckCircle2,
  LogOut,
} from 'lucide-react';

import {
  buildFollowUpNotifications,
  buildActivityNotifications,
  buildServiceNotifications,
  type DashboardNotification,
  sortNotifications,
} from '@/lib/notifications';
import {
  dismissNotifications,
  getDismissedNotificationIds,
  getStoredActionNotifications,
  NOTIFICATIONS_UPDATED_EVENT,
} from '@/lib/notification-events';
import { formatDate } from '@/lib/utils';
import { followupService } from '@/services/followup.service';
import { serviceService } from '@/services/service.service';
import { contactService } from '@/services/contact.service';
import { productService } from '@/services/product.service';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] =
    useState(false);
  const [userName, setUserName] =
    useState('Account');
  const [notifications, setNotifications] =
    useState<DashboardNotification[]>(
      [],
    );
  const [latestAction, setLatestAction] =
    useState<DashboardNotification | null>(null);
  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = window.localStorage.getItem('contactiq_user');
    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser) as { name?: string };
      setUserName(user.name || 'Account');
    } catch {
      window.localStorage.removeItem('contactiq_user');
    }
  }, []);

  function signOut() {
    window.localStorage.removeItem('contactiq_token');
    window.localStorage.removeItem('contactiq_user');
    router.replace('/login');
  }

  useEffect(() => {
    async function loadNotifications() {
      try {
        const [
          serviceResponse,
          followUpResponse,
          contactResponse,
          productResponse,
        ] = await Promise.all([
          serviceService.getServices({
            page: 1,
            limit: 100,
          }),
          followupService.getFollowUps({
            status: 'PENDING',
            page: 1,
            limit: 100,
          }),
          contactService.getContacts({
            page: 1,
            limit: 100,
          }),
          productService.getProducts({
            page: 1,
            limit: 100,
          }),
        ]);

        const dismissedIds =
          getDismissedNotificationIds();
        const dueNotifications = [
          ...getStoredActionNotifications(),
          ...sortNotifications([
            ...buildServiceNotifications(
              serviceResponse.data,
            ),
            ...buildFollowUpNotifications(
              followUpResponse.data,
            ),
            ...buildActivityNotifications(
              contactResponse.data,
              productResponse.data,
            ),
          ]),
        ].filter(
          (notification) =>
            !dismissedIds.has(notification.id),
        );

        setNotifications(dueNotifications);
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error,
        );
      }
    }

    loadNotifications();

    const refreshId = window.setInterval(
      loadNotifications,
      60_000,
    );

    return () => {
      window.clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    function handleNotificationUpdate(event: Event) {
      const notification = (
        event as CustomEvent<DashboardNotification>
      ).detail;

      if (!notification) return;

      setNotifications((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id),
      ]);
      setLatestAction(notification);
    }

    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationUpdate,
    );

    return () =>
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        handleNotificationUpdate,
      );
  }, []);

  useEffect(() => {
    if (!latestAction) return;

    const timeoutId = window.setTimeout(
      () => setLatestAction(null),
      4000,
    );

    return () => window.clearTimeout(timeoutId);
  }, [latestAction]);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  function getNotificationIcon(
    type: string,
  ) {
    if (type === 'service') {
      return CalendarClock;
    }

    if (type === 'reminder') {
      return BellRing;
    }

    if (type === 'contact') {
      return Users;
    }

    if (type === 'product') {
      return Package;
    }

    if (type === 'action') {
      return CheckCircle2;
    }

    return MessageSquareMore;
  }

  function dismissNotification(id: string) {
    dismissNotifications([id]);
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }

  function clearAllNotifications() {
    dismissNotifications(
      notifications.map((notification) => notification.id),
    );
    setNotifications([]);
    setLatestAction(null);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="hidden text-sm text-slate-500 sm:block">
          Customer Management
        </div>

        <div className="ml-auto flex items-center gap-4">
          {latestAction && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setLatestAction(null);
              }}
              className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-xs text-emerald-800 shadow-sm transition hover:bg-emerald-100 sm:flex"
              aria-label="Open latest notification"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{latestAction.message}</span>
            </button>
          )}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            <Search className="h-5 w-5" />
          </button>

          <div
            className="relative"
            ref={containerRef}
          >
            <button
              type="button"
              onClick={() =>
                setIsOpen(!isOpen)
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />

              {notifications.length > 0 && (
                <>
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />

                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
                    {notifications.length}
                  </span>
                </>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Notifications
                    </p>

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllNotifications}
                        className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Due actions and items added today.
                  </p>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map(
                      (notification) => {
                        const Icon =
                          getNotificationIcon(
                            notification.type,
                          );

                        return (
                          <Link
                            key={
                              notification.id
                            }
                            href={notification.href}
                            onClick={() => {
                              dismissNotification(
                                notification.id,
                              );
                              setIsOpen(false);
                            }}
                            className="flex gap-3 border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50"
                          >
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {
                                    notification.customerName
                                  }
                                </p>

                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                                  {notification.type}
                                </span>
                              </div>

                              <p className="mt-1 text-sm text-slate-700">
                                {
                                  notification.message
                                }
                              </p>

                              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
                                <span>
                                  {
                                    notification.title
                                  }
                                </span>

                                <span>
                                  {notification.isOverdue
                                    ? `Overdue since ${formatDate(notification.dueDate)}`
                                    : `Due ${formatDate(notification.dueDate)}`}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      },
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
