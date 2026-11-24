'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkedSession, setCheckedSession] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAuthPage && !window.localStorage.getItem('contactiq_token')) {
      router.replace('/login');
    }
    setCheckedSession(true);
  }, [isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!checkedSession || !window.localStorage.getItem('contactiq_token')) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]"><div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-lg shadow-slate-900/5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-black text-white">CI</span><span><span className="block text-sm font-semibold text-slate-900">ContactIQ</span><span className="mt-0.5 block text-xs text-slate-500">Opening your workspace…</span></span></div></div>;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen lg:ml-[272px]">
        <Navbar
          isMenuOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((open) => !open)}
        />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
