'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getAllReports, getNewStationReports } from '@/src/lib/actions/report';
import FloatingNav from '@/src/components/admin/FloatingNav';

const nmOuter = '6px 6px 14px #c0c3c8, -6px -6px 14px #ffffff';
const nmPressed = 'inset 4px 4px 10px #c0c3c8, inset -4px -4px 10px #ffffff';
const nmSubtle = '3px 3px 8px #c0c3c8, -3px -3px 8px #ffffff';

function NmCard({
  children,
  className = '',
  pressed = false,
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        boxShadow: pressed ? nmPressed : nmOuter,
        background: '#E1E4E9',
        ...style,
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
      className={`rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${getColors()}`}
    >
      {status}
    </span>
  );
}

function AvailabilityIndicator({ type }: { type: string }) {
  const color =
    type === 'available' ? '#10B981' : type === 'low' ? '#F59E0B' : '#EF4444';
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

interface NewStationReport {
  id: string;
  latitude: string;
  longitude: string;
  status: string;
  createdAt: Date;
  userName: string | null;
}

export default function ReportsMonitoring() {
  const [activeTab, setActiveTab] = useState<'fuel' | 'new-station'>('fuel');
  const [fuelReports, setFuelReports] = useState<ReportWithItems[]>([]);
  const [newStationReports, setNewStationReports] = useState<
    NewStationReport[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadReports() {
      try {
        const [fuelData, newData] = await Promise.all([
          getAllReports(),
          getNewStationReports(),
        ]);
        setFuelReports(fuelData);
        setNewStationReports(newData as NewStationReport[]);
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
          'var(--font-poppins), -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: '#E1E4E9' }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{ boxShadow: nmSubtle, background: '#E1E4E9' }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl"
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

          <div className="flex items-center gap-4">
            <NmCard className="flex p-1" style={{ background: '#E1E4E9' }}>
              <button
                onClick={() => setActiveTab('fuel')}
                style={{ boxShadow: activeTab === 'fuel' ? nmPressed : 'none' }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${activeTab === 'fuel' ? 'text-blue-500' : 'text-slate-500'}`}
              >
                FUEL STATUS
              </button>
              <button
                onClick={() => setActiveTab('new-station')}
                style={{
                  boxShadow: activeTab === 'new-station' ? nmPressed : 'none',
                }}
                className={`rounded-xl px-4 py-2 text-xs font-black transition-all duration-200 ${activeTab === 'new-station' ? 'text-blue-500' : 'text-slate-500'}`}
              >
                NEW STATIONS
              </button>
            </NmCard>

            <NmCard className="px-4 py-2">
              <span className="text-xs font-bold text-slate-500">
                Total:{' '}
                <span className="font-black text-blue-500">
                  {activeTab === 'fuel'
                    ? fuelReports.length
                    : newStationReports.length}
                </span>
              </span>
            </NmCard>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (activeTab === 'fuel' ? fuelReports : newStationReports).length ===
          0 ? (
          <NmCard className="flex flex-col items-center justify-center py-20 text-center">
            <div
              style={{ boxShadow: nmPressed }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            >
              📋
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              No {activeTab === 'fuel' ? 'Fuel Status' : 'New Station'} Reports
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              User submissions will appear here as soon as they are submitted
              from the mobile app.
            </p>
          </NmCard>
        ) : activeTab === 'fuel' ? (
          <div className="flex flex-col gap-6">
            {fuelReports.map((report) => (
              <NmCard key={report.id} className="p-6">
                {/* ... existing fuel report render logic ... */}
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  {/* Station & User Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div
                        style={{ boxShadow: nmSubtle }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg"
                      >
                        ⛽
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-black text-slate-700">
                          {report.stationName}
                        </h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
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
                        className="rounded-xl bg-slate-50/50 p-3"
                      >
                        <p className="text-xs leading-relaxed font-medium text-slate-500 italic">
                          &quot;{report.message}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items Reporting info */}
                  <div className="flex min-w-[300px] flex-wrap items-center gap-4 border-slate-200/50 lg:border-x lg:px-6">
                    <div className="mb-1 w-full">
                      <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        Item Availability
                      </span>
                    </div>
                    {report.items.map(
                      (
                        item: { itemName: string; availability: string },
                        idx: number,
                      ) => (
                        <div
                          key={idx}
                          style={{ boxShadow: nmSubtle }}
                          className="flex min-w-[120px] flex-col rounded-xl p-2.5"
                        >
                          <span className="truncate text-[10px] font-black text-slate-700">
                            {item.itemName}
                          </span>
                          <div className="mt-1.5">
                            <AvailabilityIndicator type={item.availability} />
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Queue & Final Status */}
                  <div className="flex shrink-0 items-center gap-6 lg:pl-6">
                    <div className="text-right">
                      <span className="mb-1.5 block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        Queue Status
                      </span>
                      <span className="block text-xs font-black text-slate-600">
                        {report.queue.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        Consensus
                      </span>
                      <StatusBadge status={report.status} />
                    </div>
                  </div>
                </div>
              </NmCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {newStationReports.map((report) => (
              <NmCard key={report.id} className="p-6">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  {/* Location Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div
                        style={{ boxShadow: nmSubtle }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg"
                      >
                        📍
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-black text-slate-700">
                          New Station Location
                        </h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-xs font-bold text-slate-400">
                            Suggested by {report.userName ?? 'Unknown User'}
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

                    <div
                      style={{ boxShadow: nmPressed }}
                      className="flex items-center justify-between rounded-xl bg-slate-50/50 p-3"
                    >
                      <div className="space-x-2 text-[10px] font-black text-slate-500">
                        <span className="rounded bg-white/50 px-2 py-0.5">
                          LAT: {parseFloat(report.latitude).toFixed(4)}
                        </span>
                        <span className="rounded bg-white/50 px-2 py-0.5">
                          LNG: {parseFloat(report.longitude).toFixed(4)}
                        </span>
                      </div>

                      <a
                        href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ boxShadow: nmSubtle }}
                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-black text-blue-600 transition-all hover:scale-105 active:scale-95"
                      >
                        VIEW ON MAP
                      </a>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex shrink-0 items-center gap-6 border-l border-slate-200/50 lg:pl-6">
                    <div className="flex flex-col items-center gap-2">
                      <span className="block text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        Approval Status
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
