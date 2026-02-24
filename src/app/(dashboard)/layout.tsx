'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTradingStore } from '@/store/tradingStore';
import { marketStream } from '@/lib/websocket/marketStream';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, hydrate, logout } = useAuthStore();
  const updateFromPrice = useTradingStore((s) => s.updateFromPrice);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated && !user && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, user, pathname, router]);

  useEffect(() => {
    const unsubscribe = marketStream.subscribe(({ prices }) => {
      prices.forEach((p) => updateFromPrice(p.instrument, p.bid));
    });
    return () => unsubscribe();
  }, [updateFromPrice]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="hidden md:flex w-60 border-r border-slate-900 bg-slate-950/95 p-4 flex-col gap-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_0_24px_rgba(37,99,235,0.7)]" />
          <div>
            <p className="text-sm font-semibold tracking-tight">TradeSphere X</p>
            <p className="text-[11px] text-slate-400">Institutional Terminal</p>
          </div>
        </div>
        <nav className="space-y-1 text-xs">
          <NavButton label="Overview" href="/dashboard" active={pathname === '/dashboard'} />
          <NavButton label="Trade Terminal" href="/trade-terminal" active={pathname === '/trade-terminal'} />
          <NavButton label="Live Analytics" href="/live-analytics" active={pathname === '/live-analytics'} />
          <NavButton label="Journal" href="/journal" active={pathname === '/journal'} />
          <NavButton label="Edge Discovery" href="/edge-discovery" active={pathname === '/edge-discovery'} />
          <NavButton label="AI Coach" href="/ai-coach" active={pathname === '/ai-coach'} />
          <NavButton label="Market Replay" href="/replay" active={pathname === '/replay'} />
          <NavButton label="Reports" href="/reports" active={pathname === '/reports'} />
          <NavButton label="Risk Settings" href="/settings" active={pathname === '/settings'} />
        </nav>
        <button
          onClick={logout}
          className="mt-auto text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1 flex flex-col pb-12 md:pb-0">
        <header className="h-14 border-b border-slate-900 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.7)]" />
            <span className="text-sm font-semibold">TradeSphere X</span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time simulated trading environment — all metrics update as mock markets move.
          </p>
        </header>
        <section className="flex-1 p-4 overflow-auto">{children}</section>
        <nav className="md:hidden fixed inset-x-0 bottom-0 h-12 border-t border-slate-900 bg-slate-950/95 backdrop-blur flex items-center justify-around text-[11px]">
          <MobileTab
            label="Dash"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <MobileTab
            label="Trade"
            href="/trade-terminal"
            active={pathname === '/trade-terminal'}
          />
          <MobileTab
            label="Stats"
            href="/live-analytics"
            active={pathname === '/live-analytics'}
          />
          <MobileTab
            label="Journal"
            href="/journal"
            active={pathname === '/journal'}
          />
          <MobileTab
            label="AI"
            href="/ai-coach"
            active={pathname === '/ai-coach'}
          />
        </nav>
      </main>
    </div>
  );
}

interface NavButtonProps {
  label: string;
  href: string;
  active?: boolean;
}

function NavButton({ label, href, active }: NavButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
        active
          ? 'bg-slate-900 text-sky-300 border border-sky-500/50 shadow-[0_0_16px_rgba(56,189,248,0.55)]'
          : 'text-slate-300 hover:bg-slate-900/70'
      }`}
    >
      {label}
    </button>
  );
}

function MobileTab({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className={`px-2 py-1 rounded-md ${
        active
          ? 'text-sky-300 bg-slate-900/80'
          : 'text-slate-400 hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  );
}


