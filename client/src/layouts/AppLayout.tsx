import type { ReactElement } from 'react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useOrganizationStore } from '../stores/organization.store';
import { NotificationBell } from '../components/NotificationBell';
import { GlobalSearch } from '../components/GlobalSearch';

export const AppLayout = (): ReactElement => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { selectedOrganization } = useOrganizationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const orgId = selectedOrganization?._id;

  const navItems = [
    {
      label: 'Workspaces',
      path: '/organizations',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    ...(orgId
      ? [
          {
            label: 'Teams',
            path: `/organizations/${orgId}/teams`,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
          },
          {
            label: 'Members',
            path: `/organizations/${orgId}/members`,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ),
          },
          {
            label: 'Workspace Settings',
            path: `/organizations/${orgId}/settings`,
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
        ]
      : []),
    {
      label: 'Notifications',
      path: '/notifications',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100">
      {/* Left Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-surface-800 bg-[#0B0F19]/90 backdrop-blur-xl shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-surface-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 shadow-md shadow-brand-500/20">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">Dev<span className="text-brand-400">Flow</span></span>
          </Link>
          <span className="rounded bg-surface-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">PRO</span>
        </div>

        {/* Workspace Quick Switcher Context */}
        {selectedOrganization && (
          <div className="p-4 border-b border-surface-800/80">
            <div className="flex items-center gap-3 rounded-xl border border-surface-800 bg-[#101726] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20 text-sm">
                {selectedOrganization.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">{selectedOrganization.name}</p>
                <p className="truncate text-[10px] text-slate-400 font-mono">slug: {selectedOrganization.slug}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/organizations' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-surface-800/60 hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-brand-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Telemetry Status Card */}
        <div className="p-4">
          <div className="rounded-xl border border-surface-800 bg-[#0E1522] p-3 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Telemetry Node</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                99.9%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-surface-800 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-surface-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-accent-indigo grid place-items-center text-xs font-bold text-white shrink-0">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user?.name || 'User'}</p>
                <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => void handleSignOut()}
              title="Sign out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-surface-800 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-800 bg-[#090D16]/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-surface-800"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Link to="/organizations" className="hover:text-slate-200">DevFlow</Link>
              <span>/</span>
              {selectedOrganization && (
                <>
                  <span className="text-white font-semibold">{selectedOrganization.name}</span>
                  <span>/</span>
                </>
              )}
              <span className="text-brand-400 capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-2 border-l border-surface-800 pl-4">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">Live Socket</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="h-full w-64 bg-[#0E1522] p-4 flex flex-col border-r border-surface-800" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-surface-800">
                <span className="font-extrabold text-lg text-white">DevFlow</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <nav className="mt-4 space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-surface-800"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <button
                onClick={() => void handleSignOut()}
                className="button-danger w-full text-xs"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Primary Page Canvas */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
