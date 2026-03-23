'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAllReports } from '@/src/lib/actions/report';
import FloatingNav from '@/src/components/admin/FloatingNav';

const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

function NmCard({
  children,
  className = '',
  pressed = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
}) {
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

function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch (status) {
      case 'approved':
        return 'text-emerald-500 bg-emerald-50';
      case 'pending':
        return 'text-amber-500 bg-amber-50';
      case 'suspended':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <span
      style={{ boxShadow: nmPressed }}
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getColors()}`}
    >
      {status}
    </span>
  );
}

function AvailabilityIndicator({ type }: { type: string }) {
  const color =
    type === 'available'
      ? '#10B981'
      : type === 'low'
        ? '#F59E0B'
        : '#EF4444';
  return (
    <div className="flex items-center gap-1.5">
      <div
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
        className="h-1.5 w-1.5 rounded-full"
      />
      <span className="text-[10px] font-bold text-slate-600 capitalize">
        {type}
      </span>
    </div>
  );
}

interface ReportWithItems {
  id: string;
  stationName: string;
  userName: string | null;
  userEmail: string;
  queue: string;
  message: string | null;
  status: string;
  createdAt: Date;
  items: {
    itemName: string;
    itemSinhalaName: string | null;
    availability: string;
  }[];
}

export default function ReportsMonitoring() {
  const [reports, setReports] = useState<ReportWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (_error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: '#E1E4E9',
        fontFamily:
          "var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#E1E4E9' }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 items-center justify-center rounded-xl cursor-pointer"
            onClick={() => router.push('/developer-back-door/dashboard')}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-700">
            Reports Monitor
          </span>
        </div>
      </nav>

      <FloatingNav />

      <main className="mx-auto max-w-6xl px-8 pt-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Community Reports
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Real-time feed of user-submitted station status updates
            </p>
          </div>
          
          <NmCard className="px-4 py-2">
            <span className="text-xs font-bold text-slate-500">
              Total Reports:{' '}
              <span className="text-blue-500 font-black">{reports.length}</span>
            </span>
          </NmCard>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <NmCard className="py-20 flex flex-col items-center justify-center text-center">
            <div
              style={{ boxShadow: nmPressed }}
              className="h-16 w-16 mb-6 rounded-full flex items-center justify-center text-2xl"
            >
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Reports Found</h3>
            <p className="text-sm text-slate-400 max-w-xs mt-1">
              User reports will appear here as soon as they are submitted from
              the mobile app.
            </p>
          </NmCard>
        ) : (
          <div className="flex flex-col gap-6">
            {reports.map((report) => (
              <NmCard key={report.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Station & User Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div
                        style={{ boxShadow: nmSubtle }}
                        className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-lg"
                      >
                        ⛽
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-black text-slate-700 truncate">
                          {report.stationName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                          <span className="text-xs font-bold text-slate-400">
                            By {report.userName ?? 'Unknown User'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">
                            •
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {report.message && (
                      <div
                        style={{ boxShadow: nmPressed }}
                        className="p-3 rounded-xl bg-slate-50/50"
                      >
                        <p className="text-xs italic text-slate-500 leading-relaxed font-medium">
                          &quot;{report.message}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items Reporting info */}
                  <div className="flex flex-wrap items-center gap-4 lg:px-6 lg:border-x border-slate-200/50 min-w-[300px]">
                    <div className="w-full mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Item Availability
                      </span>
                    </div>
                    {report.items.map((item: { itemName: string; availability: string }, idx: number) => (
                      <div
                        key={idx}
                        style={{ boxShadow: nmSubtle }}
                        className="flex flex-col p-2.5 rounded-xl min-w-[120px]"
                      >
                        <span className="text-[10px] font-black text-slate-700 truncate">
                          {item.itemName}
                        </span>
                        <div className="mt-1.5">
                          <AvailabilityIndicator type={item.availability} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Queue & Final Status */}
                  <div className="flex items-center gap-6 shrink-0 lg:pl-6">
                    <div className="text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                        Queue Status
                      </span>
                      <span className="text-xs font-black text-slate-600 block">
                        {report.queue.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        Consensus
                      </span>
                      <StatusBadge status={report.status} />
                    </div>
                  </div>
                </div>
              </NmCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
