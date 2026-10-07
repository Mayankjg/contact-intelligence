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
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen lg:ml-64">
        <Navbar
          isMenuOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((open) => !open)}
        />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
