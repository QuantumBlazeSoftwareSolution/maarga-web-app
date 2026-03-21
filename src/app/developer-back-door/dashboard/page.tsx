'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeveloperDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // For now, just clear and redirect
    toast.success('Logged out successfully');
    router.push('/developer-back-door/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-emerald-500/30">
      {/* Header */}
      <nav className="border-b border-white/5 bg-white/2 px-8 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 p-1.5 ring-1 ring-emerald-500/20">
              <div className="h-full w-full rounded-sm bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white/90 uppercase">Developer Console</h1>
              <p className="text-[10px] text-emerald-500/50 font-mono">MAARGA v1.0.0-PROX</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded-lg border border-white/5 px-4 py-2 text-xs font-medium text-white/40 transition-all hover:bg-white/5 hover:text-white"
          >
            Terminal Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Documentation Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:bg-white/4">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/20">Live Docs</span>
            </div>
            <h2 className="mb-2 text-lg font-light text-white/90">API Documentation</h2>
            <p className="mb-6 text-sm text-white/40">Explore versioned Swagger specs and test endpoints directly from the interface.</p>
            <button 
              onClick={() => router.push('/api-docs')}
              className="flex items-center gap-2 text-xs font-medium text-emerald-500 transition-all group-hover:gap-3 underline decoration-emerald-500/30 underline-offset-4"
            >
              Open API Docs →
            </button>
          </div>

          {/* Admin Management Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition-all hover:bg-white/4">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/20">Access Control</span>
            </div>
            <h2 className="mb-2 text-lg font-light text-white/90">Account Provisioning</h2>
            <p className="mb-6 text-sm text-white/40">Use the secure POST endpoint to create new admin entities via centralized proxy.</p>
            <div className="rounded-lg bg-black/50 p-3 font-mono text-[10px] text-white/60 ring-1 ring-white/5">
              POST /api/v1/admin/create
            </div>
          </div>

          {/* System Status Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-6 transition-all">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-500">Online</span>
            </div>
            <h2 className="mb-2 text-lg font-light text-white/90">Infrastructure</h2>
            <p className="mb-1 text-sm text-white/40 flex justify-between">
              <span>Environment:</span>
              <span className="text-white/60">Development</span>
            </p>
            <p className="text-sm text-white/40 flex justify-between">
              <span>Database:</span>
              <span className="text-emerald-500/60 font-mono">NEON_POSTGRES</span>
            </p>
          </div>

        </div>

        {/* Info Alert */}
        <div className="mt-12 rounded-2xl border border-emerald-500/10 bg-emerald-500/2 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-emerald-500">Developer Back-Door Status</h3>
              <p className="mt-1 text-xs text-white/40 leading-relaxed">
                You are currently logged into the restricted developer console. This environment bypasses standard user authentication 
                to allow for rapid infrastructure management. Remember to audit the <code className="text-emerald-500/80">X-API-KEY</code> rotation regularly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
