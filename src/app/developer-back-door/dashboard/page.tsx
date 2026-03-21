'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { seedCommonItems } from '@/src/lib/actions/items';

export default function AdminDashboard() {
  const router = useRouter();

  const handleSeedItems = async () => {
    const res = await seedCommonItems();
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleLogout = () => {
    // For now, just clear and redirect
    toast.success('Signed out successfully');
    router.push('/developer-back-door/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">Admin Hub</h1>
              <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">Maarga Platform Management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="mt-1 text-slate-500">Welcome back. Here is what is happening with the platform today.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Documentation Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Resources</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">API Documentation</h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              Access technical documentation and explore versioned platform interfaces.
            </p>
            <button
              onClick={() => router.push('/api-docs')}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
            >
              View Docs →
            </button>
          </div>

          {/* User Management Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Security</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">User Management</h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              Manage platform administrators and configure role-based access controls.
            </p>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400">Endpoint: Admin Provisioning</span>
            </div>
          </div>

          {/* Station Importer Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Data Hub</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Station Data Manager</h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              Upload and sync fuel station records from external data sources.
            </p>
            <button
              onClick={() => router.push('/developer-back-door/dashboard/station-import')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/10"
            >
              Start Import →
            </button>
          </div>

          {/* Seed Items Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Initialize</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">System Configuration</h3>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">
              Set up standard fuel types, LP gas cylinders, and EV charging formats.
            </p>
            <button
              onClick={handleSeedItems}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 underline decoration-blue-500/30 underline-offset-4 transition-all hover:text-blue-700 active:scale-95"
            >
              Seed Common Items →
            </button>
          </div>

          {/* System Status Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">Live</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Platform Status</h3>
            <div className="space-y-3">
              <p className="flex justify-between text-sm text-slate-500">
                <span>Infrastructure:</span>
                <span className="font-semibold text-slate-900">Operational</span>
              </p>
              <p className="flex justify-between text-sm text-slate-500">
                <span>Environment:</span>
                <span className="font-semibold text-slate-900">Production</span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="mt-12 rounded-2xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-600/10">
          <div className="flex items-start gap-6">
            <div className="rounded-xl bg-white/20 p-2 text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Administrative Security Notice</h3>
              <p className="mt-2 text-sm leading-relaxed text-blue-50/80">
                You are currently accessing the restricted management portal. All actions are logged and audited. 
                Ensure you log out after completing your tasks to maintain platform integrity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
