'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import FloatingNav from '@/src/components/admin/FloatingNav';
import { getSystemStats } from '@/src/lib/actions/system';

// ─── Neumorphism design tokens ───────────────────────────────────────────────
// Base: #E1E4E9  Shadow-dark: #bebec0  Shadow-light: #ffffff
// Primary shadow: 6px 6px 14px #bebec0, -6px -6px 14px #ffffff
// Inset shadow:  inset 4px 4px 10px #bebec0, inset -4px -4px 10px #ffffff
// ─────────────────────────────────────────────────────────────────────────────

const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

interface NmCardProps {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
}

function NmCard({
  children,
  className = '',
  pressed = false,
  onClick,
}: NmCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        boxShadow: pressed ? nmPressed : nmOuter,
        background: '#E1E4E9',
      }}
      className={`rounded-2xl transition-all duration-200 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

function NmButton({
  children,
  onClick,
  className = '',
  variant = 'raised',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'raised' | 'pressed';
}) {
  return (
    <button
      onClick={onClick}
      style={{
        boxShadow: variant === 'pressed' ? nmPressed : nmSubtle,
        background: '#E1E4E9',
      }}
      className={`rounded-xl transition-all duration-150 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

// Circular arc path helper
function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(toRad(startDeg));
  const sy = cy + r * Math.sin(toRad(startDeg));
  const ex = cx + r * Math.cos(toRad(endDeg));
  const ey = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    totalGB: '0.0',
    usedGB: '0.0',
    load: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getSystemStats();
      if (res.success && res.stats) {
        setStats({
          cpu: res.stats.cpu,
          memory: res.stats.memory,
          totalGB: res.stats.totalGB,
          usedGB: res.stats.usedGB,
          load: res.stats.load,
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.success('Signed out successfully');
    router.push('/developer-back-door/login');
  };

  // System load value 0–100 mapped to arc 135° → 405° (270° sweep)
  const loadValue = stats.load;
  const arcStart = 135;
  const arcEnd = arcStart + (loadValue / 100) * 270;

  const analyticsItems = [
    {
      label: 'Station Records',
      sub: '452 stations · 18 items',
      icon: '📍',
      kwh: '452 total',
    },
    {
      label: 'API Requests',
      sub: 'v1 endpoints · last 24h',
      icon: '⚡',
      kwh: '12.4k req',
    },
    {
      label: 'Admin Sessions',
      sub: '3 active · secured',
      icon: '🔐',
      kwh: '3 active',
    },
    {
      label: 'System Uptime',
      sub: 'All services nominal',
      icon: '✅',
      kwh: '99.9%',
    },
  ];

  return (
    <div
      className="min-h-screen font-sans selection:bg-blue-200"
      style={{ background: '#E1E4E9', fontFamily: "var(--font-poppins), -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      {/* ── Top Navigation ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#E1E4E9' }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <svg
              className="h-5 w-5 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-700">
            Maarga Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification dot */}
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl"
          >
            <svg
              className="h-4 w-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          </div>

          {/* Profile */}
          <NmCard className="flex items-center gap-3 px-4 py-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              }}
            >
              AA
            </div>
            <div>
              <p className="text-xs leading-none font-bold text-slate-700">
                Admin Account
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-slate-400">
                System Overseer
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:text-red-400"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </NmCard>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <FloatingNav />
      <main className="mx-auto max-w-6xl px-8 pt-2 pb-12">
        {/* ── Greeting + Quick Status row ─────────────────── */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              System Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Maarga Platform · All services operational
            </p>
          </div>
          {/* Live indicator */}
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5"
          >
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }}
            ></span>
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
              Live
            </span>
          </div>
        </div>

        {/* ── Two column main grid ───────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── LEFT COLUMN  (2/3 width) ─────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* ── System Load Card (primary, with circular dial) ─── */}
            <NmCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                  >
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-700">
                      System Performance
                    </h2>
                    <p className="text-xs text-slate-400">
                      Real-time load monitoring
                    </p>
                  </div>
                </div>
                {/* Toggle-style active badge */}
                <div
                  style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                  className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                    Nominal
                  </span>
                </div>
              </div>

              {/* Circular dial area */}
              <div className="flex items-center justify-center gap-12">
                <div className="relative flex items-center justify-center">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Background arc track */}
                    <path
                      d={arcPath(100, 100, 78, 135, 405)}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Active arc */}
                    <path
                      d={arcPath(100, 100, 78, 135, arcEnd)}
                      fill="none"
                      stroke="url(#loadGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Tick marks */}
                    {Array.from({ length: 27 }).map((_, i) => {
                      const angle = 135 + i * 10;
                      const rad = (angle * Math.PI) / 180;
                      const innerR = 62;
                      const outerR = 72;
                      const x1 = 100 + innerR * Math.cos(rad);
                      const y1 = 100 + innerR * Math.sin(rad);
                      const x2 = 100 + outerR * Math.cos(rad);
                      const y2 = 100 + outerR * Math.sin(rad);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={angle <= arcEnd ? '#3B82F6' : '#d1d5db'}
                          strokeWidth={i % 3 === 0 ? 2 : 1}
                          opacity={i % 3 === 0 ? 0.9 : 0.4}
                        />
                      );
                    })}
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="loadGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    {/* Center value */}
                    <text
                      x="100"
                      y="96"
                      textAnchor="middle"
                      className="font-black"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '32px',
                        fontWeight: '900',
                        fill: '#1e293b',
                      }}
                    >
                      {loadValue}
                    </text>
                    <text
                      x="100"
                      y="116"
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        fontWeight: '600',
                        fill: '#6b7280',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Load %
                    </text>
                    {/* Min/Max labels */}
                    <text
                      x="30"
                      y="168"
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fill: '#9ca3af',
                      }}
                    >
                      0%
                    </text>
                    <text
                      x="170"
                      y="168"
                      textAnchor="middle"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fill: '#9ca3af',
                      }}
                    >
                      100%
                    </text>
                  </svg>
                </div>

                {/* Stats beside dial */}
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'CPU', value: `${stats.cpu}%`, color: 'bg-blue-400' },
                    { 
                      label: 'Memory', 
                      value: `${stats.memory}%`, 
                      detail: `${stats.usedGB}/${stats.totalGB} GB`,
                      color: 'bg-indigo-400' 
                    },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-4">
                      <div className="w-16 text-right">
                        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                          {s.label}
                        </span>
                      </div>
                      <div
                        style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                        className="relative h-2.5 w-40 overflow-hidden rounded-full"
                      >
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full ${s.color} transition-all duration-1000 ease-in-out`}
                          style={{
                            width: s.value.includes('%') ? s.value : '60%',
                            opacity: 0.85,
                          }}
                        />
                      </div>
                      <div className="w-20 text-xs font-bold text-slate-600">
                        <span className="tabular-nums">{s.value}</span>
                        {s.detail && (
                          <span className="ml-1 text-[9px] opacity-40 font-medium">({s.detail})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </NmCard>

            {/* ── Management Scene Cards (2-col grid) ─────── */}
            <div className="grid grid-cols-2 gap-6">
              {/* Station Data Manager */}
              <NmCard
                className="p-6"
                onClick={() =>
                  router.push('/developer-back-door/dashboard/station-import')
                }
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                  >
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-700">
                  Station Manager
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  452 stations active
                </p>
                <div className="mt-4 flex gap-2">
                  <div
                    style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                    className="h-1.5 w-1/2 rounded-full"
                  >
                    <div className="h-full w-3/4 rounded-full bg-blue-400 opacity-80" />
                  </div>
                  <div
                    style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                    className="h-1.5 flex-1 rounded-full"
                  >
                    <div className="h-full w-1/3 rounded-full bg-blue-300 opacity-60" />
                  </div>
                </div>
              </NmCard>

              {/* Reports Monitor */}
              <NmCard
                className="p-6"
                onClick={() =>
                  router.push('/developer-back-door/dashboard/reports')
                }
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                  >
                    <svg
                      className="h-5 w-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-700">
                  Reports Feed
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Community-sourced status logs
                </p>
                <div className="mt-4 flex gap-2">
                  <div
                    style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                    className="h-1.5 w-full rounded-full overflow-hidden"
                  >
                    <div className="h-full w-full rounded-full bg-amber-400 opacity-80 animate-pulse" />
                  </div>
                </div>
              </NmCard>
            </div>

            {/* ── Scenes row (bottom of left col) ─────────── */}
            <NmCard className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                  >
                    <svg
                      className="h-4 w-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Platform records synced
                    </p>
                    <p className="text-xs text-slate-400">
                      452 stations · 18 item types in use
                    </p>
                  </div>
                </div>
                <NmButton
                  onClick={() =>
                    router.push('/developer-back-door/dashboard/station-import')
                  }
                  className="px-4 py-2 text-xs font-bold text-blue-500"
                >
                  Import Data
                </NmButton>
              </div>
            </NmCard>
          </div>

          {/* ── RIGHT COLUMN (1/3 width) ─────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Profile Card */}
            <NmCard className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    boxShadow: '3px 3px 6px #c0c3c8, -3px -3px 6px #ffffff',
                  }}
                >
                  AA
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">Hi, Admin</p>
                  <p className="text-xs text-slate-400">All systems active</p>
                </div>
                <div
                  style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01"
                    />
                  </svg>
                </div>
              </div>
            </NmCard>

            {/* Analytics panel */}
            <NmCard className="flex-1 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                  >
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-700">
                      Platform Analytics
                    </h3>
                    <p className="text-[10px] text-slate-400">Live overview</p>
                  </div>
                </div>
                <div
                  style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-blue-500"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
              </div>

              {/* Analytics list items */}
              <div className="flex flex-col gap-3">
                {analyticsItems.map((item) => (
                  <div
                    key={item.label}
                    style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div
                      style={{ boxShadow: nmPressed, background: '#E1E4E9' }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {item.label}
                      </p>
                      <p className="truncate text-[10px] text-slate-400">
                        {item.sub}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] font-black text-slate-500">
                        {item.kwh}
                      </span>
                      <div
                        style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
                        className="flex h-5 w-5 items-center justify-center rounded-lg"
                      >
                        <svg
                          className="h-3 w-3 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NmCard>

            {/* Quick stat cards (2x2 grid) */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Stations', value: '452', trend: '↑ 12%' },
                { label: 'Items', value: '18', trend: '↑ 2' },
                { label: 'Health', value: '99.9%', trend: '✓' },
                { label: 'Sessions', value: '3', trend: 'live' },
              ].map((s) => (
                <NmCard key={s.label} className="p-4">
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xl leading-none font-black text-slate-700">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-emerald-500">
                    {s.trend}
                  </p>
                </NmCard>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
